import { useMe } from '@/lib/app-context';
import * as routes from '@/lib/routes';
import { createRef } from 'react';
import { Link, Outlet } from 'react-router-dom';
import styles from './index.module.scss';

export const layoutContentElRef = createRef<HTMLDivElement>();

export const Layout = () => {
  const me = useMe();

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
          {me ? (
            <>
              <li className={styles.item}>
                <Link className={styles.link} to={routes.addNewIdeaRoute()}>
                  Add Idea
                </Link>
              </li>
              <li className={styles.item}>
                <Link className={styles.link} to={routes.getEditProfileRoute()}>
                  Edit Profile ({me.nick})
                </Link>
              </li>
              <li className={styles.item}>
                <Link className={styles.link} to={routes.getSignOutRoute()}>
                  Log Out ({me.nick})
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
      <div className={styles.content} ref={layoutContentElRef}>
        <Outlet />
      </div>
    </div>
  );
};
