<?php
if (!isset($pageTitle)) $pageTitle = "Projecto África";
?>
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title><?= htmlspecialchars($pageTitle) ?></title>
  <meta name="description" content="Projecto África — organização sem fins lucrativos." />
  <link rel="stylesheet" href="assets/style.css?v=2">
</head>
<body>
<header class="topbar">
  <div class="container">
    <div class="topbar-inner">
      <a class="brand" href="#inicio" aria-label="Ir para início">
        <img class="logo" src="/logo.png" alt="" aria-hidden="true" />
        <div>
          <h1>PROJECTO ÁFRICA</h1>
          <small>Alimentação • Saúde • Educação</small>
        </div>
      </a>

      <nav class="nav" aria-label="Navegação">
        <a href="#impacto">Impacto</a>
        <a href="#atuacao">Onde atuamos</a>
        <a href="#historias">Histórias</a>
        <a href="#doar">Doar</a>
        <a href="#comentarios">Comentários</a>
        <a class="cta" href="#doar">Fazer doação</a>
      </nav>

    </div>
  </div>
</header>
