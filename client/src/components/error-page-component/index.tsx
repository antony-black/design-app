import { Notification, Segment } from '@/components';

type TErrorPageComponent = {
  title?: string;
  message?: string;
};

export const ErrorPageComponent: React.FC<TErrorPageComponent> = ({
  title = 'Oops, error',
  message = 'Something went wrong',
}) => {
  return (
    <Segment title={title}>
      <Notification color="red">{message}</Notification>
    </Segment>
  );
};
