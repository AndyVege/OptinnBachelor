'use client'

import React, { useEffect, useState, useCallback } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import SelectMenu from '../../selectMenu';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson, faPersonDress, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import ClipLoader from 'react-spinners/ClipLoader';

const colorHealth = ['#0E1915', '#2F3E34', '#7DA37A', '#5C8B5E', '#2E3D2F'];


const HelseDashboard = () => {
  const { data: session } = useSession();
  const [optionsKommune] = useState<string[]>(["Asker", "Oslo", "Drammen", "Kongsberg", "Bergen"]);
  const [selectedKommune, setSelectedKommune] = useState<string>("Oslo");
  const [openKommune, setOpenKommune] = useState<boolean>(false);

  const [optionsKvartal] = useState<string[]>(["20241", "20242", "20243", "20244"]);
  const [selectedKvartal, setSelectedKvartal] = useState<string>("20244");
  const [openKvartal, setOpenKvartal] = useState<boolean>(false);

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

  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const kommuneMap: Record<string, string> = {
        "Asker": "3203",
        "Oslo": "0301",
        "Drammen": "3301",
        "Kongsberg": "3303",
        "Bergen": "4601"
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
    } finally {
      setIsLoading(false);
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

  const pieData = [
    { name: 'Menn', value: totalMen, color: colorHealth[0] },
    { name: 'Kvinner', value: totalWomen, color: colorHealth[1] }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader size={100} color="#1E3528" />
      </div>
    );
  }

  return (
    <div className="py-5 px-4 sm:px-8">
      
      <h2 className="text-center font-extrabold text-2xl sm:text-3xl md:text-4xl">{selectedKommune}</h2>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-60">
        <SelectMenu
          options={optionsKommune}
          open={openKommune}
          setOpen={setOpenKommune}
          selected={selectedKommune}
          setSelected={(val: string | number) => setSelectedKommune(String(val))}
        />
        <SelectMenu
          options={optionsKvartal}
          open={openKvartal}
          setOpen={setOpenKvartal}
          selected={selectedKvartal}
          setSelected={(val: string | number) => setSelectedKvartal(String(val))}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Panels */}
        <div className="lg:col-span-2 grid grid-rows-2 gap-6">
          {/* Sick Leave */}
          <div className="bg-white rounded-3xl shadow-md w-full p-4 md:p-6">
            <div className="relative mb-3">
              <FontAwesomeIcon icon={faCircleInfo} className="absolute right-0 top-0 w-5 h-5" />
              <h2 className="text-center text-2xl md:text-3xl font-extrabold">Sykefravær</h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Stats & Area Chart */}
              <div className="w-full lg:w-1/2">
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={chartData}>
                    <XAxis 
                      dataKey="kvartal" 
                      tickFormatter={(kvartal) => {
                        const str = kvartal.toString();
                        const year = str.slice(0, 4);
                        const q = str.slice(4);
                        return `K${q} ${year}`;
                      }} 
                    />
                    <YAxis tickFormatter={(val) => `${val}%`} domain={[0, 'auto']} hide />
                    <Tooltip 
                      formatter={(value: number) => `${value}%`}
                      labelFormatter={(kvartal: number) => {
                        const str = kvartal.toString();
                        const year = str.slice(0, 4);
                        const q = str.slice(4);
                        return `Kvartal: K${q} ${year}`;
                      }}
                    />
                    <Area type="monotone" dataKey="Menn" stroke="#2F3E34" fill="#BCE77B" strokeWidth={2} />
                    <Area type="monotone" dataKey="Kvinner" stroke="#1E3528" fill="#619b8a" strokeWidth={2} />
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

          {/* Employment */}
          <div className="bg-white rounded-3xl shadow-md w-full p-4 md:p-6">
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

        {/* Gender Distribution */}
        <div className="bg-white rounded-3xl shadow-md p-4 flex flex-col gap-6">
          <h2 className="text-center text-2xl md:text-3xl font-extrabold">Kjønnsfordeling</h2>
          <div className="flex mt-20 justify-around items-center">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPerson} size="2x" />
              <div>
                <p className="font-bold">MENN</p>
                <p className="text-xl font-extrabold">{totalMen}%</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPersonDress} size="2x" />
              <div>
                <p className="font-bold">KVINNER</p>
                <p className="text-xl font-extrabold">{totalWomen}%</p>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={chartData}>
              <XAxis dataKey="kvartal" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Menn" fill="#1E3528" />
              <Bar dataKey="Kvinner" fill="#366249" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HelseDashboard;
