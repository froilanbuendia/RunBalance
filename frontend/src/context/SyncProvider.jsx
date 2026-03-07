import { useState } from "react";
import { SyncContext } from "./SyncContext";
export const SyncProvider = ({ children }) => {
  const [syncVersion, setSyncVersion] = useState(0);

  const triggerSync = () => {
    setSyncVersion((v) => v + 1);
  };

  return (
    <SyncContext.Provider value={{ syncVersion, triggerSync }}>
      {children}
    </SyncContext.Provider>
  );
};
