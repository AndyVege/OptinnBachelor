
"use client";

import { useState, useEffect, useMemo, ChangeEvent } from "react";
import { Notification } from "@/lib/useNotifications";
import { AlertCircle, AlertTriangle, CheckCircle, Search } from "lucide-react";

// Viser relativ tid (minutter, timer, dager)
function formatRelative(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m siden`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}t siden`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d siden`;
}

type Props = {};
export default function UtvidetVarslingsystem({}: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then(({ notifications }: { notifications: any[] }) => {
        const mapped = notifications.map((r) => ({
          id: String(r.id),
          title: r.title,
          description: r.description ?? "",
          priority: (r.priority as "low" | "medium" | "high") || "low",
          timestamp: new Date(r.timestamp),
          read: false,
          category: r.category as Notification['category'],
          source: (r.source as Notification['source']) ?? 'auto',
        }));
        setNotifications(mapped);
      })
      .catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return notifications
      .filter((n) => filter === "all" || n.priority === filter)
      .filter((n) => {
        const t = n.title.toLowerCase();
        const d = (n.description ?? "").toLowerCase();
        return t.includes(term) || d.includes(term);
      });
  }, [notifications, search, filter]);

  const COLORS = {
    high: "#F87171",
    medium: "#FBBF24",
    low: "#34D399",
  } as const;

  const ICONS = {
    high: <AlertCircle className="w-5 h-5 text-red-500" />,
    medium: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    low: <CheckCircle className="w-5 h-5 text-green-500" />,
  } as const;

  const BUTTONS: Array<"all" | "high" | "medium" | "low"> = [
    "all",
    "high",
    "medium",
    "low",
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b">
        <div className="relative w-full sm:w-1/2 mb-3 sm:mb-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Søk varsler..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {BUTTONS.map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition focus:outline-none
                ${
                  filter === key
                    ? `bg-[${key === 'all' ? '#E5E7EB' : COLORS[key]}] text-white`
                    : `bg-gray-100 text-gray-700 hover:bg-gray-200`
                }`}
            >
              {key === "all"
                ? "Alle"
                : key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="max-h-[550px] overflow-y-auto">
        {filtered.map((n) => {
          const pr = n.priority as keyof typeof COLORS;
          return (
            <div
              key={n.id}
              className="flex items-start p-4 border-l-4"
              style={{ borderColor: COLORS[pr] }}
            >
              <div className="mr-3 mt-1">{ICONS[pr]}</div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-800">{n.title}</h4>
                <p className="text-gray-600 mt-1">{n.description}</p>
                <span className="text-xs text-gray-400 mt-1 block">
                  {formatRelative(n.timestamp)}
                </span>
              </div>
              <span
                className="ml-4 text-sm font-semibold uppercase"
                style={{ color: COLORS[pr] }}
              >
                {n.priority}
              </span>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-6 text-center text-gray-500">Ingen varsler funnet.</div>
        )}
      </div>
    </div>
  );
}
