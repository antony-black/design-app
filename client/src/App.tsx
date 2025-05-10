import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout';
import { getAllIdeasRoute, getSingleIdeaRoute, ideaRouteParams } from './lib/routes';
import { TrpcProvider } from './lib/trpc';
import AllIdeasPage from './pages/all-ideas-page';
import IdeaPage from './pages/idea-page';

export const App = () => {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path={getAllIdeasRoute()} element={<AllIdeasPage />} />
            <Route path={getSingleIdeaRoute(ideaRouteParams)} element={<IdeaPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  );
};
