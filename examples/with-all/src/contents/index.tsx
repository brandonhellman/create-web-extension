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
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
      <div className="rounded bg-white p-4">
        <p className="text-gray-500">Count: {count}</p>
        <div className="flex-row flex gap-2">
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const container = document.createElement('div');
document.body.appendChild(container);

const root = createRoot(container);
root.render(<App />);
