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
    <div className="overlay">
      <div className="modal">
        <p className="text">Count: {count}</p>
        <div className="button-group">
          <button
            className="button button-primary"
            onClick={() => setCount((prev) => prev + 1)}
          >
            Increment
          </button>
          <button
            className="button button-danger"
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
