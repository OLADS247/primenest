import { useState } from 'react';

const ITEMS = [
  ['home', 'Home'],
  ['how', 'How it works'],
  ['locations', 'Locations'],
  ['partner', 'Become a partner'],
  ['faq', 'FAQs'],
  ['support', 'Contact']
];

export default function Layout({ page, setPage, children }) {
  const [open, setOpen] = useState(false);
  function go(next) {
    setPage(next);
    setOpen(false);
    window.scrollTo(0, 0);
  }
  return (
    <div className="app">
      <header className="nav">
        <button className="brand" onClick={() => go('home')}>
          <div className="mark">P</div>
          <strong>Prime<span>Nest</span></strong>
        </button>
        <button className="menu" onClick={() => setOpen((v) => !v)} aria-label="Open menu">Menu</button>
        <nav className={open ? 'links open' : 'links'}>
          {ITEMS.map(([id, label]) => (
            <button key={id} className={page === id ? 'active' : ''} onClick={() => go(id)}>{label}</button>
          ))}
          <button className="primary" onClick={() => go('request')}>Request accommodation</button>
        </nav>
      </header>
      <main className="wrap">{children}</main>
      <footer className="footer">
        PrimeNest V1 pilot. Nigeria first. A place is live only when supply and process exist. Payment is not live in this version.
        {' '}
        <button className="text-btn" onClick={() => go('ops')}>Staff</button>
      </footer>
    </div>
  );
}
