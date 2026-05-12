



/**
 * Clave de la API de Pexels
 *
 * @type {String}
 */
const API_key = "c0Ll7l3wIZ7G6XESjHQFXUDADVSVvM9DX96AGefWhyHUCBHJ3oc5Z7RR";
// Crear variable busqueda actual

/**
 * texto que se utiliza para buscar
 *
 * @type {string}
 */
let busquedaActual = ""
// crear variable orientacion actual 
let orientacionActual = "Landscape"
// crear variable pagina actual =1
let paginaActual = 1

// crear variable favoritos

let favoritos = []
//fotos que muestro en pantalla
let fotosActuales = []
// captar elementos DOM

//  seleccionar elementos del HTML
//     input de busqueda
const buscadorImagenes = document.querySelector("#buscadorImagenes input")
//     boton buscar
const botonBuscadorImagenes = document.querySelector("#buscadorImagenes button")
//     seleccionar orientacion
const seleccionarOrientacion = document.querySelector("#selectorOrientacion")
//     contenedor de galeria
const contenedorImagenes = document.querySelector("#contenedorImagenes")
//     boton anterior
const botonRetroceder = document.querySelector("#back")
//     boton siguiente
const botonAvanzar = document.querySelector("#forward")
//     texto de la pagina actual
const contadorPagina = document.querySelector("#paginaActual")
//     boton de ver favoritos 
const verFavoritos = document.querySelector("#botonFavoritos")
//     contenedor de favoritos
const seccionFavoritos = document.querySelector("#contenedorFavoritos")
//     mensaje de error
const mensajeError = document.querySelector("#mensajeError")
// div categoria
const contenedorCategorias = document.querySelector("#btnCategorias")
//     botones categorías

//constante categorias para pintar los botones
const categorias = ["Nature", "anime", "gods"]

// Eventos 
// Cuando carge la pagina:
//     cargarFavoritos()
//     buscarImagenes()
//     cargar etiquetas categorias con imagen
document.addEventListener("DOMContentLoaded", () => {
    cargarFavoritos()
    categoriaBtn();

});

contenedorCategorias.addEventListener("click", (e) => {

    const boton = e.target.closest(".boton-categoria");

    if (!boton) return;

    busquedaActual = boton.dataset.categoria;

    paginaActual = 1;

    buscarImagenes();
});

//     guardar categoria en busqueda Actual
//     poner paginaActual = 1
//     llamar buscarImagenes()


// Cuando el usuario haga clic en el boton buscar:
botonBuscadorImagenes.addEventListener("click", (event) => {
    event.preventDefault();
    //     leer texto del input 
    //     validar el texto 
    const textoIngresado = buscadorImagenes.value.trim();
    const regex = /^[a-zA-Z0-9\sñÑüÜáéíóúÁÉÍÓÚ]+$/;
    //     si el texto es correcto: 
    if (textoIngresado !== "" && regex.test(textoIngresado)) {
        //         guardar texto en busquedaActual 
        busquedaActual = textoIngresado;
        //         poner paginaActual = 1
        paginaActual = 1;
        //         llamar buscarImagenes()
        buscarImagenes();
    } else {
        //     si el texto es incorrecto: mostrar mensaje de error
        alert("Por favor, ingresa un término de búsqueda válido.");
    }
})


// Cuando el usuuario cambie el filtiro de orientacion :

// seleccionarOrientacion.addEventListener("change",(event)=>{
// //     guardar orientacion elegida
//         orientacionActual = event.target.value;
// //     poner paginaActual = 1
//         paginaActual = 1;
// //     llamar buscarImagenes()
//         buscarImagenes();
// })


// Cuando el usuario haga clic en boton siguiente:

//     aumentar paginaActual en 1

//     llamar buscarImagenes() 

// Cuando el usuario haga clic en el boton ataras:

//     si paginaActual > 1:
//         disminuir paginaActual en 1

//         llamar buscarImagenes()
// añadir favoritos 
contenedorImagenes.addEventListener("click", (event) => {
    const boton = event.target.closest(".boton-favorito")
    if (!boton) return;
    const idFoto = Number(boton.dataset.id)
    const fotoEncontrada = fotosActuales.find((foto) => foto.id === idFoto)

    agregarFavorito(fotoEncontrada)
})
// cuando el usuario haga click en favoritos:

//     llamar mostrarFavoritos()



////////////// Funciones //////////////////////
const categoriaBtn = () => {
    contenedorCategorias.innerHTML = "";

    categorias.forEach((nombre) => {

        obtenerImagenCategoria(nombre).then((foto) => {

            const btn = document.createElement("button");
            btn.classList.add("boton-categoria");

            // guardar categoria en el botón
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
const obtenerImagenCategoria = (categoria) => {
    const url = `https://api.pexels.com/v1/search?query=${categoria}&per_page=1`;

    return fetch(url, {
        headers: {
            Authorization: API_key,
        }
    })
        .then(res => res.json())
        .then(data => data.photos[0]);
};

const buscarImagenes = () => {

    // crear URL de pexels usando:
    //     busquedaActual
    //     orientacionActual
    //     paginaActual
    const url = `https://api.pexels.com/v1/search?query=${busquedaActual}&orientation=${orientacionActual}&per_page=6&page=${paginaActual}`
    // devolver url

    // hacer fetch a la api 

    fetch(url, {
        headers: {
            Authorization: API_key,
        }

    })
        .then((res) => {
            return res.ok
                ? res.json()
                : Promise.reject(res);
            // convertir respuesta a json
        })
        .then((data) => {
            console.log(data);
            mostrarGaleria(data.photos)
            console.log(data.photos);
        })
        .catch((error) => {
            console.log(error.status, error.statusText);
        })
    // recibir datos

}

const mostrarGaleria = (fotos) => {
    // limpiar galeria 
    contenedorImagenes.innerHTML = "";
    fotosActuales = fotos;
    fotos.forEach((foto) => {
        // por cada foto:
        const tarjetaFoto = document.createElement("div")
        // mostrar imagen
        const imagen = document.createElement("img")
        imagen.src = foto.src.medium;
        imagen.alt = foto.alt;

        // mostrar fotografo
        const autor = document.createElement("p")
        autor.textContent = foto.photographer;
        // crear boton favoritos
        const nuevoFavorito = document.createElement("button")
        nuevoFavorito.textContent = "Favorito"
        nuevoFavorito.classList.add("boton-favorito")
        nuevoFavorito.dataset.id = foto.id
        // cuando se pulse favoritos
        // agregarFavorito()
        tarjetaFoto.append(imagen)
        tarjetaFoto.append(autor)
        tarjetaFoto.append(nuevoFavorito)

        // añadir tarjeta a galeria
        contenedorImagenes.append(tarjetaFoto)
    })
}

const agregarFavorito = (foto) => {
    // comprobar si ya exite en favoritos
    const existe = favoritos.some((favorito) => favorito.id === foto.id)
    // si No existe:
    //     añadir el array a favoritos
    if (!existe) {
        favoritos.push(foto)
        guardarFavoritos()
        alert("Añadido a favoritos")
    } else {
        alert("Imagen repetida revisa tu lista")
    }

}

const guardarFavoritos = () => {

    // convertir favoritos a JASON
    localStorage.setItem("favoritos", JSON.stringify(favoritos))
    // guardar en localStorage
}

const cargarFavoritos = () => {
    favoritos = JSON.parse(localStorage.getItem('favoritos')) || []

console.log(favoritos);
}

const mostrarFavoritos = () => {
    // limpiar contenedor de favoritos
    seccionFavoritos.innerHTML = "";
    //crear un fragmento
    const fragmentoGaleria = document.createDocumentFragment();
    // por cada favorito:
    listaFavoritos.forEach(favorito => {
    //     crear tarjeta
    const tarjetaFavorito = document.createElement("div")
    //     mostrar imagen
    const imagenFavorito = document.createElement("img")
    imagenFavorito.src = foto.src.medium;
    imagenFavorito.alt = foto.alt;
    //     crear boton eliminar
    const botonEliminarFavorito = document.createElement("button")
    botonEliminarFavorito.textContent = "Eliminar Favorito"
    botonEliminarFavorito.classList.add("eliminar-fav")
    botonEliminarFavorito.dataset.id = foto.id
    //     cuando se pulse eliminar
    //         llamar eliminarFavorito()
    tarjetaFavorito.append(imagenFavorito);
    tarjetaFavorito.append(botonEliminarFavorito)
    
    }
)}

const eliminarFavorito = (id) => {

    // eliminar favorito 
    favoritos = favoritos.filter((favorito) => favorito.id !== id)
    guardarFavoritos()

    mostrarFavoritos()
}
