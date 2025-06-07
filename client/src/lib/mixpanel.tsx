import type { TtrpcRouterOutput } from '@design-app/backend/src/lib/router/trpc-router';
import mixpanel from 'mixpanel-browser';
import { useEffect } from 'react';
import { useMe } from './app-context';
import { env } from './env';

if (env.VITE_MIXPANEL_API_KEY) {
  mixpanel.init(env.VITE_MIXPANEL_API_KEY);
}

const whenEnabled = <T,>(fn: T): T => {
  return env.VITE_MIXPANEL_API_KEY ? fn : ((() => {}) as T);
};

export const mixpanelIdentify = whenEnabled((userId: string) => {
  mixpanel.identify(userId);
});

export const mixpanelAlias = whenEnabled((userId: string) => {
  mixpanel.alias(userId);
});

export const mixpanelReset = whenEnabled(() => {
  mixpanel.reset();
});

export const mixpanelPeopleSet = whenEnabled((me: NonNullable<TtrpcRouterOutput['getMe']['me']>) => {
  mixpanel.people.set({
    $email: me.email,
    nick: me.nick,
  });
});

export const mixpanelTrackSignUp = whenEnabled(() => {
  mixpanel.track('Sign Up');
});

export const mixpanelTrackSignIn = whenEnabled(() => {
  mixpanel.track('Sign In');
});

export const mixpanelSetLike = whenEnabled((idea: TtrpcRouterOutput['setLike']['idea']) => {
  mixpanel.track('Like', { ideaId: idea.id });
});

export const MixpanelUser = () => {
  const me = useMe();
  useEffect(() => {
    if (me) {
      mixpanelPeopleSet(me);
    } else {
      mixpanelReset();
    }
  }, [me]);
  return null;
};
