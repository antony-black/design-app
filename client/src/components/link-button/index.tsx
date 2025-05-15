import cn from 'classnames';
import { Link } from 'react-router-dom';
import styles from '../custom-button/index.module.scss';

type TLinkButton = {
  children: React.ReactNode;
  to: string;
};

export const LinkButton: React.FC<TLinkButton> = ({ children, to }) => {
  return (
    <Link to={to}>
      <button className={cn({ [styles.btn]: true })}>{children}</button>
    </Link>
  );
};
