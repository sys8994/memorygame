export class AudioManager {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (!this.isMuted) {
            this.init(); 
        }
        return this.isMuted;
    }

    playTone(freq, type, duration, vol, endFreq = null) {
        if (this.isMuted) return;
        if (!this.ctx) this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(freq, now);
        if (endFreq) {
            osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
        }

        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.start(now);
        osc.stop(now + duration);
    }

    playClick() {
        this.playTone(600, 'sine', 0.1, 0.1, 300);
    }

    playFlip() {
        this.playTone(300, 'triangle', 0.15, 0.1, 150);
    }

    playMatch() {
        if (this.isMuted) return;
        if (!this.ctx) this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => { 
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.1, now + (i * 0.1));
            gain.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.1) + 0.3);
            
            osc.start(now + (i * 0.1));
            osc.stop(now + (i * 0.1) + 0.3);
        });
    }

    playMismatch() {
        if (this.isMuted) return;
        if (!this.ctx) this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const now = this.ctx.currentTime;
        [300, 250].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.05, now + (i * 0.2));
            gain.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.2) + 0.2);
            
            osc.start(now + (i * 0.2));
            osc.stop(now + (i * 0.2) + 0.2);
        });
    }

    playCountdown() {
        this.playTone(440, 'square', 0.1, 0.05);
    }

    playGo() {
        this.playTone(880, 'square', 0.3, 0.05);
    }
}

export const audioManager = new AudioManager();
