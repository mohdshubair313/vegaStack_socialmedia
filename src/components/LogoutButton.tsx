// components/LogoutButton.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post("auth/logout/"); // backend logout
    } catch (error) {
      console.error("Logout error", error);
    }
    logout(); // cookies clear + redirect
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-300 cursor-pointer"
    >
      Logout
    </button>
  );
}
