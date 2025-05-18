import { ErrorPageComponent } from '@/components';
import image404 from '../../../assets/images/404.png';
import styles from './index.module.scss';

type TNotFoundPage = {
  title?: string;
  message?: string;
};

export const NotFoundPage: React.FC<TNotFoundPage> = ({
  title = 'Not Found',
  message = 'This page does not exist',
}) => (
  <ErrorPageComponent title={title} message={message}>
    <img src={image404} alt="NOT_FOUND" className={styles.notFoundImage} width="800" height="600" />
  </ErrorPageComponent>
);
