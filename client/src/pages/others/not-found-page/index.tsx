import { ErrorPageComponent } from '@/components';

type TNotFoundPage = {
  title?: string;
  message?: string;
};

export const NotFoundPage: React.FC<TNotFoundPage> = ({
  title = 'Not Found',
  message = 'This page does not exist',
}) => <ErrorPageComponent title={title} message={message} />;
