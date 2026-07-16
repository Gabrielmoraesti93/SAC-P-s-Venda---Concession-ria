// ============================================================
//  data.js — Dados estáticos e exemplos de registros
//  AutoSAC - Sistema de Atendimento ao Cliente / Pós-Venda
// ============================================================

// ---------- MARCAS E MODELOS ----------
const MARCAS_MODELOS = {
  'Chevrolet':     ['Onix','Onix Plus','Tracker','S10','Montana','Cruze','Equinox','Spin','Trailblazer'],
  'Fiat':          ['Argo','Pulse','Fastback','Mobi','Strada','Toro','Doblo','500e','Cronos'],
  'Ford':          ['Territory','Maverick','Bronco Sport','Ranger','Transit','Mustang Mach-E'],
  'Honda':         ['Civic','HR-V','CR-V','Fit','City','City Hatchback','WR-V','ZR-V'],
  'Hyundai':       ['HB20','HB20S','Creta','Tucson','Santa Fe','Elantra','Ioniq 6'],
  'Jeep':          ['Renegade','Compass','Commander','Grand Cherokee','Gladiator','Avenger'],
  'Mitsubishi':    ['Eclipse Cross','Outlander','L200 Triton','ASX','Pajero Sport'],
  'Nissan':        ['Kicks','Frontier','Versa','Sentra','X-Trail'],
  'Peugeot':       ['208','2008','3008','408','e-208','e-2008'],
  'Renault':       ['Kwid','Sandero','Logan','Duster','Captur','Oroch','Kardian'],
  'Toyota':        ['Corolla','Corolla Cross','Hilux','SW4','Yaris','RAV4','Prius','Corolla GR'],
  'Volkswagen':    ['Polo','Virtus','Nivus','T-Cross','Taos','Tiguan','Amarok','Saveiro','ID.4'],
  'Volvo':         ['XC40','XC60','XC90','S60','V60','C40 Recharge'],
  'BMW':           ['Serie 1','Serie 3','Serie 5','X1','X3','X5','iX1','i4'],
  'Mercedes-Benz': ['Classe A','Classe C','Classe E','GLA','GLC','GLB','EQA','EQB'],
  'Audi':          ['A3','A4','Q3','Q5','Q7','e-tron','Q4 e-tron'],
  'Caoa Chery':    ['Tiggo 5X','Tiggo 7 Pro','Tiggo 8 Pro','Arrizo 6 Pro','Tiggo 5X Pro'],
  'BYD':           ['Dolphin','Seal','Yuan Plus','Atto 3','Tan','Han','Seagull'],
  'GWM':           ['Haval H6','Haval H2','ORA 03','Poer','Tank 300'],
  'Outro':         ['Outro modelo']
};

// ---------- HELPERS DE DATA ----------

function hoje() {
  return new Date().toLocaleDateString('pt-BR');
}

function diaSemana(delta) {
  const d = new Date();
  d.setDate(d.getDate() + delta);
  return d.toLocaleDateString('pt-BR');
}

// ---------- FOLLOW-UPS DE EXEMPLO ----------

const FOLLOWUPS_EXEMPLO = [
  {
    id: 1,
    cliente: 'João Silva',
    veiculo: 'Fiat Strada 2024 · Branco',
    placa: 'GHT-5J23',
    tipo: 'Primeiro contato (D+5)',
    data: diaSemana(-2),
    responsavel: 'Ana Lima',
    status: 'atrasado',
    obs: 'Veículo 0 km. Verificar se tudo correu bem na entrega.'
  },
  {
    id: 2,
    cliente: 'Maria Souza',
    veiculo: 'Toyota Corolla 2023 · Prata',
    placa: 'EFG-1A45',
    tipo: 'Follow-up mensal',
    data: diaSemana(-1),
    responsavel: 'Carlos Mendes',
    status: 'atrasado',
    obs: 'Perguntar sobre satisfação com o câmbio automático.'
  },
  {
    id: 3,
    cliente: 'Pedro Costa',
    veiculo: 'VW Polo 2025 · Azul',
    placa: 'ABC-2B78',
    tipo: 'Contato anual — interesse em troca',
    data: hoje(),
    responsavel: 'Fernanda Rocha',
    status: 'hoje',
    obs: 'Cliente completou 1 ano. Verificar interesse em trocar por SUV.'
  },
  {
    id: 4,
    cliente: 'Luciana Ferreira',
    veiculo: 'Hyundai Creta 2023 · Vermelho',
    placa: 'JKL-9C12',
    tipo: 'Mensal',
    data: diaSemana(3),
    responsavel: 'Lucas Pires',
    status: 'proximo',
    obs: 'Verificar se o recall do airbag foi resolvido na revisão.'
  },
  {
    id: 5,
    cliente: 'Roberto Alves',
    veiculo: 'Honda HR-V 2022 · Preto',
    placa: 'MNO-3D56',
    tipo: 'Pós-revisão',
    data: diaSemana(5),
    responsavel: 'Rafael Souza',
    status: 'proximo',
    obs: 'Revisão dos 15.000 km agendada. Confirmar satisfação.'
  }
];

// ---------- HISTÓRICO DE EXEMPLO ----------

const HISTORICO_EXEMPLO = [
  {
    id: 10,
    cliente: 'Pedro Costa',
    veiculo: 'VW Polo 2025',
    acao: 'Follow-up mensal',
    canal: 'WhatsApp',
    data: '22/04/2026 • 14:32',
    funcionario: 'Fernanda Rocha',
    relato: 'Cliente relatou satisfação com o veículo. Sem reclamações ou problemas.',
    encaminhamento: 'Agendado contato anual para 23/05/2026.',
    nps: 9,
    status: 'concluido'
  },
  {
    id: 11,
    cliente: 'Luciana Ferreira',
    veiculo: 'Hyundai Creta 2023',
    acao: 'Reclamação',
    canal: 'Ligação',
    data: '18/04/2026 • 10:15',
    funcionario: 'Lucas Pires',
    relato: 'Cliente relatou ruído no câmbio ao engatar marcha ré. Dentro do prazo de garantia.',
    encaminhamento: 'Redirecionada para garantia. Agendado diagnóstico para 25/04.',
    nps: 6,
    status: 'pendente'
  },
  {
    id: 12,
    cliente: 'Maria Souza',
    veiculo: 'Toyota Corolla 2023',
    acao: 'Follow-up mensal',
    canal: 'WhatsApp',
    data: '20/03/2026 • 09:00',
    funcionario: 'Carlos Mendes',
    relato: 'Perguntou sobre revisão dos 10.000 km. Dúvida sobre o que é coberto.',
    encaminhamento: 'Revisão agendada na oficina parceira para 28/03.',
    nps: 8,
    status: 'concluido'
  },
  {
    id: 13,
    cliente: 'João Silva',
    veiculo: 'Fiat Strada 2024',
    acao: 'Venda realizada',
    canal: 'Presencial',
    data: '21/05/2026 • 16:00',
    funcionario: 'Ana Lima',
    relato: 'Venda concluída. Veículo 0 km entregue com garantia de fábrica + garantia da loja.',
    encaminhamento: 'Primeiro follow-up agendado para D+5 (26/05/2026).',
    nps: null,
    status: 'venda'
  }
];

// ---------- CLIENTES DE EXEMPLO ----------

const CLIENTES_EXEMPLO = [
  { id:1, nome:'Pedro Costa',     cpf:'123.456.789-00', tel:'(11) 98765-4321', email:'pedro.costa@email.com',  veiculo:'VW Polo 2025',        placa:'ABC-2B78', tipo:'zero',  dataVenda:'2025-05-23', km:0,     followups:12, nps:9.2  },
  { id:2, nome:'Maria Souza',     cpf:'234.567.890-11', tel:'(11) 91234-5678', email:'maria.souza@email.com',  veiculo:'Toyota Corolla 2023', placa:'EFG-1A45', tipo:'usado', dataVenda:'2026-04-20', km:32000, followups:3,  nps:8.0  },
  { id:3, nome:'João Silva',      cpf:'345.678.901-22', tel:'(11) 99876-5432', email:'joao.silva@email.com',   veiculo:'Fiat Strada 2024',    placa:'GHT-5J23', tipo:'zero',  dataVenda:'2026-05-18', km:12,    followups:0,  nps:null },
  { id:4, nome:'Luciana Ferreira',cpf:'456.789.012-33', tel:'(21) 98888-1234', email:'lu.ferreira@email.com',  veiculo:'Hyundai Creta 2023',  placa:'JKL-9C12', tipo:'zero',  dataVenda:'2026-03-10', km:8500,  followups:5,  nps:6.5  },
  { id:5, nome:'Roberto Alves',   cpf:'567.890.123-44', tel:'(21) 97777-8765', email:'roberto.alves@email.com',veiculo:'Honda HR-V 2022',     placa:'MNO-3D56', tipo:'usado', dataVenda:'2025-12-01', km:28000, followups:8,  nps:8.7  }
];
