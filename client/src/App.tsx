import { TrpcProvider } from './lib/trpc';
import AllIdeasPage from './pages/all-ideas-page';

export const App = () => {
  return (
    <TrpcProvider>
      <AllIdeasPage />
    </TrpcProvider>
  );
};
