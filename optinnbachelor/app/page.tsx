'use client';
import {AreaChart,PieChart,BarChart,XAxis,ResponsiveContainer,Area,Tooltip,Pie,Cell,Legend,Bar,YAxis } from 'recharts';
import React, { useEffect, useState } from 'react';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbarwithout from './Components/navbarwithout';
import FlomProjeksjon from './Components/Category/vær/flomprojeksjon';


const colorPopulation = ['#0E1915', '#2F3E34', '#7DA37A', '#5C8B5E', '#2E3D2F'];

const GenereltDashboard = () => {
  const { data: session } = useSession();

  const [optionsKommune, setOptionsKommune] = useState<{ kommuneNavn: string }[]>([]);
  const [optionsYear, setOptionsYear] = useState<{ year: number }[]>([]);
  const [selectedKommune, setSelectedKommune] = useState<string | number>('Oslo');
  const [openKommune, setOpenKommune] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number | string>(2025);
  const [openYear, setOpenYear] = useState<boolean>(false);
  const [openInfo, setOpenInfo] = useState<string|null>(null);

  
  const [sysselsatteData, setSysselsatteData] = useState<{
      kommuneId: string;
      år: number;
      utdanningsnivå: string;
      antallSysselsatte: number;
    }[]>([]);

  const [Last5YearsPopulation, setLast5YearPopulation] = useState<
    {
      antallBefolkning: number;
      fordeling: Record<string, any>;
      year: number;
    }[]
  >([]);

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

  const fetchPopulationStats = async ({ queryKey }: QueryFunctionContext<(string | number)[]>) => {
    const [_key, year, kommune] = queryKey;
    const res = await fetch(`/api/populationStats?year=${year}&kommune=${kommune}`);
  
    if (!res.ok) throw new Error('Failed to fetch population stats');
    return res.json();
  };
  const fetchHealthStats = async ({ queryKey }: QueryFunctionContext<(string | number)[]>) => {
    const [_key, year, kommune] = queryKey;
    const res = await fetch(`/api/helseStats/sysselsatte?kommune=0301`)
    if (!res.ok) throw new Error('Failed to fetch population stats');
    return res.json();
  };

  const { data: fetchedPopulation, isLoading: loadingPopulation } = useQuery({
  queryKey: ['populationStats', selectedYear, selectedKommune],
  queryFn: fetchPopulationStats,
  enabled: !!selectedYear && !!selectedKommune,
});

const { data: fetchedHealth, isLoading: loadingHealth } = useQuery({
  queryKey: ['healthStats', selectedKommune],
  queryFn: fetchHealthStats,
  enabled: !!selectedKommune,
});

  useEffect(() => {
    if (fetchedPopulation && fetchedHealth) {
      setLast5YearPopulation(fetchedPopulation.befolkningByLast5Years);
      setSysselsatteData(fetchedHealth.sysselsatteHelse || []);
    }
  }, [fetchedPopulation,fetchedHealth]);

  const thisYearPopulationData = Last5YearsPopulation.find(entry => entry.year === selectedYear);

  const pieData = thisYearPopulationData
    ? Object.entries(thisYearPopulationData.fordeling).map(([ageGroup, value], index) => ({
        name: ageGroup,
        value,
        color: colorPopulation[index % colorPopulation.length],
      }))
    : [];



  const calculateChange = (current: number, previous: number) =>
    ((current - previous) / previous) * 100;

const {status} = useSession();
const router = useRouter();

useEffect(() => {
  if (status === "unauthenticated") {
    router.push("/login");
  }})
  const toDashboard = (tab: string) => {
    const searchParams = new URLSearchParams({ tab });
    router.push(`/mainPage?${searchParams.toString()}`);
};


  return (
    <div className="py-5 px-4 sm:px-8">
      <Navbarwithout />
      <h2 className="font-extrabold text-2xl mt-5 sm:text-3xl md:text-4xl">Hello, {session?.user?.name}</h2>
      <h2 className="text-center font-extrabold text-2xl sm:text-3xl md:text-4xl">{selectedKommune}</h2>


      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Panels (Population & Company) */}
        <div className="lg:col-span-2 grid grid-rows-2 gap-6">
          {/* Population */}
          <div className="bg-white rounded-3xl shadow-md w-full p-4 md:p-10" onClick={()=>toDashboard("Generelt")} >
            <div className="relative mb-3">
              <h2 className="text-center text-2xl md:text-3xl font-extrabold">Befolkning</h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Stats & Area Chart */}
              <div className="w-full lg:w-1/2">
                <div className="flex justify-around mb-4">
                  <div className="text-center">
                    <p className="text-sm font-bold">Total Befolkning</p>
                    <p className="text-xl font-bold">
                      {thisYearPopulationData?.antallBefolkning?.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold">Befolkningsvekst</p>
                    {(() => {
                      const prev = Last5YearsPopulation.find(p => p.year === Number(selectedYear) - 1);
                      if (!prev || !thisYearPopulationData) return null;
                      const change = calculateChange(
                        thisYearPopulationData.antallBefolkning,
                        prev.antallBefolkning
                      );
                      return (
                        <p
                          className={`text-xl font-bold ${
                            change < 0 ? 'text-red-500' : 'text-green-500'
                          }`}
                        >
                          {change.toFixed(1)}% {change < 0 ? '↓' : '↑'}
                        </p>
                      );
                    })()}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={Last5YearsPopulation}>
                    <XAxis dataKey="year" axisLine={false} tickLine={false} interval={'preserveStartEnd'} />
                    <YAxis scale="log" 
                      domain={['auto', 'auto']}
                      hide />
                    <Tooltip />
                    <Area type="monotone" dataKey="antallBefolkning" stroke="#1E3528" fill="#1E3528" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="w-full lg:w-1/2 flex justify-center items-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={30}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name }) => name}
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Company Sector */}
          <div className="bg-white rounded-3xl shadow-md w-full p-4 md:p-6" onClick={()=>toDashboard("Helse")} >
            <h2 className="text-center text-2xl md:text-3xl font-extrabold mb-4">Sysselsatte i helse- og sosialnæringer</h2>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/2">
      
                <ResponsiveContainer width="200%" height={250}>
                  <BarChart data={sysselsatteChartData}>
                    <XAxis dataKey="year" />
                    <YAxis hide />
                    <Tooltip />
                    <Bar dataKey="Grunnskole" stackId="a" fill="#a1c181" />
                    <Bar dataKey="Videregående" stackId="a" fill="#619b8a" />
                    <Bar dataKey="Universitetsnivå" stackId="a" fill="#233d4d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Unemployment Section */}
        <div className="bg-white rounded-3xl shadow-md p-4 flex flex-col gap-6" onClick={()=>toDashboard("Vær")}>
          <FlomProjeksjon />
          
        </div>
      </div>
    </div>
  );
};

export default GenereltDashboard;
