document.addEventListener("DOMContentLoaded", () => {
    listarUsuarios();
});


function mostrarAlerta(tipo, mensaje, contenedorId = "alerta-mensaje") {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    contenedor.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            <i class="bi ${tipo === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2"></i>
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    if (contenedorId === "alerta-mensaje") {
        setTimeout(() => {
            contenedor.innerHTML = "";
        }, 4000);
    }
}

function esCorreoValido(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}

async function listarUsuarios() {
    const tabla = document.getElementById("tabla-usuarios");
    try {
        const respuesta = await fetch("/api/listar-usuarios");
        const datos = await respuesta.json();

        tabla.innerHTML = "";

        if (!datos || datos.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4 text-muted">
                        No hay usuarios registrados.
                    </td>
                </tr>
            `;
            return;
        }

        datos.forEach(usuario => {
            const rolBadge = usuario.rol === "Administrador" ? "bg-primary" : "bg-secondary";

            tabla.innerHTML += `
                <tr>
                    <td>#${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellido}</td>
                    <td>${usuario.correo}</td>
                    <td>••••••••</td>
                    <td><span class="badge ${rolBadge}">${usuario.rol}</span></td>
                    <td class="text-end">
                        <div class="btn-group btn-group-sm">
                            <button type="button" class="btn btn-warning" onclick="abrirModalActualizar(${usuario.id})" title="Editar usuario">
                                <i class="bi bi-pencil-square"></i> Editar
                            </button>
                            <button type="button" class="btn btn-danger" onclick="eliminarUsuario(${usuario.id}, '${usuario.nombre} ${usuario.apellido}')" title="Eliminar usuario">
                                <i class="bi bi-trash"></i> Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error al listar usuarios:", error);
        tabla.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger py-4">
                    Error al cargar los usuarios.
                </td>
            </tr>
        `;
    }
}

async function crearUsuario() {
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const contrasenia = document.getElementById("contrasenia").value.trim();
    const rol = document.getElementById("rol").value;

    // Validaciones básicas
    if (!nombre || !apellido || !correo || !contrasenia) {
        mostrarAlerta("danger", "Por favor completa todos los campos obligatorios.", "alerta-modal-crear");
        return;
    }

    if (nombre.length < 2) {
        mostrarAlerta("warning", "El nombre debe tener al menos 2 caracteres.", "alerta-modal-crear");
        return;
    }

    if (apellido.length < 2) {
        mostrarAlerta("warning", "El apellido debe tener al menos 2 caracteres.", "alerta-modal-crear");
        return;
    }

    if (!esCorreoValido(correo)) {
        mostrarAlerta("warning", "Ingresa un correo electrónico válido (ejemplo@correo.com).", "alerta-modal-crear");
        return;
    }

    if (contrasenia.length < 4) {
        mostrarAlerta("warning", "La contraseña debe tener un mínimo de 4 caracteres.", "alerta-modal-crear");
        return;
    }

    try {
        const respuesta = await fetch("/api/crear-usuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, apellido, correo, contrasenia, rol })
        });

        const datos = await respuesta.json();

        if (datos.status) {
            document.getElementById("formCrearUsuario").reset();
            const modalEl = document.getElementById("staticBackdrop");
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) {
                modalInstance.hide();
            }

            const alertaModal = document.getElementById("alerta-modal-crear");
            if (alertaModal) alertaModal.innerHTML = "";

            mostrarAlerta("success", "Usuario creado exitosamente.");
            listarUsuarios();
        } else {
            mostrarAlerta("danger", datos.message || datos.menssage || "Error al crear el usuario.", "alerta-modal-crear");
        }
    } catch (error) {
        console.error("Error al crear usuario:", error);
        mostrarAlerta("danger", "Error de conexión al intentar crear el usuario.", "alerta-modal-crear");
    }
}

async function abrirModalActualizar(id) {
    const alertaModal = document.getElementById("alerta-modal-actualizar");
    if (alertaModal) alertaModal.innerHTML = "";

    try {
        const respuesta = await fetch(`/api/listar-usuarios/${id}`);
        const usuario = await respuesta.json();

        if (!usuario || usuario.status === false) {
            mostrarAlerta("danger", "No se pudo obtener la información del usuario.");
            return;
        }

        document.getElementById("idActualizar").value = usuario.id;
        document.getElementById("nombreActualizar").value = usuario.nombre;
        document.getElementById("apellidoActualizar").value = usuario.apellido;
        document.getElementById("correoActualizar").value = usuario.correo;
        document.getElementById("contraseniaActualizar").value = usuario.contrasenia;
        document.getElementById("rolActualizar").value = usuario.rol;

        const modalEl = document.getElementById("modalActualizarUsuario");
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();

    } catch (error) {
        console.error("Error al cargar usuario:", error);
        mostrarAlerta("danger", "Error de conexión al cargar los datos del usuario.");
    }
}

async function actualizarUsuario() {
    const id = document.getElementById("idActualizar").value;
    const nombre = document.getElementById("nombreActualizar").value.trim();
    const apellido = document.getElementById("apellidoActualizar").value.trim();
    const correo = document.getElementById("correoActualizar").value.trim();
    const contrasenia = document.getElementById("contraseniaActualizar").value.trim();
    const rol = document.getElementById("rolActualizar").value;

    // Validaciones básicas
    if (!nombre || !apellido || !correo || !contrasenia) {
        mostrarAlerta("danger", "Todos los campos son obligatorios.", "alerta-modal-actualizar");
        return;
    }

    if (nombre.length < 2 || apellido.length < 2) {
        mostrarAlerta("warning", "El nombre y apellido deben tener al menos 2 caracteres.", "alerta-modal-actualizar");
        return;
    }

    if (!esCorreoValido(correo)) {
        mostrarAlerta("warning", "Por favor introduce un correo válido.", "alerta-modal-actualizar");
        return;
    }

    if (contrasenia.length < 4) {
        mostrarAlerta("warning", "La contraseña debe tener al menos 4 caracteres.", "alerta-modal-actualizar");
        return;
    }

    try {
        const respuesta = await fetch(`/api/actualizar-usuario/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, apellido, correo, contrasenia, rol })
        });

        const datos = await respuesta.json();

        if (datos.status) {
            const modalEl = document.getElementById("modalActualizarUsuario");
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) {
                modalInstance.hide();
            }

            const alertaModal = document.getElementById("alerta-modal-actualizar");
            if (alertaModal) alertaModal.innerHTML = "";

            mostrarAlerta("success", "Usuario actualizado exitosamente.");
            listarUsuarios();
        } else {
            mostrarAlerta("danger", datos.message || datos.menssage || "Error al actualizar el usuario.", "alerta-modal-actualizar");
        }
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        mostrarAlerta("danger", "Error de conexión al actualizar el usuario.", "alerta-modal-actualizar");
    }
}

async function eliminarUsuario(id, nombreCompleto) {
    const mensajeConfirm = nombreCompleto
        ? `¿Está seguro de que desea eliminar al usuario "${nombreCompleto}"?`
        : "¿Está seguro de que desea eliminar este usuario?";

    if (!confirm(mensajeConfirm)) {
        return;
    }

    try {
        const respuesta = await fetch(`/api/eliminar-usuario/${id}`, {
            method: "DELETE"
        });

        const datos = await respuesta.json();

        if (datos.status) {
            mostrarAlerta("success", "Usuario eliminado exitosamente.");
            listarUsuarios();
        } else {
            mostrarAlerta("danger", datos.message || "Error al eliminar el usuario.");
        }
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        mostrarAlerta("danger", "Error de conexión al eliminar el usuario.");
    }
}