'use client';
import {AreaChart,PieChart,BarChart,XAxis,ResponsiveContainer,Area,Tooltip,Pie,Cell,Legend,Bar,YAxis } from 'recharts';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPerson, faPersonDress } from '@fortawesome/free-solid-svg-icons';
import SelectMenu from '../selectMenu';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import ClipLoader from 'react-spinners/ClipLoader';
import { useSession } from 'next-auth/react';

const colorPopulation = ['#0E1915', '#2F3E34', '#7DA37A', '#5C8B5E', '#2E3D2F'];
const colorCompany = ['#BCE77B', '#366249', '#1E3528', '#E1DCD5'];

const GenereltDashboard = () => {
  const { data: session } = useSession();

  const [optionsKommune, setOptionsKommune] = useState<{ kommuneNavn: string }[]>([]);
  const [optionsYear, setOptionsYear] = useState<{ year: number }[]>([]);
  const [selectedKommune, setSelectedKommune] = useState<string | number>('Oslo');
  const [openKommune, setOpenKommune] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number | string>(2025);
  const [openYear, setOpenYear] = useState<boolean>(false);

  const [Last5YearsPopulation, setLast5YearPopulation] = useState<
    {
      antallBefolkning: number;
      fordeling: Record<string, any>;
      year: number;
    }[]
  >([]);

  const [Last5YearsCompany, setLast5YearCompany] = useState<
    {
      antallBedrifter: number;
      fordeling: Record<string, any>;
      year: number;
    }[]
  >([]);

  const fetchPopulationStats = async ({ queryKey }: QueryFunctionContext<(string | number)[]>) => {
    const [_key, year, kommune] = queryKey;
    const res = await fetch(`/api/populationStats?year=${year}&kommune=${kommune}`);
    if (!res.ok) throw new Error('Failed to fetch population stats');
    return res.json();
  };

  const { data: fetchedData, isLoading } = useQuery({
    queryKey: ['populationStats', selectedYear, selectedKommune],
    queryFn: fetchPopulationStats,
    enabled: !!selectedYear && !!selectedKommune,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (fetchedData) {
      setOptionsKommune(fetchedData.kommuneNames);
      setOptionsYear(fetchedData.allTheYears);
      setLast5YearPopulation(fetchedData.befolkningByLast5Years);
      setLast5YearCompany(fetchedData.bedriftByLast5Years);
    }
  }, [fetchedData]);

  const optionListKommune: string[] = optionsKommune.map(option => option.kommuneNavn);
  const optionListYear: number[] = optionsYear.map(option => option.year);

  const thisYearPopulationData = Last5YearsPopulation.find(entry => entry.year === selectedYear);
  const thisYearCompanyData = Last5YearsCompany.find(entry => entry.year === selectedYear);

  const pieData = thisYearPopulationData
    ? Object.entries(thisYearPopulationData.fordeling).map(([ageGroup, value], index) => ({
        name: ageGroup,
        value,
        color: colorPopulation[index % colorPopulation.length],
      }))
    : [];

  const pieData2 = thisYearCompanyData?.fordeling
    ? Object.entries(thisYearCompanyData.fordeling).map(([ageGroup, value], index) => ({
        name: ageGroup,
        value,
        color: colorCompany[index % colorCompany.length],
      }))
    : [];

  const calculateChange = (current: number, previous: number) =>
    ((current - previous) / previous) * 100;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader size={100} color="#1E3528" />
      </div>
    );
  }

  return (
    <div className="py-5 px-4 sm:px-8">
      <h2 className="font-extrabold text-2xl sm:text-3xl md:text-4xl">Hello, {session?.user?.name}</h2>
      <h2 className="text-center font-extrabold text-2xl sm:text-3xl md:text-4xl">{selectedKommune}</h2>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-60">
        <SelectMenu
          options={optionListKommune}
          open={openKommune}
          setOpen={setOpenKommune}
          selected={selectedKommune}
          setSelected={setSelectedKommune}
        />
        <SelectMenu
          options={optionListYear}
          open={openYear}
          setOpen={setOpenYear}
          selected={selectedYear}
          setSelected={setSelectedYear}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Panels (Population & Company) */}
        <div className="lg:col-span-2 grid grid-rows-2 gap-6">
          {/* Population */}
          <div className="bg-white rounded-3xl shadow-md w-full p-4 md:p-6">
            <div className="relative mb-3">
              <FontAwesomeIcon icon={faCircleInfo} className="absolute right-0 top-0 w-5 h-5" />
              <h2 className="text-center text-2xl md:text-3xl font-extrabold">Population</h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Stats & Area Chart */}
              <div className="w-full lg:w-1/2">
                <div className="flex justify-around mb-4">
                  <div className="text-center">
                    <p className="text-sm font-bold">Total Population</p>
                    <p className="text-xl font-bold">
                      {thisYearPopulationData?.antallBefolkning?.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold">Population Growth</p>
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
          <div className="bg-white rounded-3xl shadow-md w-full p-4 md:p-6">
            <h2 className="text-center text-2xl md:text-3xl font-extrabold mb-4">Company Sector</h2>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/2">
                <div className="flex justify-around mb-4">
                  <div className="text-center">
                    <p className="text-sm font-bold">Total Companies</p>
                    <p className="text-xl font-bold">
                      {thisYearCompanyData?.antallBedrifter?.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold">Growth Since Last Year</p>
                    {(() => {
                      const prev = Last5YearsCompany.find(p => p.year === Number(selectedYear) - 1);
                      if (!prev || !thisYearCompanyData) return null;
                      const change = calculateChange(
                        thisYearCompanyData.antallBedrifter,
                        prev.antallBedrifter
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
                  <AreaChart data={Last5YearsCompany}>
                  <XAxis dataKey="year" axisLine={false} tickLine={false} interval={'preserveStartEnd'} />
                    <YAxis 
                      scale="log" // Logarithmic scale makes small changes more visible
                      domain={['auto', 'auto']} 
                      hide// Adjusts dynamically to data range
                    />
                    <Tooltip />
                    <Area type="monotone" dataKey="antallBedrifter" stroke="#1E3528" fill="#1E3528" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full lg:w-1/2">
                <p className="text-center font-semibold mb-2">
                  Companies by number of employees
                </p>
                <div className="flex justify-between items-center">
                  <ResponsiveContainer width="50%" height={180}>
                    <PieChart>
                      <Pie data={pieData2} innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                        {pieData2.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2 ml-2">
                    {pieData2.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-4 h-4" style={{ backgroundColor: item.color }}></div>
                        <p className="text-sm">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unemployment Section */}
        <div className="bg-white rounded-3xl shadow-md p-4 flex flex-col gap-6">
          <h2 className="text-center text-2xl md:text-3xl font-extrabold">Unemployment Stats</h2>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={[]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="year" />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#1E3528" fill="#1E3528" />
            </AreaChart>
          </ResponsiveContainer>

          <div className="flex justify-between text-center">
            <div className="w-1/3">
              <p className="text-xs font-bold">Total Unemployment</p>
              <p className="text-lg font-extrabold">20,000</p>
            </div>
            <div className="w-1/3">
              <p className="text-xs font-bold">Unemployment Rate</p>
              <p className="text-lg font-extrabold">18%</p>
            </div>
            <div className="w-1/3">
              <p className="text-xs font-bold">Change Since Last Year</p>
              <p className="text-lg font-extrabold text-green-500">-1.1 ↓</p>
            </div>
          </div>

          <div className="flex justify-around items-center">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPerson} size="2x" />
              <div>
                <p className="font-bold">MEN</p>
                <p className="text-xl font-extrabold">100000</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPersonDress} size="2x" />
              <div>
                <p className="font-bold">WOMEN</p>
                <p className="text-xl font-extrabold">200000</p>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={[]}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Female" fill="#366249" />
              <Bar dataKey="Men" fill="#1E3528" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GenereltDashboard;
