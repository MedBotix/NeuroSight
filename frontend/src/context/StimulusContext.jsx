import React, { createContext, useContext } from 'react';
import { useStimulusTest } from '../hooks/useStimulusTest';

const StimulusContext = createContext(null);

export const StimulusProvider = ({ children }) => {
  const value = useStimulusTest();
  return (
    <StimulusContext.Provider value={value}>
      {children}
    </StimulusContext.Provider>
  );
};

export const useStimulus = () => {
  const ctx = useContext(StimulusContext);
  if (!ctx) throw new Error('useStimulus must be used within a StimulusProvider');
  return ctx;
};

export default StimulusProvider;
