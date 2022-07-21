import React from 'react';
import { Footer } from '../components/Footer';
import { Sticky } from '../components/Sticky';
import { useIsMobile } from '../hooks/useIsMobile';

export interface ILayout {
    children: React.ReactNode;
}

const DemoLayout: React.FC<ILayout> = ({ children }) => {
  const isMobile = useIsMobile();
  return (
    <>
      <main className="p-0 mx-auto m-0">
        {children}
      </main>
    </>
  );
}

export default DemoLayout;
