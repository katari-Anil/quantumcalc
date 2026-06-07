/**
 * QuantumCalc Application Main Controller Core
 * Architectural Coordinator Orchestrating Independent OS Modules
 */

document.addEventListener('DOMContentLoaded', () => {
    // Phase 1: Initialize System Diagnostics & Core Systems
    SystemTheme.init();
    ThreeUniverse.init();
    TelemetryHistory.init();
    QuantumParser.init();
    VoiceInterface.init();
    AIEngine.init();
    
    // Setup Global Application UI Sound Synthesis Core
    window.AudioSynth = {
        ctx: null,
        muted: false,
        
        init() {
            // Context instantiated on demand or gesture to adhere to standard browser privacy protocols
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        },
        
        play(type) {
            if (this.muted) return;
            if (!this.ctx) this.init();
            if (this.ctx.state === 'suspended') this.ctx.resume();
            
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            const now = this.ctx.currentTime;
            
            switch(type) {
                case 'click':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(800, now);
                    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
                    gain.gain.setValueAtTime(0.08, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.05);
                    osc.start(now);
                    osc.stop(now + 0.05);
                    break;
                case 'success':
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(523.25, now); // C5
                    osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
                    gain.gain.setValueAtTime(0.06, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.25);
                    osc.start(now);
                    osc.stop(now + 0.25);
                    break;
                case 'error':
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.linearRampToValueAtTime(80, now + 0.15);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.15);
                    osc.start(now);
                    osc.stop(now + 0.15);
                    break;
            }
        }
    };

    // Attach Interface Utility Interceptions (Global Key Ripples, Audio bindings)
    setupGlobalInteractions();
    showToast('QUANTUM_OS: Core Initialization Matrix [OK]');
});

function setupGlobalInteractions() {
    // Magnetic / Responsive Node Button Waves
    document.querySelectorAll('.key, .hud-btn, .ai-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (window.AudioSynth) window.AudioSynth.play('click');
            createRipple(e, btn);
        });
    });

    // Audio Mute System Event Router
    const audioBtn = document.getElementById('audio-toggle-btn');
    audioBtn.addEventListener('click', () => {
        if (!window.AudioSynth) return;
        window.AudioSynth.muted = !window.AudioSynth.muted;
        audioBtn.classList.toggle('active', window.AudioSynth.muted);
        
        const path = audioBtn.querySelector('path');
        if (window.AudioSynth.muted) {
            path.setAttribute('d', 'M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H2V15H6L11,20V12.27L14.31,15.58C13.63,16.11 12.86,16.5 12,16.71V18.77C13.39,18.5 14.66,17.84 15.72,17L19.73,21L21,19.73L4.27,3M11,4L8.54,6.46L11,8.92V4M16.5,12A4.5,4.5 0 0,0 14,8V10.18L16.45,12.63C16.48,12.43 16.5,12.22 16.5,12M19,12C19,13.17 18.66,14.27 18.08,15.2L19.55,16.67C20.47,15.3 21,13.72 21,12A9,9 0 0,0 12,3V5.06C15,5.92 17.5,8.68 19,12Z');
            showToast('SYS_AUDIO: Output feeds suppressed.');
        } else {
            path.setAttribute('d', 'M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.77 16.5,12M11,21L6,16H2V8H6L11,3V21Z');
            showToast('SYS_AUDIO: Output feeds operational.');
        }
    });
}

function createRipple(event, element) {
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    
    const rect = element.getBoundingClientRect();
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');
    
    const prevRipple = element.querySelector('.ripple');
    if (prevRipple) prevRipple.remove();
    
    element.appendChild(circle);
}

function showToast(message) {
    const center = document.getElementById('notification-center');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    center.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}