"use client";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserId } from "@/app/hooks/useUserId";
import Lottie from "lottie-react";
import greenAnimation from "@/public/animations/green.json";
import toast from "react-hot-toast";
import { useProjects } from "@/app/hooks/useProjects";
import { useLocalSavings } from "@/app/hooks/useLocalSaving";
import { useLocalTokens } from "@/app/hooks/useLocalTokens";

export default function SavingsPage() {
  const router = useRouter();
  const userId = useUserId();
  const { loadAll } = useProjects();
  const { create } = useLocalSavings();
  const { addTokens } = useLocalTokens();
  const [showSuccess, setShowSuccess] = useState(false);

  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const [amount, setAmount] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");

  useEffect(() => {
    loadAll().then((data) => setProjects(data || []));
  }, [loadAll]);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) || null,
    [selectedProjectId, projects]
  );

  const interest = selectedProject?.irr || 0;

  const isFormValid = useMemo(() => {
    return (
      selectedProjectId &&
      amount &&
      Number(amount) > 0 &&
      accountNumber.trim() !== ""
    );
  }, [selectedProjectId, amount, accountNumber]);

  const resetAll = () => {
    setAmount("");
    setAccountNumber("");
  };

  const handleSubmit = () => {
    if (!userId || !isFormValid || !selectedProject) return;
    const investAmount = Number(amount);
    const newSaving = {
      id: Date.now().toString(),
      userId,
      type: selectedProject.name,
      typeId: selectedProject.id,
      projectId: selectedProject.id,
      amount: investAmount,
      interest: interest,
      openedAt: new Date().toISOString().split("T")[0],
      dans: accountNumber,
      description: selectedProject?.description,
      budget: selectedProject?.butged,
    };
    create(newSaving);

    const tokenAmount = Math.floor(investAmount / 10000);
    if (tokenAmount > 0) {
      addTokens(userId, tokenAmount);
      toast.success(`🎉 Та ${tokenAmount} DigiToken цуглууллаа!`);
    }
    const updatedProjects = projects.map((p) =>
      p.id === selectedProject.id
        ? { ...p, current: (p.current || 0) + investAmount }
        : p
    );
    setProjects(updatedProjects);

    

    toast.success("Хөрөнгө оруулалт амжилттай хийгдлээ!");
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 p-4">
      <div className="flex flex-row items-center space-x-3 mb-6 mt-3">
        <button
          className="text-white hover:text-gray-200 transition"
          onClick={() => router.push("/home")}
        >
          <Image src="/images/arrow.png" alt="back" width={23} height={23} />
        </button>
        <h1 className="text-2xl font-bold text-white">Ногоон хөрөнгө оруулах</h1>
      </div>

      {!selectedProjectId ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <button
              key={proj.id}
              onClick={() => {
                setSelectedProjectId(proj.id);
                resetAll();
              }}
              className="relative rounded-2xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-emerald-300/40 transition transform duration-300 p-4 bg-white/5"
            >
              <Lottie animationData={greenAnimation} loop className="w-full h-15" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg text-center px-4 py-2 rounded-xl bg-black/30">
                  {proj.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="relative mb-6 rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-white/5">
            <Lottie animationData={greenAnimation} loop className="w-full h-48" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-xl text-center bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl">
                {selectedProject?.name}
              </span>
            </div>
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow text-sm font-semibold text-gray-700">
              Хүү: {interest}%
            </div>
          </div>

          <div className="flex flex-row gap-3 mb-6">
            {projects
              .slice(0, 3)
              .filter((t) => t.id !== selectedProject.id)
              .map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedProjectId(t.id);
                    resetAll();
                  }}
                  className="flex-1 relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
                >
                  <Lottie animationData={t.animation} loop className="w-full h-23"></Lottie>
                  <div className="absolute inset-0 flex items-center justify-center bg-white/20">
                    <span className="text-white font-semibold text-sm text-center px-2 py-1 bg-black/30 backdrop-blur-md rounded-lg">
                      {t.name}
                    </span>
                  </div>
                </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-emerald-800">
                {selectedProject?.name}
              </h3>
              <p className="mt-2 text-gray-700 leading-relaxed">
                {selectedProject?.description ?? "Энэ төсөлд тайлбар олдсонгүй."}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="number"
                min={0}
                placeholder="Гүйлгээний дүн (₮)"
                className="w-full border border-gray-300 p-3 rounded-lg text-gray-900"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <input
                type="text"
                placeholder="Гүйлгээний утга"
                className="w-full border border-gray-300 p-3 rounded-lg text-gray-900"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`w-full p-3 rounded-lg text-xl font-bold transition ${
                  isFormValid
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Шилжүүлэх
              </button>

              <button
                type="button"
                onClick={() => setSelectedProjectId(null)}
                className="w-full p-3 rounded-lg text-xl font-bold bg-gray-300 text-emerald-900 hover:bg-gray-400 transition"
              >
                Болих
              </button>
            </div>
          </div>
          {showSuccess && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center">
              <Lottie
                animationData={greenAnimation}
                loop={false}
                className="w-40 h-40 mx-auto"
              />
              <h2 className="text-xl font-bold text-emerald-700 mt-4">
                Талархал
              </h2>
              <p className="text-gray-700 mt-2 leading-relaxed text-center">
                🌿 Таны хөрөнгө оруулалт зөвхөн тоо биш — байгальд үлдэх бодит өөрчлөлт юм.
                Таны дэмжлэгээр илүү цэвэр агаар, тогтвортой ирээдүйг бид хамтдаа бүтээж байна.
                Танд баярлалаа! 🌿 🌱💚
              </p>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  router.push("/home");
                }}
                className="mt-5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold w-full"
              >
                Үргэлжлүүлэх
              </button>
            </div>
          </div>
        )}
        </>
      )}
    </div>
  );
}