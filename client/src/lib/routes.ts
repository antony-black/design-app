import { pgr } from '../utils/pump-get-route';

export const getSignUpRoute = pgr(() => '/sign-up');
export const getSignInRoute = pgr(() => '/sign-in');
export const getSignOutRoute = pgr(() => '/sign-out');
export const getEditProfileRoute = pgr(() => '/edit-profile');
export const getAllIdeasRoute = pgr(() => '/');
export const getSingleIdeaRoute = pgr({ nick: true }, ({ nick }) => `/ideas/${nick}`);
export const addNewIdeaRoute = pgr(() => '/ideas/new');
export const getEditIdeaRoute = pgr({ nick: true }, ({ nick }) => `/ideas/${nick}/edit`);
