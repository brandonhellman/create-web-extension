import { trpc } from '../utils/trpc';

export function HelloWorld() {
  const hello = trpc.hello.useQuery({ text: 'client' });

  if (!hello.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>{hello.data.greeting}</p>
    </div>
  );
}
