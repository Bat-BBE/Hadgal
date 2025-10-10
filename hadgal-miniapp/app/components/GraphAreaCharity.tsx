"use client";

import { useEffect, useState, useMemo } from "react";
import PieChart from "./Chart";
import { useLocalDonations, Donation } from "@/app/hooks/useLocalDonations";
import { useUserId } from "@/app/hooks/useUserId";
import charityList from "@/app/data/organizations.json";
import { useRouter } from "next/navigation";

export default function GraphAreaCharity() {
  const userId = useUserId();
  const { getAll } = useLocalDonations();
  const router = useRouter();

  const [donations, setDonations] = useState<Donation[]>([]);
  const [orgs] = useState<any[]>(charityList);

  useEffect(() => {
    if (!userId) return;
    const d = getAll(userId);
    setDonations(d);
    }, [userId]);

  const mergedData = useMemo(() => {
    return orgs.map((org) => {
      const related = donations.filter((d) => d.orgId === org.id);
      const totalValue = related.reduce((sum, d) => sum + d.amount, 0);
      return {
        id: org.id,
        name: org.name,
        value: totalValue,
      };
    });
  }, [orgs, donations]);

  const totalDonated = useMemo(() => {
    return mergedData.reduce((sum, item) => sum + item.value, 0);
  }, [mergedData]);

  return (
    <div className="my-2 bg-white p-3 rounded-xl">
      <div
        className="mb-3 font-semibold cursor-pointer text-emerald-700 hover:underline text-lg"
        onClick={() => router.push("/charity/summary")}
      >
        Нийт хандив: ₮{totalDonated.toLocaleString("mn-MN")}
      </div>

      <hr />

      <div>
        <p className="text-lg mb-3">Хандивын хуваарилалт</p>
        <div className="relative z-10 w-60 max-w-sm mx-auto overflow-visible aspect-square">
          <PieChart data={mergedData.filter((d) => d.value > 0)} />
        </div>
      </div>
    </div>
  );
}
