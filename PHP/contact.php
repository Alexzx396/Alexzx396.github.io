<?php
// Comprobamos si el formulario ha sido enviado usando el método POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recogemos los datos del formulario
    $nombre = trim($_POST['nombre']);
    $email = trim($_POST['email']);
    $mensaje = trim($_POST['mensaje']);

    // La dirección de correo electrónico a la que quieres enviar el mensaje
    $destinatario = 'arcealex257@gmail.com';
    $asunto = 'Mensaje desde mi sitio web';

    // Preparando el cuerpo del mensaje
    $cuerpo = "Nombre: " . $nombre . "\n";
    $cuerpo .= "Email: " . $email . "\n";
    $cuerpo .= "Mensaje: " . $mensaje . "\n";

    // Cabeceras adicionales
    $cabeceras = "https://alexzx396.github.io" . "\r\n"; 
    $cabeceras .= "Reply-To: " . $email . "\r\n";
    $cabeceras .= "X-Mailer: PHP/" . phpversion();

    // Enviar el email
    $envio = mail($destinatario, $asunto, $cuerpo, $cabeceras);

    // Comprobamos si el correo fue enviado con éxito y redirigimos
    if ($envio) {
        header('Location: gracias.html');
        exit;
    } else {
        echo "Lo sentimos, ocurrió un error al enviar tu mensaje.";
    }
}
?>
