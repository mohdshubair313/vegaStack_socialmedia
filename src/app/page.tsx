"use client";

import ProtectedRoute from "@/components/ProtectedRoutes";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import { motion } from "framer-motion";
import LikeButton from "@/components/shsfui/button/like-button";

type Post = {
  id: number;
  content: string;
  category: string;
  image_url?: string;
  like_count: number;
  comment_count: number;
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [image, setImage] = useState<File | null>(null);

  const fetchPosts = () => {
  api.get("posts/?ordering=-created_at").then((res) => {
    if (res.data.results) {
      setPosts(res.data.results);
    } else {
      setPosts(res.data);
    }
  });
};

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
  if (!content.trim()) return;

  const formData = new FormData();
  formData.append("content", content);
  formData.append("category", category);
  if (image) {
    formData.append("image", image);
  }

  const res = await api.post("posts/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // Naye post ko top pe add karo
  setPosts((prev) => [res.data, ...prev]);

  setContent("");
  setCategory("general");
  setImage(null);
  setShowModal(false);
};

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white relative">
        {/* Top Navigation */}
        <header className="flex items-center justify-between px-8 py-4 backdrop-blur-lg bg-white/5 border-b border-white/10 sticky top-0 z-50">
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            SocialSphere
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/change-password"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
            >
              Change Password
            </Link>
            <LogoutButton />
          </div>
        </header>

        {/* Posts Grid */}
        <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => (window.location.href = `/posts/${post.id}`)}
                className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer border border-white/10 hover:scale-[1.02] hover:shadow-2xl transition-all duration-500"
                style={{
                  backgroundImage: `url(${post.image_url || "https://images.unsplash.com/photo-1476842634003-7dcca8f832de"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Content */}
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
                                  like_count:
                                    p.like_count + (isLiked ? 1 : -1),
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
            ))
          ) : (
            <p className="col-span-full text-gray-400 text-center">
              No posts yet
            </p>
          )}
        </main>

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 group">
          <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition bg-black/70 text-white text-xs rounded px-2 py-1">
            Click to post
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-3xl"
          >
            +
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900/80 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl w-full max-w-md p-6">
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
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
