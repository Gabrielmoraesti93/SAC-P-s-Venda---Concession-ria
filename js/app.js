// ============================================================
//  app.js — Lógica principal do AutoSAC
//  Sistema de Atendimento ao Cliente / Pós-Venda
// ============================================================

// ======================== INICIALIZAÇÃO ========================

document.addEventListener('DOMContentLoaded', () => {
  setCurrentDate();
  preencherMarcas();
  gerarBotoesNPS();
  definirDataHoraAtual();
  definirProximoFollowup(5); // D+5 padrão
  renderFollowups();
  renderHistorico();
  renderClientes();
  renderRelatorios();
});

// ======================== UTILITÁRIOS ========================

function setCurrentDate() {
  const el = document.getElementById('current-date');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
}

function definirDataHoraAtual() {
  const el = document.getElementById('at-data');
  if (!el) return;
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  el.value = new Date(now - offset).toISOString().slice(0, 16);
}

function definirProximoFollowup(dias) {
  const el = document.getElementById('fu-data');
  if (!el) return;
  const d = new Date();
  d.setDate(d.getDate() + dias);
  el.value = d.toISOString().split('T')[0];
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  const icon = type === 'success' ? '<i class="ti ti-check"></i>' : '<i class="ti ti-alert-circle"></i>';
  t.innerHTML = icon + msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ======================== NAVEGAÇÃO ========================

function navigateTo(e, page) {
  if (e) e.preventDefault();
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.add('active');

  const navEl = document.querySelector(`[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');

  const titles = {
    'novo-atendimento': 'Novo atendimento',
    'followups':        'Follow-ups',
    'clientes':         'Clientes',
    'historico':        'Histórico',
    'relatorios':       'Relatórios'
  };
  const titleEl = document.getElementById('topbar-title');
  if (titleEl) titleEl.textContent = titles[page] || page;

  // Fechar sidebar no mobile
  if (window.innerWidth <= 900) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ======================== MARCAS E MODELOS ========================

function preencherMarcas() {
  const sel = document.getElementById('vei-marca');
  if (!sel) return;
  Object.keys(MARCAS_MODELOS).sort().forEach(marca => {
    const opt = document.createElement('option');
    opt.value = marca;
    opt.textContent = marca;
    sel.appendChild(opt);
  });
}

function carregarModelos() {
  const marca = document.getElementById('vei-marca').value;
  const sel = document.getElementById('vei-modelo');
  sel.innerHTML = '<option value="">Selecione o modelo</option>';
  (MARCAS_MODELOS[marca] || []).forEach(modelo => {
    const opt = document.createElement('option');
    opt.value = modelo;
    opt.textContent = modelo;
    sel.appendChild(opt);
  });
}

// ======================== GARANTIA ========================

function atualizarGarantia() {
  const tipo      = document.getElementById('vei-tipo').value;
  const dataVenda = document.getElementById('vei-data-venda').value;
  const kmAtual   = parseInt(document.getElementById('vei-km-atual').value) || 0;

  const infoBox = document.getElementById('garantia-info-box');
  const grid    = document.getElementById('garantia-grid');

  if (!tipo || !dataVenda) {
    infoBox.style.display = 'flex';
    grid.style.display    = 'none';
    return;
  }

  infoBox.style.display = 'none';
  grid.style.display    = 'grid';

  const venda = new Date(dataVenda);
  const agora = new Date();
  const dias  = Math.floor((agora - venda) / (1000 * 60 * 60 * 24));

  let ativa, textoLimite, textoUso;

  if (tipo === 'zero') {
    ativa        = dias <= 730 && kmAtual <= 100000;
    textoLimite  = '2 anos / 100.000 km';
    textoUso     = `${dias} dias · ${kmAtual.toLocaleString('pt-BR')} km rodados`;
  } else {
    ativa        = dias <= 90 && kmAtual <= 10000;
    textoLimite  = '90 dias / 10.000 km';
    textoUso     = `${dias} dias · ${kmAtual.toLocaleString('pt-BR')} km rodados`;
  }

  ['cambio', 'freios', 'motor'].forEach(comp => {
    const statusEl = document.getElementById(`g-${comp}-status`);
    const badgeEl  = document.getElementById(`g-${comp}-badge`);
    statusEl.textContent = `${textoUso} — limite: ${textoLimite}`;
    badgeEl.textContent  = ativa ? 'Ativa' : 'Expirada';
    badgeEl.className    = `garantia-badge ${ativa ? 'badge-ok' : 'badge-exp'}`;
  });
}

// ======================== TOGGLES ========================

function toggleField(groupId, btn, val, targetId) {
  const group = document.getElementById(groupId);
  group.querySelectorAll('.btn-toggle').forEach(b => {
    b.classList.remove('active-sim', 'active-nao', 'active-talvez');
  });

  if (val === 'sim')     btn.classList.add('active-sim');
  else if (val === 'nao') btn.classList.add('active-nao');
  else                   btn.classList.add('active-talvez');

  const target = document.getElementById(targetId);
  if (target) target.style.display = (val === 'sim') ? 'block' : 'none';
}

function toggleTroca(btn, val) {
  const group = document.getElementById('tg-troca');
  group.querySelectorAll('.btn-toggle').forEach(b => {
    b.classList.remove('active-sim', 'active-nao', 'active-talvez');
  });
  if (val === 'sim')     btn.classList.add('active-sim');
  else if (val === 'nao') btn.classList.add('active-nao');
  else                   btn.classList.add('active-talvez');

  document.getElementById('sec-troca-det').style.display = (val === 'sim') ? 'block' : 'none';
}

// ======================== CANAL ========================

function selecionaCanal(btn, canal) {
  document.querySelectorAll('#canal-group .canal-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('at-canal').value = canal;
}

// ======================== NPS ========================

function gerarBotoesNPS() {
  const row = document.getElementById('nps-row');
  if (!row) return;

  for (let i = 0; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nps-btn';
    btn.textContent = i;
    btn.dataset.score = i;
    btn.addEventListener('click', () => selecionaNPS(i));
    row.appendChild(btn);
  }
}

function selecionaNPS(score) {
  document.querySelectorAll('.nps-btn').forEach(b => {
    b.classList.remove('sel-danger', 'sel-warning', 'sel-success');
  });
  const btn = document.querySelector(`.nps-btn[data-score="${score}"]`);
  if (!btn) return;

  if (score <= 6)      btn.classList.add('sel-danger');
  else if (score <= 8) btn.classList.add('sel-warning');
  else                 btn.classList.add('sel-success');

  document.getElementById('at-nps').value = score;
}

// ======================== SALVAR / LIMPAR ========================

function salvarAtendimento(e) {
  e.preventDefault();

  const nome      = document.getElementById('cli-nome').value.trim();
  const canal     = document.getElementById('at-canal').value;
  const funcionario = document.getElementById('at-funcionario').value;

  if (!nome) {
    showToast('Preencha o nome do cliente.', 'error');
    document.getElementById('cli-nome').focus();
    return;
  }
  if (!canal) {
    showToast('Selecione o canal de atendimento.', 'error');
    return;
  }
  if (!funcionario) {
    showToast('Selecione o funcionário responsável.', 'error');
    return;
  }

  // Ponto de integração: aqui você conecta a uma API ou banco de dados
  // Exemplo:
  // fetch('/api/atendimentos', { method: 'POST', body: JSON.stringify({nome, canal, ...}) })

  showToast(`Atendimento de <strong>${nome}</strong> registrado com sucesso!`);
  setTimeout(() => limparFormulario(false), 1500);
}

function salvarRascunho() {
  const nome = document.getElementById('cli-nome').value.trim();
  if (!nome) {
    showToast('Preencha pelo menos o nome do cliente para salvar o rascunho.', 'error');
    return;
  }
  showToast(`Rascunho de <strong>${nome}</strong> salvo.`);
}

function limparFormulario(confirmar = true) {
  if (confirmar && !confirm('Deseja limpar todos os campos do formulário?')) return;

  document.getElementById('form-atendimento').reset();

  // Resetar estados visuais dos botões
  document.querySelectorAll('.btn-toggle').forEach(b => {
    b.classList.remove('active-sim', 'active-nao', 'active-talvez');
  });
  document.querySelectorAll('.canal-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('at-canal').value = '';

  document.querySelectorAll('.nps-btn').forEach(b => {
    b.classList.remove('sel-danger', 'sel-warning', 'sel-success');
  });
  document.getElementById('at-nps').value = '';

  // Esconder seções condicionais
  ['sec-seguro-det', 'sec-seguro-loja-det', 'sec-troca-det'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // Resetar garantia
  document.getElementById('garantia-info-box').style.display = 'flex';
  document.getElementById('garantia-grid').style.display = 'none';

  definirDataHoraAtual();
  definirProximoFollowup(5);
}

// ======================== MÁSCARAS DE INPUT ========================

function maskCPF(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  input.value = v;
}

function maskTel(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 11);
  if (v.length <= 10) {
    v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else {
    v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }
  input.value = v;
}

function maskPlaca(input) {
  let v = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
  if (v.length > 3) v = v.slice(0, 3) + '-' + v.slice(3);
  input.value = v;
}

function maskMoeda(input) {
  let v = input.value.replace(/\D/g, '');
  v = (parseInt(v || '0') / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  input.value = v;
}

// ======================== RENDER FOLLOW-UPS ========================

function renderFollowups() {
  const container = document.getElementById('followup-list');
  if (!container) return;

  const filtro = document.getElementById('fu-filtro')?.value || 'todos';

  const lista = FOLLOWUPS_EXEMPLO.filter(f => {
    if (filtro === 'todos')    return true;
    if (filtro === 'atrasado') return f.status === 'atrasado';
    if (filtro === 'hoje')     return f.status === 'hoje';
    if (filtro === 'proximo')  return f.status === 'proximo';
    return true;
  });

  if (lista.length === 0) {
    container.innerHTML = '<div class="card"><div class="card-body" style="text-align:center;color:var(--color-text-sm);padding:2rem">Nenhum follow-up encontrado para este filtro.</div></div>';
    return;
  }

  container.innerHTML = lista.map(f => {
    const dotClass   = f.status === 'atrasado' ? 'red'   : f.status === 'hoje' ? 'amber' : 'green';
    const cardClass  = f.status === 'atrasado' ? 'overdue' : f.status === 'hoje' ? 'today' : 'upcoming';
    const badgeClass = f.status === 'atrasado' ? 'badge-red' : f.status === 'hoje' ? 'badge-amber' : 'badge-green';
    const badgeLabel = f.status === 'atrasado' ? 'Atrasado'  : f.status === 'hoje' ? 'Hoje'  : 'Próximo';

    return `
      <div class="fu-card ${cardClass}">
        <div class="fu-dot ${dotClass}"></div>
        <div class="fu-main">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
            <div>
              <div class="fu-name">${f.cliente}</div>
              <div class="fu-sub">${f.veiculo} &middot; ${f.placa} &middot; ${f.data} &middot; ${f.responsavel}</div>
            </div>
            <span class="badge ${badgeClass}">${badgeLabel}</span>
          </div>
          <div class="fu-msg"><i class="ti ti-info-circle" style="font-size:12px;vertical-align:-1px;margin-right:3px"></i>${f.tipo} &mdash; ${f.obs}</div>
          <div class="fu-actions">
            <button class="btn btn-outline btn-sm" onclick="registrarContato('${f.cliente}','Ligação')">
              <i class="ti ti-phone"></i> Ligar
            </button>
            <button class="btn btn-outline btn-sm" onclick="registrarContato('${f.cliente}','WhatsApp')">
              <i class="ti ti-brand-whatsapp"></i> WhatsApp
            </button>
            <button class="btn btn-primary btn-sm" onclick="abrirAtendimento('${f.cliente}')">
              <i class="ti ti-check"></i> Registrar atendimento
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filtrarFollowups() {
  renderFollowups();
}

function registrarContato(cliente, canal) {
  showToast(`Iniciando ${canal} com ${cliente}...`);
}

function abrirAtendimento(cliente) {
  navigateTo(null, 'novo-atendimento');
  setTimeout(() => {
    const el = document.getElementById('cli-nome');
    if (el) { el.value = cliente; el.focus(); }
    showToast(`Registrando atendimento de <strong>${cliente}</strong>`);
  }, 300);
}

// ======================== RENDER HISTÓRICO ========================

function renderHistorico() {
  const container = document.getElementById('historico-list');
  if (!container) return;

  const badgeMap = {
    concluido: ['badge-green', 'Concluído'],
    pendente:  ['badge-amber', 'Pendente'],
    venda:     ['badge-blue',  'Venda'],
  };

  const html = `
    <div class="card">
      <div class="card-body">
        <div class="timeline">
          ${HISTORICO_EXEMPLO.map((h, idx) => {
            const [badgeClass, badgeLabel] = badgeMap[h.status] || ['badge-gray', h.status];
            const npsHtml = h.nps !== null
              ? `<span class="badge ${h.nps >= 9 ? 'badge-green' : h.nps >= 7 ? 'badge-amber' : 'badge-red'}" style="margin-left:6px">NPS ${h.nps}</span>`
              : '';
            return `
              <div class="tl-item">
                <div class="tl-left">
                  <div class="tl-dot-main"></div>
                  ${idx < HISTORICO_EXEMPLO.length - 1 ? '<div class="tl-line-v"></div>' : ''}
                </div>
                <div class="tl-body">
                  <div class="tl-head">
                    <div>
                      <div class="tl-title">${h.cliente} &mdash; ${h.acao}</div>
                      <div class="tl-meta">${h.data} &middot; ${h.canal} &middot; ${h.funcionario}</div>
                    </div>
                    <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;justify-content:flex-end">
                      <span class="badge ${badgeClass}">${badgeLabel}</span>${npsHtml}
                    </div>
                  </div>
                  <div class="tl-desc">${h.relato}</div>
                  ${h.encaminhamento ? `<div class="tl-desc" style="margin-top:4px;color:var(--color-primary)"><i class="ti ti-arrow-right" style="font-size:11px;vertical-align:-1px"></i> ${h.encaminhamento}</div>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
  container.innerHTML = html;
}

// ======================== RENDER CLIENTES ========================

function renderClientes(filtro = '') {
  const container = document.getElementById('clientes-list');
  if (!container) return;

  const lista = CLIENTES_EXEMPLO.filter(c =>
    !filtro ||
    c.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    c.placa.toLowerCase().includes(filtro.toLowerCase()) ||
    c.veiculo.toLowerCase().includes(filtro.toLowerCase()) ||
    c.cpf.includes(filtro)
  );

  if (lista.length === 0) {
    container.innerHTML = '<div class="card"><div class="card-body" style="text-align:center;color:var(--color-text-sm);padding:2rem">Nenhum cliente encontrado.</div></div>';
    return;
  }

  container.innerHTML = lista.map(c => {
    const iniciais = c.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
    const npsClass = !c.nps ? 'badge-gray' : c.nps >= 9 ? 'badge-green' : c.nps >= 7 ? 'badge-amber' : 'badge-red';
    const npsLabel = c.nps ? `NPS ${c.nps.toFixed(1)}` : 'Sem NPS';
    return `
      <div class="cli-card" onclick="abrirAtendimento('${c.nome}')">
        <div class="cli-avatar">${iniciais}</div>
        <div class="cli-info">
          <div class="cli-nome">${c.nome}</div>
          <div class="cli-sub">${c.veiculo} &middot; ${c.placa} &middot; ${c.tipo === 'zero' ? '0 km' : 'Usado'} &middot; vendido em ${new Date(c.dataVenda).toLocaleDateString('pt-BR')}</div>
        </div>
        <div class="cli-meta">
          <div style="margin-bottom:4px"><span class="badge ${npsClass}">${npsLabel}</span></div>
          <div style="font-size:11px">${c.followups} contatos</div>
        </div>
      </div>
    `;
  }).join('');
}

function filtrarClientes() {
  const q = document.getElementById('cli-search')?.value || '';
  renderClientes(q);
}

// ======================== RENDER RELATÓRIOS ========================

function renderRelatorios() {
  renderChartCanal();
  renderChartNPS();
  renderChartAtendentes();
}

function renderChartCanal() {
  const container = document.getElementById('chart-canal');
  if (!container) return;
  const dados = [
    { label: 'WhatsApp',   val: 47, color: '#1A6B4A' },
    { label: 'Ligação',    val: 31, color: '#185FA5' },
    { label: 'Presencial', val: 14, color: '#B86A00' },
    { label: 'E-mail',     val: 8,  color: '#5C5A54' },
  ];
  const max = Math.max(...dados.map(d => d.val));
  container.innerHTML = dados.map(d => `
    <div class="bar-row">
      <div class="bar-label">${d.label}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(d.val/max*100).toFixed(1)}%;background:${d.color}"></div></div>
      <div class="bar-val">${d.val}%</div>
    </div>
  `).join('');
}

function renderChartNPS() {
  const container = document.getElementById('chart-nps');
  if (!container) return;
  const dados = [
    { label: 'Jan', val: 8.1 },
    { label: 'Fev', val: 7.8 },
    { label: 'Mar', val: 8.4 },
    { label: 'Abr', val: 8.9 },
    { label: 'Mai', val: 8.7 },
  ];
  container.innerHTML = dados.map(d => `
    <div class="bar-row">
      <div class="bar-label">${d.label}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(d.val/10*100).toFixed(1)}%;background:${d.val >= 9 ? '#1A6B4A' : d.val >= 7 ? '#B86A00' : '#C1362A'}"></div></div>
      <div class="bar-val">${d.val.toFixed(1)}</div>
    </div>
  `).join('');
}

function renderChartAtendentes() {
  const container = document.getElementById('chart-atendentes');
  if (!container) return;
  const dados = [
    { nome: 'Ana Lima',        atend: 48, nps: 9.1 },
    { nome: 'Carlos Mendes',   atend: 42, nps: 8.3 },
    { nome: 'Fernanda Rocha',  atend: 39, nps: 8.8 },
    { nome: 'Lucas Pires',     atend: 31, nps: 7.6 },
    { nome: 'Rafael Souza',    atend: 27, nps: 8.2 },
  ];
  const max = Math.max(...dados.map(d => d.atend));
  container.innerHTML = dados.map(d => `
    <div class="atendente-row">
      <div class="atendente-name">${d.nome}</div>
      <div class="atendente-num">${d.atend}</div>
      <div class="atendente-track"><div class="atendente-fill" style="width:${(d.atend/max*100).toFixed(1)}%"></div></div>
      <div class="atendente-nps"><span class="badge ${d.nps >= 9 ? 'badge-green' : d.nps >= 7 ? 'badge-amber' : 'badge-red'}" style="font-size:10px">${d.nps.toFixed(1)}</span></div>
    </div>
  `).join('');
}
