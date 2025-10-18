// Ses sistemi (Web Audio API kullanarak kod ile oluşturulan sesler)
class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.masterVolume = 0.5;
        this.sfxVolume = 0.7;
        this.musicVolume = 0.3;
        this.enabled = true;
        
        // Ses efektleri cache'i
        this.soundCache = new Map();
        
        // Müzik sistemi
        this.currentMusic = null;
        this.musicLoop = null;
        
        this.initAudioContext();
        console.log('Ses sistemi başlatıldı');
    }
    
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // İlk kullanıcı etkileşiminde context'i başlat
            const startAudio = () => {
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
                document.removeEventListener('click', startAudio);
                document.removeEventListener('touchstart', startAudio);
            };
            
            document.addEventListener('click', startAudio);
            document.addEventListener('touchstart', startAudio);
            
        } catch (error) {
            console.warn('Web Audio API desteklenmiyor:', error);
            this.enabled = false;
        }
    }
    
    // Temel ses dalgası oluşturma
    createOscillator(frequency, type = 'sine', duration = 0.1) {
        if (!this.enabled || !this.audioContext) return null;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;
        
        // Envelope (ADSR)
        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(this.sfxVolume * this.masterVolume, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        oscillator.start(now);
        oscillator.stop(now + duration);
        
        return { oscillator, gainNode };
    }
    
    // Gürültü oluşturma
    createNoise(duration = 0.1, type = 'white') {
        if (!this.enabled || !this.audioContext) return null;
        
        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Beyaz gürültü
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        source.buffer = buffer;
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Filtre ayarları
        if (type === 'pink') {
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        }
        
        gainNode.gain.setValueAtTime(this.sfxVolume * this.masterVolume * 0.3, this.audioContext.currentTime);
        
        source.start();
        
        return { source, gainNode, filter };
    }
    
    // Ses efektleri
    playWalkSound() {
        const sound = this.createOscillator(150, 'square', 0.05);
        setTimeout(() => {
            this.createOscillator(120, 'square', 0.05);
        }, 50);
    }
    
    playJumpSound() {
        if (!this.enabled) return;
        
        const frequencies = [200, 300, 400, 500];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.createOscillator(freq, 'sine', 0.1);
            }, index * 20);
        });
    }
    
    playAttackSound() {
        this.createOscillator(100, 'sawtooth', 0.2);
        setTimeout(() => {
            this.createNoise(0.1, 'white');
        }, 50);
    }
    
    playMagicSound(spellType = 'fireball') {
        switch(spellType) {
            case 'fireball':
                this.createOscillator(400, 'triangle', 0.3);
                setTimeout(() => {
                    this.createOscillator(200, 'sawtooth', 0.2);
                }, 100);
                break;
                
            case 'heal':
                const healFreqs = [523, 659, 784, 1047]; // C, E, G, C
                healFreqs.forEach((freq, index) => {
                    setTimeout(() => {
                        this.createOscillator(freq, 'sine', 0.2);
                    }, index * 100);
                });
                break;
                
            case 'lightning':
                this.createNoise(0.1, 'white');
                setTimeout(() => {
                    this.createOscillator(800, 'square', 0.1);
                }, 50);
                break;
                
            case 'teleport':
                this.createOscillator(1000, 'sine', 0.1);
                setTimeout(() => {
                    this.createOscillator(500, 'sine', 0.1);
                }, 200);
                break;
        }
    }
    
    playFarmSound(action) {
        switch(action) {
            case 'till':
                this.createNoise(0.2, 'pink');
                break;
                
            case 'plant':
                this.createOscillator(300, 'triangle', 0.1);
                break;
                
            case 'water':
                // Su sesi simülasyonu
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        this.createOscillator(200 + Math.random() * 100, 'sine', 0.05);
                    }, i * 30);
                }
                break;
                
            case 'harvest':
                this.createOscillator(500, 'triangle', 0.1);
                setTimeout(() => {
                    this.createOscillator(400, 'sine', 0.1);
                }, 100);
                break;
        }
    }
    
    playUISound(type) {
        switch(type) {
            case 'click':
                this.createOscillator(800, 'square', 0.05);
                break;
                
            case 'select':
                this.createOscillator(600, 'triangle', 0.1);
                break;
                
            case 'error':
                this.createOscillator(150, 'sawtooth', 0.3);
                break;
                
            case 'success':
                const successFreqs = [523, 659, 784];
                successFreqs.forEach((freq, index) => {
                    setTimeout(() => {
                        this.createOscillator(freq, 'sine', 0.1);
                    }, index * 50);
                });
                break;
                
            case 'notification':
                this.createOscillator(880, 'triangle', 0.1);
                setTimeout(() => {
                    this.createOscillator(660, 'triangle', 0.1);
                }, 100);
                break;
        }
    }
    
    playAmbientSound(environment) {
        if (!this.enabled || this.currentAmbient) return;
        
        switch(environment) {
            case 'farm':
                this.playFarmAmbient();
                break;
            case 'forest':
                this.playForestAmbient();
                break;
            case 'village':
                this.playVillageAmbient();
                break;
            case 'dungeon':
                this.playDungeonAmbient();
                break;
        }
    }
    
    playFarmAmbient() {
        // Çiftlik ortam sesi - kuş sesleri ve rüzgar
        const playBirdSound = () => {
            if (Math.random() < 0.3) {
                const freq = 800 + Math.random() * 400;
                this.createOscillator(freq, 'sine', 0.2);
                setTimeout(() => {
                    this.createOscillator(freq * 1.2, 'sine', 0.1);
                }, 100);
            }
            setTimeout(playBirdSound, 2000 + Math.random() * 3000);
        };
        
        playBirdSound();
    }
    
    playForestAmbient() {
        // Orman ortam sesi - yaprak hışırtısı
        const playLeafSound = () => {
            if (Math.random() < 0.4) {
                this.createNoise(0.3, 'pink');
            }
            setTimeout(playLeafSound, 1000 + Math.random() * 2000);
        };
        
        playLeafSound();
    }
    
    // Basit müzik sistemi
    playMusic(theme = 'peaceful') {
        if (!this.enabled || !this.audioContext) return;
        
        this.stopMusic();
        
        switch(theme) {
            case 'peaceful':
                this.playPeacefulMusic();
                break;
            case 'adventure':
                this.playAdventureMusic();
                break;
            case 'dungeon':
                this.playDungeonMusic();
                break;
        }
    }
    
    playPeacefulMusic() {
        // Basit pentatonik melodi
        const notes = [
            { freq: 261.63, duration: 0.5 }, // C
            { freq: 293.66, duration: 0.5 }, // D
            { freq: 329.63, duration: 0.5 }, // E
            { freq: 392.00, duration: 0.5 }, // G
            { freq: 440.00, duration: 0.5 }, // A
            { freq: 523.25, duration: 0.5 }, // C
            { freq: 440.00, duration: 0.5 }, // A
            { freq: 392.00, duration: 1.0 }  // G
        ];
        
        let noteIndex = 0;
        const playNextNote = () => {
            if (!this.musicLoop) return;
            
            const note = notes[noteIndex];
            this.createMusicNote(note.freq, note.duration);
            
            noteIndex = (noteIndex + 1) % notes.length;
            setTimeout(playNextNote, note.duration * 1000);
        };
        
        this.musicLoop = true;
        playNextNote();
    }
    
    createMusicNote(frequency, duration) {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'triangle';
        
        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(this.musicVolume * this.masterVolume, now + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, now + duration - 0.1);
        
        oscillator.start(now);
        oscillator.stop(now + duration);
    }
    
    stopMusic() {
        this.musicLoop = false;
        this.currentMusic = null;
    }
    
    // Hava durumu sesleri
    playWeatherSound(weather) {
        switch(weather) {
            case 'rainy':
                this.playRainSound();
                break;
            case 'stormy':
                this.playThunderSound();
                break;
            case 'windy':
                this.playWindSound();
                break;
        }
    }
    
    playRainSound() {
        // Yağmur sesi simülasyonu
        const rainLoop = () => {
            if (Math.random() < 0.8) {
                this.createNoise(0.1, 'pink');
            }
            setTimeout(rainLoop, 50 + Math.random() * 100);
        };
        
        rainLoop();
    }
    
    playThunderSound() {
        // Gök gürültüsü
        this.createNoise(1.0, 'white');
        setTimeout(() => {
            this.createOscillator(60, 'sawtooth', 0.5);
        }, 200);
    }
    
    playWindSound() {
        // Rüzgar sesi
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createNoise(0.5, 'pink');
            }, i * 200);
        }
    }
    
    // Ses ayarları
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }
    
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }
    
    toggleSound() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stopMusic();
        }
        return this.enabled;
    }
    
    // Ses efekti kısayolları (oyun olayları için)
    onPlayerMove() {
        if (Math.random() < 0.3) { // Her adımda değil
            this.playWalkSound();
        }
    }
    
    onPlayerAttack() {
        this.playAttackSound();
    }
    
    onSpellCast(spellType) {
        this.playMagicSound(spellType);
    }
    
    onFarmAction(action) {
        this.playFarmSound(action);
    }
    
    onUIInteraction(type) {
        this.playUISound(type);
    }
    
    onLevelUp() {
        this.playUISound('success');
        setTimeout(() => {
            this.playUISound('success');
        }, 200);
    }
    
    onGameOver() {
        this.stopMusic();
        this.createOscillator(200, 'sawtooth', 1.0);
        setTimeout(() => {
            this.createOscillator(150, 'sawtooth', 1.0);
        }, 500);
    }
    
    onItemPickup() {
        this.createOscillator(660, 'triangle', 0.1);
        setTimeout(() => {
            this.createOscillator(880, 'triangle', 0.1);
        }, 50);
    }
    
    onQuestComplete() {
        const questFreqs = [523, 659, 784, 1047, 1319];
        questFreqs.forEach((freq, index) => {
            setTimeout(() => {
                this.createOscillator(freq, 'sine', 0.2);
            }, index * 100);
        });
    }
}