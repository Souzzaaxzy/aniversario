# aniversario

Site de feliz aniversário — uma cartinha de presente interativa, pensada
primeiro para smartphones (proporção 9:16).

A tela inicial mostra um envelope branco fechado, com selo de cera preta e um
pingente, cercado por ornamentos minimalistas em preto e cinza.

Ao tocar na carta, ela abre: a aba superior levanta, o selo de cera se solta e
o pingente cai. Em seguida abre uma tela clara com um **cartão escuro arredondado
no estilo do widget "tocando agora" do Centro de Controle do iOS**: capa (a foto),
título e artista, barra de progresso com tempos e os controles de anterior,
play/pause e próxima — tudo desenhado em SVG.

Acima do cartão ficam **dois personagens** (um menino e uma menina) apoiados no
topo do card, olhando um para o outro — ambos de roxo. A menina tem cabelo liso
comprido com franja; o menino tem cabelo cacheado e blusa sem gola. Desenhados
em SVG, com gradientes e sombras suaves.

Os botões são apenas visuais. A música começa no toque da carta e a **barra de
progresso corre junto com o áudio em loop** — quando a música termina, ela
reinicia do começo.

Depois de **3 segundos** vendo o card do player, a tela **rola automaticamente**
para a segunda parte: uma tela sóbria com os dois nomes grandes (**Leo** e
**Gigica**) separados por um coração. A rolagem usa *scroll snap*, então dá pra
voltar e avançar arrastando também.

Quando a segunda tela aparece, começa uma pequena cena:

1. Depois de **2 segundos**, os dois personagens entram: o menino pela borda
   esquerda e a menina pela direita, vindo **pulando** até o centro.
2. O menino **entrega um anel** para a menina.
3. A menina pega o anel e **saem mini corações** da cabeça dela.
4. Os dois **se abraçam** e travam nesse abraço.
5. Logo depois, **um coração grande sobe atrás deles**, cobrindo o casal, e
   eles ficam parados abraçados dentro do coração.

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

## Personalizar

**Música e foto:** troque os arquivos `music.mp3` e `photo.jpg` na raiz do
projeto (mantendo os mesmos nomes) e o player atualiza sozinho.

**Título e artista:** no `index.html`, nos elementos `#playerTitle` e
`#playerArtist`.

A música começa **depois** do toque do usuário (assim o navegador permite a
reprodução automática) e fica em loop.

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
