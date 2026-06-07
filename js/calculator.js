/**
 * QuantumParser Mathematical Engine
 * Evaluates complex tokens, bracket levels, and custom angular operations robustly
 */

const QuantumParser = {
    displayElement: null,
    expressionElement: null,
    currentExpression: '',
    isRadianMode: true,
    lastEvaluation: null,
    
    init() {
        this.displayElement = document.getElementById('calc-display');
        this.expressionElement = document.getElementById('calc-expression');
        
        this.setupKeypadBindings();
        this.setupKeyboardRouting();
    },
    
    setupKeypadBindings() {
        document.querySelectorAll('.keypad-matrix .key').forEach(key => {
            key.addEventListener('click', () => {
                const val = key.getAttribute('data-val');
                const action = key.getAttribute('data-action');
                
                if (val) this.appendToken(val);
                else if (action) this.routeAction(action, key);
            });
        });
    },
    
    setupKeyboardRouting() {
        document.addEventListener('keydown', (e) => {
            if (document.activeElement.tagName === 'INPUT') return; // Prevent interference with AI text box
            
            if (e.key >= '0' && e.key <= '9' || e.key === '.') this.appendToken(e.key);
            else if (['+', '-', '*', '/'].includes(e.key)) this.appendToken(e.key);
            else if (e.key === '(' || e.key === ')') this.appendToken(e.key);
            else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); this.evaluateSystem(); }
            else if (e.key === 'Backspace') this.deleteLastToken();
            else if (e.key === 'Escape') this.clearSystem();
        });
    },
    
    appendToken(token) {
        if (this.currentExpression === '0' && !isNaN(token)) this.currentExpression = '';
        if (token === 'ans') {
            if (!this.lastEvaluation) return;
            token = this.lastEvaluation;
        }
        this.currentExpression += token;
        this.updateDisplayUI();
    },
    
    deleteLastToken() {
        this.currentExpression = this.currentExpression.slice(0, -1);
        this.updateDisplayUI();
    },
    
    clearSystem() {
        this.currentExpression = '';
        this.expressionElement.innerText = '';
        this.displayElement.innerText = '0';
    },
    
    routeAction(action, keyNode) {
        switch(action) {
            case 'clear': this.clearSystem(); break;
            case 'backspace': this.deleteLastToken(); break;
            case 'bracket-left': this.appendToken('('); break;
            case 'bracket-right': this.appendToken(')'); break;
            case 'toggle-deg':
                this.isRadianMode = !this.isRadianMode;
                keyNode.innerText = this.isRadianMode ? 'RAD' : 'DEG';
                document.getElementById('calc-mode-indicator').innerText = this.isRadianMode ? 'RAD' : 'DEG';
                showToast(`SYS_ENGINE: Mode toggled to ${this.isRadianMode ? 'Radians' : 'Degrees'}`);
                break;
            case 'copy': this.copyOutputToClipboard(); break;
            case 'evaluate': this.evaluateSystem(); break;
        }
    },
    
    updateDisplayUI() {
        // Format display tokens visually for aesthetic presentation
        let visualString = this.currentExpression
            .replace(/\*/g, '×')
            .replace(/\//g, '÷')
            .replace(/sqrt\(/g, '√(')
            .replace(/fact\(/g, 'fact(');
            
        this.displayElement.innerText = visualString || '0';
    },
    
    evaluateSystem() {
        if (!this.currentExpression) return;
        
        try {
            let sanitizedExpression = this.preprocessMathString(this.currentExpression);
            // Execute bounded safe calculation matrix context
            let numericalResult = new Function(`return (${sanitizedExpression})`)();
            
            if (numericalResult === undefined || isNaN(numericalResult)) throw new Error('Malformed Equation');
            
            // Format precision
            if (numericalResult % 1 !== 0) {
                numericalResult = parseFloat(numericalResult.toFixed(10));
            }
            
            this.expressionElement.innerText = this.currentExpression + ' =';
            this.lastEvaluation = numericalResult.toString();
            
            // Trigger historical archiving
            TelemetryHistory.commitLog(this.currentExpression, this.lastEvaluation);
            
            this.currentExpression = this.lastEvaluation;
            this.displayElement.innerText = this.currentExpression;
            
            if(window.AudioSynth) window.AudioSynth.play('success');
            
            // Trigger visual glow pop micro interaction
            const panel = document.querySelector('.calculator-core-panel');
            panel.classList.add('pulse-glow');
            setTimeout(() => panel.classList.remove('pulse-glow'), 800);
            
        } catch (err) {
            if(window.AudioSynth) window.AudioSynth.play('error');
            this.displayElement.innerText = 'SYS_ERROR';
            showToast('CRITICAL_MATH_FAULT: Invalid syntax sequence.');
        }
    },
    
    preprocessMathString(str) {
        // Bind math standards constants
        let parsed = str
            .replace(/pi/g, Math.PI.toString())
            .replace(/e/g, Math.E.toString());
            
        // Map Exponential power tracking operators
        parsed = parsed.replace(/([0-9a-zA-Z\d\.\)]+)\^([0-9a-zA-Z\d\.\)]+)/g, 'Math.pow($1,$2)');
        
        // Handle Trigonometric mapping based on state angular domains
        const angularScalar = this.isRadianMode ? '1' : `(Math.PI / 180)`;
        
        parsed = parsed.replace(/sin\(/g, `Math.sin(${angularScalar}*`);
        parsed = parsed.replace(/cos\(/g, `Math.cos(${angularScalar}*`);
        parsed = parsed.replace(/tan\(/g, `Math.tan(${angularScalar}*`);
        
        // Base Logs map execution
        parsed = parsed.replace(/log\(/g, 'Math.log10(');
        parsed = parsed.replace(/ln\(/g, 'Math.log(');
        parsed = parsed.replace(/sqrt\(/g, 'Math.sqrt(');
        
        // Recursive custom factorial expansion evaluation block
        parsed = parsed.replace(/fact\((.*?)\)/g, (match, expression) => {
            return `(function(n){let f=1;for(let i=1;i<=n;i++)f*=i;return f;})(${expression})`;
        });
        
        return parsed;
    },
    
    copyOutputToClipboard() {
        const value = this.displayElement.innerText;
        if (!value || value === 'SYS_ERROR') return;
        
        navigator.clipboard.writeText(value).then(() => {
            showToast('DATA_TELEMETRY: Transferred to local clipboard matrix.');
        });
    }
};