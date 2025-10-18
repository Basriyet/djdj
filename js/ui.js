// UI sistemi
class UI {
    constructor(game) {
        this.game = game;
        this.messages = [];
        this.floatingTexts = [];
        this.notifications = [];
        
        // UI elementleri
        this.healthBar = document.getElementById('healthFill');
        this.manaBar = document.getElementById('manaFill');
        
        // Mesaj sistemi
        this.messageTimeout = 3000; // 3 saniye
        
        // Mobil optimizasyonu
        this.setupMobileUI();
        
        console.log('UI sistemi başlatıldı');
    }
    
    setupMobileUI() {
        // Dokunmatik kontroller için event listener'lar
        const inventorySlots = document.querySelectorAll('.inventory-slot');
        inventorySlots.forEach((slot, index) => {
            slot.addEventListener('click', () => {
                this.selectInventorySlot(index);
            });
            
            slot.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.selectInventorySlot(index);
            });
        });
        
        // Aksiyon butonu
        const actionBtn = document.getElementById('actionBtn');
        actionBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            actionBtn.style.transform = 'scale(0.9)';
        });
        
        actionBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            actionBtn.style.transform = 'scale(1)';
        });
        
        // Kontrol butonları için haptic feedback simülasyonu
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(50); // 50ms titreşim
                }
            });
        });
    }
    
    update(deltaTime) {
        // Mesajları güncelle
        this.messages = this.messages.filter(message => {
            message.life -= deltaTime * 1000;
            return message.life > 0;
        });
        
        // Floating text'leri güncelle
        this.floatingTexts = this.floatingTexts.filter(text => {
            text.life -= deltaTime;
            text.y -= text.speed * deltaTime;
            text.alpha = text.life / text.maxLife;
            return text.life > 0;
        });
        
        // Bildirimleri güncelle
        this.notifications = this.notifications.filter(notification => {
            notification.life -= deltaTime;
            return notification.life > 0;
        });
        
        // Sağlık ve mana barlarını güncelle
        this.updateBars();
    }
    
    updateBars() {
        if (!this.game.player) return;
        
        const player = this.game.player;
        
        // Sağlık barı
        const healthPercent = (player.health / player.maxHealth) * 100;
        if (this.healthBar) {
            this.healthBar.style.width = `${healthPercent}%`;
        }
        
        // Mana barı
        const manaPercent = (player.mana / player.maxMana) * 100;
        if (this.manaBar) {
            this.manaBar.style.width = `${manaPercent}%`;
        }
    }
    
    selectInventorySlot(index) {
        if (this.game.inventory) {
            this.game.inventory.activeSlot = index;
            this.game.inventory.updateUI();
            
            // Seçili eşyayı kullan
            const items = Array.from(this.game.inventory.items.keys());
            const selectedItem = items[index];
            if (selectedItem) {
                this.showMessage(`${this.game.inventory.itemTypes[selectedItem]?.name || selectedItem} seçildi`);
            }
        }
    }
    
    showMessage(text, duration = 3000) {
        this.messages.push({
            text: text,
            life: duration,
            maxLife: duration
        });
        
        // Maksimum 5 mesaj göster
        if (this.messages.length > 5) {
            this.messages.shift();
        }
    }
    
    showFloatingText(text, x, y, color = '#ffffff', size = 16) {
        this.floatingTexts.push({
            text: text,
            x: x,
            y: y,
            color: color,
            size: size,
            life: 2,
            maxLife: 2,
            speed: 30,
            alpha: 1
        });
    }
    
    showNotification(title, message, type = 'info', duration = 5000) {
        this.notifications.push({
            title: title,
            message: message,
            type: type,
            life: duration / 1000,
            maxLife: duration / 1000
        });
    }
    
    render(ctx) {
        // Oyun durumu bilgilerini çiz
        this.renderGameInfo(ctx);
        
        // Mesajları çiz
        this.renderMessages(ctx);
        
        // Floating text'leri çiz
        this.renderFloatingTexts(ctx);
        
        // Bildirimleri çiz
        this.renderNotifications(ctx);
        
        // Debug bilgilerini çiz (geliştirme modunda)
        if (this.game.debug) {
            this.renderDebugInfo(ctx);
        }
    }
    
    renderGameInfo(ctx) {
        const padding = 20;
        const lineHeight = 25;
        let y = padding + 100; // Sağlık/mana barlarının altında
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(padding, y - 5, 250, lineHeight * 6 + 10);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        
        // Oyun bilgileri
        const gameData = this.game.gameData;
        ctx.fillText(`Gün: ${gameData.day}`, padding + 10, y + lineHeight);
        ctx.fillText(`Mevsim: ${this.getSeasonName(gameData.season)}`, padding + 10, y + lineHeight * 2);
        ctx.fillText(`Saat: ${this.game.getTimeString()}`, padding + 10, y + lineHeight * 3);
        ctx.fillText(`Hava: ${this.getWeatherName(gameData.weather)}`, padding + 10, y + lineHeight * 4);
        ctx.fillText(`Altın: ${gameData.gold}`, padding + 10, y + lineHeight * 5);
        ctx.fillText(`Level: ${gameData.level} (XP: ${gameData.experience})`, padding + 10, y + lineHeight * 6);
    }
    
    renderMessages(ctx) {
        if (this.messages.length === 0) return;
        
        const startY = this.game.canvas.height - 150;
        const lineHeight = 25;
        
        this.messages.forEach((message, index) => {
            const y = startY - (index * lineHeight);
            const alpha = message.life / message.maxLife;
            
            // Arka plan
            ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.7})`;
            ctx.fillRect(20, y - 18, ctx.measureText(message.text).width + 20, 22);
            
            // Metin
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.font = '16px Arial';
            ctx.fillText(message.text, 30, y);
        });
    }
    
    renderFloatingTexts(ctx) {
        if (!this.game.player) return;
        
        const cameraX = this.game.player.x - this.game.canvas.width / 2;
        const cameraY = this.game.player.y - this.game.canvas.height / 2;
        
        this.floatingTexts.forEach(text => {
            const screenX = text.x - cameraX;
            const screenY = text.y - cameraY;
            
            ctx.save();
            ctx.globalAlpha = text.alpha;
            ctx.fillStyle = text.color;
            ctx.font = `bold ${text.size}px Arial`;
            ctx.textAlign = 'center';
            
            // Gölge efekti
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillText(text.text, screenX + 1, screenY + 1);
            
            // Ana metin
            ctx.fillStyle = text.color;
            ctx.fillText(text.text, screenX, screenY);
            
            ctx.restore();
        });
    }
    
    renderNotifications(ctx) {
        if (this.notifications.length === 0) return;
        
        const notificationWidth = 300;
        const notificationHeight = 80;
        const startX = this.game.canvas.width - notificationWidth - 20;
        let startY = 20;
        
        this.notifications.forEach((notification, index) => {
            const y = startY + (index * (notificationHeight + 10));
            const alpha = Math.min(1, notification.life / 1); // Fade in/out
            
            // Arka plan
            let bgColor;
            switch(notification.type) {
                case 'success':
                    bgColor = `rgba(0, 128, 0, ${alpha * 0.8})`;
                    break;
                case 'warning':
                    bgColor = `rgba(255, 165, 0, ${alpha * 0.8})`;
                    break;
                case 'error':
                    bgColor = `rgba(255, 0, 0, ${alpha * 0.8})`;
                    break;
                default:
                    bgColor = `rgba(0, 100, 200, ${alpha * 0.8})`;
            }
            
            ctx.fillStyle = bgColor;
            ctx.fillRect(startX, y, notificationWidth, notificationHeight);
            
            // Kenarlık
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(startX, y, notificationWidth, notificationHeight);
            
            // Başlık
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.font = 'bold 16px Arial';
            ctx.fillText(notification.title, startX + 10, y + 25);
            
            // Mesaj
            ctx.font = '14px Arial';
            ctx.fillText(notification.message, startX + 10, y + 50);
        });
    }
    
    renderDebugInfo(ctx) {
        const player = this.game.player;
        if (!player) return;
        
        const debugInfo = [
            `FPS: ${Math.round(1 / this.game.deltaTime)}`,
            `Pos: (${Math.round(player.x)}, ${Math.round(player.y)})`,
            `Tile: (${Math.floor(player.x/32)}, ${Math.floor(player.y/32)})`,
            `Direction: ${player.direction}`,
            `Moving: ${player.moving}`,
            `Health: ${Math.round(player.health)}/${player.maxHealth}`,
            `Mana: ${Math.round(player.mana)}/${player.maxMana}`,
            `Stamina: ${Math.round(player.stamina)}/${player.maxStamina}`,
            `Scene: ${this.game.world?.currentScene || 'none'}`,
            `Weather: ${this.game.gameData.weather}`,
            `Active Spells: ${this.game.magic?.activeSpells.length || 0}`,
            `Particles: ${this.game.world?.particles.length || 0}`,
            `Crops: ${this.game.farming?.crops.size || 0}`,
            `Items: ${this.game.inventory?.items.size || 0}`
        ];
        
        const startX = this.game.canvas.width - 250;
        const startY = 100;
        const lineHeight = 18;
        
        // Arka plan
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(startX - 10, startY - 20, 240, debugInfo.length * lineHeight + 30);
        
        // Debug bilgileri
        ctx.fillStyle = '#00ff00';
        ctx.font = '12px monospace';
        debugInfo.forEach((info, index) => {
            ctx.fillText(info, startX, startY + (index * lineHeight));
        });
    }
    
    // Yardımcı metodlar
    getSeasonName(season) {
        const seasons = {
            spring: 'İlkbahar',
            summer: 'Yaz',
            fall: 'Sonbahar',
            winter: 'Kış'
        };
        return seasons[season] || season;
    }
    
    getWeatherName(weather) {
        const weathers = {
            sunny: 'Güneşli',
            cloudy: 'Bulutlu',
            rainy: 'Yağmurlu',
            stormy: 'Fırtınalı',
            snowy: 'Karlı'
        };
        return weathers[weather] || weather;
    }
    
    // Oyun menüleri
    showInventoryMenu() {
        // Envanter menüsünü göster
        this.game.gameState = 'inventory';
        this.showNotification('Envanter', 'Envanter açıldı', 'info');
    }
    
    showCraftingMenu() {
        // Üretim menüsünü göster
        if (this.game.inventory) {
            const availableRecipes = this.game.inventory.getAvailableRecipes();
            if (availableRecipes.length > 0) {
                this.showNotification('Üretim', `${availableRecipes.length} tarif mevcut`, 'info');
            } else {
                this.showMessage('Üretim için yeterli malzeme yok!');
            }
        }
    }
    
    showSpellMenu() {
        // Büyü menüsünü göster
        if (this.game.magic) {
            const knownSpells = this.game.magic.getKnownSpells();
            this.showNotification('Büyüler', `${knownSpells.length} büyü biliniyor`, 'info');
        }
    }
    
    // Mobil optimizasyonu için dokunmatik geri bildirim
    vibrate(duration = 50) {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }
    
    // Ekran yönlendirme uyarısı
    checkOrientation() {
        if (window.innerHeight > window.innerWidth) {
            this.showNotification(
                'Ekran Yönlendirme',
                'Daha iyi deneyim için cihazınızı yatay tutun',
                'warning',
                5000
            );
        }
    }
    
    // Performans optimizasyonu
    optimizeForMobile() {
        // Düşük performanslı cihazlar için ayarlar
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // Parçacık sayısını azalt
            if (this.game.world) {
                this.game.world.maxParticles = 50;
            }
            
            // Animasyon kalitesini düşür
            this.game.canvas.style.imageRendering = 'pixelated';
            
            // Frame rate'i sınırla
            this.game.targetFPS = 30;
        }
    }
    
    // Oyun kaydetme/yükleme UI
    showSaveDialog() {
        this.showNotification('Kaydet', 'Oyun kaydediliyor...', 'info');
        
        // Local storage'a kaydet
        const saveData = {
            player: {
                x: this.game.player.x,
                y: this.game.player.y,
                health: this.game.player.health,
                mana: this.game.player.mana,
                level: this.game.player.farmingLevel
            },
            gameData: this.game.gameData,
            inventory: this.game.inventory?.save(),
            farming: {
                crops: Array.from(this.game.farming?.crops.entries() || []),
                soil: Array.from(this.game.farming?.soil.entries() || [])
            }
        };
        
        try {
            localStorage.setItem('mysticValleySave', JSON.stringify(saveData));
            this.showNotification('Kaydet', 'Oyun başarıyla kaydedildi!', 'success');
        } catch (error) {
            this.showNotification('Hata', 'Oyun kaydedilemedi!', 'error');
        }
    }
    
    loadGame() {
        try {
            const saveData = localStorage.getItem('mysticValleySave');
            if (saveData) {
                const data = JSON.parse(saveData);
                
                // Oyun verilerini yükle
                if (data.gameData) {
                    Object.assign(this.game.gameData, data.gameData);
                }
                
                // Oyuncu verilerini yükle
                if (data.player && this.game.player) {
                    Object.assign(this.game.player, data.player);
                }
                
                // Envanter verilerini yükle
                if (data.inventory && this.game.inventory) {
                    this.game.inventory.load(data.inventory);
                }
                
                // Çiftlik verilerini yükle
                if (data.farming && this.game.farming) {
                    if (data.farming.crops) {
                        this.game.farming.crops = new Map(data.farming.crops);
                    }
                    if (data.farming.soil) {
                        this.game.farming.soil = new Map(data.farming.soil);
                    }
                }
                
                this.showNotification('Yükle', 'Oyun başarıyla yüklendi!', 'success');
                return true;
            }
        } catch (error) {
            this.showNotification('Hata', 'Oyun yüklenemedi!', 'error');
        }
        
        return false;
    }
}