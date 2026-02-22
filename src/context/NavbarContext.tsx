import React, { createContext, useContext, useState } from 'react';

type NavMode = 'default' | 'life-at-a-glance';

interface NavbarContextType {
  isNavbarVisible: boolean;
  setNavbarVisible: (visible: boolean) => void;
  navMode: NavMode;
  setNavMode: (mode: NavMode) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const NavbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isNavbarVisible, setNavbarVisible] = useState(true);
  const [navMode, setNavMode] = useState<NavMode>('default');
  const [activeSection, setActiveSection] = useState('Experience');

  return (
    <NavbarContext.Provider value={{ isNavbarVisible, setNavbarVisible, navMode, setNavMode, activeSection, setActiveSection }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};
