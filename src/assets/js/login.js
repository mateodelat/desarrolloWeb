// Funcion de enviar datos
document.getElementById("enviar").addEventListener("click", async function (event) {
    event.preventDefault(); // prevent the form from submitting

    // get the form data
    var email = document.getElementsByName("email")[0].value;
    var password = document.getElementsByName("password")[0].value;

    const button = document.getElementById("enviar");
    const loadingIcon = document.getElementById("loading-icon");

    // Show the loading icon
    loadingIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ';
    // Disable the button
    button.disabled = true;

    await fetchFromAuth("signin", "POST", { email, password })
        .then(async res => {

            const { token } = res

            // Validar el token
            await fetchFromAuth("?token=" + token, "GET")

            // Si es valido, se asigna el token al localStorage (cookie)
            localStorage.setItem("token", token)

            alert("Inicio de sesion exitoso")


            history.back()
        })
        .catch(e => e)
        .finally(() => {
            // Hide the loading icon
            loadingIcon.innerHTML = 'Login';
            // Enable the button
            button.disabled = false;

        })
});

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
            console.log(data)

            // Si tenemos error mostrar la alerta 
            if (data.error) {
                alert(data.error)

                throw new Error(data.error)
            }
            return data
        })


}