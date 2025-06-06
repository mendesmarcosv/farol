# FAROL - Interface da Aplicação

Uma plataforma digital com foco em acessibilidade e empatia, projetada para auxiliar pessoas em situações de desastre natural.

## 🎯 Visão Geral

A aplicação FAROL é uma interface mobile-first que funciona por comando de voz (com opção de texto) e orienta usuários sobre abrigos, fornece apoio emocional, conecta voluntários a locais de ajuda e direciona doações de forma transparente.

## 📱 Funcionalidades Principais

### Tipos de Usuário

1. **Pessoa em situação de emergência**
   - Busca abrigo e apoio emocional
   - Interação por voz ou texto
   - Orientações geolocalizadas
   - Botão de "Ajuda Agora" para emergências

2. **Voluntário(a)**
   - Informa disponibilidade para ajudar
   - Recebe indicações de locais e tarefas
   - Pode confirmar presença ou indisponibilidade

3. **Doador(a)**
   - Informa intenção de doar (itens ou dinheiro)
   - Recebe sugestões por região
   - Acesso direto a PIX e QR Codes

### Interface e Navegação

- **Tela Inicial**: Orbe animado central com opção de voz/texto
- **Seleção de Cenário**: 3 opções simuladas de fala
- **Conversa**: Bolhas de diálogo com áudio simulado
- **Resultados**: Cards com informações e ações
- **Modo Texto**: Chat alternativo para acessibilidade

## 🏗️ Estrutura de Arquivos

```
app/
├── index.html          # Página principal
├── css/
│   └── main.css       # Estilos principais
├── js/
│   ├── main.js        # Lógica principal da aplicação
│   ├── speech.js      # Módulo de voz e áudio
│   └── scenarios.js   # Dados e cenários
├── audio/             # Arquivos de áudio (a serem adicionados)
├── images/            # Imagens da aplicação
└── README.md          # Este arquivo
```

## 🚀 Como Usar

### 1. Abrir a Aplicação

Abra o arquivo `index.html` em um navegador moderno. A aplicação é compatível com:
- Chrome (recomendado)
- Firefox
- Safari
- Edge

### 2. Navegação Principal

1. **Toque no orbe central** para iniciar a interação por voz
2. **Use o botão "Modo Texto"** para navegação por texto
3. **Selecione um cenário** das 3 opções apresentadas:
   - 🚨 "Estou com medo, não sei para onde ir"
   - 🤝 "Quero me voluntariar para ajudar"
   - ❤️ "Gostaria de doar alguma coisa"

### 3. Fluxos de Interação

#### Emergência
- Mostra abrigos próximos
- Opções de apoio emocional
- Contatos de emergência
- Botão "Ajuda Agora" para situações críticas

#### Voluntariado
- Lista oportunidades próximas
- Cadastro de habilidades
- Necessidades urgentes da região

#### Doações
- Pontos de coleta de itens
- Doações em dinheiro (PIX)
- Necessidades mais urgentes

## 🎨 Design e Acessibilidade

### Paleta de Cores
- **Verde Principal**: `#54BF44` (confiança e crescimento)
- **Verde Escuro**: `#263228` (textos principais)
- **Verde Claro**: `#DEF3C6` (highlights)
- **Vermelho Emergência**: `#dc3545`
- **Azul Voluntário**: `#0d6efd`
- **Laranja Doação**: `#fd7e14`

### Princípios de Acessibilidade
- Interface mobile-first
- Navegação por voz E texto
- Alto contraste
- Textos legíveis
- Botões grandes e claros
- Animações suaves (respeitando prefers-reduced-motion)

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos responsivos com CSS Grid/Flexbox
- **JavaScript ES6+**: Lógica da aplicação (classes, async/await)
- **Bootstrap 5**: Sistema de grid e componentes
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia (Montserrat + Rethink Sans)

## 🎤 Funcionalidades de Voz

### Speech Synthesis (Text-to-Speech)
- Respostas do FAROL faladas
- Suporte a voz portuguesa
- Fallback para textos quando áudio não disponível

### Audio Simulation
- Simula reprodução de arquivos de áudio
- Efeitos visuais de ondas sonoras
- Controles de play/pause

### Reconhecimento de Voz (Simulado)
- Interface de gravação simulada
- Transcrições pré-definidas por cenário
- Análise de sentimento básica

## 📊 Dados Mock

A aplicação inclui dados simulados para demonstração:

### Abrigos (3 locais)
- Centro Comunitário São José
- Ginásio Municipal  
- Igreja do Bom Pastor

### Oportunidades de Voluntariado (3 tipos)
- Cozinha Solidária
- Centro de Distribuição
- Apoio Psicológico

### Pontos de Doação (3 categorias)
- Roupas e Cobertores
- Medicamentos e Higiene
- Alimentos

### Serviços de Apoio
- CVV (188)
- Grupos de apoio locais
- CAPS

## 🌐 Compatibilidade

### Navegadores Suportados
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Dispositivos Testados
- 📱 Mobile (iOS/Android)
- 💻 Desktop
- 📟 Tablet

### Funcionalidades por Dispositivo
| Funcionalidade | Mobile | Desktop | Notas |
|---|---|---|---|
| Interface Touch | ✅ | ✅ | Otimizada para touch |
| Speech Synthesis | ✅ | ✅ | Depende do navegador |
| Modo Texto | ✅ | ✅ | Alternativa acessível |
| Animações | ✅ | ✅ | Respeitando preferências |

## 🔧 Personalização

### Adicionando Áudios Reais
1. Adicione arquivos MP3 na pasta `audio/`
2. Nomeie conforme esperado no código:
   - `user-emergency.mp3`
   - `user-volunteer.mp3`
   - `user-donate.mp3`
   - `farol-emergency-response.mp3`
   - `farol-volunteer-response.mp3`
   - `farol-donate-response.mp3`

### Modificando Dados
Edite o arquivo `js/scenarios.js` para:
- Adicionar novos abrigos
- Modificar oportunidades de voluntariado
- Atualizar pontos de doação
- Personalizar respostas do FAROL

### Ajustando Estilos
No arquivo `css/main.css`:
- Modifique as variáveis CSS no `:root`
- Ajuste breakpoints responsivos
- Personalize animações

## 🐛 Solução de Problemas

### Áudio não funciona
- Verifique se o navegador permite autoplay
- Teste com interação do usuário primeiro
- Verifique se os arquivos de áudio existem

### Animações lentas
- Verifique se `prefers-reduced-motion` está ativo
- Teste em um dispositivo com mais performance
- Desative animações em `main.css`

### Layout quebrado no mobile
- Verifique a meta tag viewport
- Teste em diferentes tamanhos de tela
- Valide CSS no console do navegador

## 📈 Próximos Passos

### Integrações Planejadas
- [ ] API de geolocalização real
- [ ] Integração com serviços de emergência
- [ ] Base de dados real
- [ ] Sistema de notificações push
- [ ] PWA (Progressive Web App)

### Melhorias de Acessibilidade
- [ ] Leitor de tela completo
- [ ] Navegação por teclado
- [ ] Modo alto contraste
- [ ] Suporte a libras

### Funcionalidades Avançadas
- [ ] Mapa interativo
- [ ] Chat com voluntários
- [ ] Sistema de rating
- [ ] Histórico de interações

## 📞 Suporte

Para dúvidas ou problemas com a aplicação:
1. Verifique este README primeiro
2. Consulte os comentários no código
3. Teste em um navegador diferente
4. Verifique o console do navegador para erros

---

**FAROL** - Sua luz em momentos difíceis 🔦 