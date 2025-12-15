import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import PostCard from "../components/PostCard";
import { Button } from "@/components/ui/button";

const MyPosts = () => {
  const user = useSelector((state) => state.auth.user);
  const { posts, loading } = useSelector((state) => state.posts);

  const myPosts = posts.filter(
    (post) => post.authorId === user.$id
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Posts</h1>

        <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
          <Link to="/create">Create Post</Link>
        </Button>
      </div>

      {/* Loading state */}
      {loading && (
        <p className="text-muted-foreground">Loading your posts...</p>
      )}

      {/* Empty state */}
      {!loading && myPosts.length === 0 && (
        <div className="text-center py-16 border rounded-lg bg-muted/40">
          <h2 className="text-lg font-medium mb-2">
            You haven’t written any posts yet
          </h2>
          <p className="text-muted-foreground mb-4">
            Start sharing your thoughts with the world.
          </p>

          <Button
            asChild
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Link to="/create">Write your first post</Link>
          </Button>
        </div>
      )}

      {/* Posts list */}
      {!loading && myPosts.length > 0 && (
        <div className="grid gap-6">
          {myPosts.map((post) => (
            <PostCard key={post.$id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
