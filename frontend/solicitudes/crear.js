document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById('formulario-crear');

    formulario.addEventListener('submit', function(e) {
        e.preventDefault();

        const data = {
            tipo: document.getElementById('tipo').value,
            asunto: document.getElementById('asunto').value,
            nombre: document.getElementById('nombre').value,
            correo: document.getElementById('correo').value,
            descripcion: document.getElementById('descripcion').value
        };

        fetch('/api/solicitudes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                mostrarAlerta('success', '¡Solicitud registrada con éxito!');
                formulario.reset();
                
                setTimeout(() => {
                    window.location.href = '/solicitudes';
                }, 1500);
            } else {
                mostrarAlerta('danger', 'Ocurrió un error al registrar la solicitud.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarAlerta('danger', 'Ocurrió un error de conexión.');
        });
    });
});

function mostrarAlerta(tipo, mensaje) {
    const contenedor = document.getElementById('alerta-mensaje');
    contenedor.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}
