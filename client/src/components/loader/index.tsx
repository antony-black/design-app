import cn from 'classnames';
import styles from './index.module.scss';

type TLoader = {
  type: 'page' | 'section';
};

export const Loader: React.FC<TLoader> = ({ type }) => (
  <span
    className={cn({
      [styles.loader]: true,
      [styles[`type-${type}`]]: true,
    })}
  />
);
