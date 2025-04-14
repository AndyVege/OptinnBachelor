'use client'

import React, { useEffect, useState, useCallback } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts';
import SelectMenu from '../../selectMenu';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson, faPersonDress } from "@fortawesome/free-solid-svg-icons";
import { signOut, useSession } from "next-auth/react";

const HelseDashboard = () => {
  const [optionsKommune] = useState<string[]>(["Oslo", "Drammen", "Larvik"]);
  const [selectedKommune, setSelectedKommune] = useState<string>("Oslo");
  const [openKommune, setOpenKommune] = useState<boolean>(false);
  const [selectedKvartal, setSelectedKvartal] = useState<string>("20244");

  const [helseData, setHelseData] = useState<{
    kommuneId: string;
    kvartal: number;
    antallMenn: number;
    antallKvinner: number;
  }[]>([]);

  const [sysselsatteData, setSysselsatteData] = useState<{
    kommuneId: string;
    år: number;
    utdanningsnivå: string;
    antallSysselsatte: number;
  }[]>([]);

  const { data: session } = useSession();

  const fetchData = useCallback(async () => {
    try {
      const kommuneMap: Record<string, string> = {
        "Oslo": "0301",
        "Drammen": "3230",
        "Larvik": "3909"
      };

      const kommuneId = kommuneMap[selectedKommune] || "0301";

      const [res1, res2] = await Promise.all([
        fetch(`/api/helseStats?kommune=${kommuneId}&kvartal=${selectedKvartal}`),
        fetch(`/api/helseStats/sysselsatte?kommune=${kommuneId}`)
      ]);

      const data1 = await res1.json();
      const data2 = await res2.json();

      setHelseData(data1.sykefravaer || []);
      setSysselsatteData(data2.sysselsatteHelse || []);
    } catch (error) {
      console.error("Error fetching helse stats:", error);
    }
  }, [selectedKommune, selectedKvartal]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartData = helseData.map(entry => ({
    kvartal: entry.kvartal,
    Menn: entry.antallMenn,
    Kvinner: entry.antallKvinner
  }));

  const sysselsatteGrouped = sysselsatteData.reduce((acc, curr) => {
    const year = curr.år;
    if (!acc[year]) acc[year] = {};
    acc[year][curr.utdanningsnivå] = (acc[year][curr.utdanningsnivå] || 0) + curr.antallSysselsatte;
    return acc;
  }, {} as Record<number, Record<string, number>>);

  const sysselsatteChartData = Object.entries(sysselsatteGrouped).map(([year, levels]) => ({
    year: Number(year),
    Grunnskole: levels["01"] || 0,
    Videregående: levels["02"] || 0,
    Universitetsnivå: levels["03"] || 0
  }));

  const totalMen = chartData.reduce((sum, curr) => sum + curr.Menn, 0);
  const totalWomen = chartData.reduce((sum, curr) => sum + curr.Kvinner, 0);

  return (
    <div className="p-4">
      <h2 className='font-extrabold mt-5 text-4xl'>Hello, {session?.user?.name}</h2>
      <h2 className='text-center font-extrabold text-4xl'>{selectedKommune}</h2>
      <div className='flex gap-2 w-60 mb-6'>
        <SelectMenu
          options={optionsKommune}
          open={openKommune}
          setOpen={setOpenKommune}
          selected={selectedKommune}
          setSelected={(val: string | number) => setSelectedKommune(String(val))}
        />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 grid grid-rows-2 gap-5">
          <div className="bg-white rounded-[30px] shadow-md h-80 w-full py-5">
            <h3 className="text-center text-3xl font-extrabold mb-4">Sykefravær per kvartal</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData}>
                <XAxis dataKey="kvartal" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="Menn" stroke="#1E3528" fill="#1E3528" strokeWidth={2} />
                <Area type="monotone" dataKey="Kvinner" stroke="#366249" fill="#366249" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-[30px] shadow-md h-80 w-full py-5">
            <h3 className="text-center text-3xl font-extrabold mb-4">Totalt sykefravær</h3>
            <div className="flex justify-around text-center mb-4">
              <div>
                <FontAwesomeIcon icon={faPerson} color="#1E3528" size="3x" />
                <p className="font-bold">MENN</p>
                <p className="text-xl font-extrabold">{totalMen}</p>
              </div>
              <div>
                <FontAwesomeIcon icon={faPersonDress} color="#366249" size="3x" />
                <p className="font-bold">KVINNER</p>
                <p className="text-xl font-extrabold">{totalWomen}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <XAxis dataKey="kvartal" />
                <Tooltip />
                <Bar dataKey="Menn" fill="#1E3528" radius={[5, 5, 0, 0]} />
                <Bar dataKey="Kvinner" fill="#366249" radius={[5, 5, 0, 0]} />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[30px] shadow-md h-full w-full flex flex-col px-5 pt-5">
          <h2 className="text-center text-3xl font-extrabold mb-4">Sysselsatte i helse- og sosialnæringer</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sysselsatteChartData}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Grunnskole" stackId="a" fill="#a1c181" />
              <Bar dataKey="Videregående" stackId="a" fill="#619b8a" />
              <Bar dataKey="Universitetsnivå" stackId="a" fill="#233d4d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HelseDashboard;