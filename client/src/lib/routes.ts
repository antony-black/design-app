const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
  return Object.keys(object).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {}) as Record<keyof T, string>;
};

export const getAllIdeasRoute = () => '/';

export const ideaRouteParams = getRouteParams({ nick: true });
export type TideaRouteParams = typeof ideaRouteParams;
export const getSingleIdeaRoute = ({ nick }: TideaRouteParams) => `/ideas/${nick}`;

export const editIdeaRouteParams = getRouteParams({ nick: true });
export type TEditIdeaRouteParams = typeof ideaRouteParams;
export const getEditIdeaRoute = ({ nick }: TEditIdeaRouteParams) => `/ideas/${nick}/edit`;

export const addNewIdeaRoute = () => '/ideas/add';

export const getSignUpRoute = () => '/sign-up';
export const getSignInRoute = () => '/sign-in';
export const getSignOutRoute = () => '/sign-out';
