import React from 'react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { Sticky } from '../components/Sticky';
import { useIsMobile } from '../hooks/useIsMobile';

interface ILayout {
    children: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({ children }) => {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <main className="p-0 mx-auto m-0 w-full">
        {isMobile ? (
          <Nav />
        ) : (
          <Sticky>
            <Nav />
          </Sticky>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
