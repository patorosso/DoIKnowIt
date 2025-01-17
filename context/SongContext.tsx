import React, { createContext, useState, useContext } from "react";

interface SongsContextProps {
  reload: {};
  setReload: React.Dispatch<React.SetStateAction<{}>>;
}

const SongsContext = createContext<SongsContextProps | undefined>(undefined);

export const SongsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reload, setReload] = useState<{}>({});

  return (
    <SongsContext.Provider value={{ reload, setReload }}>
      {children}
    </SongsContext.Provider>
  );
};

export const useSongs = () => {
  const context = useContext(SongsContext);
  if (!context) {
    throw new Error("useSongs must be used within a SongsProvider");
  }
  return context;
};
