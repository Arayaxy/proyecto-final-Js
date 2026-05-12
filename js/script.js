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
 * Puede ser "Landscape", "Portrait" o "Square", según la API de Pexels.
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
 * Array donde se guardan las imágenes favoritas del usuario.
 *
 * @type {Array<Object>}
 */
let favoritos = [];

/**
 * Fotos que se están mostrando actualmente en pantalla.
 * Sirve para poder buscar una foto por su id al añadirla a favoritos.
 *
 * @type {Array<Object>}
 */
let fotosActuales = [];



/**
 * Input donde el usuario escribe la búsqueda.
 *
 * @type {HTMLInputElement}
 */
const buscadorImagenes = document.querySelector("#buscadorImagenes input");

/**
 * Botón para realizar la búsqueda.
 *
 * @type {HTMLButtonElement}
 */
const botonBuscadorImagenes = document.querySelector("#buscadorImagenes button");

/**
 * Selector de orientación de imágenes.
 *
 * @type {HTMLSelectElement}
 */
const seleccionarOrientacion = document.querySelector("#selectorOrientacion");

/**
 * Contenedor donde se muestran las imágenes buscadas.
 *
 * @type {HTMLElement}
 */
const contenedorImagenes = document.querySelector("#contenedorImagenes");

/**
 * Botón para retroceder de página.
 *
 * @type {HTMLButtonElement}
 */
const botonRetroceder = document.querySelector("#back");

/**
 * Botón para avanzar de página.
 *
 * @type {HTMLButtonElement}
 */
const botonAvanzar = document.querySelector("#forward");

/**
 * Elemento donde se muestra el número de página actual.
 *
 * @type {HTMLElement}
 */
const contadorPagina = document.querySelector("#paginaActual");

/**
 * Botón para ver la sección de favoritos.
 *
 * @type {HTMLButtonElement}
 */
const verFavoritos = document.querySelector("#botonFavoritos");

/**
 * Contenedor donde se muestran las imágenes favoritas.
 *
 * @type {HTMLElement}
 */
const seccionFavoritos = document.querySelector("#contenedorFavoritos");

/**
 * Elemento donde se muestra un mensaje de error.
 *
 * @type {HTMLElement}
 */
const mensajeError = document.querySelector("#mensajeError");

/**
 * Contenedor donde se pintan los botones de categorías.
 *
 * @type {HTMLElement}
 */
const contenedorCategorias = document.querySelector("#btnCategorias");

/**
 * Categorías que se mostrarán como botones en la página.
 *
 * @type {Array<string>}
 */
const categorias = ["Nature", "anime", "gods"];

const fragment = document.createDocumentFragment()


/**
 * Evento que se ejecuta cuando el DOM ha cargado completamente.
 * Carga los favoritos guardados y crea los botones de categorías.
 */
document.addEventListener("DOMContentLoaded", () => {
    cargarFavoritos();
    categoriaBtn();

});

/**
 * Evento delegado para detectar clics en los botones de categoría.
 * Guarda la categoría seleccionada como búsqueda actual y busca imágenes.
 *
 * @param {MouseEvent} e Evento de clic.
 */
contenedorCategorias.addEventListener("click", (e) => {
    const boton = e.target.closest(".boton-categoria");

    if (!boton) return;

    busquedaActual = boton.dataset.categoria;
    paginaActual = 1;

    buscarImagenes();
});



/**
 * Evento que se ejecuta cuando el usuario pulsa el botón de buscar.
 * Valida el texto introducido y realiza la búsqueda si es correcto.
 *
 * @param {MouseEvent} event Evento de clic.
 */
botonBuscadorImagenes.addEventListener("click", (event) => {
    event.preventDefault();

    const textoIngresado = buscadorImagenes.value.trim();
    const regex = /^[a-zA-Z0-9\sñÑüÜáéíóúÁÉÍÓÚ]+$/;

    if (textoIngresado !== "" && regex.test(textoIngresado)) {
        busquedaActual = textoIngresado;
        paginaActual = 1;
        buscarImagenes();
    } else {
        alert("Por favor, ingresa un término de búsqueda válido.");
    }
});

//cuando clicas el boton abre favoritos
verFavoritos.addEventListener("click", () => {
    mostrarFavoritos();
});


/**
 * Evento delegado para detectar clics en los botones de favorito
 * dentro de la galería de imágenes.
 *
 * @param {MouseEvent} event Evento de clic.
 */
contenedorImagenes.addEventListener("click", (event) => {
    const boton = event.target.closest(".boton-favorito");

    if (!boton) return;

    const idFoto = Number(boton.dataset.id);
    const fotoEncontrada = fotosActuales.find((foto) => foto.id === idFoto);

    agregarFavorito(fotoEncontrada);
});

//evento para eliminar una imagen de favoritos //
seccionFavoritos.addEventListener("click", (event) => {
    const boton = event.target
    
    //eliminar del localstorage
    eliminarFavorito(boton.id);
    //validar si hay favoritos
    if (favoritos.length === 0) {
        seccionFavoritos.innerHTML = `<p>no hay favoritos</p>`;
    }
});

//evento para avanzar entre páginas de la sección de fotos//
botonAvanzar.addEventListener("click", () => {
    paginaActual++;
    buscarImagenes();
    
})

//evento para retroceder entre páginas de la sección de fotos//
botonRetroceder.addEventListener("click", () => {
    if (paginaActual > 1) {
        paginaActual--;
        buscarImagenes();
        contadorPagina.textContent = paginaActual;
    }
})


//orientacion

////////////// Funciones //////////////////////

/**
 * Crea los botones de categorías dinámicamente.
 * Por cada categoría obtiene una imagen de Pexels y crea un botón con imagen y texto.
 *
 * @returns {void}
 */
const categoriaBtn = () => {
    contenedorCategorias.innerHTML = "";

    categorias.forEach((nombre) => {
        obtenerImagenCategoria(nombre).then((foto) => {
            const btn = document.createElement("button");
            btn.classList.add("boton-categoria");

            btn.dataset.categoria = nombre;

            const imagenBoton = document.createElement("img");
            imagenBoton.src = foto.src.medium;
            imagenBoton.alt = nombre;

            const texto = document.createElement("span");
            texto.textContent = nombre;

            btn.append(imagenBoton);
            btn.append(texto);

            contenedorCategorias.append(btn);
        });
    });
};

/**
 * Obtiene una imagen de la API de Pexels según una categoría.
 *
 * @param {string} categoria Categoría que se quiere buscar.
 * @returns {Promise<Object>} Promesa que devuelve la primera foto encontrada.
 */
const obtenerImagenCategoria = (categoria) => {
    const url = `https://api.pexels.com/v1/search?query=${categoria}&per_page=1`;

    return fetch(url, {
        headers: {
            Authorization: API_key,
        }
    })
        .then(res => res.json())
        .then(data => data.photos[0]);
            contadorPagina.textContent = paginaActual;
            botonRetroceder.disabled = !data.prev_page;
            botonAvanzar.disabled    = !data.next_page;
};

/**
 * Busca imágenes en la API de Pexels usando la búsqueda actual,
 * la orientación actual y la página actual.
 *
 * @returns {void}
 */
const buscarImagenes = () => {
    contadorPagina.textContent = paginaActual;
    const url = `https://api.pexels.com/v1/search?query=${busquedaActual}&orientation=${orientacionActual}&per_page=6&page=${paginaActual}`;

    fetch(url, {
        headers: {
            Authorization: API_key,
        }
    })
        .then((res) => {
            return res.ok
                ? res.json()
                : Promise.reject(res);
        })
        .then((data) => {
            console.log(data);
            mostrarGaleria(data.photos);
            console.log(data.photos);
        })
        .catch((error) => {
            console.log(error.status, error.statusText);
        });
};
const orientacion = () => {
    orientacionActual = seleccionarOrientacion.value;
    
    buscarImagenes()
    
    paginaActual = 1
    

}
seleccionarOrientacion.addEventListener("change",() =>{
    orientacion()
})
/**
 * Muestra las fotos recibidas en el contenedor de la galería.
 * También actualiza el array de fotos actuales.
 *
 * @param {Array<Object>} fotos Array de fotos recibidas desde Pexels.
 * @returns {void}
 */
const mostrarGaleria = (fotos) => {
    contenedorImagenes.innerHTML = "";
    fotosActuales = fotos;

    fotos.forEach((foto) => {
        const tarjetaFoto = document.createElement("div");

        const imagen = document.createElement("img");
        imagen.src = foto.src.medium;
        imagen.alt = foto.alt;

        const autor = document.createElement("p");
        autor.textContent = foto.photographer;

        const nuevoFavorito = document.createElement("button");
        nuevoFavorito.textContent = "Favorito";
        nuevoFavorito.classList.add("boton-favorito");
        nuevoFavorito.dataset.id = foto.id;

        tarjetaFoto.append(imagen);
        tarjetaFoto.append(autor);
        tarjetaFoto.append(nuevoFavorito);

        contenedorImagenes.append(tarjetaFoto);
    });
};

/**
 * Añade una foto al array de favoritos si no está repetida.
 * Después guarda los favoritos en localStorage.
 *
 * @param {Object} foto Foto que se quiere añadir a favoritos.
 * @param {number} foto.id Identificador único de la foto.
 * @returns {void}
 */
const agregarFavorito = (foto) => {
    const existe = favoritos.some((favorito) => favorito.id === foto.id);

    if (!existe) {
        favoritos.push(foto);
        guardarFavoritos();
        alert("Añadido a favoritos");
    } else {
        alert("Imagen repetida revisa tu lista");
    }
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
 * Carga los favoritos guardados en localStorage.
 * Si no hay favoritos guardados, deja el array vacío.
 *
 * @returns {void}
 */
const cargarFavoritos = () => {
    favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    
};

/**
 * Muestra las imágenes favoritas en su contenedor.
 *
 * @returns {void}
 */
const mostrarFavoritos = () => {
    seccionFavoritos.innerHTML = " ";
    cargarFavoritos()
    favoritos.forEach((foto) => {
        const tarjetaFavorito = document.createElement("div");

        const imagenFavorito = document.createElement("img");
        imagenFavorito.src = foto.src.medium;
        imagenFavorito.alt = foto.alt;

        const textoFavoritos = document.createElement("H2");
        textoFavoritos.textContent = "Tus fotos favoritas"



        const botonEliminarFavorito = document.createElement("button");
        botonEliminarFavorito.textContent = "Eliminar Favorito";
        botonEliminarFavorito.classList.add("boton-eliminar");
        botonEliminarFavorito.id = foto.id;

        seccionFavoritos.append(textoFavoritos);
        tarjetaFavorito.append(imagenFavorito);
        tarjetaFavorito.append(botonEliminarFavorito);

        fragment.append(tarjetaFavorito)

    });
    seccionFavoritos.append(fragment);

};

/**
 * Elimina una imagen del array de favoritos según su id.
 * Después guarda el nuevo array en localStorage y vuelve a pintar favoritos.
 *
 * @param {number} id Id de la imagen que se quiere eliminar.
 * @returns {void}
 */
const eliminarFavorito = (id) => {
    
    favoritos = favoritos.filter((favorito) => favorito.id != id);

    guardarFavoritos();

    mostrarFavoritos();
};
