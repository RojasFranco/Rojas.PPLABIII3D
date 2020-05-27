class Anuncio{
    id;
    titulo;
    transaccion;
    descripcion;
    precio;

    constructor(id, titulo, transaccion, descripcion, precio){
        this.id=id;
        this.titulo = titulo;
        this.transaccion = transaccion;
        this.descripcion = descripcion;     
        this.precio = precio;           
    }
}

export class Anuncio_Mascota extends Anuncio{

    animal;
    raza;
    fecha_nacimiento;
    vacuna;
    constructor(id, titulo, transaccion, descripcion, precio, animal, raza, fecha_nacimiento, vacuna){
        super(id, titulo, transaccion, descripcion, precio);
        this.animal = animal;
        this.raza=raza;
        this.fecha_nacimiento=fecha_nacimiento;
        this.vacuna=vacuna;
    }
}