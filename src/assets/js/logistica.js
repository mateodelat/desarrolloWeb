
function crearDivObligatorio(pendejada, iteracion) {
  return `<li>${pendejada[iteracion]}</li>`
}

let precioTotal = 0
let fechaGlobal = {}

async function loadLlevar() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const id = urlSearchParams.get('id');

  const fecha = await fetchFromAPI("fecha/" + id, "GET")
  fechaGlobal = fecha

  precioTotal = fecha.precio * (fecha.comision + 1)


  let material = JSON.parse(fecha.material)
  for (let i = 0; i < material[0][1].length; i++) {
    document.getElementById("Obligatorio").insertAdjacentHTML('beforeend', crearDivObligatorio(material[0][1], i));
  }
  for (let i = 0; i < material[1][1].length; i++) {
    document.getElementById("Alimentacion").insertAdjacentHTML('beforeend', crearDivObligatorio(material[1][1], i));
  }
  for (let i = 0; i < material[2][1].length; i++) {
    document.getElementById("Acampada").insertAdjacentHTML('beforeend', crearDivObligatorio(material[2][1], i));
  }

}

loadLlevar();


async function calcularTotal() {
  const tipoBoleto = document.getElementById("tipoBoleto").value;
  const cantidadBoletos = document.getElementById("cantidadBoletos").value;
  let adultos = 0;
  let ninos = 0;
  let tercera = 0;


  switch (tipoBoleto) {
    case "adulto":
      adultos = cantidadBoletos
      break;
    case "niño":
      ninos = cantidadBoletos
      break;
    case "anciano":
      tercera = cantidadBoletos
      break;
  }
  const total = cantidadBoletos * precioTotal;

  // Validar usuario 
  const { id: usuarioID } = await getUserInfo()

  const { comision: comisionFecha, usuarioID: guiaID, id: fechaID, } = fechaGlobal

  // Hacer el post a mi base de datos
  await fetchFromAPI("reserva", "POST", { comisionFecha, guiaID, fechaID, total, usuarioID, adultos, ninos, tercera })


  // Crear la reserva
  alert(`Reserva exitosa. Total a pagar cuando asistas a la aventura: $${total}`)

  window.location.href = "index.html"
}
