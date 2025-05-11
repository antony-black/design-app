import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout';
import { TrpcProvider } from './lib/trpc';
import AddIdeaPage from './pages/add-idea-page';
import AllIdeasPage from './pages/all-ideas-page';
import IdeaPage from './pages/idea-page';
import * as routes from '@/lib/routes';

export const App = () => {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path={routes.getAllIdeasRoute()} element={<AllIdeasPage />} />
            <Route path={routes.getSingleIdeaRoute(routes.ideaRouteParams)} element={<IdeaPage />} />
            <Route path={routes.addNewIdea()} element={<AddIdeaPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  );
};
