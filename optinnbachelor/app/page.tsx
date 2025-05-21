'use client'
import * as React from 'react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from './Components/navbar';
import GenereltDashboard from './Components/Category/generelt';
import HelseDashboard from './Components/Category/helse/page';
import VærDashboard from './Components/Category/vær/page';
import MainDashboard from './Components/Category/MainDashboard';

export default function Home({ searchParams }: { searchParams: {tab:string} }) {
  const { status } = useSession();
  const router = useRouter();



  const [activeTab, setActiveTab] =  useState<string>(''); // initialize with fallback

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);


  useEffect(() => {
    if (activeTab) {
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab]);

  const renderDashboard = () => {
    switch (activeTab) {
      case 'Generelt':
        return <GenereltDashboard />;
      case 'Helse':
        return <HelseDashboard />;
      case 'Vær':
        return <VærDashboard />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="bg-[#E3F1F2] p-5">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderDashboard()}
    </div>
  );
}
