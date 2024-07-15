import React, { useMemo, useReducer } from 'react';
import agroLeaderReducer, { initialStore } from './agroLeaderReducer';

// type AgroLeaderContextType = {
//   state: agroLeaderStoreType;
//   dispatch: React.Dispatch<any>;
// };

const AgroLeaderContext = React.createContext<any>([]);

const AgroLeaderProvider = (props: any) => {
  const [state, dispatch] = useReducer(agroLeaderReducer, initialStore);

  const value: any = useMemo(() => {
    return [state, dispatch];
  }, [state]);

  return <AgroLeaderContext.Provider value={value} {...props} />;
};

export default AgroLeaderProvider;

export function useAgroLeaderStore(): any {
  const context: any = React.useContext<any>(AgroLeaderContext);
  if (context === undefined) {
    throw new Error('useAgroLeader must be used within a AgroLeaderProvider');
  }
  return context[0];
}
export function useAgroLeaderDispatch(): any {
  const context: any = React.useContext<any>(AgroLeaderContext);
  if (context === undefined) {
    throw new Error('useAgroLeader must be used within a AgroLeaderProvider');
  }
  return context[1];
}
