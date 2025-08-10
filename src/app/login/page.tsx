"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface MyToken {
  user_id: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("auth/login/", form);

      const access = res.data.access;
      const refresh = res.data.refresh;

      const decoded: MyToken = jwtDecode(access);
      console.log("Decoded token:", decoded);

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user_id", decoded.user_id);

      login(access, refresh);

      router.push("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-blue-400">
      <Card className="p-8 w-full max-w-md bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20">
        <CardContent className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">
            Welcome Back
          </h2>
          <p className="text-center text-white/70">
            Login to continue your journey
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="bg-white/20 text-white placeholder-white/60 border border-white/30"
            />
            <Input
              placeholder="Username"
              type="text"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              className="bg-white/20 text-white placeholder-white/60 border border-white/30"
            />
            <Input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="bg-white/20 text-white placeholder-white/60 border border-white/30"
            />
            <Button
              type="submit"
              className="w-full bg-white text-purple-600 font-semibold hover:bg-purple-100 transition"
            >
              Login
            </Button>
          </form>
          <div className="text-center text-white/80 text-sm">
            Don’t have an account?{" "}
            <span
              className="text-white underline cursor-pointer"
              onClick={() => router.push("/signup")}
            >
              Sign Up Now
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
