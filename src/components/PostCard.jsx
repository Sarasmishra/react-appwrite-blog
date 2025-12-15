import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Bookmark } from "lucide-react";

import { getCoverImageUrl } from "../app/storageService";
import { toggleLike } from "../redux/likes/likesThunks";
import { toggleBookmark } from "../redux/bookmarks/bookmarksThunks";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const likesCount = useSelector(
    (state) => state.likes.counts[post.$id] || 0
  );

  const liked = useSelector(
    (state) => state.likes.userLikes[post.$id]
  );

  const bookmarked = useSelector(
    (state) => state.bookmarks.userBookmarks[post.$id]
  );

  const handleLike = () => {
    if (!user) return;
    dispatch(toggleLike({ postId: post.$id, userId: user.$id }));
  };

  const handleBookmark = () => {
    if (!user) return;
    dispatch(toggleBookmark({ postId: post.$id, userId: user.$id }));
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      {/* Cover Image */}
      {post.coverImageId && (
        <div className="overflow-hidden">
          <img
            src={getCoverImageUrl(post.coverImageId)}
            alt={post.title}
            className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      <CardHeader className="pb-2 space-y-2">
        {/* Date */}
        <Badge variant="secondary" className="w-fit">
          {new Date(post.$createdAt).toLocaleDateString()}
        </Badge>

        {/* Title */}
        <Link to={`/post/${post.slug}`}>
          <h2 className="text-xl font-semibold leading-snug hover:underline">
            {post.title}
          </h2>
        </Link>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Excerpt */}
        <p className="text-muted-foreground line-clamp-3">
          {post.excerpt}…
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="flex gap-1"
            onClick={handleLike}
          >
            <Heart
              className={`h-4 w-4 ${
                liked ? "fill-red-500 text-red-500" : ""
              }`}
            />
            <span className="text-sm">{likesCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
          >
            <Bookmark
              className={`h-4 w-4 ${
                bookmarked ? "fill-primary text-primary" : ""
              }`}
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
