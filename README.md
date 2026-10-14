# aniversario

Site de feliz aniversário — uma cartinha de presente interativa, pensada
primeiro para smartphones (proporção 9:16).

A tela inicial mostra um envelope branco fechado, com selo de cera preta e um
pingente, cercado por ornamentos minimalistas em preto e cinza. Ao tocar na
carta, a aba do envelope se abre, o selo se desprende e o conteúdo do presente
aparece suavemente.

## Estrutura

```
.
├── index.html      # estrutura da tela e a ilustração do envelope (SVG)
├── styles.css      # estética editorial, layout 9:16 e animações
├── script.js       # decoração gerada dinamicamente + abertura da carta
├── favicon.svg     # ícone (estrela de quatro pontas)
├── _headers        # cabeçalhos HTTP para o Cloudflare Pages
└── README.md
```

Sem build, sem dependências: é HTML, CSS e JavaScript puros.

## Rodar localmente

```bash
# opção 1 — Python
python3 -m http.server 8000

# opção 2 — Node
npx serve .
```

Depois abra `http://localhost:8000` e use o modo responsivo do navegador
(ex.: iPhone) para ver a proporção 9:16.

## Personalizar o presente

Abra `script.js` e edite o objeto `GIFT` no topo do arquivo:

```js
const GIFT = {
  eyebrow: "para você",
  name: "Feliz aniversário",
  message: "escreva aqui a sua mensagem...",
  audio: "" // coloque o nome do arquivo de música, ex.: "musica.mp3"
};
```

- `name` — o título que aparece depois de abrir a carta.
- `message` — a mensagem. Use `\n` para quebrar linhas.
- `audio` — se preencher, a música começa **depois** do toque do usuário
  (assim o navegador permite a reprodução automática). Coloque o arquivo de
  áudio na raiz do projeto.

## Publicar no Cloudflare Pages

### Opção A — direto pelo painel (mais simples)

1. Suba este repositório no GitHub (já está em
   `https://github.com/Souzzaaxzy/aniversario`).
2. No painel da Cloudflare, vá em **Workers & Pages → Create → Pages →
   Connect to Git**.
3. Selecione o repositório `aniversario`.
4. Configuração de build:
   - **Framework preset:** `None`
   - **Build command:** *(deixe vazio)*
   - **Build output directory:** `/` (a raiz do repositório)
5. Clique em **Save and Deploy**. Em instantes o site fica no ar em
   `https://aniversario.pages.dev`.

### Opção B — via Wrangler (linha de comando)

```bash
npm install -g wrangler
wrangler pages deploy . --project-name=aniversario
```

Cada `git push` na branch `main` gera um novo deploy automático (na opção A).

## Observações

- O site é 100% estático, então funciona em qualquer host estático
  (Cloudflare Pages, GitHub Pages, Netlify, Vercel).
- A música só toca após o toque na carta, aproveitando a interação do usuário
  para liberar o áudio no navegador.
