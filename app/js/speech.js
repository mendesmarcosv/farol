/**
 * FAROL - Speech Module
 * Simula funcionalidades de reconhecimento de voz e síntese de fala
 */

class SpeechManager {
    constructor() {
        this.isRecording = false;
        this.isPlaying = false;
        this.audioContext = null;
        this.speechSynthesis = window.speechSynthesis;
        this.voices = [];
        
        this.init();
    }

    init() {
        this.setupSpeechSynthesis();
        this.setupAudioContext();
        
        console.log('🎤 Speech Manager inicializado');
    }

    setupSpeechSynthesis() {
        if (!this.speechSynthesis) {
            console.warn('⚠️ Speech Synthesis não disponível neste navegador');
            return;
        }

        // Load voices
        const loadVoices = () => {
            this.voices = this.speechSynthesis.getVoices();
            console.log(`🔊 ${this.voices.length} vozes carregadas`);
        };

        loadVoices();
        
        if (this.speechSynthesis.onvoiceschanged !== undefined) {
            this.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }

    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('⚠️ AudioContext não disponível:', error);
        }
    }

    // Simula o reconhecimento de voz
    startListening() {
        if (this.isRecording) return;
        
        this.isRecording = true;
        console.log('🎤 Iniciando gravação simulada...');
        
        // Simula processo de gravação
        return new Promise((resolve) => {
            setTimeout(() => {
                this.isRecording = false;
                console.log('🎤 Gravação finalizada');
                resolve('Simulação de fala capturada');
            }, 2000);
        });
    }

    stopListening() {
        this.isRecording = false;
        console.log('🎤 Gravação interrompida');
    }

    // Síntese de fala (Text-to-Speech)
    speak(text, options = {}) {
        if (!this.speechSynthesis) {
            console.warn('⚠️ Síntese de fala não disponível');
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Configurações padrão
            utterance.rate = options.rate || 0.9;
            utterance.pitch = options.pitch || 1.0;
            utterance.volume = options.volume || 0.8;
            utterance.lang = options.lang || 'pt-BR';

            // Seleciona voz portuguesa se disponível
            const portugueseVoice = this.voices.find(voice => 
                voice.lang.includes('pt') || voice.lang.includes('BR')
            );
            
            if (portugueseVoice) {
                utterance.voice = portugueseVoice;
            }

            utterance.onstart = () => {
                this.isPlaying = true;
                console.log(`🔊 Falando: "${text}"`);
            };

            utterance.onend = () => {
                this.isPlaying = false;
                console.log('🔊 Síntese finalizada');
                resolve();
            };

            utterance.onerror = (error) => {
                this.isPlaying = false;
                console.error('❌ Erro na síntese:', error);
                reject(error);
            };

            this.speechSynthesis.speak(utterance);
        });
    }

    // Para a síntese de fala
    stopSpeaking() {
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
            this.isPlaying = false;
            console.log('🔊 Síntese interrompida');
        }
    }

    // Simula reprodução de arquivo de áudio
    playAudioFile(audioSrc) {
        return new Promise((resolve, reject) => {
            const audio = new Audio(audioSrc);
            
            audio.onloadeddata = () => {
                console.log(`🎵 Áudio carregado: ${audioSrc}`);
            };

            audio.onplay = () => {
                this.isPlaying = true;
                console.log(`🎵 Reproduzindo: ${audioSrc}`);
            };

            audio.onended = () => {
                this.isPlaying = false;
                console.log('🎵 Reprodução finalizada');
                resolve();
            };

            audio.onerror = (error) => {
                this.isPlaying = false;
                console.warn(`⚠️ Erro ao carregar áudio: ${audioSrc}`, error);
                // Fallback: usar síntese de fala
                this.speak(this.getAudioFallbackText(audioSrc));
                resolve();
            };

            audio.play().catch(error => {
                console.warn(`⚠️ Erro na reprodução: ${audioSrc}`, error);
                // Fallback: usar síntese de fala
                this.speak(this.getAudioFallbackText(audioSrc));
                resolve();
            });
        });
    }

    // Texto de fallback para quando áudio não está disponível
    getAudioFallbackText(audioSrc) {
        const fallbacks = {
            '../assets/audio/user-emergency.mp3': 'Estou com medo, não sei para onde ir',
            '../assets/audio/user-volunteer.mp3': 'Quero me voluntariar para ajudar',
            '../assets/audio/user-donate.mp3': 'Gostaria de doar alguma coisa',
            '../assets/audio/farol-emergency-response.mp3': 'Entendo como você deve estar se sentindo. Vou te ajudar a encontrar um lugar seguro.',
            '../assets/audio/farol-volunteer-response.mp3': 'Que bom que você quer ajudar! Vou encontrar oportunidades de voluntariado na sua região.',
            '../assets/audio/farol-donate-response.mp3': 'Sua generosidade faz toda a diferença! Vou te mostrar as necessidades mais urgentes na sua região.',
            // Mantendo compatibilidade com paths antigos
            'audio/user-emergency.mp3': 'Estou com medo, não sei para onde ir',
            'audio/user-volunteer.mp3': 'Quero me voluntariar para ajudar',
            'audio/user-donate.mp3': 'Gostaria de doar alguma coisa',
            'audio/farol-emergency-response.mp3': 'Entendo como você deve estar se sentindo. Vou te ajudar a encontrar um lugar seguro.',
            'audio/farol-volunteer-response.mp3': 'Que bom que você quer ajudar! Vou encontrar oportunidades de voluntariado na sua região.',
            'audio/farol-donate-response.mp3': 'Sua generosidade faz toda a diferença! Vou te mostrar as necessidades mais urgentes na sua região.',
        };

        return fallbacks[audioSrc] || 'Áudio não disponível';
    }

    // Simula análise de sentimento da fala
    analyzeSentiment(text) {
        const keywords = {
            emergency: ['medo', 'ajuda', 'perigo', 'urgente', 'não sei', 'perdido', 'sozinho'],
            volunteer: ['ajudar', 'voluntário', 'contribuir', 'trabalhar', 'fazer', 'disponível'],
            donate: ['doar', 'doação', 'contribuir', 'dinheiro', 'itens', 'ajudar'],
            emotional: ['triste', 'ansioso', 'preocupado', 'nervoso', 'assustado', 'angustiado']
        };

        const scores = {
            emergency: 0,
            volunteer: 0,
            donate: 0,
            emotional: 0
        };

        const lowerText = text.toLowerCase();

        Object.keys(keywords).forEach(category => {
            keywords[category].forEach(keyword => {
                if (lowerText.includes(keyword)) {
                    scores[category]++;
                }
            });
        });

        // Encontra categoria com maior score
        const topCategory = Object.keys(scores).reduce((a, b) => 
            scores[a] > scores[b] ? a : b
        );

        return {
            category: topCategory,
            confidence: scores[topCategory] / Math.max(1, lowerText.split(' ').length),
            scores: scores
        };
    }

    // Cria efeito visual de ondas de áudio
    createAudioWaves(container) {
        if (!container) return;

        const waves = container.querySelectorAll('.wave');
        if (waves.length === 0) return;

        const animateWaves = () => {
            waves.forEach((wave, index) => {
                const height = Math.random() * 20 + 5;
                wave.style.height = `${height}px`;
                wave.style.animationDelay = `${index * 0.1}s`;
            });
        };

        const interval = setInterval(animateWaves, 150);

        // Para animação após 3 segundos
        setTimeout(() => {
            clearInterval(interval);
            waves.forEach(wave => {
                wave.style.height = '5px';
            });
        }, 3000);
    }

    // Gera transcrição simulada
    generateTranscription(scenario) {
        const transcriptions = {
            emergency: [
                "Estou com medo, não sei para onde ir",
                "Preciso de um lugar seguro",
                "Não tenho para onde ir",
                "Estou perdido e com medo"
            ],
            volunteer: [
                "Quero me voluntariar para ajudar",
                "Como posso ajudar as pessoas?",
                "Gostaria de ser voluntário",
                "Quero contribuir de alguma forma"
            ],
            donate: [
                "Gostaria de doar alguma coisa",
                "Como posso fazer uma doação?",
                "Quero ajudar com doações",
                "Tenho itens para doar"
            ]
        };

        const options = transcriptions[scenario] || ["Fala não reconhecida"];
        return options[Math.floor(Math.random() * options.length)];
    }

    // Verifica compatibilidade do navegador
    checkBrowserSupport() {
        const support = {
            speechSynthesis: !!window.speechSynthesis,
            speechRecognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
            audioContext: !!(window.AudioContext || window.webkitAudioContext),
            getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
        };

        console.log('🔍 Suporte do navegador:', support);
        return support;
    }

    // Status atual
    getStatus() {
        return {
            isRecording: this.isRecording,
            isPlaying: this.isPlaying,
            voicesLoaded: this.voices.length > 0,
            audioContextState: this.audioContext?.state || 'not available'
        };
    }
}

// Instância global do Speech Manager
let speechManager = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    speechManager = new SpeechManager();
    
    // Torna disponível globalmente
    window.speechManager = speechManager;
});

// Export para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpeechManager;
} 