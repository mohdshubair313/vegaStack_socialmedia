// app/change-password/page.tsx
"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ old_password: "", new_password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("auth/change-password/", form);
      setMsg("Password changed successfully!");
    } catch (error) {
      setMsg("Error changing password");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Change Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="old_password"
          type="password"
          placeholder="Old Password"
          value={form.old_password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="new_password"
          type="password"
          placeholder="New Password"
          value={form.new_password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Change Password
        </button>
      </form>
      {msg && <p className="mt-4">{msg}</p>}
    </div>
  );
}
