import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
function App() {
  return <main><p className="eyebrow">BIDHUB</p><h1>Real-Time Auction Platform</h1><p>Discover items. Place your bid. Follow auctions live.</p><section><h2>Project foundation</h2><p>The application shell is ready. Auction listings, accounts and live bidding will be developed according to the team roadmap.</p><a href="https://github.com/Giabao2110/BIDHUB">View project repository</a></section></main>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><App/></StrictMode>);
