document.addEventListener("DOMContentLoaded", () => {
    listarUsuarios();
});

async function crearUsuario() {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("correo").value;
    const contrasenia = document.getElementById("contrasenia").value;
    const rol = document.getElementById("rol").value;

    const respuesta = await fetch("/api/crear-usuario",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body:JSON.stringify({
            nombre:nombre,
            apellido: apellido,
            correo: correo,
            contrasenia: contrasenia,
            rol: rol
        })
    })

    const datos = await respuesta.json();
    if (datos.status) {
        document.getElementById("formUsuario").reset();
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("staticBackdrop")
        );
        modal.hide();
        listarUsuarios()
    }
}

async function listarUsuarios() {
    const tabla = document.getElementById("tabla-usuarios");
    try {
        const respuesta = await fetch("/api/listar-usuarios");

        const datos = await respuesta.json();
        console.log(datos)  
        tabla.innerHTML = "";
        datos.forEach(usuario => {
            tabla.innerHTML += `
                <tr>
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellido}</td>
                    <td>${usuario.correo}</td>
                    <td>${usuario.contrasenia}</td>
                    <td>${usuario.rol}</td>
                    <td>
                        <button type="button"  class="btn btn-warning btn-sm" onclick="abrirModalActualizar(${usuario.id})">
                            Editar
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error(error);
        tabla.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    Error al cargar los usuarios
                </td>
            </tr>
        `;
    }
}

async function abrirModalActualizar(id) {

    try {
        const respuesta = await fetch(`/api/listar-usuarios/${id}`);
        const usuario = await respuesta.json(); 

        const modal = new bootstrap.Modal(
            document.getElementById("modalActualizarUsuario")
        );
        modal.show();
        document.getElementById("idActualizar").value = usuario.id;
        document.getElementById("nombreActualizar").value = usuario.nombre;
        document.getElementById("apellidoActualizar").value = usuario.apellido;
        document.getElementById("correoActualizar").value = usuario.correo;
        document.getElementById("contraseniaActualizar").value = usuario.contrasenia;
        document.getElementById("rolActualizar").value = usuario.rol;

    } catch (error) {

        console.error("Error al cargar usuario:", error);

    }
}

async function actualizarUsuario() {
    const id = document.getElementById("idActualizar").value;
    const nombre = document.getElementById("nombreActualizar").value;
    const apellido = document.getElementById("apellidoActualizar").value;
    const correo = document.getElementById("correoActualizar").value;
    const contrasenia = document.getElementById("contraseniaActualizar").value;
    const rol = document.getElementById("rolActualizar").value;
    const respuesta = await fetch(`/api/actualizar-usuario/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            contrasenia: contrasenia,
            rol: rol

        })
    });
    const datos = await respuesta.json();
    console.log(datos)
    if (datos.status) {
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("modalActualizarUsuario")
        );
        modal.hide();
        listarUsuarios();
    } else {
        alert(datos.message);
    }
}