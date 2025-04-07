// netlify/functions/proxy.js

export async function handler(event, context) {
  console.log('--- proxy event', event)
  console.log('--- proxy context', context)
  // const url = 'https://svr78.supla.org/direct/927/jW53MRbcodQwZj/read?format=json'; // cambia con l'URL reale
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Parametro "url" mancante' }),
    };
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Errore nel fetch: ' + error.message })
    };
  }
}
