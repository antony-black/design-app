import cn from 'classnames';
import styles from './index.module.scss';

type TNotification = {
  color: 'red' | 'green';
  children: React.ReactNode;
};
export const Notification: React.FC<TNotification> = ({ color, children }) => {
  return <div className={cn({ [styles.notification]: true, [styles[color]]: true })}>{children}</div>;
};
