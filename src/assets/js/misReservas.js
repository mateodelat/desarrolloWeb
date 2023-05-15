async function cargarReservas() {
  try {

    let usr = localStorage.getItem("usuario")
    if (!usr) {
      alert("Error obteniendo las reservas, no se obtuvo el usuario")
      return
    }

    usr = JSON.parse(usr)
    const { id: usuarioID } = usr


    // Pedir las reservas asociadas al usuario
    const reservas = await fetchFromAPI("reserva/?usuarioID=" + usuarioID, "GET")


    reservas.map(async reserva => {
      const personasTotales = reserva.adultos + reserva.ninos + reserva.tercera
      const { id, total, fechaID } = reserva


      // Ir agregando los datos que ya cargaron
      let html = `<div id=${id}>
      <div class="card">
          <img class="card-img-top w-100 d-block fit-cover" style="height: 200px;"
              src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921">
          <div class="card-body p-4">
              <h4 class="card-title" style="font-family: 'Kaushan Script', serif;"></h4>
              <p class="card-text" style="font-family: Lexend, sans-serif;"> - </p>
              <p class="card-text" style="font-family: Lexend, sans-serif;">${personasTotales} Personas</p>
              <p class="card-text" style="font-family: Lexend, sans-serif;">$ ${total}</p>
              <div class="d-flex" style="font-family: Lexend, sans-serif;text-align: center;"><img
                      class="rounded-circle flex-shrink-0 me-3 fit-cover" width="50" height="50"
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921">
                  <div>
                      <p class="fw-bold mb-0"></p>
                  </div>
              </div>
          </div>
      </div>
    </div>`

      document.getElementById("reservas").insertAdjacentHTML('beforeend', html);

      // Pedir la fecha
      let fecha
      const fechaPromise = fetchFromAPI("fecha/" + fechaID, "GET").then(r => {
        fecha = r
      })

      // Pedir al usuario
      let usuario
      const usuarioPromise = fetchFromAPI("usuario/" + usuarioID, "GET").then(r => {
        {
          usuario = r
        }
      })

      // Esperar a que se resuelvan los dos
      await fechaPromise
      await usuarioPromise

      const { tituloAventura, imagenFondo } = fecha


      let fechaInicial = new Date(fecha.fechaInicial).toString().slice(3, 10)
      let fechaFinal = new Date(fecha.fechaFinal).toString().slice(3, 10)


      const { foto, nickname } = usuario

      html = `<div id=${id}>
      <div class="card">
          <img class="card-img-top w-100 d-block fit-cover" style="height: 200px;"
              src="${imagenFondo}">
          <div class="card-body p-4">
              <h4 class="card-title" style="font-family: 'Kaushan Script', serif;">${tituloAventura}</h4>
              <p class="card-text" style="font-family: Lexend, sans-serif;">${fechaInicial} - ${fechaFinal}</p>
              <p class="card-text" style="font-family: Lexend, sans-serif;">${personasTotales} Personas</p>
              <p class="card-text" style="font-family: Lexend, sans-serif;">$ ${total}</p>
              <div class="d-flex" style="font-family: Lexend, sans-serif;text-align: center;"><img
                      class="rounded-circle flex-shrink-0 me-3 fit-cover" width="50" height="50"
                      src="${foto}">
                  <div>
                      <p class="fw-bold mb-0">${nickname}</p>
                  </div>
              </div>
          </div>
      </div>
    </div>`

      document.getElementById("reservas").innerHTML = html




    })
  } catch (error) {
    alert(error.message)

  }

}

cargarReservas();


async function fetchFromAPI(route, method, body) {

  method = method ? method : "POST"

  // Mandar solicitud al server
  const requestOptions = {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  };

  return await fetch("http://localhost:8080/" + route, requestOptions)
    .then(r => r.json())
    .then(data => {
      // Si tenemos error mostrar la alerta 
      if (data.error) {

        throw new Error(data.error)
      }
      return data
    })


}
