import { Link, Outlet } from 'react-router-dom';
import styles from './index.module.scss';
import * as routes from '@/lib/routes';

export const Layout = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.navigation}>
        <div className={styles.logo}>IdeaNick</div>
        <ul className={styles.menu}>
          <li className={styles.item}>
            <Link className={styles.link} to={routes.getAllIdeasRoute()}>
              All Ideas
            </Link>
          </li>
          <li className={styles.item}>
            <Link className={styles.link} to={routes.addNewIdea()}>
              Add Ideas
            </Link>
          </li>
        </ul>
      </div>
      <hr />
      <div>
        <Outlet />
      </div>
    </div>
  );
};
