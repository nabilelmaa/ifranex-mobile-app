import React, { createContext, ReactNode, useContext, useState } from 'react';
import Toast from 'react-native-toast-message';

interface Toast {
  show: boolean;
  message: string;
  type: "success" | "error" | "alert";
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "alert") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const showToast = (
    message: string,
    type: "success" | "error" | "alert" = "success"
  ) => {
    Toast.show({
      text1: message,
      type: type,
      position: 'top',
      visibilityTime: 2000,
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast />
    </ToastContext.Provider>
  );
};
