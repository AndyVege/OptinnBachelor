"use client";

import { useState, useEffect, useMemo } from "react";
import { useNotifications, Notification } from "@/lib/useNotifications";

type Props = {
  onClose: () => void;
  showCloseButton?: boolean;
};

export default function UtvidetVarslingSystem({
  onClose,
  showCloseButton = true,
}: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "medium" | "high">(
    "all"
  );

  // Hent historiske varsler fra API og map til Notification-format
  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        const mapped: Notification[] = data.notifications.map((row: any) => ({
          id: String(row.id),
          title: row.title ?? row.condition ?? "",
          description: row.description ?? "",
          priority: (row.priority as "low" | "medium" | "high") || "low",
          timestamp: row.timestamp ? new Date(row.timestamp) : new Date(),
          read: row.read ?? false,
        }));
        setNotifications(mapped);
      })
      .catch(console.error);
  }, []);

  // Filtrering basert på search + priority
  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const byPriority = filter === "all" || n.priority === filter;

      const qs = search.toLowerCase();
      const bySearch =
        (n.title ?? "")
          .toLowerCase()
          .includes(qs) ||
        (n.description ?? "")
          .toLowerCase()
          .includes(qs);

      return byPriority && bySearch;
    });
  }, [notifications, search, filter]);

  return (
    <div
      className="relative w-full max-w-3xl mx-auto bg-white rounded-xl p-6 shadow-lg
                 h-[600px] overflow-y-auto"
    >
      {showCloseButton && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl font-bold"
        >
          ×
        </button>
      )}

      <h2 className="text-xl font-semibold mb-4">Utvidet Varslingspanel</h2>

      <input
        type="text"
        placeholder="Søk varsler..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <div className="flex gap-2 mb-4">
        {(["all", "low", "medium", "high"] as const).map((lvl) => (
          <button
            key={lvl}
            className={`px-3 py-1 rounded-full text-sm border ${
              filter === lvl
                ? "bg-green-600 text-white border-green-600"
                : "text-gray-700 border-gray-300"
            }`}
            onClick={() => setFilter(lvl)}
          >
            {lvl === "all" ? "Alle" : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {filtered.map((n) => (
          <li key={n.id} className="border p-3 rounded shadow-sm">
            <div className="flex justify-between items-center">
              <strong>{n.title}</strong>
              <span className="text-xs text-gray-500">
                {n.priority?.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-700">{n.description}</p>
            <p className="text-xs text-gray-400 mt-1">
              {n.timestamp.toLocaleDateString("no-NO")}
            </p>
          </li>
        ))}

        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm text-center mt-4">Ingen varsler.</p>
        )}
      </ul>
    </div>
  );
}
