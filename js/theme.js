/**
 * SystemTheme Framework
 * Seamless state handling managing layout parameters, localStorage caching, and updating 3D buffers
 */

const SystemTheme = {
    toggleBtn: null,
    
    init() {
        this.toggleBtn = document.getElementById('theme-toggle-btn');
        const activeCache = localStorage.getItem('QUANTUM_THEME') || 'dark';
        
        this.setTheme(activeCache);
        this.toggleBtn.addEventListener('click', () => this.shiftSpectrum());
    },
    
    setTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('QUANTUM_THEME', themeName);
        
        // Dynamically update Three.js color space arrays seamlessly
        if (window.ThreeUniverse && ThreeUniverse.particles) {
            ThreeUniverse.updateSpectrumColors();
        }
    },
    
    shiftSpectrum() {
        const currentMode = document.documentElement.getAttribute('data-theme');
        const alternateMode = currentMode === 'dark' ? 'light' : 'dark';
        
        this.setTheme(alternateMode);
        showToast(`SYSTEM_SPECTRUM: Adjusted theme matrix to [${alternateMode.toUpperCase()}].`);
    }
};