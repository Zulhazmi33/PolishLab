// 1) GENERAL
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  // </StrictMode>,
)

// 1) permission
// sudo chown -R $(whoami) ~/.npm

// 2) clear cache
// rm -rf ~/.npm/_cacache
// npm cache clean --force
// npm install