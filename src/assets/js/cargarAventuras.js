async function cargarAventuras() {
  const aventuras = await fetch("http://localhost:8080/aventura").then(r => r.json())


  for (let i = 0; i < aventuras.length; i++) {
    document.getElementById("AquiCARDS").insertAdjacentHTML('beforeend', crearDivCards(aventuras[i]));
  }
}

cargarAventuras();



function crearDivCards(objeto) {
  //Agarrar todo el objeto para las cards
  let idImagen = objeto.imagenFondoIdx
  let usarImagen = objeto.imagenDetalle[idImagen]
  let elTitulo = objeto.titulo;
  let duracion = objeto.duracion;
  let altitud = objeto.altitud

  const { id } = objeto

  return `<div class="col">
      <div class="card"><img class="card-img-top w-100 d-block fit-cover" style="height: 200px;" src="${usarImagen}">
        <div class="card-body p-4">
          <h4 class="card-title" style="text-align: center;font-family: 'Kaushan Script', serif;">${elTitulo}</h4>
          <p class="card-text" style="text-align: center;font-family: Lexend, sans-serif;">${duracion}</p>
          <p class="card-text" style="text-align: center;font-family: Lexend, sans-serif;">${altitud} Mts</p>
        <div class="d-flex justify-content-center align-items-center"><a href="/detalleAventura.html?id=${id}"><button  class="btn btn-primary" data-bss-hover-animate="pulse" type="button" style="background: #0e141c;border-color: #0e141c;"><i class="fas fa-arrow-right"></i></button></a></div>
      </div>
    </div>
  </div>`
}



// Verificar estado del usuario si el token es valido
getUserInfo()