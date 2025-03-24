document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente cargado y analizado");

    const validarCodigoBtn = document.getElementById("validarCodigo");
    const codigoSalaInput = document.getElementById("codigoSala");
    const datosJugador = document.getElementById("datosJugador");
    const mensaje = document.getElementById("mensaje");
    const ingresoSalaForm = document.getElementById("ingresoSalaForm");

    // Leer el parámetro 'codigo' de la URL y colocarlo en el campo de entrada
    const params = new URLSearchParams(window.location.search);
    const codigoURL = params.get("codigo");
    if (codigoURL) {
        codigoSalaInput.value = codigoURL;
    }

    // Validar el código de la sala
    validarCodigoBtn.addEventListener("click", () => {
        console.log("Botón de validar código presionado");
        const codigo = codigoSalaInput.value.trim(); // Código ingresado por el usuario
        const codigoGuardado = localStorage.getItem("codigoSala"); // Código almacenado en localStorage

        if (codigo && codigo === codigoGuardado) {
            mensaje.textContent = "Código válido. Ahora puedes ingresar tu nombre y seleccionar un personaje.";
            mensaje.style.color = "green";
            datosJugador.style.display = "block"; // Mostrar los campos para el nombre y personaje
            codigoSalaInput.disabled = true; // Deshabilitar el campo del código
            validarCodigoBtn.disabled = true; // Deshabilitar el botón de validación
            document.getElementById("nombreJugador").focus(); // Colocar el cursor en el campo de nombre
        } else if (codigo) {
            mensaje.textContent = "El código no es válido. Intenta nuevamente.";
            mensaje.style.color = "red";
        } else {
            mensaje.textContent = "Por favor, ingresa un código.";
            mensaje.style.color = "red";
        }
    });

    // Manejar el envío del formulario
    ingresoSalaForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombreJugador = document.getElementById("nombreJugador").value.trim();
        const personaje = document.getElementById("personaje").value;

        if (nombreJugador && personaje) {
            mensaje.textContent = `¡Bienvenido, ${nombreJugador}! Te has unido a la sala como ${personaje}.`;
            mensaje.style.color = "blue";
            // Aquí puedes redirigir al jugador al juego o realizar otras acciones
        } else {
            mensaje.textContent = "Por favor, completa todos los campos.";
            mensaje.style.color = "red";
        }
    });
});

function crearSala() {
    let codigoSala = generarCodigoSala();
    let urlSala = `https://juegoscript.netlify.app/ingresarcodigo.html?codigo=${codigoSala}`;
    
    console.log("URL generada para el QR:", urlSala); // Verifica la URL generada

    // Guardar el código de la sala en localStorage
    localStorage.setItem("codigoSala", codigoSala);

    document.getElementById("codigo-sala").innerText = `Código de Sala: ${codigoSala}`;
    document.getElementById("qr-container").innerHTML = "";
    new QRCode(document.getElementById("qr-container"), urlSala);

    // Mostrar el botón "Iniciar Juego" debajo del QR
    const btnIniciar = document.getElementById("iniciarJuego");
    btnIniciar.style.display = "block";
    btnIniciar.disabled = false;
}
