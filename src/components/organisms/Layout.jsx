import { useState } from 'react';
import Header from '@/components/organisms/Header';
import Sidebar from '@/components/organisms/Sidebar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          showMenu={true}
        />
        
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;