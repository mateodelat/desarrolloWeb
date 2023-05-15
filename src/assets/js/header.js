async function crearDivNavBar() {
    // Verificar estado del usuario si el token es valido
    const usuario = await getUserInfo()

    const token = localStorage.getItem("token")


    if (!token) { //no hay cuenta iniciada
        return `<ul class="navbar-nav ms-auto"></ul><a class="btn btn-primary ms-md-2" role="button"
        href="login.html"
        style="background: #ffffff;border-color: #0e141c;border-radius: 0px;font-family: Lexend, sans-serif;"><span
            style="color: rgb(0, 0, 0);">Iniciar Sesión</span></a><a class="btn btn-primary ms-md-2"
        role="button" href="register.html"
        style="background: #0e141c;border-color: #0e141c;border-radius: 0px;font-family: Lexend, sans-serif;">Registrarse</a>
`
    }
    else {
        // console.log("Entro a True") //AQUI PONER IMAGEN EN localStorage.usuario
        return `<ul class="navbar-nav ms-auto"></ul><a class="navbar-text" style="color: rgb(14,20,28);padding-right: 4vh;font-family: Lexend, sans-serif;">
        <a href="agregarAventura.html" class="navbar-text" style="color: rgb(14,20,28);padding-right: 4vh;font-family: Lexend, sans-serif;">Crear Aventuras</a><a class="btn btn-primary ms-md-2" role="button" href="misReservas.html" style="background: #0e141c;border-color: #0e141c;border-radius: 0px;font-family: Lexend, sans-serif;">Mis Reservas</a>
        </a>
        <div style="margin-left: 3%;">
            <img src="${usuario.foto}" 
                alt="user image"
                width="40"
                height="40" style="border-radius:40px">
            </img>
        </div>`
    }
}

async function loadNavBar() {
    document.getElementById("Navbar right").innerHTML = await crearDivNavBar()
}

loadNavBar();


