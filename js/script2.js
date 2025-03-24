document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente cargado y analizado");

    const validarCodigoBtn = document.getElementById("validarCodigo");
    const codigoSalaInput = document.getElementById("codigoSala");
    const datosJugador = document.getElementById("datosJugador");
    const mensaje = document.getElementById("mensaje");
    const ingresoSalaForm = document.getElementById("ingresoSalaForm");

    // Simulación de códigos válidos y sus tiempos de expiración
    const codigosValidos = {
        "ABC123": new Date().getTime() + 60000, // Válido por 1 minuto
        "XYZ789": new Date().getTime() + 120000, // Válido por 2 minutos
        "QWE456": new Date().getTime() - 10000 // Ya expirado
    };

    // Validar el código de la sala
    validarCodigoBtn.addEventListener("click", () => {
        console.log("Botón de validar código presionado");
        const codigo = codigoSalaInput.value.trim();

        if (codigosValidos[codigo]) {
            const tiempoActual = new Date().getTime();
            const tiempoExpiracion = codigosValidos[codigo];

            if (tiempoActual > tiempoExpiracion) {
                mensaje.textContent = "El código ya venció. Por favor, solicita uno nuevo.";
                mensaje.style.color = "orange";
            } else {
                mensaje.textContent = "Código válido. Ahora puedes ingresar tu nombre y seleccionar un personaje.";
                mensaje.style.color = "green";
                datosJugador.style.display = "block"; // Mostrar los campos para el nombre y personaje
                codigoSalaInput.disabled = true; // Deshabilitar el campo del código
                validarCodigoBtn.disabled = true; // Deshabilitar el botón de validación
            }
        } else {
            mensaje.textContent = "El código no es válido. Intenta nuevamente.";
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