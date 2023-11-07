<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST['nombre'];
    $email = $_POST['email'];
    $mensaje = $_POST['mensaje'];

    // La dirección a la que quieres enviar el mensaje
    $destinatario = 'arcealex257@gmail.com';
    $asunto = 'Mensaje desde mi WEB personal';
    
    // Preparando el cuerpo del mensaje
    $cuerpo = "Nombre: " . $nombre . "\n";
    $cuerpo .= "Email: " . $email . "\n";
    $cuerpo .= "Mensaje: " . $mensaje . "\n";

    // Cabeceras adicionales
    $cabeceras = "From: no-reply@yourdomain.com" . "\r\n";
    $cabeceras .= "Reply-To: " . $email . "\r\n";
    $cabeceras .= "X-Mailer: PHP/" . phpversion();

    // Enviar el email
    mail($destinatario, $asunto, $cuerpo, $cabeceras);

    // Redireccionar a una página de gracias
    header('Location: gracias.html');
    exit;
}
?>
