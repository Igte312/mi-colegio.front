// src/layouts/MainLayout.tsx
import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/index.css';
import Footer from '../components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div
      className="min-h-screen bg-white font-sans text-gray-800"
      style={{
        backgroundImage: 'linear-gradient(to bottom, #E6F6F8, #D2F2F5)',
      }}
    >
      <div className="flex flex-col items-center">
        <Navbar />
        <main className="w-full max-w-6xl p-8 flex-grow">
          {children}
        </main>
        <Footer /> 
      </div>
    </div>
  );
};

export default MainLayout;