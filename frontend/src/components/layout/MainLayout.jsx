import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Sidebar } from '../common/Sidebar';
import { Rightbar } from '../common/Rightbar';
import { MobileNav } from '../common/MobileNav';

export const MainLayout = ({ hideRightbar = false }) => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Top Fixed Navbar */}
      <Navbar onOpenCreatePost={() => setIsCreatePostOpen(true)} />

      {/* Main 3-Column Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-20 lg:pb-8 flex justify-between gap-6">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Center Main Stream View */}
        <main className="flex-1 min-w-0 max-w-2xl mx-auto w-full">
          <Outlet context={{ isCreatePostOpen, setIsCreatePostOpen }} />
        </main>

        {/* Right Info Column */}
        {!hideRightbar && <Rightbar />}
      </div>

      {/* Bottom Mobile Navigation */}
      <MobileNav onOpenCreatePost={() => setIsCreatePostOpen(true)} />
    </div>
  );
};
