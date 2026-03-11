import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center px-4">
          <div className="text-xl font-bold text-scientific-blue">PreciousGPT</div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          © 2026 PreciousGPT Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
