import React, { ReactNode, useEffect, useState } from 'react';

interface StrictModeDisablerProps {
  children: ReactNode;
}

/**
 * This component renders its children outside of React.StrictMode
 * to prevent specific warnings from third-party libraries.
 * Use sparingly only for components causing UNSAFE_componentWillMount warnings.
 */
export const StrictModeDisabler: React.FC<StrictModeDisablerProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? <>{children}</> : null;
};
