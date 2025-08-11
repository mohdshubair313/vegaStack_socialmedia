"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoutes";
import api from "@/lib/api";
import LogoutButton from "@/components/LogoutButton";
import LikeButton from "@/components/shsfui/button/like-button";
import PostSkeleton from "@/components/PostSkeleton";

// Post type
interface Post {
  id: number;
  content: string;
  category: string;
  image_url?: string;
  like_count: number;
  comment_count: number;
}

// API response type
interface PaginatedResponse {
  results?: Post[];
  [key: string]: Post[] | number | string | undefined;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get<PaginatedResponse | Post[]>(
        "posts/?ordering=-created_at"
      );

      const fetchedPosts = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];

      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create a new post
  const handleCreatePost = async () => {
    if (!content.trim()) return;

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("category", category);
      if (image) formData.append("image", image);

      const token = localStorage.getItem("access_token");

      const res = await api.post<Post>("posts/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts((prev) => [res.data, ...prev]);
      setContent("");
      setCategory("general");
      setImage(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#111827] to-[#0a0f1f] text-white relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[160px] -translate-x-1/2 -translate-y-1/2"
          animate={{ y: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 10 }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[160px] translate-x-1/2 translate-y-1/2"
          animate={{ y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 12 }}
        />

        {/* Header */}
        <header className="flex items-center justify-between px-8 py-4 backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-50 shadow-lg">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-md">
            SocialSphere
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/change-password"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg"
            >
              Change Password
            </Link>
            <LogoutButton />
          </div>
        </header>

        {/* Posts Grid */}
        <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Sirf skeleton render karo jab loading ho
            Array.from({ length: 6 }).map((_, idx) => <PostSkeleton key={idx} />)
          ) : posts.length > 0 ? (
            <AnimatePresence>
              {posts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ delay: idx * 0.05, type: "spring", stiffness: 80 }}
                  onClick={() => (window.location.href = `/posts/${post.id}`)}
                  className="group relative rounded-2xl overflow-hidden shadow-xl cursor-pointer border border-white/10 hover:scale-[1.03] hover:shadow-2xl transition-all duration-500"
                  style={{
                    backgroundImage: `url(${
                      post.image_url ||
                      "https://images.unsplash.com/photo-1503264116251-35a269479413"
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />
                  <div className="relative z-10 p-5">
                    <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {post.category}
                    </h2>
                    <p className="mt-2 text-sm text-gray-200 line-clamp-3">
                      {post.content}
                    </p>
                    <div className="flex gap-4 mt-4 items-center text-sm text-gray-300">
                      <LikeButton
                        initialLiked={false}
                        onLikeChange={(isLiked) => {
                          setPosts((prev) =>
                            prev.map((p) =>
                              p.id === post.id
                                ? {
                                    ...p,
                                    like_count: p.like_count + (isLiked ? 1 : -1),
                                  }
                                : p
                            )
                          );
                        }}
                      />
                      <span>{post.like_count}</span>
                      <span>💬 {post.comment_count}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <p className="col-span-full text-gray-400 text-center">No posts yet</p>
          )}
        </main>

        {/* Floating Action Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="fixed bottom-8 right-8 group z-50"
        >
          <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition bg-black/70 text-white text-xs rounded px-2 py-1">
            Click to post
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl text-4xl"
          >
            +
          </button>
        </motion.div>

        {/* Create Post Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6"
              >
                <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Create Post
                </h2>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-white/10 bg-black/30 rounded-lg p-3 mb-3 text-white"
                >
                  <option value="general">General</option>
                  <option value="announcement">Announcement</option>
                  <option value="question">Question</option>
                </select>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full border border-white/10 bg-black/30 rounded-lg p-3 h-32 resize-none mb-3 text-white"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="mb-3 text-sm text-gray-300"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-purple-500 hover:to-blue-500"
                  >
                    Post
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
