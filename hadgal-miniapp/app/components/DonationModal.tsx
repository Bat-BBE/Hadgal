"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import successAnim from "@/public/animations/target.json";
import { useLocalDonations } from "@/app/hooks/useLocalDonations";
import { useUserId } from "@/app/hooks/useUserId";

export default function DonationModal({
  organization,
  onCloseAction,
}: {
  organization: any;
  onCloseAction: () => void;
}) {
  const router = useRouter();
  const userId = useUserId();
  const { addOne } = useLocalDonations();

  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const isFormValid = amount !== "" && accountNumber !== "";

  const handleSubmit = () => {
    if (!userId) return;

    const donationData = {
        id: Date.now().toString(),
        userId,
        orgId: organization.id,
        amount: Number(amount),
        donatedAt: new Date().toISOString(),
    };

    addOne(donationData);
    setShowSuccess(true);
    };
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      {!showSuccess && (
        <div className="bg-white rounded-2xl p-5 w-80 shadow-lg">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-emerald-800">
              {organization?.name}
            </h3>
            <p className="mt-2 text-gray-700 leading-relaxed">
              {organization?.description ?? "Тайлбар олдсонгүй."}
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
              onClick={onCloseAction}
              className="w-full p-3 rounded-lg text-xl font-bold bg-gray-300 text-emerald-900 hover:bg-gray-400 transition"
            >
              Болих
            </button>
          </div>
        </div>
      )}
      {showSuccess && (
        <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center">
          <Lottie
            animationData={successAnim}
            loop={false}
            className="w-40 h-40 mx-auto"
          />
          <h2 className="text-xl font-bold text-emerald-700 mt-4">Талархал</h2>
          <p className="text-gray-700 mt-2 leading-relaxed text-center">
            🎉 Таны өгсөн хандив нэгэн хүний амьдралд гэрэл асаахад туслах болно. Танд баярлалаа буян буцаад ирэхдээ далай мэт байх болно!
          </p>
          <button
            onClick={() => {
              setShowSuccess(false);
              onCloseAction();
              router.push("/charity/summary");
            }}
            className="mt-5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold w-full"
          >
            Үргэлжлүүлэх
          </button>
        </div>
      )}
    </div>
  );
}
