"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  let dataUrl = 'projects';
  let testId = Number(searchParams.get("project"));
  if (testId < 1) {
    testId = Number(searchParams.get("organization"));
    dataUrl = 'organizations';
  }

  const projectId = testId;
  const url = dataUrl;

  const [projects, setProjects] = useState<any[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(url);

    if (data) {
      const parsed = JSON.parse(data);
      setProjects(parsed);
    }
  }, []);

  const handleTransaction = () => {
    if (!projectId || amount <= 0) {
      alert("Дүнг зөв оруулна уу.");
      return;
    }

    const updated = projects.map((proj) =>
      proj.id === projectId
        ? { ...proj, value: (proj.value || 0) + amount } 
        : proj
    );

    localStorage.setItem(url, JSON.stringify(updated));
    setProjects(updated);
    setAmount(0);
    setSuccess(true);

    router.push('/');
  };

  const selectedProj = projects.find((p) => p.id === projectId);

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h1 className="text-xl font-semibold text-center mb-4">
        Гүйлгээ
      </h1>

      {selectedProj && (
        <p className="mb-3 text-center text-black">
          Төсөл: <span className="font-semibold">{selectedProj.name}</span>
        </p>
      )}

      <label className="block mb-2 text-black">Дүн (₮):</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
        placeholder="₮ оруулна уу"
      />

      <button
        onClick={handleTransaction}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition"
      >
        Баталгаажуулах
      </button>

      {success && (
        <div className="mt-4 text-center text-green-600 font-medium animate-pulse">
          Гүйлгээ амжилттай хийгдлээ!
        </div>
      )}
    </div>
  );
}