# FrameXtractor - Documentação Técnica e de Design

FrameXtractor é uma ferramenta web client-side (navegador) para extração segura e instantânea de frames de vídeos.

## 1. Metodologia e Filosofia
O projeto segue uma abordagem **Privacy-First** e **Serverless**:
-   **Client-Side Processing**: Todo o processamento ocorre no navegador do usuário. O vídeo nunca é enviado para um servidor, garantindo privacidade total e velocidade instantânea (sem upload/download).
-   **Vanilla JS & Modern Web APIs**: Utiliza HTML5, CSS3 e JavaScript puro (ES6+) para máxima performance e leveza, sem frameworks pesados como React ou Vue, garantindo carregamento rápido.
-   **Design System Glassmorphism**: Uma estética moderna e premium que utiliza transparências e desfoque (`backdrop-filter`) para criar profundidade e hierarquia visual.

## 2. Estrutura do Projeto

A estrutura de arquivos é organizada para manter a separação de responsabilidades:

```
FrameXtractor/
├── index.html       # Página Principal (App)
├── howto.html       # Página de Instruções
├── about.html       # Página Sobre
├── css/
│   └── main.css     # Estilos globais, variáveis, tema Glass e componentes
├── js/
│   ├── app.js       # Lógica principal da aplicação (Controller)
│   └── theme.js     # Gerenciamento de tema Claro/Escuro
└── public/          # Assets estáticos (ícones, imagens)
```

## 3. Lógica de Extração

A extração de frames utiliza o elemento HTML5 `<canvas>` como intermediário.

### Extração de Frame Único
1.  O vídeo é pausado no `currentTime` desejado via slider ou controles.
2.  Desenhamos o quadro atual do vídeo no Canvas: `ctx.drawImage(video, 0, 0)`.
3.  O Canvas é convertido para uma URL de dados (Blob/DataURL) no formato escolhido (PNG/JPEG).
4.  A imagem resultante é exibida na tela para download.

### Extração em Lote ("All Frames") - Lógica Robusta
Esta funcionalidade permite extrair múltiplos frames com base em uma taxa de quadros (FPS) definida pelo usuário.
1.  **Cálculo de Intervalo**: Determinamos o salto de tempo: `intervalo = 1 / FPS`.
2.  **Loop Assíncrono Bloqueante**:
    *   Iteramos do tempo `0` até a `duração` total do vídeo.
    *   Definimos `video.currentTime = tempo_atual`.
    *   **Aguardamos o evento `seeked`**: Utilizamos uma Promessa que só resolve quando o navegador confirma que o frame está carregado e pronto para renderização. Isso garante precisão frame-perfect.
    *   Desenhamos no Canvas e convertemos para Blob.
    *   Adicionamos o Blob em um objeto `JSZip` (biblioteca de compactação).
    *   **Yielding (`setTimeout`)**: A cada frame, pausamos a execução por 0ms para devolver o controle à Thread Principal da UI. Isso previne o congelamento da página ("Travamento") durante operações longas.
3.  **Geração do ZIP**: Ao final, o JSZip compila todos os arquivos e dispara o download automático.

## 4. Fluxos de Usuário (User Flows)

### Fluxo Principal: Extração
1.  **Upload**: Usuário arrasta um vídeo para a DropZone ou clica para selecionar.
2.  **Preview & Ajustes**:
    *   O vídeo carrega no player **Plyr** customizado.
    *   Usuário navega até o momento desejado (ou configura FPS para extração total).
3.  **Processamento**:
    *   Usuário clica em "Extract Frame".
    *   O sistema exibe barra de progresso e botão de "Stop".
    *   Resultado aparece abaixo.
4.  **Download**:
    *   Usuário clica em "Download" para salvar a imagem ou ZIP.

## 5. UI/UX Design

### Identidade Visual
-   **Glassmorphism**: Painéis flutuantes com fundo translúcido (`rgba(0,0,0,0.6)`) e desfoque (`blur(15px)`). O uso de bordas semitransparentes (`1px solid rgba(255,255,255,0.1)`) cria separação clara.
-   **Cores**: Tema escuro profundo com acentos em **Cyan Neon** (`#00d4ff`).
-   **Tipografia**: *Inter* (Google Fonts) para legibilidade limpa e moderna.

### Player de Vídeo (Customizado)
-   Utilizamos a biblioteca **Plyr.js** para substituir o player nativo inconsistente dos navegadores.
-   **Estilização Profunda**:
    *   Barra de controle flutuante em formato de "pílula", centralizada e sem tocar as bordas.
    *   Botões estritamente circulares (`border-radius: 50%`) com efeitos de brilho (`box-shadow`) ao passar o mouse, eliminando cliques acidentais e melhorando a estética.
    *   **Layout Responsivo**: Adapta-se automaticamente a vídeos verticais (9:16) escondendo controles desnecessários e evitando bloquear a visualização.
    *   **Sem Bordas Pretas**: O container do vídeo é transparente e flexível, permitindo que o vídeo ocupe apenas o espaço necessário.

### Feedback e Interação
-   **Micro-interações**: Botões escalam (`scale(1.02)`) ao passar o mouse para feedback tátil.
-   **Estados de Carregamento**: Spinners e barras de progresso informam o status de operações longas.
-   **Prevenção de Erros**:
    *   Botão de "Stop" permite cancelar processos pesados a qualquer momento.
    *   Alerta de memória se tentar extrair >1000 frames.
    *   Validação de tipo de arquivo na seleção.
