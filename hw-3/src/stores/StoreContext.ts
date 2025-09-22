import { createContext, useContext } from 'react';
import { RootStore } from './rootStore';

export const rootStore = new RootStore();

export const StoreContext = createContext<RootStore>(rootStore);
export const useStore = () => useContext(StoreContext);