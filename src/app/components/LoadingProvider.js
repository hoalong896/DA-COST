"use client";
import { createContext, useContext, useState } from "react";
import LoadingScreen from "./LoadingScreen";

const LoadingContext = createContext();

export default function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && <LoadingScreen />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
