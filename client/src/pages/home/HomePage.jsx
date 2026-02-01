import axios from 'axios';
import { useState, useEffect } from 'react';

import { Header } from "../../components/Header";
import { NavSidebar } from "../../components/NavSidebar";
import { AdsSidebar } from "../../components/AdsSidebar";
import { InitialPost } from "./InitialPost";
import { PostForm } from "./PostForm";
import { Comment } from "./Comment";

import './HomePage.css';

const POST_SLUG = "drew-dumontier";

export function HomePage() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      // TODO: Calculate IP hash client-side or let backend handle
      const ipHash = "temp-hash"; // Will be replaced with actual IP hashing
      
      await axios.post("/api/votes", {
        commentId,
        voteType,
        ipHash,
      });

      // Refresh comments to get updated counts
      if (post) {
        const commentsRes = await axios.get(`/api/comments/post/${post.id}`);
        setComments(commentsRes.data);
      }
    } catch (err) {
      console.error("Error voting:", err);
    }
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

          {/* Comments section: post form + list */}
          <section className="comments-section">
            <h2>Comments</h2>

            <PostForm onCommentPosted={handleCommentPosted} postId={post?.id} />

            {/* Dynamic comments from API */}
            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    onVote={handleVote}
                    onReply={handleReply}
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