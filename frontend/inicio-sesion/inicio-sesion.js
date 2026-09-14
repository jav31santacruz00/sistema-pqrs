const formulario = document.getElementById('formulario');

formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const contrasenia = document.getElementById('contrasenia').value;

    fetch("/autentificacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: usuario, contrasenia: contrasenia })
    })
    .then(respuesta => respuesta.json())
    .then(r => {
        console.log(r);
    })
    .catch(error => {
        console.error("Error:", error);
    });
});