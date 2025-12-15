import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/posts/postsThunks";

import PostCard from "../components/PostCard";
import PostSkeleton from "../components/PostSkeleton";
import SearchBar from "../components/SearchBar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { fetchLikes, fetchUserLikes } from "../redux/likes/likesThunks";
import { fetchUserBookmarks } from "@/redux/bookmarks/bookmarksThunks";


const Home = () => {
  const dispatch = useDispatch();

  const { posts, loading, error } = useSelector((state) => state.posts);
  const user = useSelector((state) => state.auth.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState(null);
  const POSTS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    if (posts.length > 0) {
      const postIds = posts.map((p) => p.$id);
      dispatch(fetchLikes(postIds));
  
      if (user) {
        dispatch(fetchUserLikes(user.$id));
        dispatch(fetchUserBookmarks(user.$id)); // ✅ ADD THIS
      }
    }
  }, [posts, user, dispatch]);
  
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedTag]);

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  /* ---------- ERROR ---------- */
  if (error) {
    return (
      <div className="text-center mt-10 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  // 🔒 Public users see ONLY published posts
  const publishedPosts = posts.filter((post) => post.status === "published");
  const allTags = Array.from(
    new Set(publishedPosts.flatMap((post) => post.tags || []))
  );

  // 🔒 Category filter
  const categoryFiltered =
    selectedCategory === "All"
      ? publishedPosts
      : publishedPosts.filter((post) => post.category === selectedCategory);

  // 🏷️ Tag filter
  const tagFiltered = selectedTag
    ? categoryFiltered.filter((post) => post.tags?.includes(selectedTag))
    : categoryFiltered;

  // 🔍 Search filter
  const filteredPosts = tagFiltered.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query)
    );
  });
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Latest Posts</h1>
        <p className="text-muted-foreground">
          Discover thoughts, stories, and ideas from our writers.
        </p>
      </div>

      {/* Filters: Category + Search */}
      <div className="mb-8 flex flex-col  gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="flex-1">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        {/* Category */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="General">General</SelectItem>
            <SelectItem value="Tech">Tech</SelectItem>
            <SelectItem value="Career">Career</SelectItem>
            <SelectItem value="Tutorials">Tutorials</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "secondary"}
              className="cursor-pointer capitalize"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-20 border rounded-lg bg-muted/40">
          <h2 className="text-lg font-medium mb-2">No posts found</h2>
          <p className="text-muted-foreground">Try a different keyword.</p>
        </div>
      )}

      {/* Posts grid */}
      {filteredPosts.length > 0 && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post) => (
              <PostCard key={post.$id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12 text-foreground">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
