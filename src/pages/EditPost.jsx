import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from "../redux/posts/postsThunks";
import { useParams, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import RichTextEditor from "../components/editor/RichTextEditor";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const post = useSelector((state) => state.posts.selectedPost);
  const user = useSelector((state) => state.auth.user);
  const { loading } = useSelector((state) => state.posts);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
const [tags, setTags] = useState("");


  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content); // HTML goes into TipTap
      setCategory(post.category || "General");
      setTags(post.tags?.join(", ") || "");
    }
  }, [post]);

  // Authorization check
  if (!post) return null;

  if (!user || user.$id !== post.authorId) {
    return <p className="text-center mt-10">Unauthorized</p>;
  }

  const handleUpdate = async (e) => {
    e.preventDefault();

    const tagsArray = tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

    const result = await dispatch(
      updatePost({
        postId: post.$id,
        data: {
          title,
          content,
          excerpt: content.replace(/<[^>]+>/g, "").slice(0, 120),
          category,
          tags: tagsArray,
        },
      })
    );

    if (updatePost.fulfilled.match(result)) {
      navigate(`/post/${post.slug}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Post</h1>

      <form onSubmit={handleUpdate} className="space-y-5">
        {/* Title */}
        <div className="space-y-1">
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Content */}
        <div className="space-y-1">
          <Label>Content</Label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Post"}
        </Button>
      </form>
    </div>
  );
};

export default EditPost;
