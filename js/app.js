// Variables
const carrito = document.querySelector('#carrito');
const listaCursos = document.querySelector('#lista-cursos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito'); 
let articulosCarrito = [];
const cardCursos = document.querySelectorAll(".card");

// Listeners
cargarEventListeners();

function cargarEventListeners() {
     // Dispara cuando se presiona "Agregar Carrito"
     listaCursos.addEventListener('click',  agregarCurso);

     // Cuando se elimina un curso del carrito
     carrito.addEventListener('click', eliminarCurso);

     // Al Vaciar el carrito
     vaciarCarritoBtn.addEventListener('click', vaciarCarrito);


     // NUEVO: Contenido cargado
     document.addEventListener('DOMContentLoaded', () => {
          articulosCarrito = JSON.parse( localStorage.getItem('carrito') ) || []  ;
          // console.log(articulosCarrito);
          carritoHTML();
     });
}


// Función que añade el curso al carrito
function agregarCurso(e) {
     e.preventDefault();
     // Delegation para agregar-carrito
     if(e.target.classList.contains('agregar-carrito')) {
          const curso = e.target.parentElement.parentElement;
          curso.parentElement.querySelector(".card").classList.add("card-selected");
          //e.target.parentElement.parentElement.class = "card-selected";
          // Enviamos el curso seleccionado para tomar sus datos
          leerDatosCurso(curso);
     }
}

// Lee los datos del curso
function leerDatosCurso(curso) {
     //console.log(curso.querySelector('.precio span').textContent);
     const infoCurso = {
          imagen: curso.querySelector('img').src,
          titulo: curso.querySelector('h4').textContent,
          precio: curso.querySelector('.precio span').textContent,
          id: curso.querySelector('a').getAttribute('data-id'), 
          autor: curso.querySelector('p').textContent,
          cantidad: 1
     }
     
     //if(!articulosCarrito.some( (e) => e.id === infoCurso.id ) ) marcaCursosMismoAutor(infoCurso);

     if( articulosCarrito.some( curso => curso.id === infoCurso.id ) ) { 
          const cursos = articulosCarrito.map( curso => {
               if( curso.id === infoCurso.id ) {
                    let cantidad = parseInt(curso.cantidad);
                    cantidad++
                    curso.cantidad =  cantidad;
                    return curso;
               } else {
                    return curso;
               }
          })
          articulosCarrito = [...cursos];
     }  else {
          articulosCarrito = [...articulosCarrito, infoCurso];
          marcaCursosMismoAutor(infoCurso);
     }

     //console.log(articulosCarrito)

     

     // console.log(articulosCarrito)
     carritoHTML();
}

// Elimina el curso del carrito en el DOM
function eliminarCurso(e) {
     e.preventDefault();
     if(e.target.classList.contains('borrar-curso') ) {
          // e.target.parentElement.parentElement.remove();
          const curso = e.target.parentElement.parentElement;
          const cursoId = curso.querySelector('a').getAttribute('data-id');
          let tarjetaCursoEliminado;

          // Eliminar del arreglo del carrito
          articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);

          //Desmarcamos el borde azul del curso eliminado
          cardCursos.forEach ( e => {
               if(cursoId === e.querySelector('a').getAttribute('data-id') ){
                    e.classList.remove('card-selected');   
                    tarjetaCursoEliminado = e;                
               }
               return e;
          })

          //Desmarcamos los hermanos

          cardCursos.forEach ( e => {
               if(e.querySelector('p').textContent === tarjetaCursoEliminado.querySelector('p').textContent){
                    e.classList.remove('card-brother');
                    if(e.querySelector('#descuento') != null) e.querySelector('#descuento').remove();    
                    if(e.querySelector('#nuevoPrecio') != null) e.querySelector('#nuevoPrecio').remove();                
               }
               return e;
          })


          carritoHTML();
     }
}


// Muestra el curso seleccionado en el Carrito
function carritoHTML() {

     vaciarCarrito();

     articulosCarrito.forEach(curso => {
          const row = document.createElement('tr');
          row.innerHTML = `
               <td>  
                    <img src="${curso.imagen}" width=100>
               </td>
               <td>${curso.titulo}</td>
               <td>${curso.precio}</td>
               <td>${curso.cantidad} </td>
               <td>
                    <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
               </td>
          `;
          contenedorCarrito.appendChild(row);
          contenedorCarrito.se
     });

     // NUEVO:
     sincronizarStorage();

}

//Marca los cursos del mismo autor y rebaja el precio
function marcaCursosMismoAutor(curso){

     cardCursos.forEach ( e => {
          if(e.querySelector("p").textContent === curso.autor && curso.id != e.querySelector('a').getAttribute('data-id') ){
               e.classList.add("card-brother");
               BajaPrecioCurso(e, 5);
          }
          return e;
     })
}

function BajaPrecioCurso(curso, rebaja){
     let precio = curso.querySelector('.precio span');
     let nuevoPrecio = document.createElement("span");
     nuevoPrecio.id = 'nuevoPrecio';
     nuevoPrecio.textContent =  parseInt(precio.textContent.slice(1,precio.textContent.lenght),10) - rebaja;
     nuevoPrecio.textContent = "$" + nuevoPrecio.textContent;
     
     precio.classList.add('precioViejo');
     nuevoPrecio.classList.add('u-pull-right');
     curso.querySelector('span').insertAdjacentElement('beforeend',nuevoPrecio);
     //if(curso.querySelector('#descuento') == null) AniadeCartelDescuento(curso.querySelector('a').getAttribute('data-id'));
     AniadeCartelDescuento(curso.querySelector('a').getAttribute('data-id'));
}

function AniadeCartelDescuento(cursoId){
     let cartel = document.createElement('span');
     cartel.classList.add('cartel-descuento');
     cartel.textContent = '!DESCUENTO¡';
     cartel.id = 'descuento';
     cardCursos.forEach ( e => {
          if( cursoId == e.querySelector('a').getAttribute('data-id')){
               e.querySelector('p');
               e.insertAdjacentElement('beforeend', cartel);
          }
          return e;
     })
}

// NUEVO: 
function sincronizarStorage() {
     localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Elimina los cursos del carrito en el DOM
function vaciarCarrito() {
     // forma rapida (recomendada)
     while(contenedorCarrito.firstChild) {
          contenedorCarrito.removeChild(contenedorCarrito.firstChild);
      }
}
