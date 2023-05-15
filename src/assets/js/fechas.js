let datos = [
  {
    "id": "dcf51456-9c47-4198-ae73-5b57fdc753b5",
    "personasTotales": 10,
    "fechaInicial": 1698480000000,
    "fechaFinal": 1698602400000,
    "precio": 150,
    "itinerario": "[{\"titulo\":\"Punto de reunion en Deporte Hábitat\",\"hora\":1698480000000,\"ubicacionLink\":\"https://maps.google.com/?cid=13884668388091519820\",\"ubicacionNombre\":\"Deporte Hábitat\",\"modifiable\":false,\"tipo\":\"inicio\"},{\"titulo\":\"Aventura en Nevado de Colima\",\"hora\":1698480060000},{\"titulo\":\"Punto de reunion en Deporte Hábitat\",\"hora\":1698602400000,\"ubicacionLink\":\"https://maps.google.com/?cid=13884668388091519820\",\"ubicacionNombre\":\"Deporte Hábitat\",\"modifiable\":false,\"tipo\":\"fin\"}]",
    "puntoReunionCoords": "{\"latitude\":20.6702408,\"latitudeDelta\":0.0026979605829993147,\"longitude\":-103.3825001,\"longitudeDelta\":0.00269796058300642}",
    "material": "[[\"Obligatorio\",[\"Botas o tenis\",\"Impermeable\",\"Chamarra\",\"Camisa deportiva\",\"Mochila\"]],[\"Alimentacion\",[\"Bote con agua\",\"Barras o snacks\"]],[\"Acampada\",[\"Casa de campaña\",\"Colchoneta para dormir\",\"Casa de campaña\"]]]",
    "incluido": "{\"incluido\":[],\"agregado\":[]}",
    "dificultad": 3,
    "guia": {
      "id": "3571aace-2a82-4fab-8813-7793adbbf767",
      "email": "mateodelat@gmail.com",
      "nombre": "mateodelat",
      "apellido": "De La Torre",
      "foto": "https://ui-avatars.com/api/?name=mateodelat&bold=true&background=000000&color=fff&length=1",
      "nickname": "mateodelat"
    },
    "Reservas": [
      {
        "id": "b4fc3979-46cd-4949-967e-7375fbe27454",
        "ingreso": null,
        "ninos": 0,
        "tercera": 1,
        "total": 300,
        "tipoPago": "EFECTIVO",
        "adultos": 1
      },
      {
        "id": "b4fc3979-46cd-4949-967e-7375fbe27454",
        "ingreso": null,
        "ninos": 2,
        "tercera": 3,
        "total": 400,
        "tipoPago": "TARJETA",
        "adultos": 1
      },
      {
        "id": "b4fc3979-46cd-4949-967e-7375fbe27454",
        "ingreso": null,
        "ninos": 1,
        "tercera": 3,
        "total": 100,
        "tipoPago": "TARJETA",
        "adultos": 1
      }
    ]

  }

]


function crearDivCardFecha(objeto) {
  let totalPersonas = 0, ninos = 0, tercera = 0, adultos = 0;
  for (let i = 0; i < objeto.Reservas.length; i++) {
    ninos = objeto.Reservas[i].ninos;
    tercera = objeto.Reservas[i].tercera;
    adultos = objeto.Reservas[i].adultos;
    totalPersonas += ninos + tercera + adultos;
  }
  let itinerario = JSON.parse(objeto.itinerario)
  let fechaInicial = new Date(objeto.fechaInicial).toString().slice(3, 10)
  let fechaFinal = new Date(objeto.fechaFinal).toString();

  document.getElementById("tituloAventura").innerHTML = "Aventura " + objeto.tituloAventura
  return `<div class="col">
    <div class="card h-100">
        <div class="card-body d-flex flex-column justify-content-between p-4">
            <div>
                <h4 class="display-6 fw-bold" style="font-family: 'Kaushan Script', serif;">${fechaInicial} - ${fechaFinal.slice(3, 10)}</h4>
                <hr>
                <ul class="list-unstyled">
                    <li class="d-flex mb-2"><span class="bs-icon-xs bs-icon-rounded bs-icon-primary-light bs-icon me-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-check-lg">
                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg></span><span>${itinerario[0].titulo}</span></li>
                    <li class="d-flex mb-2"><span class="bs-icon-xs bs-icon-rounded bs-icon-primary-light bs-icon me-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-check-lg">
                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg></span><span>${totalPersonas}/${objeto.personasTotales} Personas</span></li>
                    <li class="d-flex mb-2"><span class="bs-icon-xs bs-icon-rounded bs-icon-primary-light bs-icon me-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-check-lg">
                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg></span><span>Dificultad: ${objeto.dificultad}</span></li>
                </ul>
            </div><a class="btn btn-primary d-block w-100" role="button" href="logistica.html?id=${objeto.id}" style="background: rgb(0,0,0);border-color: rgb(0,0,0);" >Reservar Fecha</a>
        </div>
    </div>
</div>`
}

async function loadFechas() {

  const fechas = await fetchFromAPI("fecha", "GET")
  console.log(fechas)

  for (let i = 0; i < fechas.length; i++) {
    document.getElementById("AQUI_FECHAS").insertAdjacentHTML('beforeend', crearDivCardFecha(fechas[i]));
  }
}

loadFechas();