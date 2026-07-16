# AutoSAC — Sistema de Atendimento ao Cliente
### Pós-Venda / Concessionária de Veículos

---

## Estrutura do projeto

```
sac-concessionaria/
├── index.html        ← Toda a estrutura HTML das páginas
├── css/
│   └── style.css     ← Estilos, cores, layout e responsivo
├── js/
│   ├── data.js       ← Marcas, modelos e dados de exemplo
│   └── app.js        ← Toda a lógica: formulário, garantia, NPS, gráficos
└── README.md
```

---

## Como abrir no VS Code

1. Instale o VS Code em **code.visualstudio.com**
2. `File → Open Folder` → selecione a pasta `sac-concessionaria`
3. Instale a extensão **Live Server** (`Ctrl+Shift+X` → buscar "Live Server")
4. Clique com o botão direito em `index.html` → **Open with Live Server**
5. O sistema abre em `http://127.0.0.1:5500`

---

## Como publicar no GitHub Pages

```bash
git init
git add .
git commit -m "Primeiro commit — AutoSAC"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/sac-concessionaria.git
git push -u origin main
```

No repositório GitHub: **Settings → Pages → Branch: main → Save**

Link do site: `https://SEU_USUARIO.github.io/sac-concessionaria/`

---

## Funcionalidades

- Cadastro de cliente e veículo (20+ marcas com modelos)
- Cálculo automático de garantia: 0 km (2 anos/100k km) | Usado (90 dias/10k km)
- Registro de seguro com seguradora, apólice e cobertura
- Canal de atendimento: Ligação, WhatsApp, E-mail, Presencial
- NPS 0–10 com cores automáticas
- Follow-ups: D+5, mensal, anual (interesse em troca)
- Painel de alertas com atrasados destacados
- Histórico de atendimentos em linha do tempo
- Relatórios: canais, NPS por mês, desempenho por atendente
- Totalmente responsivo (mobile/tablet/desktop)

---

## Como personalizar

**Adicionar funcionários** — edite os `<select>` com "Ana Lima" em `index.html`

**Adicionar marcas** — edite `MARCAS_MODELOS` em `js/data.js`:
```js
'Minha Marca': ['Modelo A', 'Modelo B'],
```

**Alterar regras de garantia** — edite `atualizarGarantia()` em `js/app.js`

**Conectar a banco de dados** — substitua o `showToast` em `salvarAtendimento()` por uma chamada `fetch()` para sua API

---

*Sem frameworks, sem build tools. Abre direto no navegador.*
