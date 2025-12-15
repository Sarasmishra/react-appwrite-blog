import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { fetchPostBySlug, deletePost } from "../redux/posts/postsThunks";
import {
  fetchCommentsByPost,
  addComment,
  deleteComment,
} from "../redux/comments/commentsThunks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays } from "lucide-react";


import { getCoverImageUrl } from "../app/storageService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Bookmark } from "lucide-react";
import { toggleLike } from "../redux/likes/likesThunks";
import { toggleBookmark } from "../redux/bookmarks/bookmarksThunks";

const PostDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const { selectedPost, loading } = useSelector((state) => state.posts);
  const {
    comments,
    loading: commentsLoading,
    adding,
    deletingId,
  } = useSelector((state) => state.comments);
  const likesCount =
    useSelector((state) => state.likes.counts[selectedPost?.$id]) || 0;

  const liked = useSelector(
    (state) => state.likes.userLikes[selectedPost?.$id]
  );

  const bookmarked = useSelector(
    (state) => state.bookmarks.userBookmarks[selectedPost?.$id]
  );

  const [commentText, setCommentText] = useState("");

  const isAuthor = user?.$id === selectedPost?.authorId;

  /* ---------- FETCH POST ---------- */
  useEffect(() => {
    dispatch(fetchPostBySlug(slug));
  }, [dispatch, slug]);

  /* ---------- FETCH COMMENTS ---------- */
  useEffect(() => {
    if (selectedPost?.$id) {
      dispatch(fetchCommentsByPost(selectedPost.$id));
    }
  }, [dispatch, selectedPost?.$id]);

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 animate-pulse">
        <div className="h-64 bg-muted rounded mb-6" />
        <div className="h-8 bg-muted rounded mb-4" />
        <div className="h-4 bg-muted rounded w-3/4 mb-2" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </div>
    );
  }

  if (!selectedPost) {
    return (
      <p className="text-center mt-10 text-muted-foreground">Post not found</p>
    );
  }

  /* ---------- ADD COMMENT ---------- */
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    await dispatch(
      addComment({
        postId: selectedPost.$id,
        userId: user.$id,
        content: commentText.trim(),
      })
    );

    setCommentText("");
  };

  return (
    <article className="max-w-3xl mx-auto p-6">
{/* Title */}
<h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
  {selectedPost.title}
</h1>

{/* Meta */}
<div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
  {/* Author */}
  <div className="flex items-center gap-2 ">
    <Avatar className="h-8 w-8 ">
      <AvatarFallback>
        {selectedPost.authorName
          ? selectedPost.authorName[0].toUpperCase()
          : "U"}
      </AvatarFallback>
    </Avatar>
    <span className="font-medium ">
      {selectedPost.authorName || "Anonymous"}
    </span>
  </div>

  {/* Date */}
  <div className="flex items-center gap-1">
    <CalendarDays className="h-4 w-4" />
    <span>
      {new Date(selectedPost.$createdAt).toLocaleDateString()}
    </span>
  </div>
</div>

{isAuthor && (
  <div className="flex gap-2 mb-8">
    <Button size="sm" variant="secondary"
      onClick={() => navigate(`/edit/${selectedPost.$id}`)}
    >
      Edit
    </Button>

    <Button
      size="sm"
      variant="destructive"
      onClick={async () => {
        await dispatch(deletePost(selectedPost.$id));
        navigate("/");
      }}
    >
      Delete
    </Button>
  </div>
)}


{selectedPost.coverImageId && (
  <img
    src={getCoverImageUrl(selectedPost.coverImageId)}
    alt={selectedPost.title}
    className="w-full max-h-[420px] object-cover rounded-xl mb-10"
  />
)}

      {/* Content */}
      <div
        className="prose prose-lg max-w-none mb-12 dark:prose-invert"
        dangerouslySetInnerHTML={{
          __html: selectedPost.content,
        }}
      />
      {/* Engagement Bar */}
<div className="flex items-center gap-6 mb-10 text-sm">
  {/* Like */}
  <button
    onClick={() =>
      user &&
      dispatch(
        toggleLike({ postId: selectedPost.$id, userId: user.$id })
      )
    }
    className="flex items-center gap-1 text-muted-foreground hover:text-red-500"
  >
    <Heart
      className={`h-5 w-5 ${
        liked ? "fill-red-500 text-red-500" : ""
      }`}
    />
    <span>{likesCount}</span>
  </button>

  {/* Bookmark */}
  <button
    onClick={() =>
      user &&
      dispatch(
        toggleBookmark({ postId: selectedPost.$id, userId: user.$id })
      )
    }
    className="flex items-center gap-1 text-muted-foreground hover:text-primary"
  >
    <Bookmark
      className={`h-5 w-5 ${
        bookmarked ? "fill-primary text-primary" : ""
      }`}
    />
    <span>Save</span>
  </button>
</div>


      {/* ---------------- COMMENTS SECTION ---------------- */}
      <section className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>

        {/* Add comment */}
        {user ? (
          <div className="mb-6">
            <Textarea
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="mb-3"
            />
            <Button onClick={handleAddComment} disabled={adding}>
              {adding ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-6">
            Login to add a comment.
          </p>
        )}

        {/* Comments list */}
        {commentsLoading ? (
          <p className="text-muted-foreground">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-muted-foreground">
            No comments yet. Be the first!
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.$id}
                className="border rounded-lg p-4 bg-background"
              >
                <p className="text-sm mb-2">{comment.content}</p>

                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{new Date(comment.$createdAt).toLocaleString()}</span>

                  {user?.$id === comment.userId && (
                    <button
                      disabled={deletingId === comment.$id}
                      className="text-red-500 hover:underline disabled:opacity-50"
                      onClick={() => dispatch(deleteComment(comment.$id))}
                    >
                      {deletingId === comment.$id ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </article>
  );
};

export default PostDetails;
