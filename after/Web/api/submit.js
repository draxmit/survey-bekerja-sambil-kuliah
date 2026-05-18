export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  const SCRIPT_URL =
    process.env.GAS_URL ||
    "https://script.google.com/macros/s/REPLACE_ME/exec";

  if (SCRIPT_URL.includes('REPLACE_ME')) {
    return res.status(500).json({
      status: 'error',
      message: 'Server belum dikonfigurasi: GAS_URL belum di-set di environment.'
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        status: 'error',
        message: `Upstream error: ${response.status} ${errorText.substring(0, 100)}`
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Submission error:', error);

    let message = error.message;
    if (error.name === 'AbortError') {
      message = 'Request to Google Script timed out. Please try again.';
    }

    return res.status(500).json({
      status: 'error',
      message: message
    });
  }
}
