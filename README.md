# PrimeNest V1

Accommodation request and assistance pilot. Nigeria first.

The team tracks requests in a Google Sheet. The website collects the request. The sheet is the operating record.

## Team spreadsheet

1. Create a Google Sheet named PrimeNest Operations.
2. Extensions, then Apps Script.
3. Paste `apps-script/Code.gs`.
4. Deploy, New deployment, Web app.
5. Execute as Me. Who has access: Anyone.
6. Copy the web app URL into `src/config.js` as `API_BASE_URL`.
7. Share the Sheet with the team. They update Request Status and Assigned Partner in that sheet.

Do not mark a row paid unless payment was actually verified. Payment is not live in this version.

A customer can submit a request, receive a server-generated ID, and track it with that ID plus their email. Staff can review requests from the Staff link in the footer.

This version does not collect payment, invent agent counts, or mark a partner as verified just because they applied.

## Run it in VS Code

1. Open the `primenest` folder in VS Code.
2. Open the terminal.
3. Run:

```bash
npm install
OPS_PASSWORD="choose-a-private-password" npm run dev
```

4. Open http://localhost:5173

The default password, if you do not set one, is `change-this-before-real-users`. Change it before anyone else uses the app.

Records are stored in `server/data/primenest.json`.

## What is real

- Request form and server-side request IDs such as `PN-LAG-2026-000001`
- Tracking by request ID and email
- Partner applications, stored as pending review
- Support tickets
- Operations status updates

## What is not live

- Payments
- Automatic partner verification
- Hotel inventory
- Coverage outside the pilot rule: listed is not operational

## Before strangers can use it

This copy runs on your computer. Put it on a hosted server with HTTPS before real customers use it. Do not publish customer phone numbers in a public demo.
