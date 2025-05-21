"use client";
import { useState, useEffect } from "react";

export type Notification = {
  id: string;           
  title: string;
  description?: string;
  timestamp: Date;
  read: boolean;
  priority?: "low"|"medium"|"high";
  category?: "Vær"|"Helse"|"Generelt";
  source?: "auto"|"manual";
};

export function useNotifications({ pollIntervalMs = 10000 } = {}) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("notifications");
        if (saved) {
          return JSON.parse(saved).map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }));
        }
      } catch {
        console.error("Feil ved henting av localStorage");
      }
      return [];
    }
    return [];
  });

  const addNotification = (newAlert: Notification) => {
    setNotifications(prev =>
      prev.some(n => n.id === newAlert.id) ? prev : [{ ...newAlert, source: "auto" }, ...prev]
    );
  };

  const removeAutoNotifications = () => {
    setNotifications(prev => prev.filter(n => n.source !== "auto"));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    const fetchWeatherAlert = async () => {
      try {
        const res = await fetch("/api/weatherAlerts");
        const data = await res.json();
        if (Array.isArray(data.alerts)) {
          data.alerts.forEach((alert: any) =>
            addNotification({
              id: alert.id,
              title: alert.title,
              description: alert.description,
              timestamp: new Date(),
              read: false,
              priority: alert.priority,
              category: alert.category,
              source: "auto",
            })
          );
        }
      } catch (e) {
        console.error("Feil ved henting av værvarsel:", e);
      }
    };

    fetchWeatherAlert();
    const interval = setInterval(fetchWeatherAlert, pollIntervalMs);
    return () => clearInterval(interval);
  }, [pollIntervalMs]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  return {
    notifications,
    setNotifications,
    addNotification,
    removeAutoNotifications,
    markAllAsRead,
  };
}
