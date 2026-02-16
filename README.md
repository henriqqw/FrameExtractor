# FrameXtractor 

FrameXtractor é uma ferramenta web client-side (navegador) para extração segura, instantânea e precisa de frames de vídeos. A versão V2 foca em controle total do usuário, estabilidade para grandes arquivos e uma experiência de uso premium.

## 1. Metodologia e Filosofia
O projeto segue uma abordagem **Privacy-First** e **Serverless**:
-   **Client-Side Processing**: Todo o processamento ocorre no navegador do usuário. O vídeo nunca é enviado para um servidor, garantindo privacidade total e velocidade instantânea (sem upload/download).
-   **Vanilla JS & Modern Web APIs**: Utiliza HTML5, CSS3 e JavaScript puro (ES6+) para máxima performance e leveza, sem frameworks pesados.
-   **Design System Glassmorphism**: Uma estética moderna e premium que utiliza transparências, desfoque (`backdrop-filter`) e sombras sutis para criar profundidade e hierarquia visual.

## 2. Estrutura do Projeto

A estrutura de arquivos é organizada para manter a separação de responsabilidades:

```
FrameXtractor/
├── index.html       # Página Principal (App)
├── howto.html       # Página de Instruções
├── about.html       # Página Sobre
├── css/
│   └── main.css     # Estilos globais, variáveis, tema Glass e componentes responsivos
├── js/
│   ├── app.js       # Lógica principal (Controller), Extração, Eventos
│   └── theme.js     # Gerenciamento de tema Claro/Escuro
└── public/          # Assets estáticos (ícones, imagens)
```

## 3. Lógica de Extração e Funcionalidades V2

A extração de frames utiliza o elemento HTML5 `<canvas>` como intermediário, com lógica otimizada na V2.

### Modos de Extração
1.  **Frame Único**: Extrai o momento exato onde o vídeo está pausado.
2.  **Todos os Frames**: Extração em lote com duas sub-modalidades:
    *   **FPS (Frames Por Segundo)**: Extrai com base em uma taxa fixa (ex: 1 frame a cada segundo).
    *   **Total Frames (Novo na V2)**: O usuário define a quantidade exata de imagens finais (ex: 100 frames), e o sistema calcula o intervalo automaticamente.

### Controle de Resolução (Novo na V2)
O usuário pode escolher a resolução de saída para equilibrar qualidade e tamanho de arquivo:
-   **Presets**: 4K, 2K, 1080p, 720p, 480p.
-   **Custom**: Permite digitar uma largura específica (ex: 800px). A altura é calculada automaticamente para manter a proporção original (Aspect Ratio).

### Performance e Guardrails (Novo na V2)
Para garantir que o navegador não trave durante extrações pesadas:
-   **Troca Automática para JPEG**: Se a extração gerar >1000 frames, o formato muda automaticamente para JPEG (mais leve que PNG) para economizar memória, com notificação via Toast.
-   **Avisos de Memória**: O sistema estima o uso de RAM antes de iniciar e alerta o usuário se a extração for perigosamente grande (>2GB).
-   **Yielding de UI**: O loop de extração faz pausas programadas (`setTimeout`) para permitir que a interface do usuário se atualize e não congele.

### Player Responsivo Inteligente
-   **Aspect Ratio Dinâmico**: O container do vídeo se ajusta automaticamente à proporção do vídeo carregado (Vertical 9:16, Widescreen 16:9, etc.).
-   **Limites Inteligentes**: O player obedece `max-height: 75vh` (Desktop) e `60vh` (Mobile) para nunca "estourar" a tela ou empurrar os controles para fora de vista.

## 4. Fluxos de Usuário (User Flows)

### Fluxo Principal: Extração
1.  **Upload**: Usuário arrasta um vídeo para a DropZone ou clica para selecionar.
2.  **Preview & Ajustes**:
    *   O vídeo carrega no player customizado PLYR.
    *   Usuário escolhe o modo (Único ou Lote).
    *   Define a resolução desejada.
3.  **Processamento**:
    *   Usuário clica em "Extract Frame" ou "Start Extraction".
    *   Barra de progresso exibe status em tempo real.
    *   Botão "Stop" permite cancelar a qualquer momento.
4.  **Resultado**:
    *   Ao finalizar, a tela rola automaticamente para a área de resultados.
    *   Download disponível como imagem única ou arquivo ZIP.

## 5. UI/UX Design

### Identidade Visual
-   **Glassmorphism**: Painéis flutuantes com fundo translúcido e desfoque (`blur(15px)`).
-   **Cores**: Tema escuro profundo com acentos em **Cyan Neon** (`#00d4ff`).
-   **Hierarquia de Espaçamento**: O layout utiliza espaçamentos consistentes (`gap: 1.5rem`) e agrupamentos lógicos (`.control-group`) para facilitar a leitura.

### Player de Vídeo (Plyr Customizado)
-   Barra de controle flutuante estilo "pílula".
-   Botões circulares com feedback tátil.
-   Totalmente responsivo e adaptável a qualquer formato de vídeo.

### Feedback e Interação
-   **Toasts**: Notificações discretas no canto inferior para avisos de sistema.
-   **Auto-Scroll**: A página rola suavemente até o conteúdo relevante (ex: resultados após extração).
-   **Micro-interações**: Botões reagem ao hover/click.
