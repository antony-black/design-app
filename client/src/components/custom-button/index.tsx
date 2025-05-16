import cn from 'classnames';
import styles from './index.module.scss';

export type TCustomButton = {
  children: React.ReactNode;
  isLoading: boolean;
  disabled?: boolean;
};

export const CustomButton: React.FC<TCustomButton> = ({ children, isLoading = false }) => {
  return (
    <button className={cn({ [styles.btn]: true, [styles.disabled]: isLoading })} type="submit" disabled={isLoading}>
      {isLoading ? 'Submitting...' : children}
    </button>
  );
};
