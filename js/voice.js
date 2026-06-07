/**
 * VoiceInterface Integration Module
 * Leverages high fidelity continuous Speech Recognition translating natural phrase matrices to tokens
 */

const VoiceInterface = {
    recognition: null,
    isListening: false,
    toggleBtn: null,
    indicator: null,
    
    init() {
        this.toggleBtn = document.getElementById('voice-toggle-btn');
        this.indicator = document.getElementById('voice-indicator');
        
        const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechClass) {
            this.toggleBtn.style.display = 'none';
            console.warn('Voice API context not supported by hardware/browser stack configuration');
            return;
        }
        
        this.recognition = new SpeechClass();
        this.recognition.continuous = false;
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = false;
        
        this.recognition.onstart = () => this.handleRecognitionStart();
        this.recognition.onresult = (e) => this.handleRecognitionToken(e);
        this.recognition.onerror = () => this.handleRecognitionHalt();
        this.recognition.onend = () => this.handleRecognitionHalt();
        
        this.toggleBtn.addEventListener('click', () => this.toggleVoiceStream());
    },
    
    toggleVoiceStream() {
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    },
    
    handleRecognitionStart() {
        this.isListening = true;
        this.toggleBtn.classList.add('active');
        this.indicator.classList.remove('hidden');
        showToast('VOICE_STREAM: Commencing localized audio capture...');
    },
    
    handleRecognitionHalt() {
        this.isListening = false;
        this.toggleBtn.classList.remove('active');
        this.indicator.classList.add('hidden');
    },
    
    handleRecognitionToken(event) {
        const semanticTranscript = event.results[0][0].transcript.toLowerCase();
        showToast(`VOICE_CAPTURED: "${semanticTranscript}"`);
        this.parseSemanticCommand(semanticTranscript);
    },
    
    parseSemanticCommand(phrase) {
        // Translation token maps matching functional arrays
        let computationBlock = phrase
            .replace(/plus/g, '+')
            .replace(/minus/g, '-')
            .replace(/times/g, '*')
            .replace(/multiplied by/g, '*')
            .replace(/divided by/g, '/')
            .replace(/over/g, '/')
            .replace(/square root of /g, 'sqrt(')
            .replace(/sine of /g, 'sin(')
            .replace(/cosine of /g, 'cos(')
            .replace(/tangent of /g, 'tan(')
            .replace(/log of /g, 'log(');
            
        // Autoclose hanging brackets for voice conversions safely
        const openBrackets = (computationBlock.match(/\(/g) || []).length;
        const closeBrackets = (computationBlock.match(/\)/g) || []).length;
        if (openBrackets > closeBrackets) {
            computationBlock += ')'.repeat(openBrackets - closeBrackets);
        }
        
        // Scrub unrelated lexical audio garbage particles
        computationBlock = computationBlock.replace(/[^0-9\+\-\*\/\(\)\.\s_a-zA-Z]/g, '');
        
        if (computationBlock.trim()) {
            QuantumParser.currentExpression = computationBlock.trim();
            QuantumParser.updateDisplayUI();
            QuantumParser.evaluateSystem();
        } else {
            showToast('VOICE_FAULT: Could not extract coherent numerical expression.');
        }
    }
};