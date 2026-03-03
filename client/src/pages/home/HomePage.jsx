import axios from 'axios';
import { useState, useEffect } from 'react';

import { Header } from "../../components/Header";
import { NavSidebar } from "../../components/NavSidebar";
import { AdsSidebar } from "../../components/AdsSidebar";
import { InitialPost } from "./InitialPost";
import { CommentForm } from "./CommentForm";
import { Comment } from "./Comment";
import { getUserIdentifier } from "../../utils/userIdentifier";
import { API_BASE_URL } from "../../config/api";

import './HomePage.css';

const POST_SLUG = "drew-dumontier";

export function HomePage() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userVotes, setUserVotes] = useState({}); // Track which comments user has voted on
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle
  
  // Pagination and sorting state
  const [sortMode, setSortMode] = useState('latest'); // 'top' or 'latest'
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch post and initial comments on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch post
        const postRes = await axios.get(`${API_BASE_URL}/api/posts/${POST_SLUG}`);
        setPost(postRes.data);

        // Fetch initial comments (page 1, with sort mode)
        const commentsRes = await axios.get(
          `${API_BASE_URL}/api/comments/post/${postRes.data.id}?sort=${sortMode}&page=1&limit=10`
        );
        setComments(commentsRes.data.comments || []);
        setPaginationMeta(commentsRes.data.pagination || null);
        setCurrentPage(1);

        // Fetch user's votes for this post
        const userIdentifier = getUserIdentifier();
        const votesRes = await axios.get(`${API_BASE_URL}/api/votes/${postRes.data.id}?ipHash=${userIdentifier}`);
        setUserVotes(votesRes.data || {});
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sortMode]);

  // Handle vote on a comment
  const handleVote = async (commentId, voteType) => {
    try {
      // Get unique user identifier
      const userIdentifier = getUserIdentifier();

      // Post vote to backend
      await axios.post(`${API_BASE_URL}/api/votes`, {
        commentId,
        type: voteType,
        ipHash: userIdentifier,
      });

      // Always re-fetch comments and userVotes to ensure correct counts
      if (post) {
        const [commentsRes, votesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/comments/post/${post.id}?sort=${sortMode}&page=${currentPage}&limit=10`),
          axios.get(`${API_BASE_URL}/api/votes/${post.id}?ipHash=${userIdentifier}`)
        ]);
        setComments(commentsRes.data.comments || []);
        setPaginationMeta(commentsRes.data.pagination || null);
        setUserVotes(votesRes.data || {});
      }
    } catch (err) {
      console.error("Error voting:", err.response?.data || err.message);
    }
  };

  // Handle loading more comments
  const handleLoadMore = async () => {
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;

      const commentsRes = await axios.get(
        `${API_BASE_URL}/api/comments/post/${post.id}?sort=${sortMode}&page=${nextPage}&limit=10`
      );
      
      // Append new comments to existing ones
      setComments([...comments, ...(commentsRes.data.comments || [])]);
      setPaginationMeta(commentsRes.data.pagination || null);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error("Error loading more comments:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Helper function to update vote counts optimistically
  const updateCommentVoteCount = (comment, commentId, voteType, currentUserVote) => {
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
  };

  // Handle reply (shows reply form - to be implemented)
  const handleReply = (commentId) => {
    console.log("Reply to comment:", commentId);
    // TODO: Show reply form modal or inline form
  };

  // Handle new comment posted - refresh from page 1
  const handleCommentPosted = () => {
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
  };

  if (loading) {
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

  if (error) {
    return (
      <>
        <title>Rate My Performance</title>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="layout">
          <NavSidebar />
          <main className="content">
            <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
              Error: {error}
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

        <main className="content">
          <InitialPost post={post} />

          {/* Comments section: comment form + list */}
          <section className="comments-section">
            <div className="comments-header">
              <h2>Comments</h2>
              
              {/* Sort controls - mobile optimized */}
              <div className="sort-controls">
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
            </div>

            <CommentForm postId={post?.id} onCommentPosted={handleCommentPosted} />

            {/* Dynamic comments from API */}
            <div className="comments-list">
              {comments.length > 0 ? (
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
                  
                  {/* Load More button if there are more pages */}
                  {paginationMeta?.hasNextPage && (
                    <button 
                      className="load-more-btn"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? 'Loading...' : 'Load More Comments'}
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