// app/users/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";

// ✅ Type definitions for API response
interface UserInfo {
  id: number;
  username: string;
  email: string;
}

interface UserProfileData {
  user: UserInfo;
  bio: string;
  avatar_url: string | null;
  website: string | null;
  location: string | null;
  privacy: "public" | "private";
  followers_count: number;
  following_count: number;
  posts_count: number;
}

export default function UserProfile() {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const params = useParams<{ id: string }>();

  useEffect(() => {
    if (!params.id) return;

    axios
      .get<UserProfileData>(`http://127.0.0.1:8000/api/users/${params.id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Profile fetch error:", err));
  }, [params.id]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border"
      >
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={`${user.user.username} Avatar`}
                width={128}
                height={128}
                className="object-cover"
              />
            ) : (
              <div className="bg-indigo-500 text-white w-full h-full flex items-center justify-center text-4xl font-bold">
                {user.user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* User Info */}
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {user.user.username}
            </h2>
            <p className="text-gray-500">{user.user.email}</p>
            <p className="mt-3 text-gray-700">{user.bio}</p>

            {/* Location & Website */}
            <div className="mt-4 flex gap-6 text-sm text-gray-600">
              <span>📍 {user.location || "Not provided"}</span>
              <span>🌐 {user.website || "No website"}</span>
            </div>

            {/* Stats */}
            <div className="mt-6 flex gap-6">
              <span className="font-semibold">
                {user.followers_count} Followers
              </span>
              <span className="font-semibold">
                {user.following_count} Following
              </span>
              <span className="font-semibold">{user.posts_count} Posts</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
