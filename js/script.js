
// Crear variable APi_key
const API_key = "c0Ll7l3wIZ7G6XESjHQFXUDADVSVvM9DX96AGefWhyHUCBHJ3oc5Z7RR";
// Crear variable busqueda actual
let busquedaActual = ""
// crear variable orientacion actual 
let orientacionActual = "Landscape"
// crear variable pagina actual =1
let paginaActual = 1
// crear variable favoritos
let favoritos = []

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
    categoriaBtn();
    buscarImagenes()
    cargarFavoritos()
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
botonBuscadorImagenes.addEventListener("click",(event)=>{
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
})

//     leer texto del input 
//     validar el texto 

//     si el texto es correcto: 
//         guardar texto en busquedaActual

//         poner paginaActual = 1

//         llamar buscarImagenes()

//     si el texto es incorrecto:
//         mostrar mensaje de error

// Cuando el usuuario cambie el filtiro de orientacion :

//     guardar orientacion elegida 

//     poner paginaActual = 1

//     llamar buscarImagenes()

// Cuando el usuario haga clic en boton siguiente:

//     aumentar paginaActual en 1

//     llamar buscarImagenes() 

// Cuando el usuario haga clic en el boton ataras:

//     si paginaActual > 1:
//         disminuir paginaActual en 1

//         llamar buscarImagenes()

// cuando el usuario haga click en favoritos:

//     llamar mostrarFavoritos()

// Funciones
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

        // cuando se pulse favoritos
        AgregarFavorito()
        tarjetaFoto.append(imagen)
        tarjetaFoto.append(autor)
        tarjetaFoto.append(nuevoFavorito)

        // añadir tarjeta a galeria
        contenedorImagenes.append(tarjetaFoto)
    })
}

const AgregarFavorito = (fotos) => {
    // comprobar si ya exite en favoritos

    // si No existe:
    //     añadir el array a favoritos

    guardarFavoritos()
}

const guardarFavoritos = () => {

    // convertir favoritos a JASON

    // guardar en localStorage
}

const cargarFavoritos = () => {

    //  
}

const mostrarFavoritos = () => {

    // limpiar contenedor de favoritos

    // por cada favorito:

    //     crear tarjeta

    //     mostrar imagen

    //     crear boton eliminar

    //     cuando se pulse eliminar
    //         llamar eliminarFavorito()
}

const eliminarFavorito = (id) => {

    // eliminar favorito del array

    guardarFavoritos()

    mostrarFavoritos()
}
