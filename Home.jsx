import { FLOW, LOCATIONS } from './data.js';

export default function Home({ setPage }) {
  return (
    <>
      <section className="hero">
        <div>
          <div className="kicker">Nigeria first · Accommodation assistance</div>

          <h1>Find accommodation through one tracked request.</h1>

          <p className="lede">
            PrimeNest is not a listings site. You submit what you need. PrimeNest gives that request an ID, reviews it, and assigns a partner only when a verified partner can actually serve that place.
          </p>

          <div className="actions">
            <button
              className="primary"
              onClick={() => setPage('request')}
            >
              Request accommodation
            </button>

            <button
              className="ghost"
              onClick={() => setPage('track')}
            >
              Track a request
            </button>
          </div>
        </div>

        <aside className="panel">
          <div className="kicker">What this version can do</div>

          <div className="steps">
            {FLOW.map(([title, text], i) => (
              <div className="step" key={title}>
                <div className="num">{i + 1}</div>

                <div>
                  <strong>{title}</strong>
                  <p className="quiet">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid">
        <article className="card">
          <h3>One process</h3>
          <p>
            Every request has an ID, a status, and a next step. It should not
            live in someone’s memory.
          </p>
        </article>

        <article className="card">
          <h3>Trust is earned</h3>
          <p>
            A partner is not verified because they paid. This version does not
            sell a trust badge.
          </p>
        </article>

        <article className="card">
          <h3>No fake coverage</h3>
          <p>
            Lagos is the pilot. Other cities can be listed. Listed is not the
            same as operational.
          </p>
        </article>
      </section>
    </>
  );
}

export function How() {
  return (
    <section>
      <div className="kicker">How it works</div>

      <h1>One customer. One request. One outcome.</h1>

      <div className="grid">
        {FLOW.map(([title, text]) => (
          <article className="card" key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}

        <article className="card">
          <h3>Not in this version</h3>

          <p>
            Live hotel inventory, visa processing, flights, corporate
            accounts, and payment collection are later. They are not pretended
            here.
          </p>
        </article>
      </div>
    </section>
  );
}

export function Locations() {
  return (
    <section>
      <div className="kicker">Coverage</div>

      <h1>A city is live only when PrimeNest can serve it.</h1>

      <p className="lede">
        These records show intent and status. They are not a promise that a
        room is waiting.
      </p>

      <div className="grid">
        {LOCATIONS.map((place) => (
          <article className="card" key={place.city}>
            <span className="badge">{place.status}</span>

            <h3>{place.city}</h3>

            <p>
              {place.state}. {place.note}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Faq() {
  const items = [
    [
      'Does PrimeNest guarantee a room?',
      'No. PrimeNest runs a request. A room exists only if a partner can actually provide one.'
    ],
    [
      'Can I pay inside the app?',
      'Not yet. Do not send money to a personal account because someone claims to be PrimeNest.'
    ],
    [
      'Do you approve visas?',
      'No. PrimeNest does not guarantee visas and does not act as an immigration authority.'
    ],
    [
      'Is every Nigerian state covered?',
      'No. Coverage is operational, not decorative.'
    ]
  ];

  return (
    <section>
      <div className="kicker">FAQs</div>

      <h1>Plain answers.</h1>

      <div className="steps">
        {items.map(([q, a]) => (
          <article className="card" key={q}>
            <h3>{q}</h3>
            <p>{a}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
