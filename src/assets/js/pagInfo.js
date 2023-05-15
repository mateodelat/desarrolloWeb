async function loadAll() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const idAventura = urlSearchParams.get('id');

  const aventura = await fetch("http://localhost:8080/aventura/" + idAventura).then(r => r.json())


  if (!aventura) {
    alert("Error, no se encontro la aventura")
    return
  }


  agarrarImagenes(aventura)
  cargarDatosRecorrido(aventura);
}
loadAll();




function crearDivCarrousel(objeto, iteracion) {
  if (iteracion == 0) {
    return `<div class="carousel-item active">
      <img src="${objeto.imagenDetalle[iteracion]}" class="w-100 d-block" alt="First slide">
    </div>`
  }
  else {
    return `<div class="carousel-item">
      <img src="${objeto.imagenDetalle[iteracion]}" class="w-100 d-block" alt="${iteracion} slide">
    </div>`
  }

}

function crearDivIndicators(iteracion) {
  if (iteracion == 0) {
    return `<li data-bs-target="#carouselId" data-bs-slide-to="${iteracion}" class="active" aria-current="true" aria-label=""></li>`
  }
  else {
    return `<li data-bs-target="#carouselId" data-bs-slide-to="${iteracion}" aria-label=""></li>`
  }
}

function agarrarImagenes(data) {
  for (let i = 0; i < data.imagenDetalle.length; i++) {

    document.getElementById("carouselImg").insertAdjacentHTML('beforeend', crearDivCarrousel(data, i));
    document.getElementById("indicators").insertAdjacentHTML('beforeend', crearDivIndicators(i));

  }


}


function crearDivDatosRecorrido(dato) {
  return `<div class="col">
  <div class="p-3">
      <h4 class="display-5 fw-bold text-white mb-0" style="font-family: 'Kaushan Script', serif;">${dato.altitud}</h4>
      <p class="mb-0" style="font-family: Lexend, sans-serif;"><span style="color: rgb(255, 255, 255);">Mts</span></p>
  </div>
  </div>
  <div class="col">
  <div class="p-3">
      <h4 class="display-5 fw-bold text-white mb-0" style="font-family: 'Kaushan Script', serif;">${(dato.duracion)}</h4>
      <p class="mb-0" style="font-family: Lexend, sans-serif;"><span style="color: rgb(255, 255, 255);">Duracion</span></p>
  </div>
  </div>
  <div class="col">
  <div class="p-3">
      <h4 class="display-5 fw-bold text-white mb-0" style="font-family: 'Kaushan Script', serif;">${dato.distanciaRecorrida}</h4>
      <p class="mb-0" style="font-family: Lexend, sans-serif;"><span style="color: rgb(255, 255, 255);">Km</span></p>
  </div>
  </div>
  <div class="col">
  <div class="p-3">
      <h4 class="display-5 fw-bold text-white mb-0" style="font-family: 'Kaushan Script', serif;">$${dato.precioMin}-$${dato.precioMax}</h4>
      <p class="mb-0" style="font-family: Lexend, sans-serif;"><span style="color: rgb(255, 255, 255);">Pesos</span></p>
  </div>
  </div>`
}
function crearDivMapa(aventura) {
  const ubicacionId = encodeURIComponent(aventura.ubicacionId)

  return `
  <div class="container">
  <iframe allowfullscreen="" frameborder="0" loading="lazy"
    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBZisgbav5i7Orb4faub-AYYyZfa1R2Ijg&amp;q=place_id:${ubicacionId}&amp;zoom=9"
    width="100%" height="400"></iframe>
  </div>`

}

function cargarDatosRecorrido(objeto) {
  document.getElementById("DatosCarousel").insertAdjacentHTML('beforeend', crearDivDatosRecorrido(objeto));
  document.getElementById("descripcion").innerText = objeto.descripcion;
  document.getElementById("tituloAventura").innerText = objeto.titulo
  document.getElementById("mapaAventura").insertAdjacentHTML("beforeend", crearDivMapa(objeto))

}



