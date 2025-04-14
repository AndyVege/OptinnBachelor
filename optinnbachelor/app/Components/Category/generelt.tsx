'use Client'
import { AreaChart, PieChart,BarChart, XAxis,  ResponsiveContainer, Area, Tooltip, Pie, Cell, Legend, Bar, YAxis } from 'recharts';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson, faPersonDress} from "@fortawesome/free-solid-svg-icons";
import SelectMenu from '../selectMenu';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import ClipLoader from 'react-spinners/ClipLoader';
import { useSession } from 'next-auth/react';



const datachart = [
  { year: '2021', value: 20 },
  { year: '2022', value: 25 },
  { year: '2023', value: 15 },
  { year: '2024', value: 27 },
  { year: '2025', value: 19 },
];

const data3 = [
  {name: '18-24', Men: 4000,Female: 2400},
  {name: '25-35',Men: 3000,Female: 1398,},
  {name: '36-55',Men: 2000,Female: 9800},
  {name: '55-64',Men: 2780,Female: 3908},
];

const colorPopulation = ["#0E1915","#2F3E34","#7DA37A","#5C8B5E","#2E3D2F"]
const colorCompany = ['#BCE77B','#366249','#1E3528','#E1DCD5']

const GenereltDashboard = () => {

const { data : session} = useSession();

const [optionsKommune, setOptionsKommune] = useState<{ kommuneNavn: string }[]>([]);
const [optionsYear, setOptionsYear] = useState<{ year : number }[]>([]);
const [selectedKommune, setSelectedKommune] = useState<string | number>("Oslo"); 

const [openKommune, setOpenKommune] = useState<boolean>(false);
const [selectedYear, setSelectedYear] = useState<number| string>(2025); 
const [openYear, setOpenYear] = useState<boolean>(false);

const [Last5YearsPopulation, setLast5YearPopulation] = useState<{
  antallBefolkning: number;
  fordeling: Record<string, any>; 
  year: number;
}[]>([]);

const [Last5YearsCompany, setLast5YearCompany] = useState<{
  antallBedrifter: number;
  fordeling: Record<string, any>; 
  year: number;
}[]>([]);

// Fetch data on selectedYear or selectedKommune change
const fetchPopulationStats = async ({ queryKey }: QueryFunctionContext<(string | number)[]>) => {
  const [_key, year, kommune] = queryKey;
  const res = await fetch(`/api/populationStats?year=${year}&kommune=${kommune}`);
  if (!res.ok) throw new Error("Failed to fetch population stats");
  return res.json();
};

const { data : fetchedData , isLoading } = useQuery({
  queryKey: ["populationStats", selectedYear, selectedKommune],
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

const optionListKommune : string[] = optionsKommune.map(option => option.kommuneNavn)
const optionListYear : number[] = optionsYear.map(option => option.year)

const thisYearPopulationData = Last5YearsPopulation.find((entry) => entry.year === selectedYear);
const thisYearCompanyData = Last5YearsCompany.find((entry) => entry.year === selectedYear);

const pieData = thisYearPopulationData ? Object.entries(thisYearPopulationData.fordeling).map(([ageGroup, value],index) => ({
      name: ageGroup,
      value,
      color: colorPopulation[index % colorPopulation.length] 
    }))
  : [];

  const pieData2 = thisYearCompanyData?.fordeling ? Object.entries(thisYearCompanyData.fordeling).map(([ageGroup, value], index) => ({
      name: ageGroup,
      value,
      color: colorCompany[index % colorCompany.length]
    }))
  : [];


if(isLoading){
  return (
    <div className="flex justify-center items-center h-screen">
      <ClipLoader size={100}  color="#1E3528" />
    </div>
  );
}
  return (
    <div className="py-5">
      <h2 className='font-extrabold text-3xl sm:text-4xl md:text-5xl'>Hello,{session?.user?.name}</h2>
      <h2 className='text-center font-extrabold text-2xl sm:text-3xl md:text-4xl'>{selectedKommune}</h2>
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:w-60'>
        <SelectMenu options={optionListKommune} open={openKommune} setOpen={setOpenKommune} selected={selectedKommune} setSelected={setSelectedKommune} />
        <SelectMenu options={optionListYear} open={openYear} setOpen={setOpenYear} selected={selectedYear} setSelected={setSelectedYear} />
      </div>
      
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-3">

        {/* Left Section (Two Rows) */}
        <div className="lg:col-span-2 grid grid-rows-2 gap-3">
      

          {/* Population */}
          <div className="bg-white rounded-[30px] shadow-md h-80 w-full py-5">
          <h2 className="text-center text-2xl md:text-3xl font-extrabold mb-4">Population</h2>


          <div className="flex w-full h-3/4 border-slate-100 px-5 flex-col lg:flex-row gap-4">

              {/* Left Side - Stats & Area Chart */}
              <div className="lg:w-1/2 w-full flex flex-col items-center ">
                <div className="flex flex-col sm:flex-row gap-5 w-full justify-evenly">
                  <div className="text-center">
                    <p className="text-sm font-bold">Total Population</p>
                    <p className="text-xl font-bold">{thisYearPopulationData?.antallBefolkning.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold">Population Growth</p>
                    {Last5YearsPopulation.map((data) => {
                      const previous = Last5YearsPopulation.find(p => p.year === Number(selectedYear) - 1);
                      if (!previous || data.year !== selectedYear) return null;
                      const change = ((data.antallBefolkning - previous.antallBefolkning) / previous.antallBefolkning) * 100;
                      return <p key={data.year} className={`text-xl font-bold ${change < 0 ? "text-red-500" : "text-green-500"}`}>{change.toFixed(1)}% {change < 0 ? "↓" : "↑"}</p>;
                    })}
                  </div>
                </div>

                {/* Area Chart */}
                <ResponsiveContainer  width="100%" height={180}>
                  <AreaChart data={Last5YearsPopulation} >
                    <XAxis dataKey="year"  axisLine={false} tickLine={false} interval={'preserveStartEnd'} />
                    <YAxis 
                      scale="log" // Logarithmic scale makes small changes more visible
                      domain={['auto', 'auto']} 
                      hide// Adjusts dynamically to data range
                    />
                    <Tooltip />
                    <Area type="monotone" dataKey="antallBefolkning" stroke="#1E3528" fill="#1E3528" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>

              </div>

              

              {/* Right Side - Pie Chart & Legend */}
              

                <div className="flex w-1/2 items-center justify-end">
                  {/* Pie Chart */}
                  <ResponsiveContainer width={300} height={300} >
                  <PieChart>
                    <Pie
                      data={pieData} innerRadius={20} outerRadius={70} paddingAngle={3} cornerRadius={5} dataKey="value" label={({ name }) => name}
                    >
                      {pieData.map((entry,index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip/>
                  </PieChart>
                </ResponsiveContainer>

                
                 
                </div>
            </div>
          </div>

          {/* Company Sector */}
          <div className="bg-white rounded-[30px] shadow-md h-80 w-full py-5">
            <h2 className="text-center text-3xl font-extrabold mb-4">Company Sector</h2>

            <div className="flex w-full h-3/4 border-slate-100 px-5">
              {/* Left Side - Stats & Area Chart */}
              <div className="w-1/2 flex flex-col items-center">

                {/* Stats */}
                <div className="flex gap-10 w-full ml-20">
                  <div className="text-center">
                    <p className="text-sm font-bold">Total Company</p>
                    <p className="text-xl font-bold">{thisYearCompanyData?.antallBedrifter.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold">Company Growth Since Last Year</p>

                    { 
                      Last5YearsCompany.map((data) => {
                        const previousYearData = Last5YearsCompany.find((prevData) => prevData.year === Number(selectedYear) - 1);

                        if (!previousYearData) return null; // Ensure there's data for the previous year

                        const percentageChange = ((data.antallBedrifter - previousYearData.antallBedrifter) / previousYearData.antallBedrifter) * 100;

                        return data.year === selectedYear ? (
                          <p key={data.year} className={`text-xl font-bold ${ percentageChange < 0 ? "text-red-500" : "text-green-500"  }`} >
                            {percentageChange.toFixed(1)}% {percentageChange < 0 ? "↓" : "↑"}
                          </p>
                        ) : null;
                      })
                    }

                  </div>
                </div>

                {/* Area Chart */}
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={Last5YearsCompany}>
                    <XAxis dataKey="year" axisLine={false} tickLine={false} interval={'preserveStartEnd'} />
                    <YAxis 
                      scale="log" // Logarithmic scale makes small changes more visible
                      domain={['auto', 'auto']} 
                      hide// Adjusts dynamically to data range
                    />
                    <Tooltip />
                    <Area type="monotone" dataKey="antallBedrifter" stroke="#1E3528" fill="#1E3528"  strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Divider (Hidden on Small Screens) */}
              <div className="h-40 w-2  mt-10 ml-2 rounded-lg bg-gray-700 hidden md:block"></div>

              {/* Right Side - Pie Chart & Legend */}
              <div className="flex px-4 flex-col ">
                <p className="text-lg font-semibold text-center">
                  Number of companies by number of employees
                </p>

                <div className="flex gap-5 items-center">
                  {/* Pie Chart */}
                  <ResponsiveContainer width={200} height={180}>
                    <PieChart>
                      <Pie data={pieData2} innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                        {pieData2.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Legend */}
                  <div className="flex flex-col gap-2">
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

        {/* Right Section */}
        <div className="bg-white rounded-[30px] shadow-md p-5 flex flex-col gap-5">
          <h2 className="text-center text-2xl md:text-3xl font-extrabold">Unemployment Statistics</h2>
          <div id='line' className='w-full h-100'>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={datachart}  >
                <XAxis dataKey="year" axisLine={false} tickLine={false} interval={'preserveStartEnd'} />
                <Tooltip />
                <Area type="linear" dataKey="value" stroke="#1E3528" fill="#1E3528" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className='flex w-full h-50 text-center'>
                    <div className='w-1/3'>
                      <p className="text-xs font-bold">Total Unemployment</p>
                      <p className="text-l font-extrabold">20,000</p>
                    </div>
                    <div className='w-1/3'>
                      <p className="text-xs font-bold">Unemployment Rate</p>
                      <p className="text-l font-extrabold">18%</p>
                    </div>
                    <div className='w-1/3'>
                      <p className="text-xs font-bold">Unemployment Rate Compared To Last Year</p>
                      <p className="text-l font-extrabold text-green-500">-1,1 ↓</p>
                    </div>
          </div>

          <div id='men_female' className='flex w-full justify-between items-center h-1/3'>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPerson} color="#1E3528" size="4x" />
                <div>
                  <p className="font-bold">MEN</p>
                  <p className="text-2xl font-extrabold">100000</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPersonDress} color="#366249" size="4x" />
                <div>
                  <p className="font-bold">WOMEN</p>
                  <p className="text-2xl font-extrabold">200000</p>
                </div>
              </div>
          </div>

          <div id='barchart' className='w-full h-full flex justify-center items-end'>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={500} height={300} data={data3} >
                <XAxis dataKey="name"  axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="Female"  radius={[5, 5, 0, 0]} fill="#366249" />
                <Bar dataKey="Men"  radius={[5, 5, 0, 0]} fill="#1E3528" />
                <Legend layout="horizontal" align="center" verticalAlign="top" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>

    </div>
  );
};

export default GenereltDashboard;
