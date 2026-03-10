import axios from 'axios';
import { useState, useEffect, useCallback, useMemo } from 'react';

import { Header } from "../../components/Header";
import { NavSidebar } from "../../components/NavSidebar";
import { AdsSidebar } from "../../components/AdsSidebar";
import { InitialPost } from "./InitialPost";
import { CommentForm } from "./CommentForm";
import { Comment } from "./Comment";
import { getUserIdentifier } from "../../utils/userIdentifier";
import { API_BASE_URL } from "../../config/api";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

import './HomePage.css';

const POST_SLUG = "drew-dumontier";

export function HomePage() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [postLoading, setPostLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [postError, setPostError] = useState(null);
  const [commentsError, setCommentsError] = useState(null);
  const [userVotes, setUserVotes] = useState({}); // Track which comments user has voted on
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle
  
  // Pagination and sorting state
  const [sortMode, setSortMode] = useState('latest'); // 'top' or 'latest'
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch post once on initial mount.
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setPostLoading(true);
        setPostError(null);
        const postRes = await axios.get(`${API_BASE_URL}/api/posts/${POST_SLUG}`);
        setPost(postRes.data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setPostError(err.message);
      } finally {
        setPostLoading(false);
      }
    };

    fetchPost();
  }, []);

  // Fetch comments/votes whenever post or sort mode changes.
  useEffect(() => {
    if (!post?.id) {
      return;
    }

    const fetchCommentsAndVotes = async () => {
      try {
        setCommentsLoading(true);
        setCommentsError(null);

        // Get user identifier
        const userIdentifier = getUserIdentifier();

        const commentsPromise = axios.get(
          `${API_BASE_URL}/api/comments/post/${post.id}?sort=${sortMode}&page=1&limit=10`
        );
        const votesPromise = axios.get(`${API_BASE_URL}/api/votes/${post.id}?ipHash=${userIdentifier}`);

        // Render comments as soon as possible; do not block on votes.
        const commentsRes = await commentsPromise;

        setComments(commentsRes.data.comments || []);
        setPaginationMeta(commentsRes.data.pagination || null);
        setCurrentPage(1);
        votesPromise
          .then((votesRes) => setUserVotes(votesRes.data || {}))
          .catch((votesErr) => console.error("Error fetching votes:", votesErr));
      } catch (err) {
        console.error("Error fetching comments/votes:", err);
        setCommentsError(err.message);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchCommentsAndVotes();
  }, [post?.id, sortMode]);

  // Memoize updateCommentVoteCount helper function
  const updateCommentVoteCount = useCallback((comment, commentId, voteType, currentUserVote) => {
    if (comment.id === commentId) {
      const newComment = { ...comment };

      if (currentUserVote === voteType) {
        // User is removing their vote
        if (voteType === 'LIKE') {
          newComment.likeCount = Math.max(0, newComment.likeCount - 1);
        } else {
          newComment.dislikeCount = Math.max(0, newComment.dislikeCount - 1);
        }
      } else {
        // User is adding or changing their vote
        if (currentUserVote) {
          // Remove old vote
          if (currentUserVote === 'LIKE') {
            newComment.likeCount = Math.max(0, newComment.likeCount - 1);
          } else {
            newComment.dislikeCount = Math.max(0, newComment.dislikeCount - 1);
          }
        }
        // Add new vote
        if (voteType === 'LIKE') {
          newComment.likeCount = (newComment.likeCount || 0) + 1;
        } else {
          newComment.dislikeCount = (newComment.dislikeCount || 0) + 1;
        }
      }
      return newComment;
    }

    // Recursively update nested replies
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: comment.replies.map((reply) =>
          updateCommentVoteCount(reply, commentId, voteType, currentUserVote)
        ),
      };
    }

    return comment;
  }, []);

  // Handle vote on a comment with optimistic updates
  const handleVote = useCallback(async (commentId, voteType) => {
    try {
      // Get unique user identifier
      const userIdentifier = getUserIdentifier();
      const currentUserVote = userVotes?.[commentId];

      // Optimistically update comments using existing helper
      const updatedComments = comments.map(comment => 
        updateCommentVoteCount(comment, commentId, voteType, currentUserVote)
      );
      setComments(updatedComments);

      // Optimistically update user vote state
      const newVoteState = currentUserVote === voteType 
        ? { ...userVotes, [commentId]: undefined }  // Remove vote
        : { ...userVotes, [commentId]: voteType };   // Set/change vote
      setUserVotes(newVoteState);

      // Post vote to backend in background
      await axios.post(`${API_BASE_URL}/api/votes`, {
        commentId,
        type: voteType,
        ipHash: userIdentifier,
      });

    } catch (err) {
      console.error("Error voting:", err.response?.data || err.message);
      // On error, refetch to sync state
      if (post) {
        try {
          const userIdentifier = getUserIdentifier();
          const votesRes = await axios.get(`${API_BASE_URL}/api/votes/${post.id}?ipHash=${userIdentifier}`);
          setUserVotes(votesRes.data || {});
          // Optionally refetch comments to get correct counts
          const commentsRes = await axios.get(
            `${API_BASE_URL}/api/comments/post/${post.id}?sort=${sortMode}&page=${currentPage}&limit=10`
          );
          setComments(commentsRes.data.comments || []);
          setPaginationMeta(commentsRes.data.pagination || null);
        } catch (refetchErr) {
          console.error("Error refetching after vote failure:", refetchErr);
        }
      }
    }
  }, [comments, post, sortMode, currentPage, userVotes, updateCommentVoteCount]);

  // Handle loading more comments
  const handleLoadMore = useCallback(async () => {
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;

      const commentsRes = await axios.get(
        `${API_BASE_URL}/api/comments/post/${post.id}?sort=${sortMode}&page=${nextPage}&limit=10`
      );
      
      // Append new comments to existing ones
      setComments((prevComments) => [...prevComments, ...(commentsRes.data.comments || [])]);
      setPaginationMeta(commentsRes.data.pagination || null);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error("Error loading more comments:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [post, sortMode, currentPage]);

  // Handle reply (shows reply form - to be implemented)
  const handleReply = useCallback((commentId) => {
    console.log("Reply to comment:", commentId);
    // TODO: Show reply form modal or inline form
  }, []);

  // Handle new comment posted - refresh from page 1
  const handleCommentPosted = useCallback(() => {
    // Refresh comments after a new one is posted, reset to page 1
    if (post) {
      axios
        .get(`${API_BASE_URL}/api/comments/post/${post.id}?sort=${sortMode}&page=1&limit=10`)
        .then((res) => {
          setComments(res.data.comments || []);
          setPaginationMeta(res.data.pagination || null);
          setCurrentPage(1);
        })
        .catch(err => console.error("Error fetching updated comments:", err));
    }
  }, [post, sortMode]);

  // Use infinite scroll hook for automatic loading
  const sentinelRef = useInfiniteScroll(
    handleLoadMore,
    paginationMeta?.hasNextPage || false,
    loadingMore
  );

  if (postLoading) {
    return (
      <>
        <title>Rate My Performance</title>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="layout">
          <NavSidebar />
          <main className="content">
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
          </main>
          <AdsSidebar />
        </div>
      </>
    );
  }

  if (postError) {
    return (
      <>
        <title>Rate My Performance</title>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="layout">
          <NavSidebar />
          <main className="content">
            <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
              Error: {postError}
            </div>
          </main>
          <AdsSidebar />
        </div>
      </>
    );
  }

  return (
    <>
      <title>Rate My Performance</title>
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      <div className="layout" style={{ '--sidebar-open': sidebarOpen ? 'flex' : 'none' }}>
        <NavSidebar />

        <main id="main" className="content">
          <InitialPost post={post} />

          {/* Comments section: comment form + list */}
          <section className="comments-section">
            <div className="comments-header">
              <h2>Comments</h2>
            </div>

            <CommentForm postId={post?.id} onSubmitSuccess={handleCommentPosted} />

            {/* Sort controls - positioned above comments list */}
            <div className="sort-controls">
              <span className="sort-label">Order by:</span>
              <button 
                className={`sort-btn ${sortMode === 'latest' ? 'active' : ''}`}
                onClick={() => setSortMode('latest')}
              >
                Latest
              </button>
              <button 
                className={`sort-btn ${sortMode === 'top' ? 'active' : ''}`}
                onClick={() => setSortMode('top')}
              >
                Top
              </button>
            </div>

            {/* Dynamic comments from API */}
            <div className="comments-list">
              {commentsError ? (
                <p style={{ textAlign: 'center', color: 'red', padding: '1rem' }}>
                  Could not load comments right now. Please refresh.
                </p>
              ) : commentsLoading && comments.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', padding: '1rem' }}>
                  Loading comments...
                </p>
              ) : comments.length > 0 ? (
                <>
                  {comments.map((comment, index) => (
                    <div key={comment.id}>
                      <Comment
                        comment={comment}
                        onVote={handleVote}
                        onReply={handleReply}
                        userVoteState={userVotes}
                        onReplyPosted={handleCommentPosted}
                        depth={0}
                      />
                      {/* Intersperse ads on mobile every 2 comments, rotating through all 3 ads */}
                      {(index + 1) % 2 === 0 && (
                        <div className="inline-ad-mobile">
                          <AdsSidebar adIndex={Math.floor(index / 2) % 3} />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Sentinel for infinite scroll */}
                  {paginationMeta?.hasNextPage && (
                    <div ref={sentinelRef} className="scroll-sentinel" style={{ height: '20px', margin: '20px 0' }}>
                      {loadingMore && (
                        <p style={{ textAlign: 'center', color: '#999' }}>Loading more comments...</p>
                      )}
                    </div>
                  )}
                  
                  {/* Fallback Load More button */}
                  {paginationMeta?.hasNextPage && !loadingMore && (
                    <button 
                      className="load-more-btn"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      style={{ marginTop: '10px' }}
                    >
                      Load More Comments
                    </button>
                  )}
                </>
              ) : (
                <p style={{ textAlign: 'center', color: '#999', padding: '1rem' }}>
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </section>
        </main>

        <AdsSidebar className="sidebar-ad" />
      </div>
    </>
  );
}