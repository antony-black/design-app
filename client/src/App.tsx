import { Layout, NotAuthRouteTracker } from '@/components';
import * as routes from '@/lib/routes';
import {
  AddIdeaPage,
  AllIdeasPage,
  EditIdeaPage,
  EditProfilePage,
  IdeaPage,
  NotFoundPage,
  SignInPage,
  SignOutPage,
  SignUpPage,
} from '@/pages';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppContextProvider } from './lib/app-context';
import { MixpanelUser } from './lib/mixpanel';
import { SentryUser } from './lib/sentry';
import { TrpcProvider } from './lib/trpc';

export const App = () => {
  return (
    <HelmetProvider>
      <TrpcProvider>
        <AppContextProvider>
          <BrowserRouter>
            <SentryUser />
            <MixpanelUser />
            <NotAuthRouteTracker />
            <Routes>
              <Route path={routes.getSignOutRoute.definition} element={<SignOutPage />} />
              <Route element={<Layout />}>
                <Route path={routes.getSignUpRoute.definition} element={<SignUpPage />} />
                <Route path={routes.getSignInRoute.definition} element={<SignInPage />} />
                <Route path={routes.getEditProfileRoute.definition} element={<EditProfilePage />} />
                <Route path={routes.getAllIdeasRoute.definition} element={<AllIdeasPage />} />
                <Route path={routes.getSingleIdeaRoute.definition} element={<IdeaPage />} />
                <Route path={routes.getEditIdeaRoute.definition} element={<EditIdeaPage />} />
                <Route path={routes.addNewIdeaRoute.definition} element={<AddIdeaPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppContextProvider>
      </TrpcProvider>
    </HelmetProvider>
  );
};
