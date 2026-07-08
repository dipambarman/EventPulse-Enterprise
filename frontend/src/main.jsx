import { BrowserRouter } from 'react-router-dom';
import './index.css'
import ReactDOM from 'react-dom/client';
import App from './App.jsx'

// Global MutationObserver to fix SVG width/height="auto" attributes injected by Razorpay or other scripts
const fixSvgAutoAttributes = () => {
  const fixSvgAttributes = (svg) => {
    if (svg.getAttribute('width') === 'auto') {
      svg.removeAttribute('width');
    }
    if (svg.getAttribute('height') === 'auto') {
      svg.removeAttribute('height');
    }
  };

  // Fix existing SVGs on page load
  document.querySelectorAll('svg[width="auto"], svg[height="auto"]').forEach(fixSvgAttributes);

  // Observe future DOM changes to fix dynamically added SVGs
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          if (node.tagName === 'svg') {
            fixSvgAttributes(node);
          }
          const svgs = node.querySelectorAll && node.querySelectorAll('svg[width="auto"], svg[height="auto"]');
          svgs && svgs.forEach(fixSvgAttributes);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

fixSvgAutoAttributes();

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
