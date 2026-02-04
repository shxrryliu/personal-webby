"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ExpandedCardsContextType = {
  isExpanded: (id: string) => boolean;
  setExpanded: (id: string, value: boolean) => void;
};

const ExpandedCardsContext = createContext<ExpandedCardsContextType>({
  isExpanded: () => false,
  setExpanded: () => {},
});

export function ExpandedCardsProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<Record<string, boolean>>({});

  const isExpanded = useCallback((id: string) => map[id] ?? false, [map]);

  const setExpanded = useCallback((id: string, value: boolean) => {
    setMap((prev) => ({ ...prev, [id]: value }));
  }, []);

  return (
    <ExpandedCardsContext.Provider value={{ isExpanded, setExpanded }}>
      {children}
    </ExpandedCardsContext.Provider>
  );
}

export function useExpandedCards() {
  return useContext(ExpandedCardsContext);
}
