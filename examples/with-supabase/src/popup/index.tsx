import './index.css';

import { createRoot } from 'react-dom/client';

console.log('popup/index.tsx');

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);

  root.render(
    <div className="popup-container">
      <div>Hello from Popup!</div>
    </div>,
  );
}
