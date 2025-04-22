import React from "react";

const hazardData = [
    {
      name: "SNØSKRED",
      riskLevel: "Moderat",
      icon: "❄️",
      color: "bg-yellow-400",
      shape: "rounded-full w-6 h-6"
    },
    {
      name: "FLOM",
      riskLevel: "Betydelig",
      icon: "🌊",
      color: "bg-orange-500",
      shape: "w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-orange-500"
    },
    {
      name: "JORDSKRED",
      riskLevel: "Høy",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-5.0 10.0 110.0 135.0" className="w-8 h-8 text-gray-800">
          <path d="m6.25 39.301 10.844 6.0195c0.44531 0.24609 0.75391 0.69531 0.82031 1.2031l1.2891 9.7227c0.007813 0.070312 0.011719 0.14062 0.011719 0.21094v9.0508l6.0078 6.0078c0.22656 0.22656 0.38281 0.51172 0.44531 0.82812l2.9805 14.898h65.105v-9.5312l-26.805 2.9766-2.8359 2.8359c-0.30469 0.30469-0.71484 0.47656-1.1484 0.47656h-15.395c-0.81641 0-1.5078-0.60938-1.6055-1.418l-0.74219-5.9297-2.7344-2.7344-14.449-9.6328c-0.39844-0.26562-0.66016-0.69531-0.71094-1.1719l-1.6055-14.445-3.0078-10.523-5.8438-2.9219c-0.44531-0.22656-0.76562-0.64453-0.86719-1.1328l-3.1094-15.543-6.6445-4.4297v25.188zm0 47.945h19.086l-2.7578-13.785-6.1328-6.1328c-0.30469-0.30469-0.47656-0.71484-0.47656-1.1484v-9.6172l-1.1641-8.8047-8.5547-4.75zm72.57-11.133 0.52344-10.867-11.379-9.1445-12.207 8.0078-0.8125 16.652h4.9883l0.50391-9.8047c0.046875-0.89062 0.80469-1.5781 1.6953-1.5352l10.355 0.49609c0.89844 0.042969 1.5859 0.80469 1.5391 1.6953l-0.24219 5.0547 5.0312-0.55859zm-15.594 3.7188 1.8359-1.832c0.25781-0.26172 0.60156-0.42578 0.96484-0.46484l4.5-0.5 0.19141-3.9531-7.1289-0.34375zm-29.48-28.863c-0.80469 0.26953-1.2617 1.1133-1.0547 1.9297l2.2266 8.8281c0.11719 0.46484 0.42969 0.85156 0.86328 1.0625l3.4297 1.668c0.25391 0.125 0.53516 0.17969 0.82031 0.16016l6.8477-0.46094c0.45703-0.03125 0.87891-0.25391 1.1641-0.60938 0.28125-0.35938 0.39844-0.82031 0.32422-1.2734l-1.3828-8.3242c-0.046875-0.28906-0.17188-0.55859-0.36328-0.78516l-3.6016-4.2383c-0.42969-0.50781-1.125-0.69531-1.7539-0.48438l-7.5078 2.5234zm-11.73-28.59c-0.53125 0.14844-0.94922 0.55859-1.1094 1.0898-0.16016 0.52734-0.039062 1.1016 0.32031 1.5234l5.6562 6.5977c0.41406 0.48438 1.0703 0.67969 1.6797 0.50391l4.8047-1.3945c0.47656-0.14062 0.86328-0.49219 1.0508-0.94922 0.18359-0.46094 0.14844-0.98438-0.097657-1.4141l-4.0352-7.0234c-0.37109-0.64453-1.1328-0.95312-1.8477-0.75391l-6.4297 1.8242z" fillRule="evenodd"/>
        </svg>
      ),
      color: "bg-red-600",
      shape: "rounded-full w-6 h-6"
    }
  ];
  
  export default function FareIndikatorModul() {
    return (
      <div className="bg-white rounded-[30px] shadow-md p-5 w-2/3 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hazardData.map((hazard, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-between bg-white p-6 rounded-2xl shadow-md w-48 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-5xl mb-4">
                {hazard.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{hazard.name}</h2>
              <p className="text-gray-700 mb-1">Risikonivå:</p>
              <span
                title={`${hazard.riskLevel} risiko: Klikk linken øverst til høyre for mer info.`}
                className={`text-sm font-bold px-3 py-2 rounded-full text-white shadow-md ${hazard.color}`}
              >
                {hazard.riskLevel}
              </span>
              
              <p className="text-xs text-gray-500 mt-2">Sist oppdatert: –</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
