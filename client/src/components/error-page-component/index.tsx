import { Notification, Segment } from '@/components';

type TErrorPageComponent = {
  title?: string;
  message?: string;
  children?: React.ReactNode;
};

export const ErrorPageComponent: React.FC<TErrorPageComponent> = ({
  title = 'Oops, error',
  message = 'Something went wrong',
  children,
}) => {
  return (
    <Segment title={title}>
      <Notification color="red">{message}</Notification>
      {children}
    </Segment>
  );
};
