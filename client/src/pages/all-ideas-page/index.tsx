import { Link } from 'react-router-dom';
import { trpc } from '../../lib/trpc';
import { getSingleIdeaRoute } from '@/lib/routes';

type TIdea = {
  nick: string;
  name: string;
  description: string;
};

const AllIdeasPage = () => {
  const { data, isLoading, isFetching, error } = trpc.getAllIdeas.useQuery();
  if (isLoading || isFetching) {
    return <span>Loading...</span>;
  }
  if (!data?.ideas) {
    return <span>There are no ideas.</span>;
  }
  if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <div>
      <h1>Ideas Page</h1>
      {data.ideas.map((idea: TIdea) => (
        <div key={idea.nick}>
          <Link to={getSingleIdeaRoute({ nick: idea.nick })}>
            <h2>{idea.name}</h2>
          </Link>
          <p>{idea.description}</p>
        </div>
      ))}
    </div>
  );
};

export default AllIdeasPage;
