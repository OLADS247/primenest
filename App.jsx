import { useState } from 'react';
import Layout from './Layout.jsx';
import Home, { How, Locations, Faq } from './Home.jsx';
import Request from './Request.jsx';
import Track from './Track.jsx';
import Partner from './Partner.jsx';
import Support from './Support.jsx';
import Ops from './Ops.jsx';

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
```
