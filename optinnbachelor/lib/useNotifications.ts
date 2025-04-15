"use client";
import { useState, useEffect } from "react";

export type Notification = {
  id: string;
  title: string;
  description?: string;
  timestamp: Date;
  read: boolean;
  priority?: "low" | "medium" | "high";
};

type UseNotificationsOptions = {
  initialNotifications?: Notification[];
  pollIntervalMs?: number;
};

function mergeWithSample(
  loaded: Notification[],
  samples: Notification[]
): Notification[] {
  // FLETT sammen samples med loaded, men slett duplikater
  // 1) Start med loaded (fra localStorage)
  const merged = [...loaded];

  // 2) For hver sample, hvis den IKKE finnes i merged, legg den til
  samples.forEach((sample) => {
    const found = merged.some((n) => n.id === sample.id);
    if (!found) {
      merged.push(sample);
    }
  });

  // 3) Sorter gjerne på id eller timestamp hvis du vil ha en rekkefølge
  return merged;
}

export function useNotifications({
  initialNotifications = [],
  pollIntervalMs = 10000,
}: UseNotificationsOptions = {}) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem("notifications");
      if (saved) {
        // parse fra localStorage
        const loaded: Notification[] = JSON.parse(saved).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        // Flett sample inn i loaded. 
        return mergeWithSample(loaded, initialNotifications);
      }
    } catch (error) {
      console.error("Feil ved henting av localStorage:", error);
    }
    // Ingen lagrede data? => bruk sample
    return initialNotifications;
  });

  // Funksjon for å legge inn ny notifikasjon, unngå duplikater
  const addNotification = (newAlert: Notification) => {
    setNotifications((prev) => {
      const isDuplicate = prev.some(
        (n) =>
          n.id === newAlert.id &&
          n.title === newAlert.title &&
          n.description === newAlert.description
      );
      if (isDuplicate) {
        return prev; // ingen endring
      }
      return [newAlert, ...prev];
    });
  };

  // (Valgfritt) Polling av /api/weatherAlerts – kan kommenteres ut om du vil
  useEffect(() => {
    const fetchWeatherAlert = async () => {
      try {
        const res = await fetch("/api/weatherAlerts");
        const data = await res.json();
        if (data.alert) {
          const newAlert: Notification = {
            id: crypto.randomUUID(),
            title: "Værvarsel",
            description: data.alert,
            timestamp: new Date(),
            read: false,
            priority: "high",
          };
          addNotification(newAlert);
        }
      } catch (error) {
        console.error("Feil ved henting av værvarsel:", error);
      }
    };

    // Start med fetch + intervall
    fetchWeatherAlert();
    const interval = setInterval(fetchWeatherAlert, pollIntervalMs);
    return () => clearInterval(interval);
  }, [pollIntervalMs]);

  // (Valgfritt) Lagrer alt i localStorage når notifications endres
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  return {
    notifications,
    setNotifications,
    addNotification,
  };
}
