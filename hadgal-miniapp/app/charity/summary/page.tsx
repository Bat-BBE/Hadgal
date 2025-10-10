"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocalDonations, Donation } from "@/app/hooks/useLocalDonations";
import { useUserId } from "@/app/hooks/useUserId";
import organizations from "@/app/data/organizations.json";
import { FaDownload } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CharitySummaryPage() {
  const userId = useUserId();
  const router = useRouter();
  const { getAll } = useLocalDonations();

  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    if (!userId) return;
    const d = getAll(userId);
    setDonations(d);
    }, [userId]);


  const totalCount = donations.length;
  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const donatedOrgIds = Array.from(new Set(donations.map((d) => d.orgId)));
  const donatedOrgs = organizations.filter((org) =>
    donatedOrgIds.includes(org.id)
  );
  const handleDownload = () => {
    alert("Хуулга татах боломжийг дараа холбоно!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 p-4 text-white">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-row items-center space-x-3 mb-6 mt-3">
                <button
                  className="text-white hover:text-gray-200 transition"
                  onClick={() => router.push("/charity")}
                >
                  <Image src="/images/arrow.png" alt="back" width={23} height={23} />
                </button>
                <h1 className="text-2xl font-bold text-white">Нийт хандив</h1>
              </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-white/30 text-emerald-700 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition text-white"
        >
           Хуулга татах
        </button>
      </div>
      <div className="bg-white text-gray-800 rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-emerald-700 mb-3 ml-30">Талархал</h2>
        <p className="leading-relaxed text-black">
          🌿 Таны хандив олон хүнд тус болж байна.
          <br />
          Та нийт <b className="font-bold text-xl text-emerald-600">{totalCount}</b> удаа хандив өгч, нийт{" "}
          <b className="font-bold text-xl text-emerald-600">₮{totalAmount.toLocaleString("mn-MN")}</b>-ийг сайн үйлсэд зориулжээ.
          <br />
          Танд баярлалаа!
        </p>
      </div>
      <h3 className="text-lg font-bold mb-3">Хандив өгсөн байгууллагууд</h3>
      <div className="space-y-3">
        {donatedOrgs.length === 0 ? (
          <p className="text-gray-200">Та хараахан хандив хийгээгүй байна.</p>
        ) : (
          donatedOrgs.map((org) => (
            <div
              key={org.id}
              className="bg-white/40 text-black rounded-lg p-4 shadow"
            >
              <p className="font-semibold text-white">{org.name}</p>
              <p className="text-sm text-gray-300">
                {org.description?.slice(0, 80) || ""}...
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
