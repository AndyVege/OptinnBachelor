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
import UtvidetVarslingsystem from './Components/UtvidetVarslingsystem';

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] =  useState<string>(''); // initialize with fallback

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab) {
        setActiveTab(tab);
      }
    }
  }, []);

  useEffect(() => {
    if (activeTab) {
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab]);

  const renderDashboard = () => {
    switch (activeTab) {
      case 'Befolkning':
        return <GenereltDashboard />;
      case 'Helse':
        return <HelseDashboard />;
      case 'Vær':
        return <VærDashboard />;
      case 'UtvidetVarslingssystem':
        return <UtvidetVarslingsystem/>
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
