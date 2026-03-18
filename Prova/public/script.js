class HardwareService {
    constructor() {
        //Servidor local
        this.apiUrl = 'http://localhost:3000/v1/status';
    }

    async getStats() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error("Erro na resposta do servidor");
            return await response.json();
        } catch (error) {
            console.error("Servidor Offline. Usando dados de demonstração.");
            return {
                cpu: 0,
                temp: 0,
                ram: "0.0"
            };
        }
    }
}

// Classe responsável pela Interface (View Layer)
class DashboardUI {
    constructor(service) {
        this.service = service;
        
        // Mapeamento dos elementos do DOM
        this.elements = {
            cpu: { 
                card: document.querySelector('.card.cpu'),
                value: document.querySelector('.card.cpu .value') 
            },
            temp: { 
                card: document.querySelector('.card.temp'),
                value: document.querySelector('.card.temp .value') 
            },
            ram: { 
                card: document.querySelector('.card.ram'),
                value: document.querySelector('.card.ram .value') 
            }
        };

        // Configurações de limites críticos
        this.thresholds = { cpu: 85, temp: 75, ram: 13 };
    }

    updateCard(type, value, unit) {
        const el = this.elements[type];
        if (!el) return;

        // Atualiza o texto
        el.value.innerHTML = `${value}<span class="unit">${unit}</span>`;

        // Lógica de alerta crítico
        const isCritico = parseFloat(value) > this.thresholds[type];
        el.card.classList.toggle('critico', isCritico);
    }

    async refresh() {
        const data = await this.service.getStats();
        
        if (data) {
            this.updateCard('cpu', data.cpu, '%');
            this.updateCard('temp', data.temp, '°C');
            this.updateCard('ram', data.ram, 'GB');
        }
    }

    start(interval = 2000) {
        this.refresh(); // Execução imediata
        setInterval(() => this.refresh(), interval);
    }
}

// --- Inicialização do Sistema ---
const skyService = new HardwareService();
const dashboard = new DashboardUI(skyService);

// Iniciando o monitoramento
dashboard.start();