// app/change-password/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Lock, KeyRound } from "lucide-react";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ old_password: "", new_password: "" });
  const [msg, setMsg] = useState("");
  const router = useRouter();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await api.put("auth/change-password/", {
      old_password: form.old_password,
      new_password: form.new_password,
    });
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setMsg("Password changed successfully! Redirecting to login...");

    setTimeout(() => {
      router.push("/login");
    }, 1500);

  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as { response?: { data?: unknown } }).response?.data
    ) {
      const errData = (error as { response?: { data?: Record<string, string[]> } }).response?.data;
      if (errData?.old_password) {
        setMsg(errData.old_password[0]);
        return;
      }
    }
    setMsg("Error changing password");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2"
        >
          <Lock className="text-blue-500" /> Change Password
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 space-y-5"
        >
          <div className="relative">
            <KeyRound className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              name="old_password"
              type="password"
              placeholder="Old Password"
              value={form.old_password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              name="new_password"
              type="password"
              placeholder="New Password"
              value={form.new_password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-2 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            Change Password
          </motion.button>
        </motion.form>

        {msg && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mt-4 text-center font-medium ${
              msg.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {msg}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
