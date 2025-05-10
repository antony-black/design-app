import { Link, Outlet } from 'react-router-dom';
import { getAllIdeasRoute } from '@/lib/routes';

export const Layout = () => {
  return (
    <div>
      <h1>
        <b>Design App</b>
      </h1>
      <ul>
        <li>
          <Link to={getAllIdeasRoute()}>All Ideas</Link>
        </li>
      </ul>
      <hr />
      <div>
        <Outlet />
      </div>
    </div>
  );
};
