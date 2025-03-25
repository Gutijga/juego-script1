let jugadores = []; // Array para almacenar los datos de los jugadores






function mostrarFormulario() {
    let cantidad = parseInt(document.getElementById("numJugadores").value);

    // Validación de cantidad de jugadores permitidos (entre 2 y 4)
    if (isNaN(cantidad) || cantidad < 2 || cantidad > 4) {
        alert("Por favor, elige entre 2 y 4 jugadores.");
        return;
    }

    document.getElementById("formulario").style.display = "none";
    let form = document.getElementById("jugadoresForm");
    form.innerHTML = "<h3>Ingresa los nombres de los jugadores:</h3>";

    // Creación dinámica de los campos de entrada para nombres y selección de muñecos
    for (let i = 1; i <= cantidad; i++) {
        form.innerHTML += `<label>Jugador ${i}:</label>
                            <input type="text" id="jugador${i}" oninput="validarTexto(this)" required><br>

                            <div class="seleccion-muneco">
                                ${['red', 'blue', 'yellow', 'pink'].map(color => `
                                    <label class="muneco-label">
                                        <input type="radio" name="muneco${i}" value="${color}" required>
                                        <div class="ghost ${color}">
                                            <div class="eye left"><div class="pupil"></div>< /div>
                                            <div class="eye right"><div class="pupil"></div></div>
                                            <div class="wave">
                                                <span></span><span></span><span></span>
                                            </div>
                                        </div>
                                    </label>
                                `).join('')}
                            </div>`;
    }

    form.innerHTML += `<br><button onclick="iniciarJuego(${cantidad})">Iniciar Juego</button>`;
    form.style.display = "block";
}

// Función para validar que solo se ingresen letras en los nombres de los jugadores
function validarTexto(input) {
    input.value = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
}

function generarCodigoSala() {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
}

async function crearSala() {
    let codigoSala = generarCodigoSala();
    let urlSala = `https://juegoscript.netlify.app/frontend/ingresarcodigo.html?codigo=${codigoSala}`;
    
    console.log("URL generada para el QR:", urlSala); // Verifica la URL generada

    try {
        // Enviar código de la sala al backend
        let response = await fetch ("https://console.clever-cloud.com/users/me/applications/app_e52f1e4d-2eb3-4fd7-8507-8a86fa0e0a67", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ codigo: codigoSala })
        });

        let data = await response.json();
        console.log("Respuesta del backend:", data);

        if (response.ok) {
            // Guardar el código de la sala en localStorage
            localStorage.setItem("codigoSala", codigoSala);

            // Mostrar el código en la página
            document.getElementById("codigo-sala").innerText = `Código de Sala: ${codigoSala}`;
            document.getElementById("qr-container").innerHTML = "";
            new QRCode(document.getElementById("qr-container"), urlSala);

            // Mostrar el botón "Iniciar Juego"
            const btnIniciar = document.getElementById("iniciarJuego");
            btnIniciar.style.display = "block";
            btnIniciar.disabled = false;
        } else {
            console.error("Error al crear la sala:", data);
            alert("Error al crear la sala. Inténtalo de nuevo.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un problema con la conexión al servidor.");
    }
}


function iniciarJuego() {
    let conteo = 5;
    const conteoElemento = document.getElementById("conteoRegresivo");
    const botonIniciar = document.getElementById("iniciarJuego");
    botonIniciar.disabled = true;

    const intervalo = setInterval(() => {
        conteoElemento.innerText = `El juego comienza en: ${conteo}...`;
        conteo--;

        if (conteo < 0) {
            clearInterval(intervalo);
            conteoElemento.innerText = "¡El juego ha comenzado!";
            botonIniciar.disabled = false;

            // Generar la tabla después de que el conteo termine
            generarTablero();
        }
    }, 1000);
}


// Función para mostrar los muñecos en la tabla
function mostrarMuñecos() {
    // Primero, eliminar cualquier muñeco existente para evitar duplicados
    document.querySelectorAll('.ghost-jugador, .nombre-jugador').forEach(elem => elem.remove());
    
    // Obtiene la celda del número 1 en el tablero
    const celdaUno = document.getElementById('celda-1'); 
    if (!celdaUno) return; // Verificación de seguridad
    
    // Obtiene las dimensiones de la celda (posición y tamaño)
    const celdaRect = celdaUno.getBoundingClientRect(); 
    
    // =====================================================================
    // AJUSTES DE POSICIÓN - MODIFICA ESTOS VALORES PARA AJUSTAR LA POSICIÓN
    // =====================================================================
    
    // AJUSTES VERTICALES
    const ajusteAltura = -28; // Positivo: baja los muñecos, Negativo: sube los muñecos
    
    // AJUSTES HORIZONTALES
    const distanciaDesdeElBorde = -20; // Distancia desde el borde izquierdo de la casilla 1
                                      // Positivo: muñecos a la derecha, Negativo: muñecos a la izquierda
    
    const espacioEntreMunecos = 40; // Espacio horizontal entre muñecos
                                    // Positivo: muñecos separados, Negativo: muñecos superpuestos
    
    const direccion = -1; // 1: muñecos de izquierda a derecha, -1: muñecos de derecha a izquierda
    
    // =====================================================================
    // FIN DE AJUSTES DE POSICIÓN
    // =====================================================================
    
    // Altura fija para todos los muñecos - al pie del cuadro 1
    const alturaFija = celdaRect.top + celdaRect.height + ajusteAltura;
    
    // Itera sobre cada jugador en el array 'jugadores'
    jugadores.forEach((jugador, index) => {
        // Crear un nuevo div que representará al muñeco
        let jugadorDiv = document.createElement('div');
        // Añade las clases 'ghost' y el color del jugador al div
        jugadorDiv.classList.add('ghost', jugador.color, 'ghost-jugador');
        // Asegura que el muñeco esté en posición absoluta
        jugadorDiv.style.position = 'absolute'; 
        
        // Posición horizontal: calculada según la dirección y el espacio entre muñecos
        const offsetX = distanciaDesdeElBorde + (direccion * index * espacioEntreMunecos); 
        
        // Aplica las posiciones calculadas - MISMA ALTURA para todos
        jugadorDiv.style.left = `${celdaRect.left + offsetX}px`; 
        jugadorDiv.style.top = `${alturaFija}px`; 
        
        // Ajusta el tamaño del muñeco
        jugadorDiv.style.width = '30px'; 
        jugadorDiv.style.height = '40px';
        // Asegura que esté por encima de otros elementos
        jugadorDiv.style.zIndex = '10';
        // Añadir cursor pointer para indicar que es interactivo
        jugadorDiv.style.cursor = 'pointer';

        // Crear ojos
        const leftEye = document.createElement('div');
        leftEye.classList.add('eye', 'left1');
        const leftPupil = document.createElement('div');
        leftPupil.classList.add('pupil');
        leftEye.appendChild(leftPupil);
        jugadorDiv.appendChild(leftEye);

        const rightEye = document.createElement('div');
        rightEye.classList.add('eye', 'right1');
        const rightPupil = document.createElement('div');
        rightPupil.classList.add('pupil');
        rightEye.appendChild(rightPupil);
        jugadorDiv.appendChild(rightEye);

        // Crear la onda inferior (patas)
        const wave = document.createElement('div');
        wave.classList.add('wave');
        for (let i = 0; i < 3; i++) {
            const span = document.createElement('span');
            wave.appendChild(span);
        }
        jugadorDiv.appendChild(wave);

        // Crear el tooltip para el nombre del jugador
        let tooltip = document.createElement('div');
        tooltip.textContent = jugador.nombre;
        tooltip.classList.add('nombre-jugador');
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = jugador.color;
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.fontSize = '12px';
        tooltip.style.fontWeight = 'bold';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.zIndex = '11';
        tooltip.style.display = 'none'; // Inicialmente oculto
        tooltip.style.transition = 'opacity 0.3s'; // Transición suave
        
        // Posicionar el tooltip ENCIMA del muñeco
        tooltip.style.left = `${celdaRect.left + offsetX - 10}px`; // Centrado con el muñeco
        tooltip.style.top = `${alturaFija - 30}px`; // Encima del muñeco
        tooltip.style.textAlign = 'center';
        
        // Agregar eventos para mostrar y ocultar el tooltip
        jugadorDiv.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
            tooltip.style.opacity = '1';
        });
        
        jugadorDiv.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                if (tooltip.style.opacity === '0') {
                    tooltip.style.display = 'none';
                }
            }, 300);
        });
        
        // Agregar el muñeco y el tooltip al body
        document.body.appendChild(jugadorDiv);
        document.body.appendChild(tooltip);
        
        // Añadir un log para depuración
        console.log(`Jugador ${jugador.nombre} posicionado en: left=${jugadorDiv.style.left}, top=${jugadorDiv.style.top}`);
    });
}




// Agregar al final del script si no existe ya
window.addEventListener('resize', () => {
    // Actualizar posición de los muñecos cuando cambia el tamaño de la ventana
    mostrarMuñecos();
});




function generarTablero() {
    const tablero = document.getElementById('tablero');
    tablero.innerHTML = "";
    tablero.style.display = "grid";
    tablero.style.gridTemplateColumns = "repeat(10, 1fr)"; // 10 columnas por fila

    let contador = 100; // Comienza en 100 (parte superior izquierda)

    for (let fila = 0; fila < 10; fila++) { // 10 filas en total
        let numerosFila = [];

        for (let columna = 0; columna < 10; columna++) {
            numerosFila.push(contador);
            contador--; // Disminuye el número
        }

        // Si la fila es par (índice impar porque el índice empieza en 0), se invierte la fila
        if (fila % 2 !== 0) {
            numerosFila.reverse();
        }

        // Generar las celdas con los números en el orden correcto
        numerosFila.forEach(num => {
            let celda = document.createElement('div');
            celda.classList.add('celda');
            celda.textContent = num;
            celda.setAttribute('id', `celda-${num}`);

            // Agregar un div para representar al jugador en su posición inicial
            let jugadorEnPosicion = jugadores.find(j => j.posicion === num);
            if (jugadorEnPosicion) {
                let jugadorDiv = document.createElement('div');
                
            }

            tablero.appendChild(celda);
        });
    }

    document.getElementById("reiniciarJuego").style.display = "block";
}



// Genera un conjunto de números aleatorios dentro de un rango para posiciones en el tablero
function obtenerNumerosAleatorios(cantidad, min, max, ocupados) {
    let numeros = new Set();
    while (numeros.size < cantidad) {
        let num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (num === 100 || num === 1) continue; // Evita las posiciones 1 y 100
        if (!ocupados.has(num) && !ocupados.has(num - 1) && !ocupados.has(num + 1)) {
            numeros.add(num);
            ocupados.add(num);
        }
    }
    return [...numeros];
}



function mostrarJugadores() {
    let contenedorJugadores = document.getElementById("jugadoresSeleccionados");
    contenedorJugadores.innerHTML = "<h3>Jugadores en partida:</h3><BR></BR>";

    jugadores.forEach(jugador => {
        let jugadorDiv = document.createElement("div");
        jugadorDiv.classList.add("jugador-info");

        jugadorDiv.innerHTML = `
            <div class="ghost ${jugador.color}">
                <div class="eye left"><div class="pupil"></div></div>
                <div class="eye right"><div class="pupil"></div></div>
                <div class="wave">
                    <span></span><span></span><span></span>
                </div>
            </div>
            <span style="color: ${jugador.color}; font-weight: bold;">${jugador.nombre}</span>
        `;

        contenedorJugadores.appendChild(jugadorDiv);
    });

    contenedorJugadores.style.display = "flex";
}





// Función para reiniciar el juego recargando la página
function reiniciarJuego() {
    let confirmacion = confirm("¿Quieres reiniciar el juego?");
    if (confirmacion) {
        location.reload();
    }
}

// Función para asignar colores a las celdas (rojas y verdes) aleatoriamente
function pintarCeldas() {
    let ocupados = new Set();
    let cantidadVerdes = Math.floor(Math.random() * 8) + 1;
    let cantidadRojas = Math.floor(Math.random() * 8) + 1;

    let celdasRojas = obtenerNumerosAleatorios(cantidadRojas, 71, 99, ocupados);
    celdasRojas.forEach(num => document.getElementById(`celda-${num}`).classList.add('rojo'));

    let celdasVerdes = obtenerNumerosAleatorios(cantidadVerdes, 2, 30, ocupados);
    celdasVerdes.forEach(num => document.getElementById(`celda-${num}`).classList.add('verde'));

    let cantidadCentro = Math.floor(Math.random() * 5) + 1;
    let celdasCentro = obtenerNumerosAleatorios(cantidadCentro, 31, 70, ocupados);
    
    celdasCentro.forEach(num => {
        let color = Math.random() < 0.5 ? 'verde' : 'rojo';
        document.getElementById(`celda-${num}`).classList.add(color);
    });
}





// Seleccionar el elemento de Pac-Man
const pacman = document.querySelector('.pacman');
const pepitas = document.querySelectorAll('.dot'); // Asumiendo que 'dot' son las pepitas

// Posición inicial aleatoria de Pac-Man
let x = Math.random() * (window.innerWidth - 100);
let y = Math.random() * (window.innerHeight - 100);

// Velocidad inicial de Pac-Man
const initialSpeed = 3;
let speedX = initialSpeed;
let speedY = initialSpeed;
let eating = false;

// Función para mover a Pac-Man
function movePacman() {
    const dots = document.querySelectorAll('.dot'); // Obtener todos los puntos en la pantalla
    let closestDot = null;
    let minDistance = Infinity;

    // Buscar el punto más cercano a Pac-Man
    dots.forEach(dot => {
        const dotX = parseFloat(dot.style.left);
        const dotY = parseFloat(dot.style.top);
        const distance = Math.hypot(dotX - x, dotY - y);

        if (distance < minDistance) {
            minDistance = distance;
            closestDot = dot;
        }
    });

    // Si hay un punto cerca, ajustar la dirección de Pac-Man hacia él
    if (closestDot) {
        let dotX = parseFloat(closestDot.style.left);
        let dotY = parseFloat(closestDot.style.top);

        let directionX = dotX - x;
        let directionY = dotY - y;
        let magnitude = Math.hypot(directionX, directionY);

        let currentSpeed = minDistance < 30 ? initialSpeed * 0.5 : initialSpeed; // Reducir velocidad si está cerca
        speedX = (directionX / magnitude) * currentSpeed;
        speedY = (directionY / magnitude) * currentSpeed;

        // Si Pac-Man toca el punto, se lo "come"
        if (minDistance < 10) {
            eating = true;
            setTimeout(() => {
                closestDot.remove();
                eating = false;
                speedX = (directionX / magnitude) * initialSpeed;
                speedY = (directionY / magnitude) * initialSpeed;
                
                if (document.querySelectorAll('.dot').length === 0) {
                    explotarMuñeco();
                    return;
                }
            }, 300); // Simula la pausa de comer
        }
    }

    // Actualizar posición de Pac-Man
    x += speedX;
    y += speedY;

    // Definir los límites de la pantalla
    const maxX = window.innerWidth - 50;
    const maxY = window.innerHeight - 50;

    // Verificar si Pac-Man toca los bordes y hacer que rebote
    if (x <= 0 || x >= maxX) speedX *= -1;
    if (y <= 0 || y >= maxY) speedY *= -1;

    // Aplicar transformaciones CSS para mover y reflejar a Pac-Man
    pacman.style.left = `${x}px`;
    pacman.style.top = `${y}px`;
    pacman.style.transform = `scaleX(${speedX > 0 ? 1 : -1})`;
    pacman.style.transition = eating ? 'transform 0.3s ease' : 'none'; // Simular pausa al comer

    // Llamar a la función en el siguiente frame
    requestAnimationFrame(movePacman);
}

// Función para generar puntos aleatorios en la pantalla
function generateDots() {
    const numDots = Math.floor(Math.random() * 10) + 5; // Entre 5 y 15 puntos
    for (let i = 0; i < numDots; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        dot.style.left = Math.random() * (window.innerWidth - 40) + "px";
        dot.style.top = Math.random() * (window.innerHeight - 40) + "px";
        document.body.appendChild(dot);
    }
}

// Función que maneja la explosión de Pac-Man y la reaparición de pepitas
function explotarMuñeco() {
    pacman.style.animation = 'explode 0.8s forwards';
    setTimeout(() => {
        pacman.style.display = "none";
        document.querySelectorAll('.dot').forEach(pepita => pepita.style.display = "none");
        
        setTimeout(() => {
            document.querySelectorAll('.dot').forEach(pepita => pepita.style.display = "block");

            setTimeout(() => {
                pacman.style.display = "block";
                pacman.style.animation = ""; // Reiniciar animación para futuras explosiones
                generateDots(); // Generar nuevas pepitas al reaparecer Pac-Man
            }, 3000); // Pac-Man aparece después de 3 segundos de las pepitas
        }, 15000); // Espera 15 segundos antes de que reaparezcan las pepitas
    }, 800); // Tiempo de explosión antes de desaparecer
}

// Ajustar la posición de Pac-Man si la ventana cambia de tamaño
window.addEventListener("resize", () => {
    if (x > window.innerWidth - 50) x = window.innerWidth - 50;
    if (y > window.innerHeight - 50) y = window.innerHeight - 50;
});



// Generar puntos al iniciar el juego
generateDots();

// Iniciar la animación de Pac-Man
movePacman();
