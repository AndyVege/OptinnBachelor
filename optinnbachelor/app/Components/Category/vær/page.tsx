import React, { useState } from 'react'
import WeatherDisplay from "../../værDisplay";
import SelectMenu from '../../selectMenu';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

export default function Home() {
  const [locations] = useState([
    { id: 1, name: "Oslo" },
    { id: 2, name: "Gjerdrum" },
    { id: 3, name: "Larvik" },
  ]);
  const [selectedLocationId, setSelectedLocationId] = useState<number>(1);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Optinn værdashboard 🌤️</h1>
      
      <div className='flex gap-2 w-60 mb-6'>
        <Listbox value={selectedLocationId} onChange={setSelectedLocationId}>
          <div className="relative w-60">
            <ListboxButton className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-left">
              {locations.find(loc => loc.id === selectedLocationId)?.name}
            </ListboxButton>
            <ListboxOptions className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {locations.map((loc) => (
                <ListboxOption
                  key={loc.id}
                  value={loc.id}
                  className={({ active }) =>
                    `cursor-pointer px-4 py-2 ${
                      active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                    }`
                  }
                >
                  {loc.name}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
      <WeatherDisplay locationId={selectedLocationId} />
    </main>
  );
}