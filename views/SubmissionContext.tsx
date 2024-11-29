import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the context type
interface SubmissionTriggerContextType {
  trigger: boolean;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context
const SubmissionTriggerContext = createContext<SubmissionTriggerContextType | null>(null);

// Define the provider props
interface SubmissionTriggerProviderProps {
  children: ReactNode; // Explicitly define the type for children
}

// Provider component
export const SubmissionTriggerProvider: React.FC<SubmissionTriggerProviderProps> = ({ children }) => {
  const [trigger, setTrigger] = useState(false);

  return (
    <SubmissionTriggerContext.Provider value={{ trigger, setTrigger }}>
      {children}
    </SubmissionTriggerContext.Provider>
  );
};

// Hook to use the context
export const useSubmissionTrigger = () => {
  const context = useContext(SubmissionTriggerContext);
  if (!context) {
    throw new Error('useSubmissionTrigger must be used within SubmissionTriggerProvider');
  }
  return context;
};
