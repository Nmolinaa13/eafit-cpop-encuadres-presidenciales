// api/sheet.js — Vercel Serverless Function
// Hace el fetch al CSV de Google Sheets desde el servidor (sin CORS)
// y lo reenvía al frontend con los headers correctos.

const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSzRTFiqGC_u88dW6vAwMyDkV0wDLv3ZD2yYMhdQW1LjwPGCN_n7o0BL9kXEFtuYibsf1jhFm6JboH8/pub?gid=1129586752&single=true&output=csv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch(SHEET_CSV_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CPOP-Dashboard/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Google Sheets respondió con status ${response.status}`);
    }

    const csvText = await response.text();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    return res.status(200).send(csvText);

  } catch (err) {
    console.error('[api/sheet] Error:', err.message);
    return res.status(502).json({
      error: 'No se pudo obtener los datos de Google Sheets.',
      detail: err.message,
    });
  }
}
