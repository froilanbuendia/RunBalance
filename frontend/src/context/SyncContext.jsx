import { createContext, useContext } from "react";

export const SyncContext = createContext();

export const useSync = () => useContext(SyncContext);
