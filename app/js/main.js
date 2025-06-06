/**
 * FAROL - Main JavaScript
 * Gerencia navegação, interações e estado da aplicação
 */

class FarolApp {
    constructor() {
        this.currentScreen = 'homeScreen';
        this.currentScenario = null;
        this.audioPlayer = document.getElementById('audioPlayer');
        this.isPlaying = false;
        this.audioSequence = []; // Para controlar sequência de áudios
        this.currentAudioIndex = 0;
        this.isInAudioMode = false; // Estado para saber se está reproduzindo áudios
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAudio();
        this.showScreen('homeScreen');
        
        // Debug info
        console.log('🔦 FAROL App iniciado');
    }

    setupEventListeners() {
        // Spline container click (replacing main orb)
        const splineContainer = document.getElementById('splineContainer');
        if (splineContainer) {
            splineContainer.addEventListener('click', () => this.handleSplineClick());
        }

        // Voice button (new bottom controls)
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => this.handleVoiceButtonClick());
        }

        // Text mode button (now in bottom controls)
        const textModeBtn = document.getElementById('textModeBtn');
        if (textModeBtn) {
            textModeBtn.addEventListener('click', () => this.showTextMode());
        }

        // Back buttons
        const backToHome = document.getElementById('backToHome');
        if (backToHome) {
            backToHome.addEventListener('click', () => this.showScreen('homeScreen'));
        }

        const backToConversation = document.getElementById('backToConversation');
        if (backToConversation) {
            backToConversation.addEventListener('click', () => this.showScreen('conversationScreen'));
        }

        const backFromTextMode = document.getElementById('backFromTextMode');
        if (backFromTextMode) {
            backFromTextMode.addEventListener('click', () => this.showScreen('homeScreen'));
        }

        // Option cards (voice options screen)
        const optionCards = document.querySelectorAll('.option-card');
        optionCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const scenario = e.currentTarget.dataset.scenario;
                this.handleScenarioSelection(scenario);
            });
        });

        // Chat functionality
        const sendMessageBtn = document.getElementById('sendMessageBtn');
        const chatInput = document.getElementById('chatInput');
        
        if (sendMessageBtn) {
            sendMessageBtn.addEventListener('click', () => this.sendChatMessage());
        }
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendChatMessage();
                }
            });
        }

        // Voice modal functionality
        const closeVoiceModal = document.getElementById('closeVoiceModal');
        if (closeVoiceModal) {
            closeVoiceModal.addEventListener('click', () => this.closeVoiceModal());
        }

        // Voice modal overlay click to close
        const voiceModalOverlay = document.getElementById('voiceModalOverlay');
        if (voiceModalOverlay) {
            voiceModalOverlay.addEventListener('click', (e) => {
                if (e.target === voiceModalOverlay) {
                    this.closeVoiceModal();
                }
            });
        }

        // Voice option buttons in modal
        const voiceOptionBtns = document.querySelectorAll('.voice-option-btn');
        voiceOptionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scenario = e.currentTarget.dataset.scenario;
                this.handleVoiceOptionSelection(scenario);
            });
        });

        // Audio play buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('play-audio-btn') || e.target.closest('.play-audio-btn')) {
                this.handleAudioPlay(e);
            }
        });

        // Emergency help button
        const emergencyHelp = document.querySelector('.btn-emergency');
        if (emergencyHelp) {
            emergencyHelp.addEventListener('click', () => this.handleEmergencyHelp());
        }

        // Botão de voltar na navbar
        const navbarBackBtn = document.getElementById('navbarBackBtn');
        if (navbarBackBtn) {
            navbarBackBtn.addEventListener('click', () => {
                window.location.href = '/';
            });
        }

        // Novo: tratar clique nas opções do modo texto
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-option')) {
                let scenario = null;
                if (e.target.classList.contains('scenario-emergency')) scenario = 'emergency';
                if (e.target.classList.contains('scenario-volunteer')) scenario = 'volunteer';
                if (e.target.classList.contains('scenario-donate')) scenario = 'donate';
                if (scenario) {
                    // Animação de digitando do usuário
                    this.addChatMessage('', 'user', { typing: true });
                    setTimeout(() => {
                        // Remove typing
                        const chatMessages = document.getElementById('chatMessages');
                        if (chatMessages) {
                            const typing = chatMessages.querySelector('.user-message .typing-indicator');
                            if (typing) typing.parentElement.parentElement.remove();
                        }
                        // Mensagem do usuário
                        let userMsg = '';
                        if (scenario === 'emergency') userMsg = 'Eu preciso de um lugar seguro… tem algum abrigo por perto?';
                        if (scenario === 'volunteer') userMsg = 'Quero ajudar. Sou cozinheiro. Tem algum lugar aqui por perto precisando de ajuda?';
                        if (scenario === 'donate') userMsg = 'Quero ajudar de alguma forma, tem alguma ideia de como posso ajudar na situação?';
                        this.addChatMessage(userMsg, 'user');
                        // Animação de digitando da IA
                        this.addChatMessage('', 'farol', { typing: true });
                        setTimeout(() => {
                            // Remove typing
                            const chatMessages = document.getElementById('chatMessages');
                            if (chatMessages) {
                                const typing = chatMessages.querySelector('.farol-message .typing-indicator');
                                if (typing) typing.parentElement.parentElement.remove();
                            }
                            // Resposta da IA
                            const response = this.getFarolTextResponse('', scenario);
                            this.addChatMessage(response, 'farol', { showDetails: true });
                        }, 1200);
                    }, 800);
                }
            }
            // Botão ver detalhes
            if (e.target.classList.contains('btn-details')) {
                // Não faz nada, botão apenas visual
            }
            // Botão X do modo texto
            if (e.target.id === 'closeTextModeBtn') {
                window.location.href = 'app/index.html';
            }
        });
    }

    setupAudio() {
        if (this.audioPlayer) {
            this.audioPlayer.addEventListener('ended', () => {
                this.isPlaying = false;
                this.handleAudioEnd();
            });

            this.audioPlayer.addEventListener('timeupdate', () => {
                this.updateAudioProgress();
            });
        }
    }

    handleAudioEnd() {
        this.currentAudioIndex++;
        
        if (this.currentAudioIndex < this.audioSequence.length) {
            // Reproduzir próximo áudio na sequência
            this.playNextAudio();
        } else {
            // Sequência terminada
            this.isPlaying = false;
            this.updateVoiceButtonIcon(); // Voltar ícone para microfone
            this.finishAudioSequence();
        }
    }

    playNextAudio() {
        const nextAudio = this.audioSequence[this.currentAudioIndex];
        this.updateAudioStatus(nextAudio.status);
        this.playAudio(nextAudio.src);
    }

    finishAudioSequence() {
        // Parar animação de áudio
        this.pauseAudioAnimation();
        
        // Mostrar botão de detalhes após um pequeno delay
        setTimeout(() => {
            this.showDetailsButton();
        }, 500);
    }

    pauseAudioAnimation() {
        const audioVisualizer = document.querySelector('.audio-visualizer');
        if (audioVisualizer) {
            audioVisualizer.classList.add('paused');
        }
    }

    resumeAudioAnimation() {
        const audioVisualizer = document.querySelector('.audio-visualizer');
        if (audioVisualizer) {
            audioVisualizer.classList.remove('paused');
        }
    }

    updateAudioStatus(status) {
        const audioStatus = document.getElementById('audioStatus');
        if (audioStatus) {
            audioStatus.textContent = status;
        }
    }

    showDetailsButton() {
        const detailsButtonContainer = document.getElementById('detailsButtonContainer');
        if (detailsButtonContainer) {
            detailsButtonContainer.style.display = 'block';
            setTimeout(() => {
                detailsButtonContainer.classList.add('show');
            }, 100);
        }
    }

    hideDetailsButton() {
        const detailsButtonContainer = document.getElementById('detailsButtonContainer');
        if (detailsButtonContainer) {
            detailsButtonContainer.classList.remove('show');
            setTimeout(() => {
                detailsButtonContainer.style.display = 'none';
            }, 300);
        }
    }

    showScreen(screenId) {
        // Remove active class from all screens
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });

        // Add active class to target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            setTimeout(() => {
                targetScreen.classList.add('active');
            }, 100);
        }

        this.currentScreen = screenId;
        
        // Update voice status based on screen
        this.updateVoiceStatus(screenId);

        console.log(`📱 Navegando para: ${screenId}`);
    }

    updateVoiceStatus(screenId) {
        const voiceStatus = document.getElementById('voiceStatus');
        const statusText = voiceStatus?.querySelector('.status-text');
        
        if (!statusText) return;

        switch (screenId) {
            case 'homeScreen':
                statusText.textContent = 'Toque para falar';
                break;
            case 'voiceOptionsScreen':
                statusText.textContent = 'Escolha uma opção';
                break;
            case 'conversationScreen':
                statusText.textContent = 'Conversando...';
                break;
            default:
                statusText.textContent = '';
        }
    }

    handleSplineClick() {
        // Adiciona efeito visual
        const splineContainer = document.getElementById('splineContainer');
        splineContainer.style.transform = 'translate(-50%, -50%) scale(0.47)';
        setTimeout(() => {
            splineContainer.style.transform = 'translate(-50%, -50%) scale(0.5)';
        }, 150);
        // Abrir apenas o modal de voz
        setTimeout(() => {
            this.showVoiceModal();
        }, 300);
        console.log('🎤 Spline clicado - abrindo modal de voz');
    }

    handleVoiceButtonClick() {
        const voiceBtn = document.getElementById('voiceBtn');
        
        // Se está reproduzindo áudio, parar imediatamente
        if (this.isPlaying) {
            this.stopAudioPlayback();
            return;
        }
        
        // Se já está em modo de áudio (mas não reproduzindo), permite abrir o modal novamente
        if (this.isInAudioMode && !this.isPlaying) {
            this.showVoiceModal();
            return;
        }
        
        // Adiciona estado de gravação
        voiceBtn.classList.add('recording');
        
        // Simula gravação por alguns segundos, depois abre o modal
        setTimeout(() => {
            voiceBtn.classList.remove('recording');
            this.showVoiceModal();
        }, 2000);

        console.log('🎤 Botão de voz clicado - iniciando gravação');
    }

    stopAudioPlayback() {
        // Parar áudio imediatamente
        if (this.audioPlayer) {
            this.audioPlayer.pause();
            this.audioPlayer.currentTime = 0;
        }
        
        this.isPlaying = false;
        this.updateVoiceButtonIcon();
        this.pauseAudioAnimation();
        // Não mostrar botão de detalhes se parar antes do fim
        // this.showDetailsButton();
        console.log('⏹️ Reprodução de áudio interrompida');
    }

    showVoiceModal() {
        const voiceModalOverlay = document.getElementById('voiceModalOverlay');
        if (voiceModalOverlay) {
            voiceModalOverlay.style.display = 'flex';
            setTimeout(() => {
                voiceModalOverlay.classList.add('show');
            }, 10);
        }
        console.log('🎤 Modal de voz aberto');
    }

    closeVoiceModal() {
        const voiceModalOverlay = document.getElementById('voiceModalOverlay');
        if (voiceModalOverlay) {
            voiceModalOverlay.classList.remove('show');
            setTimeout(() => {
                voiceModalOverlay.style.display = 'none';
            }, 300);
        }
        console.log('❌ Modal de voz fechado');
    }

    handleVoiceOptionSelection(scenario) {
        // Fecha o modal primeiro
        this.closeVoiceModal();
        
        // Inicia o modo de áudio na tela inicial
        setTimeout(() => {
            this.startAudioMode(scenario);
        }, 300);
        
        console.log(`🎯 Opção de voz selecionada: ${scenario}`);
    }

    startAudioMode(scenario) {
        this.currentScenario = scenario;
        this.isInAudioMode = true;
        
        // Esconder subtitle
        this.hideSubtitle();
        
        // Mostrar animação de áudio
        this.showAudioAnimation();
        
        // Preparar sequência de áudios
        this.prepareAudioSequence(scenario);
        
        // Iniciar reprodução
        this.startAudioSequence();
        
        console.log(`🎵 Modo de áudio iniciado para: ${scenario}`);
    }

    hideSubtitle() {
        const homeSubtitle = document.getElementById('homeSubtitle');
        if (homeSubtitle) {
            homeSubtitle.style.opacity = '0';
            homeSubtitle.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                homeSubtitle.style.display = 'none';
            }, 300);
        }
    }

    showSubtitle() {
        const homeSubtitle = document.getElementById('homeSubtitle');
        if (homeSubtitle) {
            homeSubtitle.style.display = 'block';
            setTimeout(() => {
                homeSubtitle.style.opacity = '1';
                homeSubtitle.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    showAudioAnimation() {
        const audioAnimation = document.getElementById('audioAnimation');
        if (audioAnimation) {
            audioAnimation.style.display = 'block';
            setTimeout(() => {
                audioAnimation.classList.add('show');
            }, 100);
        }
    }

    hideAudioAnimation() {
        const audioAnimation = document.getElementById('audioAnimation');
        if (audioAnimation) {
            audioAnimation.classList.remove('show');
            setTimeout(() => {
                audioAnimation.style.display = 'none';
            }, 300);
        }
    }

    prepareAudioSequence(scenario) {
        // Definir sequência de áudios baseada no cenário, sempre com blip.mp3 no meio
        const audioSequences = {
            emergency: [
                {
                    src: 'assets/audio/thomas-ajuda.mp3',
                    status: 'Reproduzindo sua fala...'
                },
                {
                    src: 'assets/audio/blip.mp3',
                    status: ''
                },
                {
                    src: 'assets/audio/river-ajuda.mp3',
                    status: 'FAROL respondendo...'
                }
            ],
            volunteer: [
                {
                    src: 'assets/audio/thomas-voluntario.mp3',
                    status: 'Reproduzindo sua fala...'
                },
                {
                    src: 'assets/audio/blip.mp3',
                    status: ''
                },
                {
                    src: 'assets/audio/river-voluntario.mp3',
                    status: 'FAROL respondendo...'
                }
            ],
            donate: [
                {
                    src: 'assets/audio/thomas-doar.mp3',
                    status: 'Reproduzindo sua fala...'
                },
                {
                    src: 'assets/audio/blip.mp3',
                    status: ''
                },
                {
                    src: 'assets/audio/river-doar.mp3',
                    status: 'FAROL respondendo...'
                }
            ]
        };
        this.audioSequence = audioSequences[scenario] || audioSequences.emergency;
        this.currentAudioIndex = 0;
    }

    startAudioSequence() {
        if (this.audioSequence.length > 0) {
            // Garantir que a animação está ativa
            this.resumeAudioAnimation();
            
            const firstAudio = this.audioSequence[0];
            this.updateAudioStatus(firstAudio.status);
            this.playAudio(firstAudio.src);
        }
    }

    showDetails() {
        if (this.currentScenario) {
            // Resetar interface
            this.resetAudioMode();
            
            // Navegar para tela de conversa
            setTimeout(() => {
                this.startConversation(this.currentScenario);
            }, 300);
        }
    }

    resetAudioMode() {
        this.isInAudioMode = false;
        this.audioSequence = [];
        this.currentAudioIndex = 0;
        
        // Parar áudio se estiver tocando
        if (this.audioPlayer) {
            this.audioPlayer.pause();
            this.audioPlayer.currentTime = 0;
        }
        
        // Limpar estado pausado da animação
        this.resumeAudioAnimation();
        
        // Esconder elementos de áudio
        this.hideAudioAnimation();
        this.hideDetailsButton();
        
        // Mostrar subtitle novamente
        setTimeout(() => {
            this.showSubtitle();
        }, 300);
    }

    handleScenarioSelection(scenario) {
        this.currentScenario = scenario;

        // Play audio simulation (if available)
        this.playScenarioAudio(scenario);

        // Navigate to conversation
        setTimeout(() => {
            this.startConversation(scenario);
        }, 1000);

        console.log(`🎯 Cenário selecionado: ${scenario}`);
    }

    playScenarioAudio(scenario) {
        const audioFile = this.getScenarioAudioFile(scenario);
        if (audioFile) {
            this.playAudio(audioFile);
        }
    }

    getScenarioAudioFile(scenario) {
        const audioFiles = {
            emergency: 'assets/audios/user-emergency.mp3',
            volunteer: 'assets/audios/user-volunteer.mp3',
            donate: 'assets/audios/user-donate.mp3'
        };
        
        return audioFiles[scenario];
    }

    async startConversation(scenario) {
        this.showScreen('conversationScreen');
        
        // Show user message first
        await this.showUserMessage(scenario);
        
        // Then show FAROL typing and response
        await this.showFarolResponse(scenario);
    }

    async showUserMessage(scenario) {
        const userMessage = document.getElementById('userMessage');
        const userMessageText = document.getElementById('userMessageText');
        
        const messages = {
            emergency: "Estou com medo, não sei para onde ir",
            volunteer: "Quero me voluntariar para ajudar",
            donate: "Gostaria de doar alguma coisa"
        };

        userMessageText.textContent = messages[scenario];
        userMessage.style.display = 'flex';
        
        // Animate in
        setTimeout(() => {
            userMessage.style.opacity = '1';
            userMessage.style.transform = 'translateY(0)';
        }, 100);

        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    async showFarolResponse(scenario) {
        const farolMessage = document.getElementById('farolMessage');
        const typingIndicator = document.getElementById('typingIndicator');
        const farolMessageContent = document.getElementById('farolMessageContent');
        const farolMessageText = document.getElementById('farolMessageText');

        // Show FAROL message container
        farolMessage.style.display = 'flex';
        setTimeout(() => {
            farolMessage.style.opacity = '1';
            farolMessage.style.transform = 'translateY(0)';
        }, 100);

        // Show typing indicator
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Hide typing, show response
        typingIndicator.style.display = 'none';
        farolMessageContent.style.display = 'block';

        const responses = this.getFarolResponses(scenario);
        farolMessageText.textContent = responses.text;

        // Play FAROL audio response
        if (responses.audio) {
            this.playAudio(responses.audio);
        }

        // Show action buttons and emergency help if needed
        setTimeout(() => {
            this.showActionButtons(scenario);
            if (scenario === 'emergency') {
                this.showEmergencyHelp();
            }
        }, 2000);
    }

    getFarolResponses(scenario) {
        const responses = {
            emergency: {
                text: "Entendo como você deve estar se sentindo. Vou te ajudar a encontrar um lugar seguro. Posso acessar sua localização para encontrar abrigos próximos?",
                audio: "assets/audios/farol-emergency-response.mp3"
            },
            volunteer: {
                text: "Que bom que você quer ajudar! Existe uma força especial em pessoas como você. Vou encontrar oportunidades de voluntariado na sua região.",
                audio: "assets/audios/farol-volunteer-response.mp3"
            },
            donate: {
                text: "Sua generosidade faz toda a diferença! Vou te mostrar as necessidades mais urgentes na sua região e como você pode contribuir.",
                audio: "assets/audios/farol-donate-response.mp3"
            }
        };

        return responses[scenario];
    }

    showActionButtons(scenario) {
        const actionButtons = document.getElementById('actionButtons');
        if (!actionButtons) return;

        const buttons = this.getActionButtons(scenario);
        actionButtons.innerHTML = buttons.map(button => 
            `<button class="btn btn-action" data-action="${button.action}">
                <i class="${button.icon}"></i>
                ${button.text}
            </button>`
        ).join('');

        actionButtons.style.display = 'flex';

        // Add event listeners to new buttons
        actionButtons.querySelectorAll('.btn-action').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleActionButton(e));
        });
    }

    getActionButtons(scenario) {
        const buttons = {
            emergency: [
                { action: 'find-shelter', icon: 'fas fa-home', text: 'Encontrar Abrigo' },
                { action: 'get-support', icon: 'fas fa-heart', text: 'Apoio Emocional' },
                { action: 'emergency-contacts', icon: 'fas fa-phone', text: 'Contatos de Emergência' }
            ],
            volunteer: [
                { action: 'find-opportunities', icon: 'fas fa-search', text: 'Ver Oportunidades' },
                { action: 'register-skills', icon: 'fas fa-user-plus', text: 'Cadastrar Habilidades' },
                { action: 'nearby-needs', icon: 'fas fa-map-marker-alt', text: 'Necessidades Próximas' }
            ],
            donate: [
                { action: 'donate-items', icon: 'fas fa-box', text: 'Doar Itens' },
                { action: 'donate-money', icon: 'fas fa-donate', text: 'Doação em Dinheiro' },
                { action: 'urgent-needs', icon: 'fas fa-exclamation-circle', text: 'Necessidades Urgentes' }
            ]
        };

        return buttons[scenario] || [];
    }

    handleActionButton(event) {
        const action = event.target.closest('.btn-action').dataset.action;
        
        // Visual feedback
        const button = event.target.closest('.btn-action');
        button.style.transform = 'translateY(-3px)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);

        // Navigate to results based on action
        setTimeout(() => {
            this.showResults(action);
        }, 300);

        console.log(`🎯 Ação selecionada: ${action}`);
    }

    showResults(action) {
        this.showScreen('resultsScreen');
        
        // Update results title
        const resultsTitle = document.getElementById('resultsTitle');
        const resultsContent = document.getElementById('resultsContent');
        
        const resultData = this.getResultData(action);
        
        if (resultsTitle) {
            resultsTitle.textContent = resultData.title;
        }
        
        if (resultsContent) {
            resultsContent.innerHTML = resultData.content;
        }
    }

    getResultData(action) {
        const data = {
            'find-shelter': {
                title: 'Abrigos Próximos',
                content: this.generateShelterResults()
            },
            'find-opportunities': {
                title: 'Oportunidades de Voluntariado',
                content: this.generateVolunteerResults()
            },
            'donate-items': {
                title: 'Pontos de Doação',
                content: this.generateDonationResults()
            },
            'donate-money': {
                title: 'Doação em Dinheiro',
                content: this.generateMoneyDonationResults()
            },
            'get-support': {
                title: 'Apoio Emocional',
                content: this.generateSupportResults()
            },
            'urgent-needs': {
                title: 'Necessidades Urgentes',
                content: this.generateUrgentNeedsResults()
            }
        };

        return data[action] || { title: 'Resultados', content: '<p>Carregando...</p>' };
    }

    generateShelterResults() {
        return `
            <div class="result-card">
                <div class="result-card-header">
                    <div class="result-icon">
                        <i class="fas fa-home"></i>
                    </div>
                    <div>
                        <h3 class="result-title">Centro Comunitário São José</h3>
                        <p class="result-subtitle">1.2 km de distância</p>
                    </div>
                </div>
                <div class="result-content">
                    <div class="result-info">
                        <div class="info-item">
                            <i class="fas fa-users"></i>
                            <span>45/80 ocupação</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-utensils"></i>
                            <span>Refeições disponíveis</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-wheelchair"></i>
                            <span>Acessível</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-paw"></i>
                            <span>Aceita pets</span>
                        </div>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-result">Como Chegar</button>
                    <button class="btn btn-result btn-outline">Ligar</button>
                </div>
            </div>
            
            <div class="result-card">
                <div class="result-card-header">
                    <div class="result-icon">
                        <i class="fas fa-home"></i>
                    </div>
                    <div>
                        <h3 class="result-title">Ginásio Municipal</h3>
                        <p class="result-subtitle">2.1 km de distância</p>
                    </div>
                </div>
                <div class="result-content">
                    <div class="result-info">
                        <div class="info-item">
                            <i class="fas fa-users"></i>
                            <span>120/150 ocupação</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-shower"></i>
                            <span>Banheiros disponíveis</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-first-aid"></i>
                            <span>Atendimento médico</span>
                        </div>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-result">Como Chegar</button>
                    <button class="btn btn-result btn-outline">Mais Info</button>
                </div>
            </div>
        `;
    }

    generateVolunteerResults() {
        return `
            <div class="result-card">
                <div class="result-card-header">
                    <div class="result-icon">
                        <i class="fas fa-utensils"></i>
                    </div>
                    <div>
                        <h3 class="result-title">Cozinha Solidária</h3>
                        <p class="result-subtitle">1.5 km de distância</p>
                    </div>
                </div>
                <div class="result-content">
                    <div class="result-info">
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <span>8h às 18h</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-users"></i>
                            <span>Precisa de 5 voluntários</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-tasks"></i>
                            <span>Preparo de refeições</span>
                        </div>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-result">Quero Ajudar</button>
                    <button class="btn btn-result btn-outline">Mais Info</button>
                </div>
            </div>
            
            <div class="result-card">
                <div class="result-card-header">
                    <div class="result-icon">
                        <i class="fas fa-box"></i>
                    </div>
                    <div>
                        <h3 class="result-title">Centro de Distribuição</h3>
                        <p class="result-subtitle">800m de distância</p>
                    </div>
                </div>
                <div class="result-content">
                    <div class="result-info">
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <span>6h às 22h</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-users"></i>
                            <span>Precisa de 3 voluntários</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-tasks"></i>
                            <span>Organização de doações</span>
                        </div>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-result">Quero Ajudar</button>
                    <button class="btn btn-result btn-outline">Como Chegar</button>
                </div>
            </div>
        `;
    }

    generateDonationResults() {
        return `
            <div class="result-card">
                <div class="result-card-header">
                    <div class="result-icon">
                        <i class="fas fa-tshirt"></i>
                    </div>
                    <div>
                        <h3 class="result-title">Roupas e Cobertores</h3>
                        <p class="result-subtitle">Necessidade ALTA</p>
                    </div>
                </div>
                <div class="result-content">
                    <div class="result-info">
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Centro Comunitário - 1.2km</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <span>8h às 20h</span>
                        </div>
                    </div>
                    <p><strong>Mais necessário:</strong> Casacos, cobertores, roupas infantis</p>
                </div>
                <div class="result-actions">
                    <button class="btn btn-result">Como Chegar</button>
                    <button class="btn btn-result btn-outline">Lista Completa</button>
                </div>
            </div>
            
            <div class="result-card">
                <div class="result-card-header">
                    <div class="result-icon">
                        <i class="fas fa-medkit"></i>
                    </div>
                    <div>
                        <h3 class="result-title">Medicamentos e Higiene</h3>
                        <p class="result-subtitle">Necessidade MÉDIA</p>
                    </div>
                </div>
                <div class="result-content">
                    <div class="result-info">
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Farmácia Solidária - 900m</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <span>9h às 17h</span>
                        </div>
                    </div>
                    <p><strong>Mais necessário:</strong> Fraldas, produtos de higiene, medicamentos básicos</p>
                </div>
                <div class="result-actions">
                    <button class="btn btn-result">Como Chegar</button>
                    <button class="btn btn-result btn-outline">Lista Completa</button>
                </div>
            </div>
        `;
    }

    generateMoneyDonationResults() {
        return `
            <div class="result-card">
                <div class="result-card-header">
                    <div class="result-icon">
                        <i class="fas fa-qrcode"></i>
                    </div>
                    <div>
                        <h3 class="result-title">Doação Direta - PIX</h3>
                        <p class="result-subtitle">Fundo de Emergência Municipal</p>
                    </div>
                </div>
                <div class="result-content">
                    <p>Chave PIX: <strong>emergencia@prefeitura.gov.br</strong></p>
                    <div class="qr-code-placeholder" style="width: 200px; height: 200px; background: #f8f9fa; border: 2px dashed #dee2e6; display: flex; align-items: center; justify-content: center; margin: 1rem 0; border-radius: 10px;">
                        <span style="color: #6c757d;">QR Code do PIX</span>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-result">Copiar Chave PIX</button>
                    <button class="btn btn-result btn-outline">Compartilhar</button>
                </div>
            </div>
            
            <div class="result-card">
                <div class="result-card-header">
                    <div class="result-icon">
                        <i class="fas fa-university"></i>
                    </div>
                    <div>
                        <h3 class="result-title">Cruz Vermelha Local</h3>
                        <p class="result-subtitle">ONG Verificada</p>
                    </div>
                </div>
                <div class="result-content">
                    <p>Conta: Banco do Brasil<br>
                    Agência: 1234-5 | Conta: 67890-1</p>
                    <p><small>CNPJ: 12.345.678/0001-90</small></p>
                </div>
                <div class="result-actions">
                    <button class="btn btn-result">Mais Informações</button>
                    <button class="btn btn-result btn-outline">Site Oficial</button>
                </div>
            </div>
        `;
    }

    generateSupportResults() {
        return `
            <div class="result-card">
                <div class="result-card-header">
                    <div class="result-icon">
                        <i class="fas fa-phone"></i>
                    </div>
                    <div>
                        <h3 class="result-title">CVV - Centro de Valorização da Vida</h3>
                        <p class="result-subtitle">Apoio emocional 24h</p>
                    </div>
                </div>
                <div class="result-content">
                    <p><strong>Telefone:</strong> 188 (gratuito)</p>
                    <p>Atendimento confidencial por voluntários treinados</p>
                </div>
                <div class="result-actions">
                    <button class="btn btn-result">Ligar Agora</button>
                    <button class="btn btn-result btn-outline">Chat Online</button>
                </div>
            </div>
            
            <div class="result-card">
                <div class="result-card-header">
                    <div class="result-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <div>
                        <h3 class="result-title">Grupo de Apoio Local</h3>
                        <p class="result-subtitle">Centro Comunitário</p>
                    </div>
                </div>
                <div class="result-content">
                    <div class="result-info">
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <span>Quartas 19h</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>1.2km de distância</span>
                        </div>
                    </div>
                    <p>Grupo de apoio mútuo para pessoas em situação de crise</p>
                </div>
                <div class="result-actions">
                    <button class="btn btn-result">Participar</button>
                    <button class="btn btn-result btn-outline">Mais Info</button>
                </div>
            </div>
        `;
    }

    generateUrgentNeedsResults() {
        return `
            <div class="result-card">
                <div class="result-card-header">
                    <div class="result-icon" style="background: rgba(220, 53, 69, 0.1); color: #dc3545;">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div>
                        <h3 class="result-title">Água Potável</h3>
                        <p class="result-subtitle" style="color: #dc3545;">URGENTE</p>
                    </div>
                </div>
                <div class="result-content">
                    <p>Necessidade imediata de água potável para 200 famílias</p>
                    <div class="result-info">
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Região Norte da cidade</span>
                        </div>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-result" style="background: #dc3545;">Doar Agora</button>
                    <button class="btn btn-result btn-outline">Compartilhar</button>
                </div>
            </div>
            
            <div class="result-card">
                <div class="result-card-header">
                    <div class="result-icon" style="background: rgba(253, 126, 20, 0.1); color: #fd7e14;">
                        <i class="fas fa-baby"></i>
                    </div>
                    <div>
                        <h3 class="result-title">Itens para Bebês</h3>
                        <p class="result-subtitle" style="color: #fd7e14;">ALTA PRIORIDADE</p>
                    </div>
                </div>
                <div class="result-content">
                    <p>Fraldas, leite em pó e roupas para recém-nascidos</p>
                    <div class="result-info">
                        <div class="info-item">
                            <i class="fas fa-users"></i>
                            <span>15 bebês precisando</span>
                        </div>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-result">Doar Itens</button>
                    <button class="btn btn-result btn-outline">Lista Completa</button>
                </div>
            </div>
        `;
    }

    showEmergencyHelp() {
        const emergencyHelp = document.getElementById('emergencyHelp');
        if (emergencyHelp) {
            emergencyHelp.style.display = 'block';
        }
    }

    handleEmergencyHelp() {
        // Navigate to emergency flow
        alert('🚨 Iniciando fluxo de emergência...\n\nEsta funcionalidade direcionaria para um questionário rápido de 3 perguntas para localizar ajuda imediata.');
        console.log('🚨 Fluxo de emergência iniciado');
    }

    showTextMode() {
        this.showScreen('textModeScreen');
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
            // Adiciona mensagem inicial com opções
            const optionsHtml = `
                <div class="message-container farol-message">
                    <div class="message-avatar farol-avatar">
                        <img src="../assets/imgs/ai-orb.webp" alt="FAROL">
                    </div>
                    <div class="message-bubble farol-bubble">
                        <p>Como posso te ajudar? Escolha uma opção abaixo ou digite sua mensagem:</p>
                        <div class="text-options">
                            <button class="btn-option scenario-emergency">Preciso de Ajuda</button>
                            <button class="btn-option scenario-volunteer">Quero Ajudar</button>
                            <button class="btn-option scenario-donate">Quero Doar</button>
                        </div>
                    </div>
                </div>
            `;
            chatMessages.insertAdjacentHTML('beforeend', optionsHtml);
        }
        setTimeout(() => {
            const chatInput = document.getElementById('chatInput');
            if (chatInput) chatInput.focus();
        }, 500);
    }

    sendChatMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        if (!message) return;
        this.addChatMessage(message, 'user', { typing: false });
        chatInput.value = '';
        // Animação de digitando da IA
        this.addChatMessage('', 'farol', { typing: true });
        setTimeout(() => {
            // Remove typing
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                const typing = chatMessages.querySelector('.farol-message .typing-indicator');
                if (typing) typing.parentElement.parentElement.remove();
            }
            // Resposta padrão
            const response = this.getFarolTextResponse(message);
            this.addChatMessage(response, 'farol', { showDetails: true });
        }, 1200);
        console.log('💬 Mensagem de texto enviada:', message);
    }

    addChatMessage(message, sender, options = {}) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        let messageHtml = '';
        if (options.typing) {
            messageHtml = `
                <div class="message-container ${sender}-message">
                    <div class="message-bubble ${sender}-bubble">
                        <div class="typing-indicator">
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            messageHtml = `
                <div class="message-container ${sender}-message">
                    ${sender === 'farol' ? `
                        <div class="message-avatar farol-avatar">
                            <img src="../assets/imgs/ai-orb.webp" alt="FAROL">
                        </div>
                    ` : ''}
                    <div class="message-bubble ${sender}-bubble">
                        <p class="message-text">${message}</p>
                        ${options.showDetails ? `<button class="btn-details btn-sm">Ver detalhes</button>` : ''}
                    </div>
                    ${sender === 'user' ? `
                        <div class="message-avatar">
                            <img src="../assets/imgs/eduardo-freitas.webp" alt="Usuário">
                        </div>
                    ` : ''}
                </div>
            `;
        }
        chatMessages.insertAdjacentHTML('beforeend', messageHtml);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    getFarolTextResponse(message, scenario) {
        if (scenario === 'emergency') {
            return 'Achei um lugar seguro e com o que você precisa. Quer ver como chegar?';
        } else if (scenario === 'volunteer') {
            return 'Encontrei um abrigo que precisa de apoio na cozinha. Você topa? Posso te conectar pelo WhatsApp.';
        } else if (scenario === 'donate') {
            return 'Esses são alguns projetos que precisam de ajuda agora. Pode contribuir com uma vaquinha ou se engajar com um abrigo próximo. Quer que eu liste algumas opções?';
        }
        // Resposta padrão
        return 'Entendi! Me conte mais ou escolha uma das opções acima.';
    }

    playAudio(audioSrc) {
        if (!this.audioPlayer || !audioSrc) return;

        this.audioPlayer.src = audioSrc;
        this.audioPlayer.play()
            .then(() => {
                this.isPlaying = true;
                this.updateVoiceButtonIcon();
                console.log(`🔊 Reproduzindo: ${audioSrc}`);
            })
            .catch(error => {
                console.warn('⚠️ Arquivo de áudio não encontrado, simulando reprodução:', error);
                // Simular reprodução com timeout
                this.simulateAudioPlayback();
            });
    }

    simulateAudioPlayback() {
        this.isPlaying = true;
        this.updateVoiceButtonIcon();
        
        // Simular duração de 3 segundos
        setTimeout(() => {
            this.isPlaying = false;
            this.handleAudioEnd();
        }, 3000);
    }

    handleAudioPlay(event) {
        const button = event.target.closest('.play-audio-btn');
        if (!button) return;

        if (this.isPlaying) {
            this.audioPlayer.pause();
            this.isPlaying = false;
        } else {
            // Try to play audio (will fall back gracefully if not available)
            const audioSrc = button.dataset.audio || 'audio/default.mp3';
            this.playAudio(audioSrc);
        }

        this.updateAudioButtons();
    }

    updateAudioButtons() {
        const audioButtons = document.querySelectorAll('.play-audio-btn');
        audioButtons.forEach(button => {
            const icon = button.querySelector('i');
            if (icon) {
                icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
            }
        });
    }

    updateAudioProgress() {
        const progressBars = document.querySelectorAll('.progress-bar');
        if (this.audioPlayer && this.audioPlayer.duration) {
            const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
            progressBars.forEach(bar => {
                bar.style.width = `${progress}%`;
            });
        }
    }

    updateVoiceButtonIcon() {
        const voiceBtn = document.getElementById('voiceBtn');
        const icon = voiceBtn?.querySelector('i');
        
        if (!icon) return;
        
        if (this.isPlaying) {
            // Trocar para ícone de pause (quadrado) e cor vermelha
            icon.className = 'fas fa-stop';
            voiceBtn.classList.add('playing');
            voiceBtn.classList.remove('recording');
        } else {
            // Voltar para ícone de microfone
            icon.className = 'fas fa-microphone';
            voiceBtn.classList.remove('playing', 'recording');
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.farolApp = new FarolApp();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FarolApp;
} 