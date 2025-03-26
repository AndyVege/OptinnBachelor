import React from 'react'
import WeatherDisplay from "../../værDisplay";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Optinn værdashboard 🌤️</h1>
      <WeatherDisplay />
    </main>
  );
}