import './index.css';

import { createRoot } from 'react-dom/client';

console.log('popup/index.tsx');

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <div className="flex h-96 w-96 flex-col items-center justify-center">
      <div>Hello from Popup!</div>
    </div>,
  );
}
