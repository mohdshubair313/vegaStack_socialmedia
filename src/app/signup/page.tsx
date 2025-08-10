"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    password2: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("auth/register/", form);
    console.log("Submitting form:", form);
    router.push("/login");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-blue-400">
      <Card className="p-8 w-full max-w-md bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20">
        <CardContent className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">
            Create Account
          </h2>
          <p className="text-center text-white/70">
            Join us and start your journey
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="bg-white/20 text-white placeholder-white/60 border border-white/30"
            />
            <Input
              placeholder="Username"
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
            <Input
              placeholder="Confirm Password"
              type="password"
              value={form.password2}
              onChange={(e) =>
                setForm({ ...form, password2: e.target.value })
              }
              className="bg-white/20 text-white placeholder-white/60 border border-white/30"
            />
            <Button
              type="submit"
              className="w-full bg-white text-purple-600 font-semibold hover:bg-purple-100 transition"
            >
              Sign Up
            </Button>
          </form>
          <div className="text-center text-white/80 text-sm">
            Already have an account?{" "}
            <span
              className="text-white underline cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Login Now
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
