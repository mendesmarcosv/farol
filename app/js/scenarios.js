/**
 * FAROL - Scenarios Module
 * Gerencia dados e lógica dos diferentes cenários de uso
 */

class ScenariosManager {
    constructor() {
        this.scenarios = {
            emergency: {
                id: 'emergency',
                name: 'Emergência',
                color: '#dc3545',
                icon: 'fas fa-exclamation-triangle',
                userMessage: 'Estou com medo, não sei para onde ir',
                farolResponse: 'Entendo como você deve estar se sentindo. Vou te ajudar a encontrar um lugar seguro. Posso acessar sua localização para encontrar abrigos próximos?',
                actions: [
                    { id: 'find-shelter', icon: 'fas fa-home', text: 'Encontrar Abrigo' },
                    { id: 'get-support', icon: 'fas fa-heart', text: 'Apoio Emocional' },
                    { id: 'emergency-contacts', icon: 'fas fa-phone', text: 'Contatos de Emergência' }
                ],
                urgencyLevel: 'high',
                showEmergencyButton: true
            },
            volunteer: {
                id: 'volunteer',
                name: 'Voluntariado',
                color: '#0d6efd',
                icon: 'fas fa-hands-helping',
                userMessage: 'Quero me voluntariar para ajudar',
                farolResponse: 'Que bom que você quer ajudar! Existe uma força especial em pessoas como você. Vou encontrar oportunidades de voluntariado na sua região.',
                actions: [
                    { id: 'find-opportunities', icon: 'fas fa-search', text: 'Ver Oportunidades' },
                    { id: 'register-skills', icon: 'fas fa-user-plus', text: 'Cadastrar Habilidades' },
                    { id: 'nearby-needs', icon: 'fas fa-map-marker-alt', text: 'Necessidades Próximas' }
                ],
                urgencyLevel: 'medium',
                showEmergencyButton: false
            },
            donate: {
                id: 'donate',
                name: 'Doação',
                color: '#fd7e14',
                icon: 'fas fa-heart',
                userMessage: 'Gostaria de doar alguma coisa',
                farolResponse: 'Sua generosidade faz toda a diferença! Vou te mostrar as necessidades mais urgentes na sua região e como você pode contribuir.',
                actions: [
                    { id: 'donate-items', icon: 'fas fa-box', text: 'Doar Itens' },
                    { id: 'donate-money', icon: 'fas fa-donate', text: 'Doação em Dinheiro' },
                    { id: 'urgent-needs', icon: 'fas fa-exclamation-circle', text: 'Necessidades Urgentes' }
                ],
                urgencyLevel: 'low',
                showEmergencyButton: false
            }
        };

        this.mockData = this.initializeMockData();
        
        console.log('🎯 Scenarios Manager inicializado');
    }

    initializeMockData() {
        return {
            shelters: [
                {
                    id: 'shelter-001',
                    name: 'Centro Comunitário São José',
                    address: 'Rua das Flores, 123 - Centro',
                    distance: 1.2,
                    capacity: { current: 45, max: 80 },
                    services: ['refeições', 'banheiros', 'atendimento médico'],
                    accessibility: true,
                    pets: true,
                    phone: '(11) 1234-5678',
                    coordinates: { lat: -23.5505, lng: -46.6333 }
                },
                {
                    id: 'shelter-002',
                    name: 'Ginásio Municipal',
                    address: 'Av. Central, 456 - Vila Nova',
                    distance: 2.1,
                    capacity: { current: 120, max: 150 },
                    services: ['banheiros', 'atendimento médico', 'segurança'],
                    accessibility: true,
                    pets: false,
                    phone: '(11) 8765-4321',
                    coordinates: { lat: -23.5515, lng: -46.6343 }
                },
                {
                    id: 'shelter-003',
                    name: 'Igreja do Bom Pastor',
                    address: 'Rua da Paz, 789 - Jardim Esperança',
                    distance: 0.8,
                    capacity: { current: 25, max: 40 },
                    services: ['refeições', 'apoio espiritual'],
                    accessibility: false,
                    pets: true,
                    phone: '(11) 2468-1357',
                    coordinates: { lat: -23.5495, lng: -46.6323 }
                }
            ],
            volunteerOpportunities: [
                {
                    id: 'volunteer-001',
                    title: 'Cozinha Solidária',
                    organization: 'Casa do Bem',
                    address: 'Rua Solidária, 321 - Centro',
                    distance: 1.5,
                    schedule: '8h às 18h',
                    volunteers: { needed: 5, current: 2 },
                    tasks: ['preparo de refeições', 'distribuição', 'limpeza'],
                    skills: ['culinária básica'],
                    urgency: 'alta',
                    phone: '(11) 3456-7890'
                },
                {
                    id: 'volunteer-002',
                    title: 'Centro de Distribuição',
                    organization: 'Ajuda Mútua',
                    address: 'Av. Doação, 654 - Vila Nova',
                    distance: 0.8,
                    schedule: '6h às 22h',
                    volunteers: { needed: 3, current: 1 },
                    tasks: ['organização de doações', 'triagem', 'empacotamento'],
                    skills: ['organização', 'força física'],
                    urgency: 'média',
                    phone: '(11) 9876-5432'
                },
                {
                    id: 'volunteer-003',
                    title: 'Apoio Psicológico',
                    organization: 'Mente Sã',
                    address: 'Rua Esperança, 987 - Centro',
                    distance: 2.3,
                    schedule: '9h às 17h',
                    volunteers: { needed: 2, current: 0 },
                    tasks: ['escuta ativa', 'acolhimento', 'encaminhamentos'],
                    skills: ['psicologia', 'assistência social'],
                    urgency: 'alta',
                    phone: '(11) 1357-2468'
                }
            ],
            donationPoints: [
                {
                    id: 'donation-001',
                    name: 'Centro de Doações - Roupas',
                    category: 'roupas',
                    urgency: 'alta',
                    address: 'Centro Comunitário - Rua das Flores, 123',
                    distance: 1.2,
                    schedule: '8h às 20h',
                    mostNeeded: ['casacos', 'cobertores', 'roupas infantis'],
                    phone: '(11) 1234-5678'
                },
                {
                    id: 'donation-002',
                    name: 'Farmácia Solidária',
                    category: 'higiene-medicamentos',
                    urgency: 'média',
                    address: 'Rua da Saúde, 456 - Centro',
                    distance: 0.9,
                    schedule: '9h às 17h',
                    mostNeeded: ['fraldas', 'produtos de higiene', 'medicamentos básicos'],
                    phone: '(11) 2468-1357'
                },
                {
                    id: 'donation-003',
                    name: 'Banco de Alimentos',
                    category: 'alimentos',
                    urgency: 'alta',
                    address: 'Av. Alimentação, 789 - Vila Nova',
                    distance: 1.8,
                    schedule: '7h às 19h',
                    mostNeeded: ['alimentos não perecíveis', 'água', 'leite em pó'],
                    phone: '(11) 3579-1468'
                }
            ],
            monetaryDonations: [
                {
                    id: 'monetary-001',
                    name: 'Fundo de Emergência Municipal',
                    type: 'government',
                    pixKey: 'emergencia@prefeitura.gov.br',
                    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                    description: 'Fundo oficial da prefeitura para situações de emergência',
                    verified: true
                },
                {
                    id: 'monetary-002',
                    name: 'Cruz Vermelha Local',
                    type: 'ngo',
                    bankAccount: {
                        bank: 'Banco do Brasil',
                        agency: '1234-5',
                        account: '67890-1',
                        cnpj: '12.345.678/0001-90'
                    },
                    description: 'Organização internacional de ajuda humanitária',
                    verified: true,
                    website: 'https://cruzvermelha.org.br'
                }
            ],
            supportServices: [
                {
                    id: 'support-001',
                    name: 'CVV - Centro de Valorização da Vida',
                    type: 'emotional',
                    phone: '188',
                    description: 'Apoio emocional 24h por telefone',
                    availability: '24h',
                    free: true,
                    chat: true
                },
                {
                    id: 'support-002',
                    name: 'Grupo de Apoio Local',
                    type: 'group',
                    address: 'Centro Comunitário - Rua das Flores, 123',
                    distance: 1.2,
                    schedule: 'Quartas-feiras às 19h',
                    description: 'Grupo de apoio mútuo para pessoas em situação de crise',
                    coordinator: 'Psicóloga Maria Silva',
                    phone: '(11) 1234-5678'
                },
                {
                    id: 'support-003',
                    name: 'CAPS - Centro de Atenção Psicossocial',
                    type: 'professional',
                    address: 'Rua da Saúde, 456 - Centro',
                    distance: 0.9,
                    schedule: '8h às 17h',
                    description: 'Atendimento psicológico e psiquiátrico gratuito',
                    services: ['psicologia', 'psiquiatria', 'terapia em grupo'],
                    phone: '(11) 2468-1357'
                }
            ],
            urgentNeeds: [
                {
                    id: 'urgent-001',
                    item: 'Água Potável',
                    urgency: 'urgente',
                    quantity: '200 famílias',
                    location: 'Região Norte da cidade',
                    description: 'Necessidade imediata de água potável para famílias desabrigadas',
                    contact: '(11) 9999-0001',
                    deadline: '24 horas'
                },
                {
                    id: 'urgent-002',
                    item: 'Itens para Bebês',
                    urgency: 'alta',
                    quantity: '15 bebês',
                    location: 'Abrigo Central',
                    description: 'Fraldas, leite em pó e roupas para recém-nascidos',
                    contact: '(11) 9999-0002',
                    deadline: '48 horas'
                },
                {
                    id: 'urgent-003',
                    item: 'Medicamentos Básicos',
                    urgency: 'alta',
                    quantity: '100 pessoas',
                    location: 'Posto de Saúde Móvel',
                    description: 'Medicamentos para hipertensão, diabetes e dor',
                    contact: '(11) 9999-0003',
                    deadline: '72 horas'
                }
            ]
        };
    }

    getScenario(scenarioId) {
        return this.scenarios[scenarioId];
    }

    getAllScenarios() {
        return Object.values(this.scenarios);
    }

    getDataByAction(action) {
        const actionDataMap = {
            'find-shelter': () => this.mockData.shelters,
            'find-opportunities': () => this.mockData.volunteerOpportunities,
            'donate-items': () => this.mockData.donationPoints,
            'donate-money': () => this.mockData.monetaryDonations,
            'get-support': () => this.mockData.supportServices,
            'urgent-needs': () => this.mockData.urgentNeeds,
            'emergency-contacts': () => this.getEmergencyContacts(),
            'register-skills': () => this.getSkillsRegistration(),
            'nearby-needs': () => this.getNearbyNeeds()
        };

        const dataFunction = actionDataMap[action];
        return dataFunction ? dataFunction() : [];
    }

    getEmergencyContacts() {
        return [
            {
                id: 'emergency-001',
                name: 'SAMU',
                phone: '192',
                type: 'medical',
                description: 'Atendimento médico de urgência',
                availability: '24h'
            },
            {
                id: 'emergency-002',
                name: 'Bombeiros',
                phone: '193',
                type: 'rescue',
                description: 'Resgate e primeiros socorros',
                availability: '24h'
            },
            {
                id: 'emergency-003',
                name: 'Polícia Militar',
                phone: '190',
                type: 'security',
                description: 'Segurança e ordem pública',
                availability: '24h'
            },
            {
                id: 'emergency-004',
                name: 'Defesa Civil',
                phone: '199',
                type: 'civil',
                description: 'Coordenação de emergências e desastres',
                availability: '24h'
            }
        ];
    }

    getSkillsRegistration() {
        return {
            categories: [
                {
                    id: 'healthcare',
                    name: 'Saúde',
                    skills: ['médico', 'enfermeiro', 'técnico em enfermagem', 'paramédico', 'psicólogo']
                },
                {
                    id: 'construction',
                    name: 'Construção/Reparo',
                    skills: ['pedreiro', 'eletricista', 'encanador', 'carpinteiro', 'pintor']
                },
                {
                    id: 'logistics',
                    name: 'Logística',
                    skills: ['motorista', 'organizador', 'distribuição', 'almoxarife']
                },
                {
                    id: 'support',
                    name: 'Apoio',
                    skills: ['cozinheiro', 'limpeza', 'cuidador de idosos', 'babá', 'tradutor']
                },
                {
                    id: 'communication',
                    name: 'Comunicação',
                    skills: ['relações públicas', 'redes sociais', 'jornalista', 'designer']
                }
            ],
            form: {
                fields: ['name', 'phone', 'email', 'skills', 'availability', 'location'],
                required: ['name', 'phone', 'skills']
            }
        };
    }

    getNearbyNeeds() {
        return this.mockData.urgentNeeds.map(need => ({
            ...need,
            distance: Math.random() * 5 + 0.5 // Simula distância aleatória
        })).sort((a, b) => a.distance - b.distance);
    }

    // Filtra dados por urgência
    filterByUrgency(data, urgencyLevel) {
        const urgencyOrder = ['urgente', 'alta', 'média', 'baixa'];
        const maxLevel = urgencyOrder.indexOf(urgencyLevel);
        
        return data.filter(item => {
            const itemUrgency = urgencyOrder.indexOf(item.urgency || 'baixa');
            return itemUrgency <= maxLevel;
        });
    }

    // Filtra dados por distância
    filterByDistance(data, maxDistance = 5) {
        return data.filter(item => (item.distance || 0) <= maxDistance)
                   .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    // Simula busca por localização
    searchByLocation(data, userLocation = null) {
        // Em um app real, calcularia distâncias reais
        return data.map(item => ({
            ...item,
            distance: Math.random() * 10 + 0.1 // Simula distância
        })).sort((a, b) => a.distance - b.distance);
    }

    // Gera estatísticas para dashboard
    getStatistics() {
        return {
            shelters: {
                total: this.mockData.shelters.length,
                available: this.mockData.shelters.filter(s => s.capacity.current < s.capacity.max).length,
                occupancy: Math.round(
                    this.mockData.shelters.reduce((acc, s) => acc + s.capacity.current, 0) /
                    this.mockData.shelters.reduce((acc, s) => acc + s.capacity.max, 0) * 100
                )
            },
            volunteers: {
                opportunities: this.mockData.volunteerOpportunities.length,
                needed: this.mockData.volunteerOpportunities.reduce((acc, v) => acc + v.volunteers.needed, 0),
                registered: this.mockData.volunteerOpportunities.reduce((acc, v) => acc + v.volunteers.current, 0)
            },
            donations: {
                points: this.mockData.donationPoints.length,
                urgent: this.mockData.urgentNeeds.filter(n => n.urgency === 'urgente').length,
                categories: [...new Set(this.mockData.donationPoints.map(d => d.category))].length
            },
            support: {
                services: this.mockData.supportServices.length,
                available24h: this.mockData.supportServices.filter(s => s.availability === '24h').length
            }
        };
    }

    // Simula notificações
    getNotifications() {
        return [
            {
                id: 'notif-001',
                type: 'urgent',
                title: 'Nova necessidade urgente',
                message: 'Água potável urgente para 200 famílias',
                timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
                action: 'urgent-needs'
            },
            {
                id: 'notif-002',
                type: 'volunteer',
                title: 'Oportunidade próxima',
                message: 'Cozinha solidária precisa de voluntários hoje',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h atrás
                action: 'find-opportunities'
            },
            {
                id: 'notif-003',
                type: 'info',
                title: 'Novo abrigo disponível',
                message: 'Centro Comunitário São José tem 35 vagas',
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4h atrás
                action: 'find-shelter'
            }
        ];
    }

    // Valida dados de entrada
    validateUserInput(scenario, userData) {
        const validationRules = {
            emergency: {
                required: ['location'],
                optional: ['name', 'phone', 'needs', 'companions']
            },
            volunteer: {
                required: ['name', 'phone', 'skills'],
                optional: ['email', 'availability', 'experience']
            },
            donate: {
                required: ['type'],
                optional: ['items', 'amount', 'location', 'contact']
            }
        };

        const rules = validationRules[scenario];
        if (!rules) return { valid: false, errors: ['Cenário inválido'] };

        const errors = [];
        
        rules.required.forEach(field => {
            if (!userData[field]) {
                errors.push(`Campo obrigatório: ${field}`);
            }
        });

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
}

// Instância global
let scenariosManager = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    scenariosManager = new ScenariosManager();
    
    // Torna disponível globalmente
    window.scenariosManager = scenariosManager;
});

// Export para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScenariosManager;
} 