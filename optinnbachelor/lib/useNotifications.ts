"use client";
import { useState, useEffect } from "react";

export type Notification = {
  id: string;
  title: string;
  description?: string;
  timestamp: Date;
  read: boolean;
  priority?: "low" | "medium" | "high";
  category?: "Vær" | "Helse" | "Generelt";
  source?: "auto" | "manual";
};

type UseNotificationsOptions = {
  initialNotifications?: Notification[];
  pollIntervalMs?: number;
};

export function useNotifications({
  initialNotifications = [],
  pollIntervalMs = 10000,
}: UseNotificationsOptions = {}) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem("notifications");
      if (saved) {
        return JSON.parse(saved).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
      }
    } catch (error) {
      console.error("Feil ved henting av localStorage:", error);
    }
    return initialNotifications;
  });

  const addNotification = (newAlert: Notification) => {
    setNotifications((prev) => {
      const isDuplicate = prev.some(
        (n) =>
          n.title === newAlert.title &&
          n.description === newAlert.description
      );
      if (isDuplicate) return prev;

      return [{ ...newAlert, source: newAlert.source || "auto" }, ...prev];
    });
  };

  const removeAutoNotifications = () => {
    setNotifications((prev) => prev.filter((n) => n.source !== "auto"));
  };

  useEffect(() => {
    const fetchWeatherAlert = async () => {
      try {
        const res = await fetch("/api/weatherAlerts");
        const data = await res.json();

        if (data.alerts) {
          data.alerts.forEach((alert: any) => {
            addNotification({
              id: crypto.randomUUID(),
              title: alert.title,
              description: alert.description,
              timestamp: new Date(),
              read: false,
              priority: alert.priority || "medium",
              category: alert.category || "Generelt",
              source: "auto",
            });
          });
        }
      } catch (error) {
        console.error("Feil ved henting av værvarsel:", error);
      }
    };

    fetchWeatherAlert();
    const interval = setInterval(fetchWeatherAlert, pollIntervalMs);
    return () => clearInterval(interval);
  }, [pollIntervalMs]);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  return {
    notifications,
    setNotifications,
    addNotification,
    removeAutoNotifications,
  };
}
