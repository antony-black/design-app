import cn from 'classnames';
import { Link } from 'react-router-dom';
import type { TCustomButton } from '../custom-button';
import styles from '../custom-button/index.module.scss';

type TLinkButton = TCustomButton & { to: string };

export const LinkButton: React.FC<TLinkButton> = ({ children, to, color = 'green' }) => {
  return (
    <Link className={cn({ [styles.button]: true, [styles[`color-${color}`]]: true })} to={to}>
      <button className={cn({ [styles.btn]: true })}>{children}</button>
    </Link>
  );
};
