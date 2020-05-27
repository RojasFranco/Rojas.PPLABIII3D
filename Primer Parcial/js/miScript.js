import { Anuncio_Mascota } from "../js/entidades.js";


let contenedorTabla = document.getElementById("contenedorTabla");
let contenedorSpinner = document.getElementById("paraSpinner");
let miSpinner = document.createElement("img");
let srcMiSpinner = "../Imagenes/miSpinner.gif";
contenedorSpinner.appendChild(miSpinner);


let tabla = document.createElement("table");;
let formulario = document.getElementById("formulario");


let datos;

let transaccionAnuncio = "venta";
let idAnuncio;
let tituloAnuncio;
let descripcionAnuncio;
let tipoAnimal;
let precioAnuncio;
let razaAnuncio;
let fechaAnuncio;


let vacunaAplicada;
let tiposAnimales = document.getElementsByName("tipoAnimales");

let botonesModificar = document.getElementById("botonesModificar");


/****************** TRAER DATOS *******************/
function TraerDatos(){
    while(tabla.childElementCount>0){
        tabla.removeChild(tabla.firstElementChild);
    }
    tabla.classList.add("miTabla");
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        miSpinner.setAttribute("src", srcMiSpinner);
        if(xhr.readyState==4){
            miSpinner.removeAttribute("src");
            if(xhr.status==200){            
                let rtaXhr = xhr.response;
                let rtaJson = JSON.parse(rtaXhr);
                datos = rtaJson.data;
                console.log(rtaJson.message);
                CrearTablaConDatos(datos);
                let tdsTabla = document.getElementsByTagName("td");
                cargarEventosTdsTabla(tdsTabla);
            }
            else{
                console.log("HUBO ERROR AL CARGAR");
            }
        }
    }

    xhr.open("GET", "http://localhost:3000/traer");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send();
}

TraerDatos();

/******************* CARGAR TABLA ******************/

function CrearTablaConDatos(datosTabla){
    let trHead = document.createElement("tr");

    for (const key in datosTabla[0]) {
        let th = document.createElement("th");
        th.textContent = key;
        trHead.appendChild(th);
    }
    tabla.appendChild(trHead);

    datosTabla.forEach(fila => {
      let tr = document.createElement("tr");
      for (const key in fila) {
          let td = document.createElement("td");
          td.textContent = fila[key];
          tr.appendChild(td);
      }
      tabla.appendChild(tr);
    })
    contenedorTabla.appendChild(tabla);
}


/******************* ALTA ******************/

let btnAlta = document.getElementById("btnGuardar");

btnAlta.addEventListener("click", function(){
    tituloAnuncio = document.getElementById("txtTitulo").value;
    descripcionAnuncio = document.getElementById("txtDescripcion").value;
    precioAnuncio = document.getElementById("txtPrecio").value;
    razaAnuncio = document.getElementById("txtRaza").value;
    fechaAnuncio = document.getElementById("dateFecha").value;

    vacunaAplicada = VacunaFueAplicada();

    tipoAnimal = obtenerTipoAnimal();
    if(tituloAnuncio.length>3 && tipoAnimal!=null && vacunaAplicada!=null){
        let anuncioMascota = new Anuncio_Mascota(null, tituloAnuncio, transaccionAnuncio, descripcionAnuncio,
            precioAnuncio, tipoAnimal, razaAnuncio, fechaAnuncio, vacunaAplicada);
        
        AltaAnuncio(anuncioMascota);

    }
    else{
        alert("COMPLETE LOS CAMPOS");
    }
})

function AltaAnuncio(anuncio){
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        miSpinner.setAttribute("src", srcMiSpinner);
        if(xhr.readyState==4){
            miSpinner.removeAttribute("src");
            if(xhr.status==200){
                let rtaXhr = xhr.response;
                let rtaJson = JSON.parse(rtaXhr);
                console.log(rtaJson.message);
                TraerDatos();
            }
            else{
                console.log("HUBO ERR");
            }
        }

    }
    xhr.open("POST", "http://localhost:3000/alta");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(JSON.stringify(anuncio));
}

function obtenerTipoAnimal(){
    let elementoSeleccionado;
    tiposAnimales.forEach(element => {
        if(element.checked){
            elementoSeleccionado = element.value;
        }
    })
    return elementoSeleccionado;
}

let vacunas = document.getElementsByTagName("option");

function VacunaFueAplicada(){
    let retorno;
    for (let index = 0; index < vacunas.length; index++) {
        const element = vacunas[index];
        if(element.selected){
            retorno = element.value
        }
    }
    return retorno;
}

/************** CARGAR ANUNCIOS EVENTOS***************/

function cargarEventosTdsTabla(tdsTabla){
    for (let index = 0; index < tdsTabla.length; index++) {
        const td = tdsTabla[index];
        td.addEventListener("click", function(){
            let elementoPadre = td.parentElement;
            //let elementoIdBuscado = elementoPadre.firstElementChild;
            //retornoId = elementoIdBuscado.textContent;
            botonesModificar.style.display = "flex";
            LlenarFormularioSegunElementoPadre(elementoPadre);
        })
        
    }
}

function LlenarFormularioSegunElementoPadre(elementoPadre){
    idAnuncio = elementoPadre.children[0].textContent;


    document.getElementById("txtTitulo").value = elementoPadre.children[1].textContent;

    document.getElementById("txtDescripcion").value = elementoPadre.children[3].textContent;
    document.getElementById("txtPrecio").value = elementoPadre.children[4].textContent;
    
    tipoAnimal = elementoPadre.children[5].textContent;
    tiposAnimales.forEach(element => {
        if(element.value == tipoAnimal){
           element.setAttribute("checked", "true");
        }
    })
    
    document.getElementById("txtRaza").value = elementoPadre.children[6].textContent;
    document.getElementById("dateFecha").value = elementoPadre.children[7].textContent;

    //VACUNAAA8
    vacunaAplicada = elementoPadre.children[8].textContent;
    for (let index = 0; index < vacunas.length; index++) {
        const element = vacunas[index];
        if(element.value == vacunaAplicada){
            element.setAttribute("selected", "true");
        }
    }

}
    


/*************CANCELAR **************/

let btnCancelar = document.getElementById("btnCancelar");

btnCancelar.addEventListener("click", function(){
    formulario.reset();
    botonesModificar.style.display = "none";
})


/************************** BAJA **************************/
//OBS EL ID ANUNCIO YA LO TENGO CUANDO SELECCIONA UN TD EN IDANUNCIO
let btnEliminar = document.getElementById("btnEliminar");

btnEliminar.addEventListener("click", function(){


    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        miSpinner.setAttribute("src", srcMiSpinner);
        if(xhr.readyState==4){
            if(xhr.status==200){
                let rtaXhr = xhr.response;
                let rtaJson = JSON.parse(rtaXhr);
                console.log(rtaJson.message);
                miSpinner.removeAttribute("src");
                TraerDatos();
                formulario.reset();
                botonesModificar.style.display = "none";
            }
            else{
                console.log(`Hubo un error: ${xhr.status}`);
            }
        }        
    }
    xhr.open("POST", "http://localhost:3000/baja");
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.send(`id=${idAnuncio}`);
})

/************************** MODIFICAR **************************/

let btnModificar = document.getElementById("btnModificar");
btnModificar.addEventListener("click", function(){

    tituloAnuncio = document.getElementById("txtTitulo").value;
    descripcionAnuncio = document.getElementById("txtDescripcion").value;
    precioAnuncio = document.getElementById("txtPrecio").value;
    razaAnuncio = document.getElementById("txtRaza").value;
    fechaAnuncio = document.getElementById("dateFecha").value;

    vacunaAplicada = VacunaFueAplicada();

    tipoAnimal = obtenerTipoAnimal();
    if(tituloAnuncio.length>3 && tipoAnimal!=null && vacunaAplicada!=null){
        let anuncioMascota = new Anuncio_Mascota(idAnuncio, tituloAnuncio, transaccionAnuncio, descripcionAnuncio,
            precioAnuncio, tipoAnimal, razaAnuncio, fechaAnuncio, vacunaAplicada);
        
        ModificarAnuncio(anuncioMascota);

    }
    else{
        alert("COMPLETE LOS CAMPOS");
    }
})

function ModificarAnuncio(anuncio){

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        miSpinner.setAttribute("src",srcMiSpinner);
        if(xhr.readyState==4){
            if(xhr.status==200){
                let rtaXhr = xhr.response;
                let rtaJson = JSON.parse(rtaXhr);
                console.log(rtaJson.message);
                miSpinner.removeAttribute("src");
                TraerDatos();
                formulario.reset();
                botonesModificar.style.display = "none";
            }
            else{
                console.log(`Hubo un error: ${xhr.status}`);
            }
        }        
    }
    xhr.open("POST", "http://localhost:3000/modificar");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(JSON.stringify(anuncio));
}