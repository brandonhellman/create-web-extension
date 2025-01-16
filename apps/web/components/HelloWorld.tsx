import { trpc } from '../utils/trpc';

export function HelloWorld() {
  const hello = trpc.user.selectUser.useQuery({
    userId: '1'
  });

  if (!hello.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>{hello.data.id}</p>
    </div>
  );
}
