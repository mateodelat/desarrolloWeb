async function getUserInfo() {

    const token = localStorage.getItem("token")

    if (!token) {
        alert("El usuario no esta autenticado")
        localStorage.removeItem("token")
    }
    else {
        const usuario = await fetchFromAuth("user?token=" + token, "GET").catch(e => {
            console.log(e.message)
            // Si el token no es valido, mandar alerta
            throw new Error("Error, tu sesion ha expirado")
        })
        return usuario
    }

}


async function fetchFromAuth(route, method, body) {

    method = method ? method : "POST"

    // Mandar solicitud al server
    const requestOptions = {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
    };

    return await fetch("http://localhost:8080/auth/" + route, requestOptions)
        .then(r => r.json())
        .then(data => {
            // Si tenemos error mostrar la alerta 
            if (data.error) {
                showAlert("Error", data.error)

                throw new Error(data.error)
            }
            return data
        })


}
