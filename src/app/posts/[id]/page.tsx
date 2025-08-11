"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";
import DetailedPostSkeleton from "@/components/DetailedPostSkeleton";

interface Post {
  id: number;
  content: string;
  title: string;
  author: string;
  author_id: number; // ✅ backend should return this
  created_at: string;
  updated_at: string;
  image_url: string | null;
  category: string;
  is_active: boolean;
  like_count: number;
  comment_count: number;
}

interface Comment {
  id: number;
  content: string;
  author: string;
  created_at: string;
}

export default function PostDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { accessToken }: { accessToken: string | null } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("general");
  const [storedUserId, setStoredUserId] = useState<number | null>(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const idFromStorage = localStorage.getItem("user_id");
    if (idFromStorage) setStoredUserId(Number(idFromStorage));
  }, []);

  const fetchPost = async () => {
    try {
      const res = await api.get<Post>(`posts/${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setPost(res.data);
      setEditContent(res.data.content);
      setEditCategory(res.data.category);
    } catch (err) {
      console.error("Failed to fetch post:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get<Comment[]>(
        `interaction/posts/${id}/comments/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchPost();
    fetchComments();
  }, [id, accessToken]);

  const handleUpdate = async () => {
    try {
      const res = await api.patch<Post>(
        `posts/${id}/`,
        { content: editContent, category: editCategory },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setPost(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update post:", err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`posts/${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      router.push("/");
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    try {
      await api.post(
        `interaction/posts/${id}/like/`,
        { liked: newLiked },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    try {
      await api.post(
        `interaction/posts/${id}/comments/create/`,
        { content: comment },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setComment("");
      setShowCommentBox(false);
      fetchComments();
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-600">
        <DetailedPostSkeleton />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Post not found.
      </div>
    );
  }

  const isAuthor = storedUserId === post.author_id; // ✅ now uses correct field

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 pb-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-pink-200/30 rounded-full blur-[160px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-purple-200/30 rounded-full blur-[160px] -z-10 animate-pulse" />

      {/* Header Image */}
      {post.image_url && (
        <div className="relative w-full h-[420px] md:h-[500px] overflow-hidden group">
          <motion.div
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Image
              src={post.image_url}
              alt="Post Cover"
              fill
              className="object-cover transform group-hover:scale-105 transition duration-700"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-white/90" />
        </div>
      )}

      {/* Post Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto -mt-28 px-6"
      >
        <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-12 border border-white/40 relative z-10">
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[200px]"
              />
              <Input
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleUpdate}>Save</Button>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Category */}
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-5 py-1 rounded-full text-white font-semibold text-sm shadow-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 animate-[pulse_3s_infinite]"
              >
                {post.category}
              </motion.span>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mt-4 tracking-tight">
                {post.title || `${post.category} — A Deep Dive`}
              </h1>

              {/* Author */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => router.push(`/users/${post.author_id}`)} // ✅ fixed
                className="mt-5 flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition">
                  <span className="font-bold text-indigo-700 text-lg">
                    {post.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-700 font-medium group-hover:text-indigo-600 transition">
                  {post.author}
                </p>
              </motion.div>

              {/* Like & Comment */}
              <div className="flex gap-6 text-gray-600 mt-6">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl transition shadow-sm ${
                    liked
                      ? "bg-blue-100 text-blue-600 shadow-inner"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <ThumbsUp size={20} />
                  {liked ? "Liked" : "Like"}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCommentBox(!showCommentBox)}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl hover:bg-gray-100 transition shadow-sm"
                >
                  <MessageCircle size={20} />
                  Comment
                </motion.button>
              </div>

              {/* Comment Box */}
              {showCommentBox && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex gap-2"
                >
                  <Input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                  />
                  <Button onClick={handleCommentSubmit}>Send</Button>
                </motion.div>
              )}

              {/* Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="prose prose-lg mt-8 max-w-none text-gray-800"
              >
                <p>{post.content}</p>
              </motion.div>

              {/* Edit/Delete */}
              {isAuthor && (
                <div className="mt-8 flex gap-2">
                  <Button onClick={() => setIsEditing(true)}>Update</Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                </div>
              )}

              {/* Comments */}
              <div className="mt-10 border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Comments</h3>
                {comments.length > 0 ? (
                  comments.map((c) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-4 pb-3 border-b border-gray-100"
                    >
                      <p className="font-medium text-gray-900">{c.author}</p>
                      <p className="text-gray-700">{c.content}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(c.created_at).toLocaleString()}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
