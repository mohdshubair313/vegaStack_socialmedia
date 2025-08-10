"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Globe, MapPin, UserPlus, Users } from "lucide-react";

interface UserProfile {
  user: {
    id: number;
    username: string;
    email: string;
  };
  bio: string;
  avatar_url: string | null;
  website: string;
  location: string;
  privacy: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
}

export default function UserProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [storedUserId, setStoredUserId] = useState<string | null>(null);
  

  useEffect(() => {
      if (typeof window !== "undefined") {
        setStoredUserId(localStorage.getItem("user_id"));
        const userId = localStorage.getItem("user_id");
        console.log(userId);
      }
    }, []);

  const fetchProfile = async () => {
    try {
      if (!id) return; // Agar id nahi mili to skip
     const userId = localStorage.getItem("user_id");

      const res = await api.get(`users/${userId}/`);
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (!id) return <div className="p-6 text-center">Invalid user ID.</div>;
  if (loading) return <div className="p-6 text-center">Loading profile...</div>;
  if (!profile) return <div className="p-6 text-center">User not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.user.username}
              width={120}
              height={120}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-700">
              {profile.user.username.charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="text-2xl font-bold mt-4">{profile.user.username}</h1>
          <p className="text-gray-500">{profile.bio}</p>
        </div>

        <div className="flex justify-around mt-6 text-center">
          <div>
            <p className="font-bold text-lg">{profile.posts_count}</p>
            <p className="text-gray-500 text-sm">Posts</p>
          </div>
          <div>
            <p className="font-bold text-lg">{profile.followers_count}</p>
            <p className="text-gray-500 text-sm">Followers</p>
          </div>
          <div>
            <p className="font-bold text-lg">{profile.following_count}</p>
            <p className="text-gray-500 text-sm">Following</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {profile.website && (
            <div className="flex items-center gap-2 text-blue-500">
              <Globe size={18} />
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {profile.website}
              </a>
            </div>
          )}
          {profile.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={18} /> {profile.location}
            </div>
          )}
          <div className="text-gray-500 text-sm">
            Privacy: <span className="capitalize">{profile.privacy}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Button>
            <UserPlus size={16} className="mr-2" />
            Follow
          </Button>
          <Button variant="secondary">
            <Users size={16} className="mr-2" />
            Message
          </Button>
        </div>
      </div>
    </div>
  );
}
