import { Link, Outlet } from 'react-router-dom';
import styles from './index.module.scss';
import * as routes from '@/lib/routes';

export const Layout = () => {
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
          <li className={styles.item}>
            <Link className={styles.link} to={routes.addNewIdea()}>
              Add Idea
            </Link>
          </li>
        </ul>
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};
