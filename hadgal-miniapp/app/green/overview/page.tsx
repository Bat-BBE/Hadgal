"use client";
import { useEffect, useMemo, useState } from "react";
import BackCoin from "../../components/backButton";
import GraphArea from "../../components/GraphArea";
import ClickableItem from "@/app/components/ListItem";
import { useLocalSavings, Saving } from "@/app/hooks/useLocalSaving";
import { useProjects } from "@/app/hooks/useProjects";
import { useUserId } from "@/app/hooks/useUserId";
import { config } from "@/config/index";
import { Projects } from "@/app/type/Project"

export default function GreenOverview() {
  const userId = useUserId();
  const { getAll } = useLocalSavings();
  const { loadAll: loadProjects } = useProjects();

  const [savings, setSavings] = useState<Saving[]>([]);
  const [projects, setProjects] = useState<Projects[]>([]);

  useEffect(() => {
    if (!userId) return;
    const data = getAll(userId);
    setSavings(data);

    loadProjects().then((res) => setProjects(res));
  }, [userId, getAll, loadProjects]);

  const groupedData = useMemo(() => {
    return savings.reduce((acc: any[], s: any) => {
      const existing = acc.find((item) => item.projectId === s.projectId);
      if (existing) {
        existing.amount += s.amount;
      } else {
        const proj = projects.find((p) => p.id === s.projectId);
        acc.push({
          projectId: s.projectId,
          name: proj?.name || s.type,
          amount: s.amount,
        });
      }
      return acc;
    }, []);
  }, [savings, projects]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 m-0 p-4 text-black">
      <BackCoin uri={`${config.apiBaseUrl}/home`} />
      <h1 className="ml-3 text-2xl text-white mb-3 font-bold">Ногоон хөрөнгө</h1>
      <GraphArea
        data = {groupedData.map((g) => ({
          label: g.name,
          value: g.amount,
        }))}
      />
      <div className="mt-4">
        {groupedData.map((g) => (
          <ClickableItem
            key={g.projectId}
            title={g.name}
            subtitle={`Хөрөнгө оруулалт: ₮${g.amount.toLocaleString("mn-MN")}`}
            url={`/green/${g.projectId}`}
            />
        ))}
      </div>
    </div>
  );
}
