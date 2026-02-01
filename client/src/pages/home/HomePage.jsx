import axios from 'axios';
import { useState, useEffect } from 'react';

import { Header } from "../../components/Header";
import { NavSidebar } from "../../components/NavSidebar";
import { AdsSidebar } from "../../components/AdsSidebar";
import { InitialPost } from "./InitialPost";
import { CommentForm } from "./CommentForm";
import { Comment } from "./Comment";
import { getUserIdentifier } from "../../utils/userIdentifier";

import './HomePage.css';

const POST_SLUG = "drew-dumontier";

export function HomePage() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userVotes, setUserVotes] = useState({}); // Track which comments user has voted on

  // Fetch post and comments on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch post
        const postRes = await axios.get(`/api/posts/${POST_SLUG}`);
        setPost(postRes.data);

        // Fetch comments for the post
        const commentsRes = await axios.get(`/api/comments/post/${postRes.data.id}`);
        setComments(commentsRes.data);

        // Fetch user's votes for this post
        const userIdentifier = getUserIdentifier();
        const votesRes = await axios.get(`/api/votes/${postRes.data.id}?ipHash=${userIdentifier}`);
        setUserVotes(votesRes.data || {});
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle vote on a comment
  const handleVote = async (commentId, voteType) => {
    try {
      // Get unique user identifier
      const userIdentifier = getUserIdentifier();

      // Post vote to backend
      await axios.post("/api/votes", {
        commentId,
        type: voteType,
        ipHash: userIdentifier,
      });

      // Always re-fetch comments and userVotes to ensure correct counts
      if (post) {
        const [commentsRes, votesRes] = await Promise.all([
          axios.get(`/api/comments/post/${post.id}`),
          axios.get(`/api/votes/${post.id}?ipHash=${userIdentifier}`)
        ]);
        setComments(commentsRes.data);
        setUserVotes(votesRes.data || {});
      }
    } catch (err) {
      console.error("Error voting:", err.response?.data || err.message);
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

  // Handle new comment posted
  const handleCommentPosted = () => {
    // Refresh comments after a new one is posted
    if (post) {
      axios.get(`/api/comments/post/${post.id}`).then((res) => {
        setComments(res.data);
      }).catch(err => console.error("Error fetching updated comments:", err));
    }
  };

  if (loading) {
    return (
      <>
        <title>Rate My Performance</title>
        <Header />
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
        <Header />
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
      <Header />

      <div className="layout">
        <NavSidebar />

        <main className="content">
          <InitialPost post={post} />

          {/* Comments section: comment form + list */}
          <section className="comments-section">
            <h2>Comments</h2>

            <CommentForm postId={post?.id} onCommentPosted={handleCommentPosted} />

            {/* Dynamic comments from API */}
            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    onVote={handleVote}
                    onReply={handleReply}
                    userVoteState={userVotes}
                  />
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#999', padding: '1rem' }}>
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </section>
        </main>

        <AdsSidebar />
      </div>
    </>
  );
}