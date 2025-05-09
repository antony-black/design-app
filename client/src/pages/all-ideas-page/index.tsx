import { trpc } from '../../lib/trpc';

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
    return <span>{error.message}</span>
  }

  return (
    <div>
      <h1>Ideas Page</h1>
      {data.ideas.map((idea: TIdea) => (
        <div key={idea.nick}>
          <h2>{idea.name}</h2>
          <p>{idea.description}</p>
        </div>
      ))}
    </div>
  );
};

export default AllIdeasPage;
