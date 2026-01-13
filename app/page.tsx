"use client";

import { useEffect } from "react";
import "./globals.css";

export default function Home() {
  useEffect(() => {
    window.location.href = "/login";
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg font-semibold">
        Redirecting to website...
      </p>
    </div>
  );
}
