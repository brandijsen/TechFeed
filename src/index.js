async function callLambdaFunction() {
  // qui la magia: facciamo una chiamata ad una funzione che creeremo fra poco in un file a parte e che Netlify chiama dal proprio back-end in modo sicuro e privato quando necessario
  const response = await fetch("/.netlify/functions/lambda");
  const data = await response.json();

  console.log(response); // Facciamo ciò che vogliamo coi dati ottenuti
}

callLambdaFunction();