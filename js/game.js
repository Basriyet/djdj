// Ana oyun motoru
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.running = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        
        // Oyun durumu
        this.gameState = 'loading'; // loading, playing, paused, inventory
        this.currentScene = 'farm';
        
        // Mobil optimizasyonu için canvas boyutunu ayarla
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Oyun nesneleri
        this.player = null;
        this.world = null;
        this.inventory = null;
        this.magic = null;
        this.farming = null;
        this.ui = null;
        
        // Input yönetimi
        this.keys = {};
        this.touches = {};
        this.setupInput();
        
        // Oyun verileri
        this.gameData = {
            day: 1,
            season: 'spring',
            time: 6 * 60, // 6:00 AM (dakika cinsinden)
            weather: 'sunny',
            gold: 500,
            experience: 0,
            level: 1
        };
        
        console.log('Mystic Valley oyunu başlatılıyor...');
    }
    
    resizeCanvas() {
        const container = document.getElementById('gameContainer');
        const rect = container.getBoundingClientRect();
        
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Pixel art için crisp rendering
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
    }
    
    setupInput() {
        // Klavye kontrolü
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.handleKeyPress(e.code);
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mobil dokunma kontrolü
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            for (let touch of e.changedTouches) {
                this.touches[touch.identifier] = {
                    x: touch.clientX,
                    y: touch.clientY,
                    startX: touch.clientX,
                    startY: touch.clientY
                };
            }
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            for (let touch of e.changedTouches) {
                if (this.touches[touch.identifier]) {
                    this.touches[touch.identifier].x = touch.clientX;
                    this.touches[touch.identifier].y = touch.clientY;
                }
            }
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            for (let touch of e.changedTouches) {
                delete this.touches[touch.identifier];
            }
        });
        
        // UI buton kontrolü
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const direction = btn.dataset.direction;
                if (direction && this.player) {
                    this.handleDirectionInput(direction);
                }
            });
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const direction = btn.dataset.direction;
                if (direction && this.player) {
                    this.handleDirectionInput(direction);
                }
            });
        });
        
        // Aksiyon butonu
        document.getElementById('actionBtn').addEventListener('click', () => {
            this.handleAction();
        });
    }
    
    handleKeyPress(key) {
        switch(key) {
            case 'KeyW':
            case 'ArrowUp':
                this.handleDirectionInput('up');
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.handleDirectionInput('down');
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.handleDirectionInput('left');
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.handleDirectionInput('right');
                break;
            case 'Space':
            case 'Enter':
                this.handleAction();
                break;
            case 'KeyI':
                this.toggleInventory();
                break;
            case 'KeyM':
                this.castSpell();
                break;
        }
    }
    
    handleDirectionInput(direction) {
        if (!this.player || this.gameState !== 'playing') return;
        
        switch(direction) {
            case 'up':
                this.player.move(0, -1);
                break;
            case 'down':
                this.player.move(0, 1);
                break;
            case 'left':
                this.player.move(-1, 0);
                break;
            case 'right':
                this.player.move(1, 0);
                break;
            case 'center':
                this.castSpell();
                break;
        }
    }
    
    handleAction() {
        if (!this.player || this.gameState !== 'playing') return;
        
        const playerX = Math.floor(this.player.x / 32);
        const playerY = Math.floor(this.player.y / 32);
        
        // Çiftlik eylemleri
        if (this.farming) {
            this.farming.handleAction(playerX, playerY);
        }
        
        // Etkileşim kontrolü
        this.checkInteractions(playerX, playerY);
    }
    
    checkInteractions(x, y) {
        // NPC'ler, objeler ve diğer etkileşimler
        if (this.world) {
            const tile = this.world.getTile(x, y);
            if (tile && tile.interactive) {
                this.handleTileInteraction(tile, x, y);
            }
        }
    }
    
    handleTileInteraction(tile, x, y) {
        switch(tile.type) {
            case 'chest':
                this.openChest(x, y);
                break;
            case 'shop':
                this.openShop();
                break;
            case 'portal':
                this.usePortal(tile.destination);
                break;
            case 'npc':
                this.talkToNPC(tile.npcId);
                break;
        }
    }
    
    toggleInventory() {
        if (this.gameState === 'playing') {
            this.gameState = 'inventory';
        } else if (this.gameState === 'inventory') {
            this.gameState = 'playing';
        }
    }
    
    castSpell() {
        if (this.magic && this.player) {
            this.magic.castSelectedSpell(this.player.x, this.player.y);
        }
    }
    
    async init() {
        try {
            // Oyun bileşenlerini başlat
            this.world = new World(this);
            this.player = new Player(this, 400, 300);
            this.inventory = new Inventory(this);
            this.magic = new Magic(this);
            this.farming = new Farming(this);
            this.ui = new UI(this);
            
            // Dünyayı yükle
            await this.world.loadScene(this.currentScene);
            
            // Başlangıç eşyalarını ver
            this.inventory.addItem('seeds', 10);
            this.inventory.addItem('sword', 1);
            this.inventory.addItem('potion', 3);
            
            this.gameState = 'playing';
            
            // Loading ekranını gizle
            setTimeout(() => {
                document.getElementById('loadingScreen').style.display = 'none';
            }, 2000);
            
            console.log('Oyun başarıyla yüklendi!');
            
        } catch (error) {
            console.error('Oyun yükleme hatası:', error);
        }
    }
    
    start() {
        if (this.running) return;
        
        this.running = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    stop() {
        this.running = false;
    }
    
    gameLoop(currentTime = 0) {
        if (!this.running) return;
        
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Güncelle
        this.update(this.deltaTime);
        
        // Çiz
        this.render();
        
        // Bir sonraki frame
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        // Zaman güncelle
        this.updateGameTime(deltaTime);
        
        // Oyun nesnelerini güncelle
        if (this.player) this.player.update(deltaTime);
        if (this.world) this.world.update(deltaTime);
        if (this.magic) this.magic.update(deltaTime);
        if (this.farming) this.farming.update(deltaTime);
        if (this.ui) this.ui.update(deltaTime);
    }
    
    updateGameTime(deltaTime) {
        // 1 gerçek saniye = 1 oyun dakikası
        this.gameData.time += deltaTime * 60;
        
        // Gün geçişi
        if (this.gameData.time >= 24 * 60) {
            this.gameData.time = 6 * 60; // 6:00 AM'de başla
            this.gameData.day++;
            this.onNewDay();
        }
    }
    
    onNewDay() {
        console.log(`Yeni gün: ${this.gameData.day}`);
        
        // Mevsim değişimi (28 günde bir)
        if (this.gameData.day % 28 === 1) {
            const seasons = ['spring', 'summer', 'fall', 'winter'];
            const currentIndex = seasons.indexOf(this.gameData.season);
            this.gameData.season = seasons[(currentIndex + 1) % seasons.length];
            console.log(`Yeni mevsim: ${this.gameData.season}`);
        }
        
        // Çiftlik güncellemeleri
        if (this.farming) {
            this.farming.onNewDay();
        }
        
        // Rastgele hava durumu
        const weathers = ['sunny', 'cloudy', 'rainy', 'stormy'];
        this.gameData.weather = weathers[Math.floor(Math.random() * weathers.length)];
    }
    
    render() {
        // Ekranı temizle
        this.ctx.fillStyle = '#2d5016';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.gameState === 'playing') {
            // Dünyayı çiz
            if (this.world) this.world.render(this.ctx);
            
            // Oyuncuyu çiz
            if (this.player) this.player.render(this.ctx);
            
            // Büyüleri çiz
            if (this.magic) this.magic.render(this.ctx);
            
            // Çiftlik efektlerini çiz
            if (this.farming) this.farming.render(this.ctx);
        }
        
        // UI'yi çiz
        if (this.ui) this.ui.render(this.ctx);
    }
    
    // Yardımcı metodlar
    getTimeString() {
        const hours = Math.floor(this.gameData.time / 60);
        const minutes = Math.floor(this.gameData.time % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    addGold(amount) {
        this.gameData.gold += amount;
        if (this.ui) this.ui.showFloatingText(`+${amount} altın`, this.player.x, this.player.y - 20, '#ffd700');
    }
    
    addExperience(amount) {
        this.gameData.experience += amount;
        
        // Level atlama kontrolü
        const requiredExp = this.gameData.level * 100;
        if (this.gameData.experience >= requiredExp) {
            this.gameData.level++;
            this.gameData.experience -= requiredExp;
            if (this.ui) this.ui.showFloatingText(`Level ${this.gameData.level}!`, this.player.x, this.player.y - 40, '#00ff00');
            
            // Level atlama bonusları
            this.player.maxHealth += 10;
            this.player.health = this.player.maxHealth;
            this.player.maxMana += 5;
            this.player.mana = this.player.maxMana;
        }
    }
}

// Global oyun instance'ı
let game = null;