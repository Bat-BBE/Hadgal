"use client";

import { useRouter } from "next/navigation";
import Image from "next/image"
import { useUserId } from "../hooks/useUserId";
import { useLocalTokens } from "../hooks/useLocalTokens";
import toast from "react-hot-toast";

export default function BackCoin({uri}: {uri? : string}) {
  const router = useRouter();
  const userId = useUserId();
  const { getBalance } = useLocalTokens();
  const token = userId ? getBalance(userId) : 0;

  return (
    <div className="flex justify-between p-2">
      <div 
        onClick={() => (uri ? router.push(uri) : router.back())}
        className="cursor-pointer text-blue-400 mt-1 ml-1 hover:text-blue-200 transition"
      >
      <Image src="/images/arrow.png" alt="back" width={25} height={25} />
      </div>
      <div className="flex">
          <button
          onClick={() => {
            toast.success(
              `Таны одоогийн токен: ${token}\n💰 10,000₮ тутамд 1 токен олгогдоно.`,
              {
                duration: 5000,
                position: "top-center",
              }
            );
          }}
          className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/20 transition-all"
        >
          <span className="text-green-300 text-sm font-bold">{token}</span>
          <Image src="/images/coin.png" alt="coin" width={18} height={18} />
        </button>
      </div>
    </div>
  );
}