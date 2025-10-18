// Oyuncu karakteri sınıfı
class Player {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 32;
        
        // Hareket
        this.speed = 120; // piksel/saniye
        this.direction = 'down';
        this.moving = false;
        this.lastMoveTime = 0;
        
        // Animasyon
        this.animationFrame = 0;
        this.animationTime = 0;
        this.animationSpeed = 0.2; // saniye
        
        // İstatistikler
        this.health = 100;
        this.maxHealth = 100;
        this.mana = 50;
        this.maxMana = 50;
        this.stamina = 100;
        this.maxStamina = 100;
        
        // Yetenekler
        this.farmingLevel = 1;
        this.magicLevel = 1;
        this.combatLevel = 1;
        this.miningLevel = 1;
        this.fishingLevel = 1;
        
        // Durum
        this.isAttacking = false;
        this.isCasting = false;
        this.attackCooldown = 0;
        this.castCooldown = 0;
        
        // Sprite renkleri (kod ile oluşturulan)
        this.colors = {
            skin: '#ffdbac',
            hair: '#8b4513',
            shirt: '#4169e1',
            pants: '#2f4f4f',
            boots: '#654321'
        };
        
        console.log('Oyuncu karakteri oluşturuldu');
    }
    
    update(deltaTime) {
        // Cooldown'ları güncelle
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
        if (this.castCooldown > 0) {
            this.castCooldown -= deltaTime;
        }
        
        // Animasyonu güncelle
        if (this.moving) {
            this.animationTime += deltaTime;
            if (this.animationTime >= this.animationSpeed) {
                this.animationFrame = (this.animationFrame + 1) % 4;
                this.animationTime = 0;
            }
        } else {
            this.animationFrame = 0;
        }
        
        // Mana ve stamina yenilenmesi
        if (this.mana < this.maxMana) {
            this.mana = Math.min(this.maxMana, this.mana + deltaTime * 10);
        }
        if (this.stamina < this.maxStamina) {
            this.stamina = Math.min(this.maxStamina, this.stamina + deltaTime * 20);
        }
        
        // Hareket durumunu sıfırla
        this.moving = false;
    }
    
    move(dx, dy) {
        const currentTime = Date.now();
        if (currentTime - this.lastMoveTime < 150) return; // Hareket hızını sınırla
        
        const tileSize = 32;
        const newX = this.x + dx * tileSize;
        const newY = this.y + dy * tileSize;
        
        // Dünya sınırları kontrolü
        if (newX < 0 || newX >= this.game.canvas.width - this.width ||
            newY < 0 || newY >= this.game.canvas.height - this.height) {
            return;
        }
        
        // Çarpışma kontrolü
        if (this.game.world && this.game.world.isCollision(newX, newY, this.width, this.height)) {
            return;
        }
        
        // Hareketi uygula
        this.x = newX;
        this.y = newY;
        this.moving = true;
        this.lastMoveTime = currentTime;
        
        // Yönü güncelle
        if (dx > 0) this.direction = 'right';
        else if (dx < 0) this.direction = 'left';
        else if (dy > 0) this.direction = 'down';
        else if (dy < 0) this.direction = 'up';
        
        // Stamina tüket
        this.stamina = Math.max(0, this.stamina - 2);
    }
    
    attack() {
        if (this.attackCooldown > 0 || this.stamina < 10) return;
        
        this.isAttacking = true;
        this.attackCooldown = 0.5; // 0.5 saniye cooldown
        this.stamina -= 10;
        
        // Saldırı alanını hesapla
        const attackRange = 40;
        let attackX = this.x;
        let attackY = this.y;
        
        switch(this.direction) {
            case 'up':
                attackY -= attackRange;
                break;
            case 'down':
                attackY += this.height;
                break;
            case 'left':
                attackX -= attackRange;
                break;
            case 'right':
                attackX += this.width;
                break;
        }
        
        // Düşmanları kontrol et ve hasar ver
        // Bu kısım düşman sistemi eklendiğinde genişletilecek
        
        setTimeout(() => {
            this.isAttacking = false;
        }, 200);
        
        console.log('Oyuncu saldırdı!');
    }
    
    castSpell(spellType = 'fireball') {
        if (this.castCooldown > 0 || this.mana < 20) return;
        
        this.isCasting = true;
        this.castCooldown = 1.0; // 1 saniye cooldown
        this.mana -= 20;
        
        // Büyü efekti oluştur
        if (this.game.magic) {
            this.game.magic.createSpell(spellType, this.x, this.y, this.direction);
        }
        
        setTimeout(() => {
            this.isCasting = false;
        }, 300);
        
        console.log(`Oyuncu ${spellType} büyüsü kullandı!`);
    }
    
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        
        // Ölüm kontrolü
        if (this.health <= 0) {
            this.onDeath();
        }
        
        // UI'de hasar göster
        if (this.game.ui) {
            this.game.ui.showFloatingText(`-${amount}`, this.x, this.y - 10, '#ff0000');
        }
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        
        if (this.game.ui) {
            this.game.ui.showFloatingText(`+${amount}`, this.x, this.y - 10, '#00ff00');
        }
    }
    
    onDeath() {
        console.log('Oyuncu öldü!');
        // Ölüm ekranı veya respawn mantığı
        this.health = this.maxHealth * 0.5; // %50 can ile yeniden doğ
        this.x = 400; // Başlangıç pozisyonuna dön
        this.y = 300;
    }
    
    render(ctx) {
        // Gölge çiz
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.ellipse(this.x + this.width/2, this.y + this.height - 2, this.width/3, 4, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Karakter gövdesini çiz
        this.drawCharacter(ctx);
        
        // Saldırı efekti
        if (this.isAttacking) {
            this.drawAttackEffect(ctx);
        }
        
        // Büyü efekti
        if (this.isCasting) {
            this.drawCastEffect(ctx);
        }
        
        // Debug bilgisi (geliştirme aşamasında)
        if (false) { // Debug modunu açmak için true yap
            ctx.strokeStyle = '#ff0000';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.fillText(`${Math.floor(this.x)}, ${Math.floor(this.y)}`, this.x, this.y - 5);
        }
    }
    
    drawCharacter(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        // Animasyon offset'i
        const bobOffset = this.moving ? Math.sin(this.animationFrame * Math.PI / 2) * 1 : 0;
        
        // Kafa
        ctx.fillStyle = this.colors.skin;
        ctx.fillRect(centerX - 6, this.y + 2 + bobOffset, 12, 12);
        
        // Saç
        ctx.fillStyle = this.colors.hair;
        ctx.fillRect(centerX - 7, this.y + 1 + bobOffset, 14, 8);
        
        // Gözler
        ctx.fillStyle = '#000000';
        ctx.fillRect(centerX - 4, this.y + 5 + bobOffset, 2, 2);
        ctx.fillRect(centerX + 2, this.y + 5 + bobOffset, 2, 2);
        
        // Gövde
        ctx.fillStyle = this.colors.shirt;
        ctx.fillRect(centerX - 8, this.y + 14 + bobOffset, 16, 12);
        
        // Kollar
        const armOffset = this.moving ? Math.sin(this.animationFrame * Math.PI / 2) * 2 : 0;
        ctx.fillStyle = this.colors.skin;
        ctx.fillRect(centerX - 12, this.y + 16 + bobOffset + armOffset, 4, 8);
        ctx.fillRect(centerX + 8, this.y + 16 + bobOffset - armOffset, 4, 8);
        
        // Bacaklar
        ctx.fillStyle = this.colors.pants;
        const legOffset = this.moving ? Math.sin(this.animationFrame * Math.PI / 2) * 3 : 0;
        ctx.fillRect(centerX - 6, this.y + 26 + bobOffset + legOffset, 5, 6);
        ctx.fillRect(centerX + 1, this.y + 26 + bobOffset - legOffset, 5, 6);
        
        // Ayakkabılar
        ctx.fillStyle = this.colors.boots;
        ctx.fillRect(centerX - 7, this.y + 30 + bobOffset + legOffset, 6, 3);
        ctx.fillRect(centerX + 1, this.y + 30 + bobOffset - legOffset, 6, 3);
        
        // Yön göstergesi (ok)
        if (this.moving) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            const arrowSize = 4;
            let arrowX = centerX;
            let arrowY = centerY;
            
            switch(this.direction) {
                case 'up':
                    arrowY -= 20;
                    ctx.beginPath();
                    ctx.moveTo(arrowX, arrowY);
                    ctx.lineTo(arrowX - arrowSize, arrowY + arrowSize);
                    ctx.lineTo(arrowX + arrowSize, arrowY + arrowSize);
                    ctx.fill();
                    break;
                case 'down':
                    arrowY += 20;
                    ctx.beginPath();
                    ctx.moveTo(arrowX, arrowY);
                    ctx.lineTo(arrowX - arrowSize, arrowY - arrowSize);
                    ctx.lineTo(arrowX + arrowSize, arrowY - arrowSize);
                    ctx.fill();
                    break;
                case 'left':
                    arrowX -= 20;
                    ctx.beginPath();
                    ctx.moveTo(arrowX, arrowY);
                    ctx.lineTo(arrowX + arrowSize, arrowY - arrowSize);
                    ctx.lineTo(arrowX + arrowSize, arrowY + arrowSize);
                    ctx.fill();
                    break;
                case 'right':
                    arrowX += 20;
                    ctx.beginPath();
                    ctx.moveTo(arrowX, arrowY);
                    ctx.lineTo(arrowX - arrowSize, arrowY - arrowSize);
                    ctx.lineTo(arrowX - arrowSize, arrowY + arrowSize);
                    ctx.fill();
                    break;
            }
        }
    }
    
    drawAttackEffect(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        // Saldırı efekti
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        const effectSize = 20;
        switch(this.direction) {
            case 'up':
                ctx.arc(centerX, centerY - effectSize, effectSize, 0, Math.PI);
                break;
            case 'down':
                ctx.arc(centerX, centerY + effectSize, effectSize, Math.PI, 2 * Math.PI);
                break;
            case 'left':
                ctx.arc(centerX - effectSize, centerY, effectSize, -Math.PI/2, Math.PI/2);
                break;
            case 'right':
                ctx.arc(centerX + effectSize, centerY, effectSize, Math.PI/2, 3*Math.PI/2);
                break;
        }
        
        ctx.stroke();
    }
    
    drawCastEffect(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        // Büyü efekti - parlayan daire
        const time = Date.now() * 0.01;
        const radius = 15 + Math.sin(time) * 5;
        
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        
        // İç parıltı
        ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Yardımcı metodlar
    getHealthPercentage() {
        return this.health / this.maxHealth;
    }
    
    getManaPercentage() {
        return this.mana / this.maxMana;
    }
    
    getStaminaPercentage() {
        return this.stamina / this.maxStamina;
    }
    
    getTilePosition() {
        return {
            x: Math.floor(this.x / 32),
            y: Math.floor(this.y / 32)
        };
    }
}