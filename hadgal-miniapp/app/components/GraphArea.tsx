"use client";

import { useEffect, useState, useMemo } from "react";
import PieChart from "./Chart";
import { useLocalSavings, Saving } from "@/app/hooks/useLocalSaving";
import { useUserId } from "@/app/hooks/useUserId";
import projectList from "@/app/data/projects.json";

type GraphAreaProps = {
  data?: { label: string; value: number }[];
};

export default function GraphArea({ data }: GraphAreaProps) {
  const userId = useUserId();
  const { getAll } = useLocalSavings();

  const [savings, setSavings] = useState<Saving[]>([]);
  const [projects, setProjects] = useState<any[]>(projectList);

  useEffect(() => {
    if (!userId) return;
    const s = getAll(userId);
    setSavings(s);
  }, [userId, getAll]);

  const mergedData = useMemo(() => {
    return projects.map((p) => {
      const related = savings.filter((s: any) => s.projectId === p.id);
      const totalValue = related.reduce((sum, s) => sum + s.amount, 0);
      return {
        id: p.id,
        name: p.name,
        value: totalValue,
        interest: p.irr || 0,
      };
    });
  }, [projects, savings]);

  const totalInvested = useMemo(() => {
    return mergedData.reduce((sum, item) => sum + item.value, 0);
  }, [mergedData]);

  const totalProfit = useMemo(() => {
    return mergedData.reduce(
      (sum, item) => sum + (item.value * item.interest) / 100,
      0
    );
  }, [mergedData]);

  return (
    <div className="my-2 bg-white p-3 rounded-xl">
      <div className="mb-3">
        Нийт хөрөнгө оруулалт: ₮{totalInvested.toLocaleString("mn-MN")}
      </div>
      <div className="mb-3">
        Нийт ашиг: ₮{totalProfit.toLocaleString("mn-MN")}
      </div>

      <hr />
      <div>
        <p className="text-lg mb-3 fo">Хөрөнгө оруулалтын хуваарилалт</p>
        <div className="relative z-10 w-80 max-w-sm mx-auto overflow-visible aspect-square">
          <PieChart data={mergedData.filter((d) => d.value > 0)} />
        </div>
      </div>
    </div>
  );
}
