import * as routes from '@/lib/routes';
import { trpc } from '@/lib/trpc';
import { Link, Outlet } from 'react-router-dom';
import styles from './index.module.scss';

export const Layout = () => {
  const { data, isLoading, isFetching, isError } = trpc.getMe.useQuery();

  return (
    <div className={styles.layout}>
      <div className={styles.navigation}>
        <h1 className={styles.logo}>IdeaNick</h1>
        <ul className={styles.menu}>
          <li className={styles.item}>
            <Link className={styles.link} to={routes.getAllIdeasRoute()}>
              All Ideas
            </Link>
          </li>
          {isLoading || isFetching || isError ? null : data.me ? (
            <>
              <li className={styles.item}>
                <Link className={styles.link} to={routes.addNewIdeaRoute()}>
                  Add Idea
                </Link>
              </li>
              <li className={styles.item}>
                <Link className={styles.link} to={routes.getSignOutRoute()}>
                  Log Out ({data.me.nick})
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className={styles.item}>
                <Link className={styles.link} to={routes.getSignUpRoute()}>
                  Sign up
                </Link>
              </li>
              <li className={styles.item}>
                <Link className={styles.link} to={routes.getSignInRoute()}>
                  Sign in
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};
