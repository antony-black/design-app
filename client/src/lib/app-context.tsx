import { Loader } from '@/components';
import type { TtrpcRouterOutput } from '@design-app/backend/src/lib/router/trpc-router';
import { createContext, useContext } from 'react';
import { trpc } from './trpc';

export type TAppContext = {
  me: TtrpcRouterOutput['getMe']['me'];
};

const AppReactContext = createContext<TAppContext>({
  me: null,
});

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, error, isLoading, isFetching, isError } = trpc.getMe.useQuery();

  return (
    <AppReactContext.Provider
      value={{
        me: data?.me || null,
      }}
    >
      {isLoading || isFetching ? <Loader type="page" /> : isError ? <p>Error: {error.message}</p> : children}
    </AppReactContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppReactContext);
};

export const useMe = () => {
  const { me } = useAppContext();
  return me;
};
