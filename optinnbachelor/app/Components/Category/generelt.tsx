import React from 'react'

const GenereltDashboard= () => {
  return (
    <div className="p-10 bg-[#E5F1EF]">
      <h1 className="text-4xl font-bold mb-6 ml-10">Hello, User!</h1>
    <div className="p-10 grid grid-cols-3 gap-6 bg-[#E5F1EF]">
      <div className="col-span-2 grid grid-cols-2 gap-6">
        <div className="bg-white rounded-[30px] shadow-md p-6 h-60 w-96"></div>
        <div className="bg-white rounded-[30px] shadow-md p-6 h-60 w-96"></div>
        <div className="bg-white rounded-[30px] shadow-md p-6 h-60 w-96"></div>
        <div className="bg-white rounded-[30px] shadow-md p-6 h-60 w-96"></div>
      </div>
      <div className="bg-white rounded-[30px] shadow-md p-6 h-full">
      <h2 className="text-2xl font-bold mb-4">Varslinger</h2>
      </div>
    </div>
    </div>  
  );
}

export default GenereltDashboard
