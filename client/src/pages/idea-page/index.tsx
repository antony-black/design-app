import { useParams } from 'react-router-dom';
import type { TideaRouteParams } from '@/lib/routes';

const IdeaPage: React.FC = () => {
  const { nick } = useParams<TideaRouteParams>();

  return (
    <div>
      <h1>{nick}</h1>
      <div>
        <p>Text 1</p>
        <p>Text 2</p>
        <p>Text 3</p>
      </div>
    </div>
  );
};

export default IdeaPage;
