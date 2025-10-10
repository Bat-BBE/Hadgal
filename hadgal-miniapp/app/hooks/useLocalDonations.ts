"use client";

export type Donation = {
  id: string;
  userId: string;
  orgId: number;
  amount: number;
  donatedAt: string;
};

export function useLocalDonations() {
  const STORAGE_KEY = "donations";

  const getAll = (userId: string): Donation[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data: Donation[] = raw ? JSON.parse(raw) : [];
      return data.filter((d) => d.userId === userId);
    } catch {
      return [];
    }
  };

  const addOne = (donation: Donation) => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data: Donation[] = raw ? JSON.parse(raw) : [];
    data.push(donation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const removeOne = (id: string) => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data: Donation[] = raw ? JSON.parse(raw) : [];
    const updated = data.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getById = (userId: string, id: string) => {
    const all = getAll(userId);
    return all.find((d) => d.id === id);
  };

  return {
    getAll,
    addOne,
    removeOne,
    getById,
  };
}
