// Funcion de enviar datos
document.getElementById("enviar").addEventListener("click", handleSignup);
async function handleSignup(event) {
    event.preventDefault(); // prevent the form from submitting

    // get the form data
    var email = document.getElementsByName("email")[0].value;
    var password = document.getElementsByName("password")[0].value;
    var nickname = document.getElementsByName("nickname")[0].value;

    const button = document.getElementById("enviar");
    const loadingIcon = document.getElementById("loading-icon");

    // Show the loading icon
    loadingIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ';
    // Disable the button
    button.disabled = true;

    await fetchFromAuth("signup", "POST", { nickname, email, password })
        .then(r => {
            console.log({ r })
            showAlert("Exito", "Cuenta creada correctamente, solo falta que la confirmes", "info")


            // Mostrar el modal de confirmar correo
            const confirmModal = document.getElementById('confirmModal');
            const modal = new bootstrap.Modal(confirmModal);
            modal.show();

            // Cambiar el correo
            confirmModal.querySelector('[id="emailConfirm"]').value = email;



            // Guardar la informacion del usuario
            localStorage.setItem("auth", JSON.stringify(r))


        })
        .finally(() => {
            // Hide the loading icon
            loadingIcon.innerHTML = 'Register';
            // Enable the button
            button.disabled = false;

        })

}


async function handleConfirm() {
    const confirmModal = document.getElementById('confirmModal');

    // Mostrar el modal de confirmar correo
    const email = confirmModal.querySelector('[id="emailConfirm"]').value
    const code = confirmModal.querySelector('[id="codeConfirm"]').value

    console.log({
        email, code
    })

    await fetchFromAuth("confirm", "POST", { email, code })
        .then(r => {
            alert("Cuenta confirmada correctamente, ya puedes iniciar sesion")
            window.location.pathname = "login.html"



        })
        .catch(e => e)



}

async function handleResend() {
    const confirmModal = document.getElementById('confirmModal');
    const email = confirmModal.querySelector('[id="emailConfirm"]').value



    await fetchFromAuth("resendConfirm", "POST", { email })
        .then(r => {
            showAlert("Exito", "Codigo reenviado correctamente a " + r.res.CodeDeliveryDetails.Destination, "info")
            console.log(r)
        })
        .catch(e => e)

}


function showAlert(title, body, type) {
    type = type ? type : "danger"



    const confirmModal = document.getElementById('confirmModal');

    const html = `
    <div id ="alerta" class="alert alert-${type} alert fade show fixed-top"
    role="alert">
        <strong>${title}</strong> ${body}
    </div>

    <script>
        var alertList = document.querySelectorAll('.alert');
        alertList.forEach(function (alert) {
            new bootstrap.Alert(alert)
        })
    </script>`

    // Si no hay modal presentado, marcar error
    if (confirmModal.style.display === "none" || confirmModal.style.display == "") {
        // Poner la alerta en el inicio
        const body = document.getElementsByTagName("body")[0]
        body.insertAdjacentHTML('afterbegin', html);

        const alerta = document.getElementById("alerta")

        setTimeout(() => {
            alerta.remove()
            // Eliminar la alerta
        }, 3000);


        return
    }


    const alerta = confirmModal.querySelector('[id="modalAlert"]')
    alerta.insertAdjacentHTML('beforeend', html);
    setTimeout(() => {
        alerta.innerHTML = ""
    }, 2000);


}

