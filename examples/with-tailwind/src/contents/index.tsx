import { useState } from 'react';
import { createRoot } from 'react-dom/client';

console.log('contents/index.ts');

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [count, setCount] = useState(0);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Hello, Tailwind!</h1>
      <p className="text-gray-500">Count: {count}</p>
      <button
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
        onClick={() => setCount((prev) => prev + 1)}
      >
        Increment
      </button>
      <button
        className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
        onClick={() => setIsOpen(false)}
      >
        Remove
      </button>
    </div>
  );
}

const container = document.createElement('div');
document.body.appendChild(container);

const root = createRoot(container);
root.render(<App />);
