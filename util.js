const addContentHTML = (id, file) => {
    fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    });
}
function getFieldFromLocation(campo) {
  // Obtener la URL actual
  const urlActual = window.location.href;
  
  // Crear un objeto URL
  const url = new URL(urlActual);
  
  // Obtener el valor del campo específico
  const valor = url.searchParams.get(campo);
  
  // Retornar el valor o null si no existe
  return valor ? valor : null;
}
