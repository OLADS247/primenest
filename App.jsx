import { useState } from 'react';
import Layout from './components/Layout.jsx';
import Home, { How, Locations, Faq } from './pages/Home.jsx';
import Request from './pages/Request.jsx';
import Track from './pages/Track.jsx';
import Partner from './pages/Partner.jsx';
import Support from './pages/Support.jsx';
import Ops from './pages/Ops.jsx';

export default function App() {
  const [page, setPage] = useState('home');
  return (
    <Layout page={page} setPage={setPage}>
      {page === 'home' && <Home setPage={setPage} />}
      {page === 'how' && <How />}
      {page === 'locations' && <Locations />}
      {page === 'faq' && <Faq />}
      {page === 'request' && <Request setPage={setPage} />}
      {page === 'track' && <Track />}
      {page === 'partner' && <Partner />}
      {page === 'support' && <Support />}
      {page === 'ops' && <Ops />}
    </Layout>
  );
}
