// Büyü sistemi
class Magic {
    constructor(game) {
        this.game = game;
        this.spells = new Map();
        this.activeSpells = [];
        this.spellTypes = this.initializeSpellTypes();
        this.knownSpells = new Set(['fireball', 'heal', 'grow']); // Başlangıç büyüleri
        
        // Büyü efektleri
        this.effects = [];
        this.particles = [];
        
        console.log('Büyü sistemi başlatıldı');
    }
    
    initializeSpellTypes() {
        return {
            // Saldırı büyüleri
            fireball: {
                name: 'Ateş Topu',
                type: 'offensive',
                manaCost: 20,
                damage: 35,
                range: 150,
                speed: 200,
                cooldown: 2,
                description: 'Düşmanlara ateş topu fırlatır',
                color: '#ff4500',
                element: 'fire',
                level: 1,
                particles: 'fire'
            },
            lightning: {
                name: 'Şimşek',
                type: 'offensive',
                manaCost: 30,
                damage: 50,
                range: 200,
                speed: 500,
                cooldown: 3,
                description: 'Anlık şimşek saldırısı',
                color: '#ffff00',
                element: 'lightning',
                level: 3,
                particles: 'lightning'
            },
            ice_shard: {
                name: 'Buz Parçası',
                type: 'offensive',
                manaCost: 25,
                damage: 30,
                range: 120,
                speed: 180,
                cooldown: 2.5,
                description: 'Dondurucu buz parçası',
                color: '#00bfff',
                element: 'ice',
                level: 2,
                particles: 'ice',
                effect: 'slow'
            },
            
            // Savunma büyüleri
            shield: {
                name: 'Büyü Kalkanı',
                type: 'defensive',
                manaCost: 40,
                duration: 10,
                cooldown: 15,
                description: 'Geçici koruma sağlar',
                color: '#00ff00',
                element: 'arcane',
                level: 2,
                particles: 'shield'
            },
            invisibility: {
                name: 'Görünmezlik',
                type: 'defensive',
                manaCost: 50,
                duration: 8,
                cooldown: 20,
                description: 'Kısa süre görünmez olur',
                color: '#9370db',
                element: 'arcane',
                level: 4,
                particles: 'invisibility'
            },
            
            // Yardımcı büyüler
            heal: {
                name: 'İyileştirme',
                type: 'support',
                manaCost: 25,
                healing: 40,
                cooldown: 3,
                description: 'Canı yeniler',
                color: '#00ff00',
                element: 'nature',
                level: 1,
                particles: 'heal'
            },
            grow: {
                name: 'Büyütme',
                type: 'support',
                manaCost: 15,
                cooldown: 1,
                description: 'Bitkileri hızla büyütür',
                color: '#90ee90',
                element: 'nature',
                level: 1,
                particles: 'grow'
            },
            teleport: {
                name: 'Işınlanma',
                type: 'utility',
                manaCost: 35,
                range: 100,
                cooldown: 5,
                description: 'Kısa mesafe ışınlanma',
                color: '#9370db',
                element: 'arcane',
                level: 3,
                particles: 'teleport'
            },
            
            // Çiftlik büyüleri
            rain: {
                name: 'Yağmur Çağırma',
                type: 'utility',
                manaCost: 60,
                duration: 30,
                cooldown: 60,
                description: 'Geçici yağmur getirir',
                color: '#87ceeb',
                element: 'water',
                level: 3,
                particles: 'rain'
            },
            fertile_soil: {
                name: 'Verimli Toprak',
                type: 'utility',
                manaCost: 40,
                cooldown: 10,
                description: 'Toprağı verimli hale getirir',
                color: '#8b4513',
                element: 'earth',
                level: 2,
                particles: 'earth'
            },
            
            // İleri seviye büyüler
            meteor: {
                name: 'Meteor',
                type: 'offensive',
                manaCost: 80,
                damage: 100,
                range: 300,
                speed: 150,
                cooldown: 10,
                description: 'Gökten meteor düşürür',
                color: '#ff6600',
                element: 'fire',
                level: 5,
                particles: 'meteor'
            },
            time_stop: {
                name: 'Zaman Durdurma',
                type: 'utility',
                manaCost: 100,
                duration: 5,
                cooldown: 30,
                description: 'Zamanı kısa süre durdurur',
                color: '#4b0082',
                element: 'time',
                level: 6,
                particles: 'time'
            }
        };
    }
    
    update(deltaTime) {
        // Aktif büyüleri güncelle
        this.activeSpells = this.activeSpells.filter(spell => {
            spell.life -= deltaTime;
            
            if (spell.type === 'projectile') {
                this.updateProjectile(spell, deltaTime);
            } else if (spell.type === 'effect') {
                this.updateEffect(spell, deltaTime);
            }
            
            return spell.life > 0;
        });
        
        // Büyü efektlerini güncelle
        this.effects = this.effects.filter(effect => {
            effect.life -= deltaTime;
            return effect.life > 0;
        });
        
        // Parçacıkları güncelle
        this.particles = this.particles.filter(particle => {
            particle.life -= deltaTime;
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            
            // Yerçekimi efekti
            if (particle.gravity) {
                particle.vy += 200 * deltaTime;
            }
            
            return particle.life > 0;
        });
    }
    
    updateProjectile(spell, deltaTime) {
        // Hareket
        spell.x += spell.vx * deltaTime;
        spell.y += spell.vy * deltaTime;
        
        // Menzil kontrolü
        const distance = Math.sqrt(
            Math.pow(spell.x - spell.startX, 2) + 
            Math.pow(spell.y - spell.startY, 2)
        );
        
        if (distance > spell.range) {
            spell.life = 0;
            this.createExplosion(spell.x, spell.y, spell.spellType);
            return;
        }
        
        // Çarpışma kontrolü
        if (this.checkProjectileCollision(spell)) {
            spell.life = 0;
            this.createExplosion(spell.x, spell.y, spell.spellType);
        }
        
        // Parçacık izi
        this.createTrailParticles(spell);
    }
    
    updateEffect(spell, deltaTime) {
        // Büyü efektlerinin özel güncellemeleri
        switch(spell.spellId) {
            case 'shield':
                this.updateShieldEffect(spell, deltaTime);
                break;
            case 'invisibility':
                this.updateInvisibilityEffect(spell, deltaTime);
                break;
            case 'rain':
                this.updateRainEffect(spell, deltaTime);
                break;
        }
    }
    
    castSpell(spellId, targetX = null, targetY = null) {
        const spellType = this.spellTypes[spellId];
        if (!spellType) {
            console.error(`Bilinmeyen büyü: ${spellId}`);
            return false;
        }
        
        if (!this.knownSpells.has(spellId)) {
            this.showMessage('Bu büyüyü bilmiyorsunuz!');
            return false;
        }
        
        const player = this.game.player;
        if (!player) return false;
        
        // Mana kontrolü
        if (player.mana < spellType.manaCost) {
            this.showMessage('Yetersiz mana!');
            return false;
        }
        
        // Cooldown kontrolü
        const lastCast = this.spells.get(spellId) || 0;
        const currentTime = Date.now() / 1000;
        if (currentTime - lastCast < spellType.cooldown) {
            this.showMessage('Büyü henüz hazır değil!');
            return false;
        }
        
        // Mana tüket
        player.mana -= spellType.manaCost;
        this.spells.set(spellId, currentTime);
        
        // Büyüyü uygula
        this.executeSpell(spellId, spellType, targetX, targetY);
        
        // Deneyim ver
        this.game.addExperience(spellType.level * 2);
        
        return true;
    }
    
    executeSpell(spellId, spellType, targetX, targetY) {
        const player = this.game.player;
        const playerX = player.x + player.width / 2;
        const playerY = player.y + player.height / 2;
        
        switch(spellType.type) {
            case 'offensive':
                this.castOffensiveSpell(spellId, spellType, playerX, playerY, targetX, targetY);
                break;
            case 'defensive':
                this.castDefensiveSpell(spellId, spellType);
                break;
            case 'support':
                this.castSupportSpell(spellId, spellType, targetX, targetY);
                break;
            case 'utility':
                this.castUtilitySpell(spellId, spellType, targetX, targetY);
                break;
        }
        
        // Cast efekti
        this.createCastEffect(playerX, playerY, spellType.color);
        
        this.showMessage(`${spellType.name} büyüsü kullandınız!`);
    }
    
    castOffensiveSpell(spellId, spellType, startX, startY, targetX, targetY) {
        // Hedef belirleme
        if (targetX === null || targetY === null) {
            // Oyuncunun baktığı yöne fırlat
            const direction = this.game.player.direction;
            switch(direction) {
                case 'up':
                    targetX = startX;
                    targetY = startY - 100;
                    break;
                case 'down':
                    targetX = startX;
                    targetY = startY + 100;
                    break;
                case 'left':
                    targetX = startX - 100;
                    targetY = startY;
                    break;
                case 'right':
                    targetX = startX + 100;
                    targetY = startY;
                    break;
                default:
                    targetX = startX + 100;
                    targetY = startY;
            }
        }
        
        // Projectile oluştur
        const dx = targetX - startX;
        const dy = targetY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const vx = (dx / distance) * spellType.speed;
            const vy = (dy / distance) * spellType.speed;
            
            this.activeSpells.push({
                type: 'projectile',
                spellId: spellId,
                spellType: spellType,
                x: startX,
                y: startY,
                startX: startX,
                startY: startY,
                vx: vx,
                vy: vy,
                life: spellType.range / spellType.speed,
                range: spellType.range,
                size: 8
            });
        }
    }
    
    castDefensiveSpell(spellId, spellType) {
        this.activeSpells.push({
            type: 'effect',
            spellId: spellId,
            spellType: spellType,
            life: spellType.duration,
            target: 'player'
        });
        
        // Oyuncuya buff uygula
        this.applyPlayerBuff(spellId, spellType);
    }
    
    castSupportSpell(spellId, spellType, targetX, targetY) {
        const player = this.game.player;
        
        switch(spellId) {
            case 'heal':
                player.heal(spellType.healing);
                this.createHealEffect(player.x + player.width/2, player.y + player.height/2);
                break;
                
            case 'grow':
                this.castGrowSpell(targetX, targetY);
                break;
        }
    }
    
    castUtilitySpell(spellId, spellType, targetX, targetY) {
        switch(spellId) {
            case 'teleport':
                this.castTeleport(targetX, targetY, spellType.range);
                break;
                
            case 'rain':
                this.castRain(spellType.duration);
                break;
                
            case 'fertile_soil':
                this.castFertileSoil(targetX, targetY);
                break;
                
            case 'time_stop':
                this.castTimeStop(spellType.duration);
                break;
        }
    }
    
    castGrowSpell(targetX, targetY) {
        if (!this.game.farming) return;
        
        const player = this.game.player;
        const tileX = targetX !== null ? Math.floor(targetX / 32) : Math.floor(player.x / 32);
        const tileY = targetY !== null ? Math.floor(targetY / 32) : Math.floor(player.y / 32);
        
        // Çevredeki bitkileri büyüt
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                const cropKey = `${tileX + dx},${tileY + dy}`;
                const crop = this.game.farming.crops.get(cropKey);
                
                if (crop && crop.stage < crop.type.stages.length - 1) {
                    crop.growthProgress += 1; // 1 gün büyüme
                    this.game.farming.updateCrop(crop, 0);
                    
                    // Büyüme efekti
                    this.createGrowEffect((tileX + dx) * 32 + 16, (tileY + dy) * 32 + 16);
                }
            }
        }
    }
    
    castTeleport(targetX, targetY, range) {
        const player = this.game.player;
        
        if (targetX === null || targetY === null) {
            // Oyuncunun baktığı yöne ışınlan
            const direction = player.direction;
            switch(direction) {
                case 'up':
                    targetY = player.y - range;
                    targetX = player.x;
                    break;
                case 'down':
                    targetY = player.y + range;
                    targetX = player.x;
                    break;
                case 'left':
                    targetX = player.x - range;
                    targetY = player.y;
                    break;
                case 'right':
                    targetX = player.x + range;
                    targetY = player.y;
                    break;
            }
        }
        
        // Çarpışma kontrolü
        if (!this.game.world.isCollision(targetX, targetY, player.width, player.height)) {
            // Teleport efekti
            this.createTeleportEffect(player.x + player.width/2, player.y + player.height/2);
            
            player.x = targetX;
            player.y = targetY;
            
            this.createTeleportEffect(player.x + player.width/2, player.y + player.height/2);
        } else {
            this.showMessage('Oraya ışınlanamazsınız!');
        }
    }
    
    castRain(duration) {
        // Hava durumunu geçici olarak değiştir
        const originalWeather = this.game.gameData.weather;
        this.game.gameData.weather = 'rainy';
        
        // Tüm bitkileri sula
        if (this.game.farming) {
            this.game.farming.soil.forEach((soil, key) => {
                soil.watered = true;
                soil.waterLevel = 1.0;
            });
        }
        
        // Süre sonunda eski hava durumuna dön
        setTimeout(() => {
            this.game.gameData.weather = originalWeather;
        }, duration * 1000);
        
        this.showMessage('Yağmur çağırdınız!');
    }
    
    castFertileSoil(targetX, targetY) {
        if (!this.game.farming) return;
        
        const player = this.game.player;
        const tileX = targetX !== null ? Math.floor(targetX / 32) : Math.floor(player.x / 32);
        const tileY = targetY !== null ? Math.floor(targetY / 32) : Math.floor(player.y / 32);
        
        // Çevredeki toprağı verimli yap
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const soilKey = `${tileX + dx},${tileY + dy}`;
                const soil = this.game.farming.soil.get(soilKey);
                
                if (soil) {
                    soil.fertility = Math.min(2.0, soil.fertility + 0.5);
                    this.createFertileEffect((tileX + dx) * 32 + 16, (tileY + dy) * 32 + 16);
                }
            }
        }
    }
    
    castTimeStop(duration) {
        // Zaman durdurma efekti (basit implementasyon)
        this.game.gameState = 'time_stopped';
        
        setTimeout(() => {
            this.game.gameState = 'playing';
        }, duration * 1000);
        
        this.showMessage('Zaman durdu!');
    }
    
    checkProjectileCollision(spell) {
        // Dünya çarpışması
        if (this.game.world.isCollision(spell.x - spell.size/2, spell.y - spell.size/2, spell.size, spell.size)) {
            return true;
        }
        
        // Düşman çarpışması (gelecekte eklenecek)
        // ...
        
        return false;
    }
    
    applyPlayerBuff(spellId, spellType) {
        const player = this.game.player;
        
        switch(spellId) {
            case 'shield':
                // Geçici savunma bonusu
                player.defense = (player.defense || 0) + 20;
                setTimeout(() => {
                    player.defense = Math.max(0, (player.defense || 0) - 20);
                }, spellType.duration * 1000);
                break;
                
            case 'invisibility':
                // Görünmezlik efekti
                player.invisible = true;
                setTimeout(() => {
                    player.invisible = false;
                }, spellType.duration * 1000);
                break;
        }
    }
    
    // Efekt oluşturma metodları
    createCastEffect(x, y, color) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 100,
                vy: (Math.random() - 0.5) * 100,
                life: 0.5 + Math.random() * 0.5,
                color: color,
                size: 2 + Math.random() * 3
            });
        }
    }
    
    createExplosion(x, y, spellType) {
        const particleCount = spellType.damage / 5;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = 50 + Math.random() * 100;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0.8 + Math.random() * 0.4,
                color: spellType.color,
                size: 3 + Math.random() * 4,
                gravity: spellType.element === 'fire'
            });
        }
    }
    
    createTrailParticles(spell) {
        if (Math.random() < 0.3) {
            this.particles.push({
                x: spell.x + (Math.random() - 0.5) * 10,
                y: spell.y + (Math.random() - 0.5) * 10,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20,
                life: 0.3 + Math.random() * 0.2,
                color: spell.spellType.color,
                size: 1 + Math.random() * 2
            });
        }
    }
    
    createHealEffect(x, y) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 30,
                y: y + (Math.random() - 0.5) * 30,
                vx: (Math.random() - 0.5) * 30,
                vy: -Math.random() * 50 - 20,
                life: 1 + Math.random() * 0.5,
                color: '#00ff00',
                size: 2 + Math.random() * 2
            });
        }
    }
    
    createGrowEffect(x, y) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 20,
                vy: -Math.random() * 30 - 10,
                life: 0.8 + Math.random() * 0.4,
                color: '#90ee90',
                size: 1 + Math.random() * 2
            });
        }
    }
    
    createTeleportEffect(x, y) {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 40,
                y: y + (Math.random() - 0.5) * 40,
                vx: (Math.random() - 0.5) * 80,
                vy: (Math.random() - 0.5) * 80,
                life: 0.6 + Math.random() * 0.4,
                color: '#9370db',
                size: 2 + Math.random() * 3
            });
        }
    }
    
    createFertileEffect(x, y) {
        for (let i = 0; i < 6; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 25,
                y: y + (Math.random() - 0.5) * 25,
                vx: (Math.random() - 0.5) * 30,
                vy: -Math.random() * 20 - 5,
                life: 1 + Math.random() * 0.5,
                color: '#8b4513',
                size: 1 + Math.random() * 2
            });
        }
    }
    
    render(ctx) {
        // Aktif büyüleri çiz
        this.activeSpells.forEach(spell => {
            if (spell.type === 'projectile') {
                this.renderProjectile(ctx, spell);
            } else if (spell.type === 'effect') {
                this.renderEffect(ctx, spell);
            }
        });
        
        // Parçacıkları çiz
        this.renderParticles(ctx);
    }
    
    renderProjectile(ctx, spell) {
        if (!this.game.player) return;
        
        const cameraX = this.game.player.x - this.game.canvas.width / 2;
        const cameraY = this.game.player.y - this.game.canvas.height / 2;
        
        const screenX = spell.x - cameraX;
        const screenY = spell.y - cameraY;
        
        // Büyü çekirdeği
        ctx.fillStyle = spell.spellType.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, spell.size, 0, 2 * Math.PI);
        ctx.fill();
        
        // Parıltı efekti
        ctx.strokeStyle = spell.spellType.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(screenX, screenY, spell.size + 3, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    renderEffect(ctx, spell) {
        if (!this.game.player) return;
        
        const player = this.game.player;
        const cameraX = player.x - this.game.canvas.width / 2;
        const cameraY = player.y - this.game.canvas.height / 2;
        
        const screenX = player.x + player.width/2 - cameraX;
        const screenY = player.y + player.height/2 - cameraY;
        
        switch(spell.spellId) {
            case 'shield':
                ctx.strokeStyle = spell.spellType.color;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(screenX, screenY, 25, 0, 2 * Math.PI);
                ctx.stroke();
                break;
                
            case 'invisibility':
                // Oyuncuyu yarı saydam yap
                ctx.globalAlpha = 0.3;
                break;
        }
    }
    
    renderParticles(ctx) {
        if (!this.game.player) return;
        
        const cameraX = this.game.player.x - this.game.canvas.width / 2;
        const cameraY = this.game.player.y - this.game.canvas.height / 2;
        
        this.particles.forEach(particle => {
            const screenX = particle.x - cameraX;
            const screenY = particle.y - cameraY;
            
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.life / 2;
            ctx.beginPath();
            ctx.arc(screenX, screenY, particle.size, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        ctx.globalAlpha = 1;
    }
    
    // Büyü öğrenme
    learnSpell(spellId) {
        if (this.spellTypes[spellId]) {
            this.knownSpells.add(spellId);
            this.showMessage(`${this.spellTypes[spellId].name} büyüsünü öğrendiniz!`);
            return true;
        }
        return false;
    }
    
    // Mevcut büyüleri listele
    getKnownSpells() {
        return Array.from(this.knownSpells).map(spellId => ({
            id: spellId,
            ...this.spellTypes[spellId]
        }));
    }
    
    showMessage(message) {
        if (this.game.ui) {
            this.game.ui.showMessage(message);
        }
        console.log(`Büyü: ${message}`);
    }
    
    // Seçili büyüyü kullan
    castSelectedSpell(x, y) {
        // Şimdilik fireball kullan
        this.castSpell('fireball', x, y);
    }
}