"use client";

import { useRouter } from "next/navigation";

type ClickableItemProps = {
  title: string;
  subtitle?: string;
  url: string;
};

export default function ClickableItem({ title, subtitle, url }: ClickableItemProps) {
  const router = useRouter();

  return (
    <div
      className="p-4 mb-3 bg-white/90 rounded-xl shadow cursor-pointer hover:bg-gray-100 transition"
      onClick={() => router.push(url)}
    >
      <p className="text-lg font-bold">{title}</p>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </div>
  );
}

