document.addEventListener("DOMContentLoaded", () => {

    // VARIABLES

    /**
     * API Key de Pexels.
     * Se utiliza para autorizar las peticiones a la API.
     *
     * @type {string}
     */
    const API_key = "c0Ll7l3wIZ7G6XESjHQFXUDADVSVvM9DX96AGefWhyHUCBHJ3oc5Z7RR";

    /**
     * Texto actual que se usa para buscar imágenes.
     *
     * @type {string}
     */
    let busquedaActual = "";

    /**
     * Orientación actual de las imágenes.
     * Puede ser "landscape", "portrait" o "" para todas.
     *
     * @type {string}
     */
    let orientacionActual = "landscape";

    /**
     * Página actual de resultados.
     *
     * @type {number}
     */
    let paginaActual = 1;

    /**
     * Array donde se guardan las imágenes favoritas.
     *
     * @type {Array<Object>}
     */
    let favoritos = [];

    /**
     * Array con las fotos que se están mostrando actualmente en pantalla.
     * Sirve para encontrar una foto por su id al añadirla a favoritos.
     *
     * @type {Array<Object>}
     */
    let fotosActuales = [];

    /**
     * Controla si la sección de favoritos está visible o no.
     *
     * @type {boolean}
     */
    let favoritosVisibles = false;

    /**
     * Categorías iniciales que se mostrarán como botones.
     *
     * @type {Array<string>}
     */
    const categorias = ["Nature", "anime", "gods"];

    /**
     * Input donde el usuario escribe la búsqueda.
     *
     * @type {HTMLInputElement}
     */
    const buscadorImagenes = document.querySelector("#buscadorImagenes input");

    /**
     * Selector de orientación de las imágenes.
     *
     * @type {HTMLSelectElement}
     */
    const seleccionarOrientacion = document.querySelector("#selectorOrientacion");

    /**
     * Contenedor donde se muestran las imágenes de la galería.
     *
     * @type {HTMLElement}
     */
    const contenedorImagenes = document.querySelector("#contenedorImagenes");

    /**
     * Elemento donde se muestra el número de página actual.
     *
     * @type {HTMLElement}
     */
    const contadorPagina = document.querySelector("#paginaActual");

    /**
     * Contenedor donde se muestran las imágenes favoritas.
     *
     * @type {HTMLElement}
     */
    const seccionFavoritos = document.querySelector("#contenedorFavoritos");

    /**
     * Contenedor donde se pintan los botones de categorías.
     *
     * @type {HTMLElement}
     */
    const contenedorCategorias = document.querySelector("#btnCategorias");

    /**
     * Botón para mostrar u ocultar favoritos.
     *
     * @type {HTMLButtonElement}
     */
    const botonFavoritos = document.querySelector("#botonFavoritos");

    /**
     * Botón para retroceder una página.
     *
     * @type {HTMLButtonElement}
     */
    const botonRetroceder = document.querySelector("#back");

    /**
     * Botón para avanzar una página.
     *
     * @type {HTMLButtonElement}
     */
    const botonAvanzar = document.querySelector("#forward");

    // EVENTOS

    /**
     * Evento delegado para controlar todos los clicks de la aplicación.
     *
     * Detecta clicks en:
     * - botones de categoría
     * - botones de favorito
     * - botones de eliminar favorito
     * - botón buscar
     * - botón ver favoritos
     * - botón siguiente
     * - botón anterior
     */
    document.body.addEventListener("click", (event) => {
        manejarClicks(event);
    });

    /**
     * Evento delegado para controlar cambios en elementos de formulario.
     *
     * Actualmente controla el cambio del selector de orientación.
     */
    document.body.addEventListener("change", (event) => {
        manejarCambios(event);
    });

    // FUNCIONES

    /**
     * Carga los favoritos guardados en localStorage.
     * Si no hay favoritos guardados, deja el array vacío.
     *
     * @returns {void}
     */
    const cargarFavoritos = () => {
        favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    };

    /**
     * Guarda el array de favoritos en localStorage.
     *
     * @returns {void}
     */
    const guardarFavoritos = () => {
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
    };

    /**
     * Crea la URL para buscar imágenes en la API de Pexels.
     *
     * @param {string} busqueda Texto que se quiere buscar.
     * @param {string} orientacion Orientación de la imagen.
     * @param {number} pagina Página de resultados.
     * @returns {string} URL completa para hacer la petición.
     */
    const crearUrlBusqueda = (busqueda, orientacion, pagina) => {
        return `https://api.pexels.com/v1/search?query=${busqueda}&orientation=${orientacion}&per_page=6&page=${pagina}`;
    };

    /**
     * Obtiene una imagen de Pexels para representar una categoría.
     *
     * @param {string} categoria Categoría que se quiere buscar.
     * @returns {Promise<Object|null>} Devuelve la primera foto encontrada o null si falla.
     */
    const obtenerImagenCategoria = async (categoria) => {
        const url = `https://api.pexels.com/v1/search?query=${categoria}&per_page=1`;

        try {
            const respuesta = await fetch(url, {
                headers: {
                    Authorization: API_key,
                },
            });

            if (!respuesta.ok) {
                throw new Error("Error al cargar la categoría.");
            }

            const data = await respuesta.json();

            return data.photos[0] || null;

        } catch (error) {
            console.log(error);
            return null;
        }
    };

    /**
     * Crea un botón de categoría con una imagen y un texto.
     *
     * @param {string} categoria Nombre de la categoría.
     * @param {Object} foto Foto recibida desde Pexels.
     * @returns {HTMLButtonElement} Botón de categoría creado.
     */
    const crearBotonCategoria = (categoria, foto) => {
        const boton = document.createElement("button");
        boton.classList.add("boton-categoria");
        boton.dataset.categoria = categoria;

        const imagen = document.createElement("img");
        imagen.src = foto.src.medium;
        imagen.alt = categoria;

        const texto = document.createElement("span");
        texto.textContent = categoria;

        boton.append(imagen, texto);

        return boton;
    };

    /**
     * Pinta los botones de categorías en el contenedor de categorías.
     *
     * @param {Array<string>} listaCategorias Lista de categorías que se quieren mostrar.
     * @returns {Promise<void>}
     */
    const pintarCategorias = async (listaCategorias) => {
        contenedorCategorias.innerHTML = "";

        const fragment = document.createDocumentFragment();

        for (const categoria of listaCategorias) {
            const foto = await obtenerImagenCategoria(categoria);

            if (foto) {
                const boton = crearBotonCategoria(categoria, foto);
                fragment.append(boton);
            }
        }

        contenedorCategorias.append(fragment);
    };

    /**
     * Crea una tarjeta HTML para una imagen de la galería.
     *
     * @param {Object} foto Foto recibida desde Pexels.
     * @returns {HTMLDivElement} Tarjeta de imagen creada.
     */
    const crearTarjetaImagen = (foto) => {
        const tarjeta = document.createElement("div");

        const imagen = document.createElement("img");
        imagen.src = foto.src.medium;
        imagen.alt = foto.alt || "Imagen de Pexels";

        const autor = document.createElement("p");
        autor.textContent = foto.photographer;

        const botonFavorito = document.createElement("button");
        botonFavorito.textContent = "Favorito";
        botonFavorito.classList.add("boton-favorito");
        botonFavorito.dataset.id = foto.id;

        tarjeta.append(imagen, autor, botonFavorito);

        return tarjeta;
    };

    /**
     * Muestra las imágenes recibidas en la galería.
     * También actualiza el array de fotos actuales.
     *
     * @param {Array<Object>} fotos Array de fotos recibidas desde Pexels.
     * @returns {void}
     */
    const mostrarGaleria = (fotos) => {
        contenedorImagenes.innerHTML = "";
        fotosActuales = fotos;

        contenedorImagenes.className = orientacionActual;

        favoritosVisibles = false;
        botonFavoritos.textContent = "Ver favoritos";
        seccionFavoritos.innerHTML = "";

        if (fotos.length === 0) {
            contenedorImagenes.innerHTML = "<p>No se encontraron imágenes.</p>";
            return;
        }

        const fragment = document.createDocumentFragment();

        fotos.forEach((foto) => {
            const tarjeta = crearTarjetaImagen(foto);
            fragment.append(tarjeta);
        });

        contenedorImagenes.append(fragment);
    };

    /**
     * Actualiza el contador de página y activa o desactiva los botones de paginación.
     *
     * @param {Object} data Datos completos recibidos desde la API de Pexels.
     * @returns {void}
     */
    const actualizarPaginacion = (data) => {
        contadorPagina.textContent = paginaActual;

        botonRetroceder.disabled = paginaActual === 1;
        botonAvanzar.disabled = !data.next_page;
    };

    /**
     * Busca imágenes en la API de Pexels usando la búsqueda actual,
     * la orientación actual y la página actual.
     *
     * @returns {Promise<void>}
     */
    const buscarImagenes = async () => {
        if (busquedaActual === "") {
            alert("Primero busca algo o elige una categoría.");
            return;
        }

        const url = crearUrlBusqueda(
            busquedaActual,
            orientacionActual,
            paginaActual
        );

        try {
            const respuesta = await fetch(url, {
                headers: {
                    Authorization: API_key,
                },
            });

            if (!respuesta.ok) {
                throw new Error("Error al buscar imágenes.");
            }

            const data = await respuesta.json();

            mostrarGaleria(data.photos);
            actualizarPaginacion(data);

        } catch (error) {
            console.log(error);
            alert("Ha ocurrido un error al buscar imágenes.");
        }
    };

    /**
     * Obtiene el texto escrito por el usuario en el input,
     * lo valida y realiza una búsqueda si es correcto.
     *
     * @returns {void}
     */
    const buscarDesdeInput = () => {
        const textoIngresado = buscadorImagenes.value.trim();
        const regex = /^[a-zA-Z0-9\sñÑüÜáéíóúÁÉÍÓÚ]+$/;

        if (textoIngresado !== "" && regex.test(textoIngresado)) {
            busquedaActual = textoIngresado;
            paginaActual = 1;

            buscarImagenes();
        } else {
            alert("Por favor, ingresa un término de búsqueda válido.");
        }
    };

    /**
     * Realiza una búsqueda usando una categoría seleccionada.
     *
     * @param {string} categoria Categoría seleccionada por el usuario.
     * @returns {void}
     */
    const buscarPorCategoria = (categoria) => {
        busquedaActual = categoria;
        paginaActual = 1;

        buscarImagenes();
    };

    /**
     * Cambia la orientación actual de las imágenes y vuelve a buscar.
     *
     * @returns {void}
     */
    const cambiarOrientacion = () => {
        orientacionActual = seleccionarOrientacion.value;
        paginaActual = 1;

        buscarImagenes();
    };

    /**
     * Cambia la página actual de resultados.
     *
     * @param {number} movimiento Número que indica si se avanza o retrocede.
     * Usa 1 para avanzar y -1 para retroceder.
     * @returns {void}
     */
    const cambiarPagina = (movimiento) => {
        const nuevaPagina = paginaActual + movimiento;

        if (nuevaPagina < 1) return;

        paginaActual = nuevaPagina;

        buscarImagenes();
    };

    /**
     * Añade una imagen a favoritos si no está repetida.
     *
     * @param {number} idFoto ID de la foto que se quiere añadir.
     * @returns {void}
     */
    const agregarFavorito = (idFoto) => {
        const fotoEncontrada = fotosActuales.find((foto) => foto.id === idFoto);

        if (!fotoEncontrada) return;

        const existe = favoritos.some((foto) => foto.id === idFoto);

        if (existe) {
            alert("Imagen repetida. Revisa tu lista.");
            return;
        }

        favoritos.push(fotoEncontrada);
        guardarFavoritos();

        alert("Añadido a favoritos.");
    };

    /**
     * Crea una tarjeta HTML para una imagen favorita.
     *
     * @param {Object} foto Foto favorita.
     * @returns {HTMLDivElement} Tarjeta de favorito creada.
     */
    const crearTarjetaFavorito = (foto) => {
        const tarjeta = document.createElement("div");

        const imagen = document.createElement("img");
        imagen.src = foto.src.medium;
        imagen.alt = foto.alt || "Imagen favorita";

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar favorito";
        botonEliminar.classList.add("boton-eliminar");
        botonEliminar.dataset.id = foto.id;

        tarjeta.append(imagen, botonEliminar);

        return tarjeta;
    };

    /**
     * Muestra todas las imágenes favoritas guardadas.
     *
     * @returns {void}
     */
    const mostrarFavoritos = () => {
        cargarFavoritos();

        seccionFavoritos.innerHTML = "";

        const titulo = document.createElement("h2");
        titulo.textContent = "Tus fotos favoritas";
        seccionFavoritos.append(titulo);

        if (favoritos.length === 0) {
            const mensaje = document.createElement("p");
            mensaje.textContent = "No hay favoritos.";
            seccionFavoritos.append(mensaje);
            return;
        }

        const fragment = document.createDocumentFragment();

        favoritos.forEach((foto) => {
            const tarjeta = crearTarjetaFavorito(foto);
            fragment.append(tarjeta);
        });

        seccionFavoritos.append(fragment);
    };

    /**
     * Oculta la sección de favoritos limpiando su contenido.
     *
     * @returns {void}
     */
    const ocultarFavoritos = () => {
        seccionFavoritos.innerHTML = "";
    };

    /**
     * Alterna entre mostrar y ocultar la sección de favoritos.
     *
     * @returns {void}
     */
    const alternarFavoritos = () => {
        favoritosVisibles = !favoritosVisibles;

        if (favoritosVisibles) {
            mostrarFavoritos();
            botonFavoritos.textContent = "Ocultar favoritos";
        } else {
            ocultarFavoritos();
            botonFavoritos.textContent = "Ver favoritos";
        }
    };

    /**
     * Elimina una imagen de favoritos según su ID.
     * Después guarda los cambios y vuelve a pintar la sección de favoritos.
     *
     * @param {number} idFoto ID de la foto que se quiere eliminar.
     * @returns {void}
     */
    const eliminarFavorito = (idFoto) => {
        favoritos = favoritos.filter((foto) => foto.id !== idFoto);

        guardarFavoritos();
        mostrarFavoritos();
    };

    /**
     * Maneja todos los clicks principales de la aplicación usando delegación de eventos.
     *
     * @param {MouseEvent} event Evento de click.
     * @returns {void}
     */
    const manejarClicks = (event) => {
        const botonCategoria = event.target.closest(".boton-categoria");
        const botonFavorito = event.target.closest(".boton-favorito");
        const botonEliminar = event.target.closest(".boton-eliminar");
        const botonBuscar = event.target.closest("#buscadorImagenes button");
        const botonVerFavoritos = event.target.closest("#botonFavoritos");
        const botonSiguiente = event.target.closest("#forward");
        const botonAnterior = event.target.closest("#back");

        if (botonCategoria) {
            buscarPorCategoria(botonCategoria.dataset.categoria);
            return;
        }

        if (botonFavorito) {
            const idFoto = Number(botonFavorito.dataset.id);
            agregarFavorito(idFoto);
            return;
        }

        if (botonEliminar) {
            const idFoto = Number(botonEliminar.dataset.id);
            eliminarFavorito(idFoto);
            return;
        }

        if (botonBuscar) {
            event.preventDefault();
            buscarDesdeInput();
            return;
        }

        if (botonVerFavoritos) {
            alternarFavoritos();
            return;
        }

        if (botonSiguiente) {
            cambiarPagina(1);
            return;
        }

        if (botonAnterior) {
            cambiarPagina(-1);
            return;
        }
    };

    /**
     * Maneja los cambios en elementos de formulario usando delegación de eventos.
     *
     * Actualmente detecta el cambio del selector de orientación.
     *
     * @param {Event} event Evento change.
     * @returns {void}
     */
    const manejarCambios = (event) => {
        const selector = event.target.closest("#selectorOrientacion");

        if (selector) {
            cambiarOrientacion();
        }
    };

    /**
     * Inicia la aplicación.
     * Carga favoritos, pinta las categorías y configura la paginación inicial.
     *
     * @returns {void}
     */
    const iniciarApp = () => {
        cargarFavoritos();
        pintarCategorias(categorias);

        contadorPagina.textContent = paginaActual;
        botonRetroceder.disabled = true;
        botonAvanzar.disabled = true;
    };

    iniciarApp();
});