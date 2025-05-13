import cn from 'classnames';
import styles from './index.module.scss';

type TCustomButton = {
  children: React.ReactNode;
  isLoading: boolean;
};

export const CustomButton: React.FC<TCustomButton> = ({ children, isLoading = false }) => {
  return (
    <button className={cn({ [styles.btn]: true, [styles.disabled]: isLoading })} type="submit" disabled={isLoading}>
      {isLoading ? 'Submitting...' : children}
    </button>
  );
};
