<?php
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: https://yasin-sun.developerakademie.net");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['email'], $input['name'], $input['msg'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit();
}

$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
$name = htmlspecialchars(trim($input['name']), ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars(trim($input['msg']), ENT_QUOTES, 'UTF-8');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit();
}

$to = 'info@sun-dev.de';
$subject = "Portfolio Kontakt von $name";
$body = "
<html>
<head><title>Portfolio Kontakt</title></head>
<body>
    <h2>Neue Kontaktanfrage vom Portfolio</h2>
    <p><strong>Name:</strong> $name</p>
    <p><strong>E-Mail:</strong> $email</p>
    <p><strong>Nachricht:</strong></p>
    <p>$message</p>
    <hr>
    <p><small>Gesendet über: yasin-sun.developerakademie.net</small></p>
</body>
</html>
";

$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: Portfolio <noreply@yasin-sun.developerakademie.net>',
    'Reply-To: ' . $email,
    'Return-Path: info@sun-dev.de'
];

if (mail($to, $subject, $body, implode("\r\n", $headers))) {
    echo json_encode(['success' => true, 'message' => 'E-Mail erfolgreich versendet']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'E-Mail konnte nicht versendet werden']);
}
?>