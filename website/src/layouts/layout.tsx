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
        <>
            <main className="p-0 mx-auto m-0">
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
        </>
    );
}

export default Layout;
