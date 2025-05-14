const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
  return Object.keys(object).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {}) as Record<keyof T, string>;
};

export const getAllIdeasRoute = () => '/';

export const ideaRouteParams = getRouteParams({ nick: true });
export type TideaRouteParams = typeof ideaRouteParams;
export const getSingleIdeaRoute = ({ nick }: TideaRouteParams) => `/ideas/${nick}`;

export const addNewIdeaRoute = () => '/ideas/add';

export const signUpRoute = () => '/sign-up';
export const signInRoute = () => '/sign-in';
