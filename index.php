<?php
$pageTitle = "Projecto África — Ajuda Humanitária";
require __DIR__ . "/header.php";
?>

<main id="inicio" class="hero">
  <div class="container">
    <div class="hero-grid">
      <div class="hero-card">
        <div class="inner">
          <div class="hero-eyebrow">
            <span class="pill"><span class="dot"></span> Organização sem fins lucrativos</span>
            <span class="pill">Transparência • Ação local</span>
          </div>
          <h2 class="hero-title">Ajuda real, no local certo, na hora certa.</h2>
          <p class="hero-sub">
            O Projecto África apoia crianças e famílias com alimentação, kits de higiene, reforço escolar e apoio comunitário.
            Seu apoio vira impacto mensurável — e os números ficam visíveis aqui.
          </p>
          <div class="hero-actions">
            <a class="btn primary" href="#doar">Doar agora</a>
            <a class="btn" href="#atuacao">Ver atuação</a>
            <a class="btn" href="#historias">Ver histórias</a>
          </div>
          <div class="mini">
            <span>✓ Contadores ao vivo</span>
            <span>✓ Doações salvas no servidor</span>
            <span>✓ Comentários salvos no servidor</span>
          </div>
        </div>
      </div>

      <div class="hero-card side" id="impacto">
        <h3>Impacto em números</h3>

        <div class="stat">
          <div class="badge" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M7 8c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5z" stroke="rgba(255,255,255,.85)" stroke-width="2"/>
              <path d="M3 21c1.2-4 4.5-6 9-6s7.8 2 9 6" stroke="rgba(255,255,255,.85)" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div>
            <b id="kidsHelped">0</b>
            <span>Crianças assistidas</span>
          </div>
        </div>

        <div class="stat">
          <div class="badge" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16v10H4V7z" stroke="rgba(255,255,255,.85)" stroke-width="2" />
              <path d="M7 7V5h10v2" stroke="rgba(255,255,255,.85)" stroke-width="2" stroke-linecap="round"/>
              <path d="M9 12h6" stroke="rgba(255,255,255,.85)" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div>
            <b id="mealsServed">0</b>
            <span>Refeições entregues</span>
          </div>
        </div>

        <div class="stat">
          <div class="badge" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v18" stroke="rgba(255,255,255,.85)" stroke-width="2" stroke-linecap="round"/>
              <path d="M7 8h10M7 16h10" stroke="rgba(255,255,255,.85)" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div>
            <b id="schoolsSupported">0</b>
            <span>Pontos de apoio / escolas</span>
          </div>
        </div>

        <small>
          * Estes números você ajusta no JS. Doações/comentários abaixo ficam gravados em JSON no servidor.
        </small>
      </div>
    </div>
  </div>
</main>

<section id="atuacao">
  <div class="container">
    <div class="section-head">
      <div>
        <h2>Onde atuamos</h2>
        <p>A ajuda é organizada por frentes: alimentação, saúde, educação e suporte comunitário.</p>
      </div>
    </div>

    <div class="grid">
      <div class="card span8">
        <h3>Frentes de atuação</h3>
        <p>Menos discurso, mais entrega. Programas com metas claras.</p>
        <ul class="list">
          <li class="li"><div><b>Alimentação e nutrição</b><small>Refeições, cestas e água potável.</small></div></li>
          <li class="li"><div><b>Saúde e higiene</b><small>Kits de higiene e campanhas locais.</small></div></li>
          <li class="li"><div><b>Educação e reforço</b><small>Materiais e reforço escolar.</small></div></li>
          <li class="li"><div><b>Comunidade e proteção</b><small>Parcerias com líderes locais.</small></div></li>
        </ul>
        <span class="tag">impacto mensurável • baixo custo operacional</span>
      </div>

      <div class="card span4">
        <h3>Locais (exemplo)</h3>
        <p>Troque pelos locais reais.</p>
        <ul class="list">
          <li class="li"><div><b>Centro A</b><small>Alimentação + higiene</small></div></li>
          <li class="li"><div><b>Escola B</b><small>Reforço + materiais</small></div></li>
          <li class="li"><div><b>Ponto C</b><small>Campanhas de saúde</small></div></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section id="historias">
  <div class="container">
    <div class="section-head">
      <div>
        <h2>Histórias e registros</h2>
        <p>Carrossel com artigos/galeria. Depois você troca por fotos reais.</p>
      </div>
    </div>

    <div class="carousel">
      <div class="carousel-top">
        <div class="tabs" role="tablist">
          <button class="tab active" data-filter="all">Tudo</button>
          <button class="tab" data-filter="food">Alimentação</button>
          <button class="tab" data-filter="school">Educação</button>
          <button class="tab" data-filter="health">Saúde</button>
        </div>
        <div class="car-controls">
          <button class="iconbtn" id="prev" aria-label="Anterior">‹</button>
          <button class="iconbtn" id="next" aria-label="Próximo">›</button>
        </div>
      </div>

      <div class="track-wrap">
        <div class="track" id="track">
          <article class="slide" data-kind="food"><div class="img"></div><div class="body"><div class="kicker"><i></i> Alimentação</div><h4>Refeições do dia</h4><p>Entrega organizada com apoio local.</p><div class="meta"><span>Hoje</span><span>Atualização</span></div></div></article>
          <article class="slide" data-kind="food"><div class="img"></div><div class="body"><div class="kicker"><i></i> Nutrição</div><h4>Foco no básico</h4><p>Nutrição constante muda o futuro.</p><div class="meta"><span>Semanal</span><span>Relato</span></div></div></article>
          <article class="slide" data-kind="school"><div class="img"></div><div class="body"><div class="kicker"><i></i> Educação</div><h4>Reforço escolar</h4><p>Materiais e acompanhamento.</p><div class="meta"><span>Ativo</span><span>Programa</span></div></div></article>
          <article class="slide" data-kind="health"><div class="img"></div><div class="body"><div class="kicker"><i></i> Saúde</div><h4>Kits de higiene</h4><p>Prevenção custa pouco.</p><div class="meta"><span>Mensal</span><span>Entrega</span></div></div></article>
          <article class="slide" data-kind="health"><div class="img"></div><div class="body"><div class="kicker"><i></i> Comunidade</div><h4>Rede local</h4><p>Continuidade com parceiros.</p><div class="meta"><span>Contínua</span><span>Ação</span></div></div></article>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="doar">
  <div class="container">
    <div class="section-head">
      <div>
        <h2>Doações</h2>
        <p>Agora salva no servidor (arquivo JSON). Sem MySQL.</p>
      </div>
    </div>

    <div class="donation-wrap">
      <div class="panel">
        <div class="ph"><h3>Resumo</h3><span class="pill"><span class="dot"></span> Transparência</span></div>
        <div class="pc">
          <div class="metrics">
            <div class="metric"><b id="donationCount">0</b><span>Doações registradas</span></div>
            <div class="metric"><b id="donationTotal">R$ 0,00</b><span>Total arrecadado</span></div>
            <div class="metric"><b id="avgDonation">R$ 0,00</b><span>Média por doação</span></div>
          </div>
          <div class="helper" style="margin-top:12px">Obs: isto não processa pagamento; só registra (você integra depois).</div>
        </div>
      </div>

      <div class="panel">
        <div class="ph"><h3>Registrar doação</h3><span class="pill">Rápido</span></div>
        <div class="pc">
          <div class="success" id="successBox">Doação registrada. Obrigado!</div>

          <div class="quick">
            <button class="q" data-amount="10">10</button>
            <button class="q" data-amount="25">25</button>
            <button class="q" data-amount="50">50</button>
            <button class="q" data-amount="100">100</button>
            <button class="q" data-amount="200">200</button>
          </div>

          <form class="form" id="donationForm">
            <div class="row">
              <div>
                <label for="donorName">Seu nome</label>
                <input id="donorName" maxlength="40" required />
              </div>
              <div>
                <label for="currency">Moeda</label>
                <select id="currency">
                  <option value="BRL">BRL (R$)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div class="row">
              <div>
                <label for="amount">Valor</label>
                <input id="amount" type="number" min="1" step="1" required />
              </div>
              <div>
                <label for="purpose">Destino</label>
                <select id="purpose">
                  <option>Alimentação</option>
                  <option>Educação</option>
                  <option>Saúde</option>
                  <option>Onde for mais necessário</option>
                </select>
              </div>
            </div>

            <div>
              <label for="note">Mensagem (opcional)</label>
              <input id="note" maxlength="80" />
            </div>

            <button class="btn primary" type="submit">Confirmar</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="comentarios">
  <div class="container">
    <div class="section-head">
      <div>
        <h2>Comentários</h2>
        <p>Salva no servidor em JSON (sem MySQL).</p>
      </div>
    </div>

    <div class="comments">
      <div class="panel">
        <div class="ph"><h3>Deixar comentário</h3><span class="pill">Respeito</span></div>
        <div class="pc">
          <form class="form" id="commentForm">
            <div class="row">
              <div>
                <label for="cName">Nome</label>
                <input id="cName" maxlength="40" required />
              </div>
              <div>
                <label for="cCity">Cidade/País (opcional)</label>
                <input id="cCity" maxlength="40" />
              </div>
            </div>

            <div>
              <label for="cText">Comentário</label>
              <textarea id="cText" maxlength="400" required></textarea>
              <div class="helper">Comentários ofensivos são bloqueados.</div>
            </div>

            <button class="btn primary" type="submit">Publicar</button>
          </form>
        </div>
      </div>

      <div class="panel">
        <div class="ph"><h3>Mensagens</h3><span class="pill"><span class="dot"></span> Atualiza</span></div>
        <div class="pc">
          <div id="commentList" style="display:grid; gap:10px;"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<?php require __DIR__ . "/footer.php"; ?>
