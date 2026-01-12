<?php
// api.php — API simples em JSON (sem MySQL)
// Rotas:
//   GET  api.php?type=donations
//   POST api.php?type=donations   body JSON: {name,currency,amount,purpose,note}
//   GET  api.php?type=comments
//   POST api.php?type=comments    body JSON: {name,city,text}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$type = $_GET['type'] ?? '';
$allowed = ['donations','comments'];
if (!in_array($type, $allowed, true)) {
  http_response_code(400);
  echo json_encode(['ok'=>false,'error'=>'type inválido'], JSON_UNESCAPED_UNICODE);
  exit;
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
  @mkdir($dataDir, 0775, true);
}

$file = $dataDir . '/' . $type . '.json';

// garante arquivo existe
if (!file_exists($file)) {
  @file_put_contents($file, json_encode([], JSON_UNESCAPED_UNICODE));
}

function readJsonFile($file) {
  $raw = @file_get_contents($file);
  if ($raw === false) return [];
  $arr = json_decode($raw, true);
  return is_array($arr) ? $arr : [];
}

function writeJsonFile($file, $arr) {
  $json = json_encode($arr, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  return @file_put_contents($file, $json, LOCK_EX) !== false;
}

function getBodyJson() {
  $raw = file_get_contents('php://input');
  if (!$raw) return [];
  $arr = json_decode($raw, true);
  return is_array($arr) ? $arr : [];
}

// moderação simples (comentários)
function hasBannedWords($text) {
  $banned = ["fdp","pqp","caralho","porra","viado","puta","buceta","racista","macaco","desgraça","merda"];
  $t = mb_strtolower($text ?? '', 'UTF-8');
  foreach ($banned as $w) {
    if (strpos($t, $w) !== false) return true;
  }
  return false;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $arr = readJsonFile($file);
  echo json_encode(['ok'=>true,'data'=>$arr], JSON_UNESCAPED_UNICODE);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $body = getBodyJson();
  $arr = readJsonFile($file);

  if ($type === 'donations') {
    $name = trim((string)($body['name'] ?? ''));
    $currency = strtoupper(trim((string)($body['currency'] ?? 'BRL')));
    $amount = (int)($body['amount'] ?? 0);
    $purpose = trim((string)($body['purpose'] ?? ''));
    $note = trim((string)($body['note'] ?? ''));

    $validCurrencies = ['BRL','USD','EUR'];
    if ($name === '' || $amount < 1 || !in_array($currency, $validCurrencies, true)) {
      http_response_code(422);
      echo json_encode(['ok'=>false,'error'=>'dados inválidos'], JSON_UNESCAPED_UNICODE);
      exit;
    }

    $arr[] = [
      'name' => mb_substr($name, 0, 40),
      'currency' => $currency,
      'amount' => $amount,
      'purpose' => mb_substr($purpose, 0, 40),
      'note' => mb_substr($note, 0, 80),
      'at' => gmdate('c')
    ];

    if (!writeJsonFile($file, $arr)) {
      http_response_code(500);
      echo json_encode(['ok'=>false,'error'=>'falha ao salvar'], JSON_UNESCAPED_UNICODE);
      exit;
    }

    echo json_encode(['ok'=>true], JSON_UNESCAPED_UNICODE);
    exit;
  }

  if ($type === 'comments') {
    $name = trim((string)($body['name'] ?? ''));
    $city = trim((string)($body['city'] ?? ''));
    $text = trim((string)($body['text'] ?? ''));

    if ($name === '' || $text === '') {
      http_response_code(422);
      echo json_encode(['ok'=>false,'error'=>'dados inválidos'], JSON_UNESCAPED_UNICODE);
      exit;
    }
    if (hasBannedWords($text)) {
      http_response_code(422);
      echo json_encode(['ok'=>false,'error'=>'comentário bloqueado'], JSON_UNESCAPED_UNICODE);
      exit;
    }

    $arr[] = [
      'name' => mb_substr($name, 0, 40),
      'city' => mb_substr($city, 0, 40),
      'text' => mb_substr($text, 0, 400),
      'at' => gmdate('c')
    ];

    if (!writeJsonFile($file, $arr)) {
      http_response_code(500);
      echo json_encode(['ok'=>false,'error'=>'falha ao salvar'], JSON_UNESCAPED_UNICODE);
      exit;
    }

    echo json_encode(['ok'=>true], JSON_UNESCAPED_UNICODE);
    exit;
  }
}

http_response_code(405);
echo json_encode(['ok'=>false,'error'=>'método não permitido'], JSON_UNESCAPED_UNICODE);
