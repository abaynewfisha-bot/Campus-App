import { useNetworkState } from "expo-network";
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

interface NetworkContextValue {
  isConnected: boolean;
  isInternetReachable: boolean;
}

const NetworkContext = createContext<NetworkContextValue>({
  isConnected: true,
  isInternetReachable: true,
});

export function NetworkProvider({ children }: { children: ReactNode }) {
  const state = useNetworkState();

  const value = useMemo<NetworkContextValue>(
    () => ({
      isConnected: state.isConnected ?? true,
      isInternetReachable: state.isInternetReachable ?? true,
    }),
    [state.isConnected, state.isInternetReachable],
  );

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
}

export function useNetwork(): NetworkContextValue {
  return useContext(NetworkContext);
}
