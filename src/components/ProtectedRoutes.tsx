"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PostSkeleton from "./PostSkeleton";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { accessToken, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !accessToken) {
      router.push("/login");
    }
  }, [loading, accessToken, router]);

  if (loading) {
    return <PostSkeleton />;
  }

  return <>{children}</>;
}
