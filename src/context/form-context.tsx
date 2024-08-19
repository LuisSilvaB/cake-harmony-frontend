import { createContext, useContext } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface FormContextType {
  form: UseFormReturn<any>; 
}

export const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};