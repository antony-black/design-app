import { Layout } from '@/components';
import * as routes from '@/lib/routes';
import { AddIdeaPage, AllIdeasPage, IdeaPage, SignInPage, SignOutPage, SignUpPage } from '@/pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppContextProvider } from './lib/app-context';
import { TrpcProvider } from './lib/trpc';
import { EditIdeaPage } from './pages/ideas/edit-idea-page';
import { NotFoundPage } from './pages/others/not-found-page';

export const App = () => {
  return (
    <TrpcProvider>
      <AppContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path={routes.getSignOutRoute()} element={<SignOutPage />} />
            <Route element={<Layout />}>
              <Route path={routes.getSignUpRoute()} element={<SignUpPage />} />
              <Route path={routes.getSignInRoute()} element={<SignInPage />} />
              <Route path={routes.getAllIdeasRoute()} element={<AllIdeasPage />} />
              <Route path={routes.getSingleIdeaRoute(routes.ideaRouteParams)} element={<IdeaPage />} />
              <Route path={routes.addNewIdeaRoute()} element={<AddIdeaPage />} />
              <Route path={routes.getEditIdeaRoute(routes.editIdeaRouteParams)} element={<EditIdeaPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </TrpcProvider>
  );
};
