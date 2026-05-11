
// Crear variable APi_key
const API_key = "c0Ll7l3wIZ7G6XESjHQFXUDADVSVvM9DX96AGefWhyHUCBHJ3oc5Z7RR";
// Crear variable busqueda actual
let busquedaActual = "nature"
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
const seccionParaImagenes = document.querySelector("#contenedorImagenes")
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
const btnCategoria = document.querySelector("#boton-categoria")
//constante categorias para pintar los botones
const categorias = ["Nature", "Space", "Fantasy"]

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

//     guardar categoria en busqueda Actual
//     poner paginaActual = 1
//     llamar buscarImagenes()
        btnCategoria?.addEventListener("click", () => {
            busquedaActual = nombre;
            paginaActual = 1;
            buscarImagenes();
        });

// Cuando el usuario haga clic en el boton buscar:

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
    categorias.forEach(nombre => {
        const btn = document.createElement('div')
        btn.innerHTML = nombre;
        btn.classList.add("boton-categoria")
        contenedorCategorias.append(btn)
    
// Cuando el usuario haga clic en una categoria :


    });

}

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

    // por cada foto:

    // crear tarjeta for i<=6

    // mostrar imagen

    // mostrar fotografo

    // crear boton favoritos

    // cuando se pulse favoritos
    //     llamar AgregarFavorito()

    // añadir tarjeta a galeria
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
