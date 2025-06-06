import cn from 'classnames';
import styles from './index.module.scss';

type TButtonColor = 'red' | 'green';

export type TCustomButton = {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  color?: TButtonColor;
  type?: 'button' | 'submit';
  onClick?: () => void;
};

export const CustomButton: React.FC<TCustomButton> = ({
  children,
  isLoading = false,
  color = 'green',
  type = 'submit',
  disabled,
  onClick,
}) => {
  return (
    <button
      className={cn({
        [styles.button]: true,
        [styles[`color-${color}`]]: true,
        [styles.disabled]: disabled || isLoading,
        [styles.loading]: isLoading,
      })}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      <span className={styles.text}>{children}</span>
    </button>
  );
};

export const CustomButtons = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.buttons}>{children}</div>;
};
