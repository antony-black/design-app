import styles from './index.module.scss';

type TFormItems = {
  children: React.ReactNode;
};

export const FormItems: React.FC<TFormItems> = ({ children }) => {
  return <div className={styles.formitems}>{children}</div>;
};
