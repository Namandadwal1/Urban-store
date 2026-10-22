
"use client";

import { useEffect, useState } from "react";

export default function WebsiteLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (document.readyState === "complete") {
      setLoading(false);
      return;
    }

    const handleLoad = () => setLoading(false);

    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#FAF7F2]">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium tracking-[0.3em] text-[#29231F]">
          LOADING
        </span>
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#A56A43]" />
      </div>
    </div>
  );
}
