async function getUserInfo() {

    const token = localStorage.getItem("token")
    if (!token) {
        localStorage.removeItem("usuario")
        console.log("User not authenticated")
        return
    }
    else {
        const usuario = await fetchFromAuth("user?token=" + token, "GET").catch(e => {
            alert("Error, tu sesion ha expirado")
            // Quitar el token
            localStorage.removeItem("token")
            localStorage.removeItem("usuario")


        })
        localStorage.setItem("usuario", JSON.stringify(usuario))
        return usuario
    }

}


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
                throw new Error(data.error)
            }
            return data
        })


}
