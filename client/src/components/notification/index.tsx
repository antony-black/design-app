import cn from 'classnames';
import styles from './index.module.scss';

export type TNotification = {
  color: 'red' | 'green' | 'brown';
  hidden?: boolean;
  children: React.ReactNode;
};
export const Notification: React.FC<TNotification> = ({ color, children, hidden }) => {
  if (hidden) {
    return null;
  }

  return <div className={cn({ [styles.notification]: true, [styles[color]]: true })}>{children}</div>;
};
