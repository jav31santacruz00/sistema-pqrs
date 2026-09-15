document.addEventListener("DOMContentLoaded", () => {
    cargarSolicitudes();
});

function cargarSolicitudes() {
    fetch('/api/solicitudes')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('tabla-solicitudes');
            tbody.innerHTML = '';

            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No hay solicitudes registradas.</td></tr>';
                return;
            }

            data.forEach(solicitud => {
                const tr = document.createElement('tr');
                
                let estadoBadge = 'bg-secondary';
                if (solicitud.estado === 'Resuelto') estadoBadge = 'bg-success';
                else if (solicitud.estado === 'En progreso') estadoBadge = 'bg-warning text-dark';

                let tipoBadge = 'bg-info text-dark';
                if (solicitud.tipo === 'Queja' || solicitud.tipo === 'Reclamo') tipoBadge = 'bg-danger';

                tr.innerHTML = `
                    <td>#${solicitud.id}</td>
                    <td><span class="badge ${tipoBadge}">${solicitud.tipo}</span></td>
                    <td>${solicitud.asunto}</td>
                    <td>${solicitud.nombre}</td>
                    <td><span class="badge ${estadoBadge}">${solicitud.estado}</span></td>
                    <td>${new Date(solicitud.fecha).toLocaleDateString()}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarSolicitud(${solicitud.id})" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Error al cargar solicitudes:', error);
            document.getElementById('tabla-solicitudes').innerHTML = '<tr><td colspan="7" class="text-center py-4 text-danger">Error al cargar los datos.</td></tr>';
        });
}

function eliminarSolicitud(id) {
    if (confirm('¿Está seguro de que desea eliminar esta solicitud?')) {
        fetch(`/api/solicitudes/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                mostrarAlerta('success', 'Solicitud eliminada exitosamente.');
                cargarSolicitudes();
            } else {
                mostrarAlerta('danger', 'Error al eliminar la solicitud.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarAlerta('danger', 'Error de conexión al eliminar.');
        });
    }
}

function mostrarAlerta(tipo, mensaje) {
    const contenedor = document.getElementById('alerta-mensaje');
    contenedor.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    setTimeout(() => {
        contenedor.innerHTML = '';
    }, 4000);
}
