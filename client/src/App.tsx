import { Layout } from '@/components';
import * as routes from '@/lib/routes';
import { AddIdeaPage, AllIdeasPage, IdeaPage, SignInPage, SignUpPage } from '@/pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { TrpcProvider } from './lib/trpc';

export const App = () => {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path={routes.signUpRoute()} element={<SignUpPage />} />
            <Route path={routes.signInRoute()} element={<SignInPage />} />
            <Route path={routes.getAllIdeasRoute()} element={<AllIdeasPage />} />
            <Route path={routes.getSingleIdeaRoute(routes.ideaRouteParams)} element={<IdeaPage />} />
            <Route path={routes.addNewIdeaRoute()} element={<AddIdeaPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  );
};
