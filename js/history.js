/**
 * TelemetryHistory Architecture
 * Direct transactional tracking pipeline to Local Storage
 */

const TelemetryHistory = {
    storageKey: 'QUANTUM_CALC_TELEMETRY',
    streamContainer: null,
    searchField: null,
    logs: [],
    
    init() {
        this.streamContainer = document.getElementById('history-stream-container');
        this.searchField = document.getElementById('history-search');
        
        document.getElementById('clear-history-btn').addEventListener('click', () => this.purgeLogs());
        this.searchField.addEventListener('input', () => this.renderStreamUI());
        
        this.loadLogs();
    },
    
    loadLogs() {
        const physicalData = localStorage.getItem(this.storageKey);
        this.logs = physicalData ? JSON.parse(physicalData) : [];
        this.renderStreamUI();
    },
    
    commitLog(expression, result) {
        const item = {
            id: Date.now(),
            expression,
            result,
            timestamp: new Date().toLocaleTimeString()
        };
        this.logs.unshift(item);
        if (this.logs.length > 50) this.logs.pop(); // Cap log size
        
        localStorage.setItem(this.storageKey, JSON.stringify(this.logs));
        this.renderStreamUI();
    },
    
    purgeLogs() {
        this.logs = [];
        localStorage.removeItem(this.storageKey);
        this.renderStreamUI();
        showToast('SYSTEM_LOGS: Telemetry index wiped clear.');
    },
    
    renderStreamUI() {
        const filter = this.searchField.value.toLowerCase();
        this.streamContainer.innerHTML = '';
        
        const matches = this.logs.filter(log => 
            log.expression.toLowerCase().includes(filter) || 
            log.result.toLowerCase().includes(filter)
        );
        
        if (matches.length === 0) {
            this.streamContainer.innerHTML = `<div style="font-size:0.8rem; opacity:0.4; font-family:var(--font-sub); padding:10px; text-align:center;">NO TELEMETRY MATCHES FOUND</div>`;
            return;
        }
        
        matches.forEach(log => {
            const card = document.createElement('div');
            card.className = 'history-card';
            card.innerHTML = `
                <div class="hist-expr">${log.expression}</div>
                <div class="hist-res">${log.result}</div>
            `;
            
            card.addEventListener('click', () => {
                QuantumParser.currentExpression = log.result;
                QuantumParser.updateDisplayUI();
                showToast('SYSTEM_LOGS: Injected log result to processor.');
            });
            
            this.streamContainer.appendChild(card);
        });
    }
};