import { useSelector } from "react-redux";
import PostCard from "../components/PostCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Bookmarks = () => {
  const posts = useSelector((state) => state.posts.posts);
  const bookmarks = useSelector(
    (state) => state.bookmarks.userBookmarks
  );

  const bookmarkedPosts = posts.filter(
    (post) => bookmarks[post.$id]
  );

  if (bookmarkedPosts.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">
          No bookmarks yet
        </h2>
        <p className="text-muted-foreground mb-6">
          Save posts to read later.
        </p>

        <Link to="/">
          <Button>Explore posts</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Your Bookmarks
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bookmarkedPosts.map((post) => (
          <PostCard key={post.$id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
