function crearAventura() {
    const nombre = document.getElementById('nombre').value;
    const distancia = document.getElementById('distancia').value;
    const duracion = document.getElementById('duracion').value;
    const descripcion = document.getElementById('descripcion').value;
    const imagen = document.getElementById('imagen').value;
    const precioMin = document.getElementById('precioMin').value;
    const precioMax = document.getElementById('precioMax').value;
    const ubicacionId = document.getElementById('ubicacionId').value;

    // Validacion local
    let alertMessage = "";

    if (!nombre) {
        alertMessage += "Debes agregar el nombre de la aventura.\n";
    }

    if (!duracion) {
        alertMessage += "Debes agregar la duración de la aventura.\n";
    }

    if (!distancia) {
        alertMessage += "Debes agregar la distancia recorrida de la aventura.\n";
    }

    if (!imagen) {
        alertMessage += "Debes agregar al menos una imagen de la aventura.\n";
    }

    if (!precioMin) {
        alertMessage += "Debes agregar el precio mínimo de la aventura.\n";
    }

    if (!precioMax) {
        alertMessage += "Debes agregar el precio máximo de la aventura.\n";
    }


    if (!ubicacionId) {
        alertMessage += "Debes agregar la ubicacionId de la aventura.\n";
    }

    if (alertMessage) {
        alert(alertMessage);
        return

    }

    const data = {
        titulo: nombre,
        distanciaRecorrida: distancia,
        duracion: duracion,
        descripcion: descripcion,
        imagenDetalle: [imagen],
        precioMin,
        precioMax,
        ubicacionId
    };


    enviarAventura(data); // Replace this with your desired action, such as sending the data to a server or displaying it in the console
}

document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting normally
    crearAventura();
});

function previewImage(event) {
    var input = event.target;
    var preview = document.getElementById('preview');
    preview.src = input.value;
}


async function enviarAventura(body) {
    const button = document.getElementById("enviar");
    const loadingIcon = document.getElementById("loading-icon");


    try {

        // Show the loading icon
        loadingIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ';
        // Disable the button
        button.disabled = true;

        // Obtener el usuarioID
        const { id: usuarioID } = await getUserInfo()
        body = {
            ...body,
            usuarioID
        }


        // Mandar solicitud al server
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };

        return await fetch("http://localhost:8080/aventura", requestOptions)
            .then(r => r.json())
            .then(data => {

                // Si tenemos error mostrar la alerta 
                if (data.error) {
                    throw new Error(data.error)
                }
                alert("Aventura creada con exito")
                window.location.pathname = "index.html"
                return data
            })

    } catch (error) {
        alert("Ocurrio un error creando la aventura: " + error.message)

    } finally {
        // Show the loading icon
        loadingIcon.innerHTML = 'Enviar';
        // Disable the button
        button.disabled = false;

    }

}
