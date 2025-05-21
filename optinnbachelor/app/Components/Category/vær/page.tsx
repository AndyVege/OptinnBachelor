"use client"
import React, { useState } from 'react'
import WeatherDisplay from "../../værDisplay";
import FareIndikatorModul from '../../FareIndikatorModul';
import SelectMenu from '../../selectMenu';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import FlomProjeksjon from "./flomprojeksjon"; // Importer den nye flom-projeksjonskomponenten
import { useSession } from 'next-auth/react';



export default function Home() {
  const [locations] = useState([
    { id: 1, name: "Oslo" },
    { id: 2, name: "Gjerdrum" },
    { id: 3, name: "Larvik" },
  ]);
  const [selectedLocationId, setSelectedLocationId] = useState<number>(1);
  const { data: session } = useSession();

  return (
    <main className="p-8">
       <div className="pr-[50px]">
        <h2 className="font-extrabold text-2xl sm:text-3xl md:text-4xl">Hei, {session?.user?.name}</h2>
        <h2 className="font-extrabold text-center text-2xl sm:text-3xl md:text-4xl">{locations.find(loc => loc.id === selectedLocationId)?.name}</h2>
      </div>


      <div className="flex gap-2 w-60 mb-6">
        <Listbox value={selectedLocationId} onChange={setSelectedLocationId}>
          <div className="relative w-60">
            <ListboxButton className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-white text-left">
              {locations.find(loc => loc.id === selectedLocationId)?.name}
            </ListboxButton>
            <ListboxOptions className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {locations.map((loc) => (
                <ListboxOption
                  key={loc.id}
                  value={loc.id}
                  className={({ active }) =>
                    `cursor-pointer px-4 py-2 ${
                      active ? "bg-blue-100 text-blue-900" : "text-gray-900"
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

      <div className="flex gap-6">
        <WeatherDisplay locationId={selectedLocationId} />
        <FareIndikatorModul />
      </div>

      {/* Legg til flomprojeksjons-komponenten under værdisplay */}
      <FlomProjeksjon />

      
    </main>
  );
}
