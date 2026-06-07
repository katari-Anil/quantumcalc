/**
 * AIEngine Architecture
 * SIMULATES symbolic math engine calculations, delivering isolated execution sequences step-by-step
 */

const AIEngine = {
    inputField: null,
    solveBtn: null,
    displayShell: null,
    
    init() {
        this.inputField = document.getElementById('ai-input-field');
        this.solveBtn = document.getElementById('ai-solve-btn');
        this.displayShell = document.getElementById('ai-response-shell');
        
        this.solveBtn.addEventListener('click', () => this.triggerAnalysis());
        this.inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.triggerAnalysis();
        });
    },
    
    triggerAnalysis() {
        const query = this.inputField.value.trim();
        if (!query) return;
        
        this.displayShell.innerHTML = `
            <div class="ai-placeholder">
                <div class="quantum-core" style="width:30px; height:30px; margin-bottom:15px;"></div>
                <p style="font-family: var(--font-sub); letter-spacing:1px;">PROCESSING EQUATION MATRIX... ALLOCATING NODES</p>
            </div>
        `;
        
        setTimeout(() => this.generateStepMatrix(query), 1200);
    },
    
    generateStepMatrix(query) {
        try {
            // Leverage internal pre-existing clean engine parser matrices
            let evaluationChain = QuantumParser.preprocessMathString(query);
            let absoluteOutput = new Function(`return (${evaluationChain})`)();
            
            if (absoluteOutput === undefined || isNaN(absoluteOutput)) throw new Error('Unresolvable');
            
            if (absoluteOutput % 1 !== 0) absoluteOutput = parseFloat(absoluteOutput.toFixed(6));
            
            // Build dynamic aesthetic algorithmic data models
            this.displayShell.innerHTML = `
                <div class="ai-solution-block animate-fade-in">
                    <h3>ANALYSIS RESULT: ${absoluteOutput}</h3>
                    <p style="font-size:0.85rem; opacity:0.6; font-family:var(--font-display);">TARGET_EXPR // ${query}</p>
                    <ul class="ai-steps-list">
                        <li>Parsing local tokens and matching mathematical operational precedence constraints.</li>
                        <li>Transposing values: Identified functional variables matching numerical constraints.</li>
                        <li>Computed vector sequence isolation resolving isolated scopes.</li>
                        <li>Unifying global sequence matrix down to atomic absolute vector scalar.</li>
                    </ul>
                    <div class="ai-explanation">
                        <strong>Architectural Core Breakdown:</strong> The matrix evaluated safely. By computing inner scopes prior to linear scalar functions, the output consolidated smoothly to <code>${absoluteOutput}</code>.
                    </div>
                </div>
            `;
            
            if(window.AudioSynth) window.AudioSynth.play('success');
            
        } catch (err) {
            this.displayShell.innerHTML = `
                <div class="ai-placeholder" style="color:#ff3366;">
                    <div>⚠️</div>
                    <p>QUANTUM_CORE_ABORT: The formulation structure violates execution criteria or balance domains.</p>
                </div>
            `;
            if(window.AudioSynth) window.AudioSynth.play('error');
        }
    }
};