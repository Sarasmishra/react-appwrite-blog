import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../redux/posts/postsThunks";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import RichTextEditor from "../components/editor/RichTextEditor";

const CreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const { loading } = useSelector((state) => state.posts);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // HTML
  const [status, setStatus] = useState("published");
  const [coverImage, setCoverImage] = useState(null);
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const excerpt = content.replace(/<[^>]+>/g, "").slice(0, 120);

    const tagsArray = tags
  .split(",")
  .map((tag) => tag.trim())
  .filter(Boolean);

    const result = await dispatch(
      createPost({
        title,
        slug,
        content,
        excerpt,
        status,
        category,
    tags: tagsArray,
        authorId: user.$id,
        coverImage,
      })
    );

    if (createPost.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Create Post</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="space-y-1">
          <Label>Title</Label>
          <Input
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Cover Image */}
        <div className="space-y-1">
          <Label>Cover Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
          />
        </div>

        {/* Content */}
        <div className="space-y-1">
          <Label>Content</Label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        {/* Category */}
        <div className="space-y-1">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="Tech">Tech</SelectItem>
              <SelectItem value="Career">Career</SelectItem>
              <SelectItem value="Tutorials">Tutorials</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div className="space-y-1">
          <Label>Tags</Label>
          <Input
            placeholder="react, redux, appwrite"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="space-y-1">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Publish</SelectItem>
              <SelectItem value="draft">Save as Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "Publishing..." : "Create Post"}
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
