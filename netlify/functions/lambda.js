exports.handler = async (event) => {
  // Più tardi imposteremo una variabile d'ambiente interna a Netlify stesso, accessibile semplicemente così:
  const API_PROVA = process.env.API_PROVA;

  // qui facciamo la chiamata alla API esattamente come la facevamo prima in index_dev.js
  const response = await fetch(`endpoint/parameters&API_PROVA=${API_PROVA}`);
  const data = await response.json();

  // da qui in giù la funzione fa da back-end: elaboriamo dei dati e li rimandiamo al front-end in formato JSON con uno statusCode 200, cioè "successo".
  const pass = (body) => {
    return {
      statusCode: 200,
      body: JSON.stringify(body),
    };
  };

  return pass(data);
};