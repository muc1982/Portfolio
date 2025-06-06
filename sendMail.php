<?php
header('Content-Type: application/json');

header("Access-Control-Allow-Origin: https://portfolio.yasinsun.de");
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

$ip = $_SERVER['REMOTE_ADDR'];
$rate_limit_file = 'rate_limit_' . md5($ip) . '.txt';
if (file_exists($rate_limit_file)) {
    $last_request = (int)file_get_contents($rate_limit_file);
    if (time() - $last_request < 60) { 
        http_response_code(429);
        echo json_encode(['error' => 'Too many requests']);
        exit();
    }
}
file_put_contents($rate_limit_file, time());

$to = 'info@sun-dev.de';
$subject = "Portfolio Contact from $name";
$body = "
<html>
<head><title>Portfolio Contact</title></head>
<body>
    <h2>New Contact from Portfolio</h2>
    <p><strong>Name:</strong> $name</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Message:</strong></p>
    <p>$message</p>
</body>
</html>
";

$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: Portfolio <no-reply@dev-sun.de>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion()
];

if (mail($to, $subject, $body, implode("\r\n", $headers))) {
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email']);
}
?>