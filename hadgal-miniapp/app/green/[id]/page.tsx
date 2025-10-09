"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Lottie from "lottie-react";
import greenAnimation from "@/public/animations/green.json";
import { useUserId } from "@/app/hooks/useUserId";
import { useLocalSavings, Saving } from "@/app/hooks/useLocalSaving";
import { useProjects } from "@/app/hooks/useProjects";
import { useLocalTokens } from "@/app/hooks/useLocalTokens";
import { Projects } from "@/app/type/Project";

export default function GreenSavingDetail() {
  const { id } = useParams();
  const router = useRouter();
  const userId = useUserId();

  const { getById } = useLocalSavings();
  const { loadAll: loadProjects } = useProjects();
  const { getBalance } = useLocalTokens();

  const [saving, setSaving] = useState<Saving | null>(null);
  const [projects, setProjects] = useState<Projects[]>([]);
  const [tokens, setTokens] = useState<number>(0);

  useEffect(() => {
    if (!userId || !id) return;

    const savingData = getById(userId, id as string);
    setSaving(savingData ?? null);

    loadProjects().then((res) => setProjects(res));
    setTokens(getBalance(userId));
  }, [id, userId, getById, loadProjects, getBalance]);

  const selectedProject = useMemo(() => {
    if (!saving) return null;
    return projects.find((p) => p.id === Number(saving.projectId)) || null;
  }, [saving, projects]);

  const fmtMoney = (n: number | undefined) =>
    `₮${(n ?? 0).toLocaleString("mn-MN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  if (!saving || !selectedProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 p-6 text-white">
        <button onClick={() => router.back()} className="mb-4">
          <Image src="/images/arrow.png" alt="back" width={22} height={22} />
        </button>
        <p>Хөрөнгө оруулалтын мэдээлэл олдсонгүй.</p>
      </div>
    );
  }

  const budget = selectedProject.budget ?? 0;
  const investedPercent = budget ? (saving.amount / budget) * 100 : 0;
  const monthlyReturn = ((saving.amount * Number(saving.interest || 0)) / 100) / 12;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 p-6 text-white">
      <div className="flex items-center gap-3 mb-3">
        <button onClick={() => router.back()}>
          <Image src="/images/arrow.png" alt="back" width={22} height={22} />
        </button>
        <h1 className="text-2xl font-bold">Миний хөрөнгө</h1>
      </div>

      <div className="bg-white/85 rounded-2xl p-5 shadow-lg mb-3 text-gray-800">
        <h2 className="text-xl font-bold text-emerald-800">{saving.type}</h2>
        <p className="mt-2 text-gray-700">{saving.description}</p>
      </div>

      <div className="bg-white/3 p-2 rounded-xl bg-white/30">
        <div className="grid grid-row-1 sm:grid-cols-3 gap-1 mb-3">
          <InfoCard label="Миний хөрөнгө" value={fmtMoney(saving.amount)} />
          <InfoCard label="Жилийн өгөөж (IRR)" value={`${saving.interest}%`} />
          <InfoCard label="Төслийн нийт хөрөнгө" value={fmtMoney(budget)} />
          <InfoCard label="Сарын өгөөж" value={fmtMoney(monthlyReturn)} />
          <InfoCard
            label="Үлдэж буй хөрөнгө"
            value={fmtMoney(budget - saving.amount)}
          />
          <div className="bg-white/5 rounded-2xl p-5 shadow-lg mt-2 text-gray-300">
            <p className="mb-2 font-medium">Миний хувь нэмэр</p>
            <div className="w-full bg-white rounded-full h-4 overflow-hidden">
                <div
                  className="h-4 bg-emerald-600"
                  style={{ width: `${investedPercent}%` }}
                />
            </div>
          <p className="mt-2 text-sm text-gray-300">
            {investedPercent.toFixed(1)}% санхүүжилтэнд оролцсон
          </p>
        </div>
      </div>
      </div>
      <div className="overflow-hidden">
        <Lottie animationData={greenAnimation} loop className="w-full h-60" />
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-row justify-between px-4 py-2 border-b-1">
      <p className="text-gray-300 text-sm mt-1">{label}</p>
      <p className="text-lm font-semibold text-white mt-1">{value}</p>
    </div>
  );
}
