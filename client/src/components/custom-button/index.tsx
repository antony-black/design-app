import cn from 'classnames';
import styles from './index.module.scss';

type TButtonColor = 'red' | 'green';

export type TCustomButton = {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  color?: TButtonColor;
};

export const CustomButton: React.FC<TCustomButton> = ({ children, isLoading = false, color = 'green' }) => {
  return (
    <button
      className={cn({
        [styles.button]: true,
        [styles[`color-${color}`]]: true,
        [styles.disabled]: isLoading,
        [styles.loading]: isLoading,
      })}
      type="submit"
      disabled={isLoading}
    >
      <span className={styles.text}>{children}</span>
    </button>
  );
};
