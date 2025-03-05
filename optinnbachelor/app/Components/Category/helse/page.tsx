import React from 'react';
import useSykefravaer from '../../../hooks/useSykefravaer';
import { TrendingUp } from "lucide-react";

const HelseDashboard = () => {
  const { data, loading, error } = useSykefravaer();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-10 bg-[#E5F1EF] min-h-screen">
      <h1 className="text-4xl font-bold mb-6 ml-10">Hello, User!</h1>
      <div className="p-10 grid grid-cols-3 gap-6 bg-[#E5F1EF]">
        <div className="col-span-2 grid grid-cols-2 gap-6">
          <div className="bg-white rounded-[30px] shadow-md p-6 h-60 w-96"></div>
          <div className="bg-white rounded-[30px] shadow-md p-6 h-60 w-96"></div>
          <div className="bg-white rounded-[30px] shadow-md p-6 h-60 w-96">
            {data?.map((item, index) => (
              <div key={index}>
                <h2 className="text-2xl font-bold mb-4 ml-2"> Sykefraværprosent {item.kvartal}</h2>
                <p className=" mt-5 ml-5 text-[50px] font-bold">{item.sykefraversprosent}%</p>
                <p className="text-red-500 ml-5">{item.prosentEndring}%</p> <TrendingUp className="text-red-500 ml-5" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-[30px] shadow-md p-6 h-60 w-96"></div>
        </div>
        <div className="bg-white rounded-[30px] shadow-md p-6 h-full">
          <h2 className="text-2xl font-bold mb-4 ml-2">Varslinger</h2>
        </div>
      </div>
    </div>
  );
};

export default HelseDashboard;
