// Çiftlik ve tarım sistemi
class Farming {
    constructor(game) {
        this.game = game;
        this.crops = new Map(); // Ekilmiş bitkiler
        this.cropTypes = this.initializeCropTypes();
        this.tools = ['hoe', 'watering_can', 'scythe', 'seeds'];
        this.currentTool = 'hoe';
        
        // Çiftlik durumu
        this.soil = new Map(); // Toprak durumu (işlenmiş, sulanmış, vs.)
        this.seasons = {
            spring: ['potato', 'carrot', 'tulip'],
            summer: ['tomato', 'corn', 'sunflower'],
            fall: ['pumpkin', 'wheat', 'grape'],
            winter: ['turnip', 'crystal_berry']
        };
        
        console.log('Çiftlik sistemi başlatıldı');
    }
    
    initializeCropTypes() {
        return {
            potato: {
                name: 'Patates',
                growthTime: 4, // gün
                seasons: ['spring', 'fall'],
                value: 50,
                stages: ['seed', 'sprout', 'growing', 'ready'],
                waterNeeded: 2,
                experience: 10,
                color: '#8b4513'
            },
            carrot: {
                name: 'Havuç',
                growthTime: 3,
                seasons: ['spring', 'summer'],
                value: 35,
                stages: ['seed', 'sprout', 'growing', 'ready'],
                waterNeeded: 1,
                experience: 8,
                color: '#ff8c00'
            },
            tomato: {
                name: 'Domates',
                growthTime: 5,
                seasons: ['summer'],
                value: 80,
                stages: ['seed', 'sprout', 'growing', 'flowering', 'ready'],
                waterNeeded: 3,
                experience: 15,
                color: '#ff0000'
            },
            corn: {
                name: 'Mısır',
                growthTime: 6,
                seasons: ['summer'],
                value: 100,
                stages: ['seed', 'sprout', 'growing', 'tall', 'tasseling', 'ready'],
                waterNeeded: 2,
                experience: 20,
                color: '#ffd700'
            },
            pumpkin: {
                name: 'Balkabağı',
                growthTime: 8,
                seasons: ['fall'],
                value: 200,
                stages: ['seed', 'sprout', 'vine', 'flowering', 'small_fruit', 'growing_fruit', 'large_fruit', 'ready'],
                waterNeeded: 4,
                experience: 30,
                color: '#ff8c00'
            },
            wheat: {
                name: 'Buğday',
                growthTime: 4,
                seasons: ['fall'],
                value: 60,
                stages: ['seed', 'sprout', 'growing', 'ready'],
                waterNeeded: 1,
                experience: 12,
                color: '#daa520'
            },
            turnip: {
                name: 'Şalgam',
                growthTime: 3,
                seasons: ['winter'],
                value: 40,
                stages: ['seed', 'sprout', 'growing', 'ready'],
                waterNeeded: 1,
                experience: 8,
                color: '#9370db'
            },
            crystal_berry: {
                name: 'Kristal Meyve',
                growthTime: 10,
                seasons: ['winter'],
                value: 500,
                stages: ['seed', 'sprout', 'growing', 'crystallizing', 'glowing', 'ready'],
                waterNeeded: 5,
                experience: 50,
                color: '#00ffff',
                magical: true
            },
            tulip: {
                name: 'Lale',
                growthTime: 2,
                seasons: ['spring'],
                value: 25,
                stages: ['seed', 'sprout', 'ready'],
                waterNeeded: 1,
                experience: 5,
                color: '#ff69b4',
                flower: true
            },
            sunflower: {
                name: 'Ayçiçeği',
                growthTime: 4,
                seasons: ['summer'],
                value: 90,
                stages: ['seed', 'sprout', 'growing', 'ready'],
                waterNeeded: 2,
                experience: 18,
                color: '#ffd700',
                flower: true
            }
        };
    }
    
    update(deltaTime) {
        // Bitkilerin büyümesini kontrol et
        this.crops.forEach((crop, key) => {
            this.updateCrop(crop, deltaTime);
        });
        
        // Toprak nemini azalt
        this.soil.forEach((soilData, key) => {
            if (soilData.watered) {
                soilData.waterLevel -= deltaTime * 0.1; // Su yavaşça buharlaşır
                if (soilData.waterLevel <= 0) {
                    soilData.watered = false;
                    soilData.waterLevel = 0;
                }
            }
        });
    }
    
    updateCrop(crop, deltaTime) {
        if (crop.stage >= crop.type.stages.length - 1) return; // Zaten olgun
        
        // Su gereksinimi kontrolü
        const soilKey = `${crop.x},${crop.y}`;
        const soil = this.soil.get(soilKey);
        
        if (!soil || !soil.watered) {
            crop.growthProgress -= deltaTime * 0.05; // Susuz büyüme yavaşlar
            crop.growthProgress = Math.max(0, crop.growthProgress);
            return;
        }
        
        // Normal büyüme
        const growthRate = this.getGrowthRate(crop);
        crop.growthProgress += deltaTime * growthRate;
        
        // Aşama kontrolü
        const stageProgress = crop.growthProgress / crop.type.growthTime;
        const newStage = Math.min(
            Math.floor(stageProgress * crop.type.stages.length),
            crop.type.stages.length - 1
        );
        
        if (newStage > crop.stage) {
            crop.stage = newStage;
            this.onCropStageChange(crop);
        }
    }
    
    getGrowthRate(crop) {
        let rate = 1.0;
        
        // Mevsim bonusu
        const currentSeason = this.game.gameData.season;
        if (crop.type.seasons.includes(currentSeason)) {
            rate *= 1.2;
        } else {
            rate *= 0.5; // Yanlış mevsimde yavaş büyür
        }
        
        // Hava durumu bonusu
        const weather = this.game.gameData.weather;
        if (weather === 'rainy') {
            rate *= 1.3;
        } else if (weather === 'sunny') {
            rate *= 1.1;
        } else if (weather === 'stormy') {
            rate *= 0.8;
        }
        
        // Büyülü bitkiler için özel durum
        if (crop.type.magical) {
            const timeOfDay = this.getTimeOfDay();
            if (timeOfDay === 'night') {
                rate *= 1.5; // Gece büyür
            }
        }
        
        return rate;
    }
    
    getTimeOfDay() {
        const hour = Math.floor(this.game.gameData.time / 60);
        if (hour >= 6 && hour < 18) return 'day';
        if (hour >= 18 && hour < 22) return 'evening';
        return 'night';
    }
    
    onCropStageChange(crop) {
        // Aşama değişimi efekti
        if (this.game.ui) {
            this.game.ui.showFloatingText(
                `${crop.type.name} büyüyor!`,
                crop.x * 32 + 16,
                crop.y * 32 + 16,
                '#00ff00'
            );
        }
        
        // Parçacık efekti
        this.createGrowthEffect(crop.x * 32 + 16, crop.y * 32 + 16);
    }
    
    createGrowthEffect(x, y) {
        for (let i = 0; i < 5; i++) {
            this.game.world.addParticle({
                type: 'growth',
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 50,
                vy: -Math.random() * 30 - 20,
                life: 1 + Math.random(),
                color: '#00ff00'
            });
        }
    }
    
    handleAction(x, y) {
        const tool = this.getCurrentTool();
        
        switch(tool) {
            case 'hoe':
                this.tillSoil(x, y);
                break;
            case 'seeds':
                this.plantSeed(x, y);
                break;
            case 'watering_can':
                this.waterSoil(x, y);
                break;
            case 'scythe':
                this.harvestCrop(x, y);
                break;
        }
    }
    
    getCurrentTool() {
        // Inventory'den aktif tool'u al
        if (this.game.inventory) {
            return this.game.inventory.getActiveTool() || 'hoe';
        }
        return this.currentTool;
    }
    
    tillSoil(x, y) {
        const tile = this.game.world.getTile(x, y);
        if (!tile || !tile.farmable) {
            this.showMessage('Burada toprak işleyemezsiniz!');
            return;
        }
        
        const soilKey = `${x},${y}`;
        if (this.soil.has(soilKey)) {
            this.showMessage('Toprak zaten işlenmiş!');
            return;
        }
        
        // Toprağı işle
        this.soil.set(soilKey, {
            tilled: true,
            watered: false,
            waterLevel: 0,
            fertility: 1.0
        });
        
        // Tile'ı güncelle
        tile.tilled = true;
        
        this.showMessage('Toprak işlendi!');
        this.addFarmingExperience(2);
        
        // Efekt
        this.createTillEffect(x * 32 + 16, y * 32 + 16);
    }
    
    plantSeed(x, y) {
        const soilKey = `${x},${y}`;
        const soil = this.soil.get(soilKey);
        
        if (!soil || !soil.tilled) {
            this.showMessage('Önce toprağı işlemelisiniz!');
            return;
        }
        
        if (this.crops.has(soilKey)) {
            this.showMessage('Burada zaten bir bitki var!');
            return;
        }
        
        // Tohum türünü seç (şimdilik rastgele)
        const availableSeeds = this.getAvailableSeeds();
        if (availableSeeds.length === 0) {
            this.showMessage('Tohum yok!');
            return;
        }
        
        const seedType = availableSeeds[0]; // İlk mevcut tohumu kullan
        
        // Tohumu ek
        const crop = {
            type: this.cropTypes[seedType],
            x: x,
            y: y,
            stage: 0,
            growthProgress: 0,
            plantedDay: this.game.gameData.day,
            watered: 0
        };
        
        this.crops.set(soilKey, crop);
        
        // Inventory'den tohum çıkar
        if (this.game.inventory) {
            this.game.inventory.removeItem('seeds', 1);
        }
        
        this.showMessage(`${crop.type.name} ekildi!`);
        this.addFarmingExperience(5);
        
        // Efekt
        this.createPlantEffect(x * 32 + 16, y * 32 + 16);
    }
    
    getAvailableSeeds() {
        const currentSeason = this.game.gameData.season;
        return this.seasons[currentSeason] || [];
    }
    
    waterSoil(x, y) {
        const soilKey = `${x},${y}`;
        const soil = this.soil.get(soilKey);
        
        if (!soil) {
            this.showMessage('Burada toprak yok!');
            return;
        }
        
        if (soil.watered && soil.waterLevel > 0.8) {
            this.showMessage('Toprak zaten sulanmış!');
            return;
        }
        
        // Toprağı sula
        soil.watered = true;
        soil.waterLevel = 1.0;
        
        this.showMessage('Toprak sulandı!');
        this.addFarmingExperience(1);
        
        // Efekt
        this.createWaterEffect(x * 32 + 16, y * 32 + 16);
    }
    
    harvestCrop(x, y) {
        const soilKey = `${x},${y}`;
        const crop = this.crops.get(soilKey);
        
        if (!crop) {
            this.showMessage('Burada hasat edilecek bir şey yok!');
            return;
        }
        
        if (crop.stage < crop.type.stages.length - 1) {
            this.showMessage('Henüz olgunlaşmamış!');
            return;
        }
        
        // Hasadı yap
        const harvestAmount = this.calculateHarvestAmount(crop);
        const totalValue = harvestAmount * crop.type.value;
        
        // Ödülleri ver
        this.game.addGold(totalValue);
        this.addFarmingExperience(crop.type.experience);
        
        // Inventory'ye ürün ekle
        if (this.game.inventory) {
            this.game.inventory.addItem(crop.type.name.toLowerCase(), harvestAmount);
        }
        
        // Crop'u kaldır
        this.crops.delete(soilKey);
        
        // Toprak durumunu sıfırla
        const soil = this.soil.get(soilKey);
        if (soil) {
            soil.fertility *= 0.9; // Verimlilik azalır
        }
        
        this.showMessage(`${crop.type.name} hasat edildi! +${totalValue} altın`);
        
        // Efekt
        this.createHarvestEffect(x * 32 + 16, y * 32 + 16, crop.type.color);
    }
    
    calculateHarvestAmount(crop) {
        let amount = 1;
        
        // Kalite bonusu
        const soilKey = `${crop.x},${crop.y}`;
        const soil = this.soil.get(soilKey);
        if (soil && soil.fertility > 1.2) {
            amount += 1;
        }
        
        // Mevsim bonusu
        const currentSeason = this.game.gameData.season;
        if (crop.type.seasons.includes(currentSeason)) {
            amount += Math.floor(Math.random() * 2);
        }
        
        // Çiftçilik seviyesi bonusu
        const farmingLevel = this.game.player.farmingLevel;
        if (farmingLevel >= 5) {
            amount += Math.floor(Math.random() * 2);
        }
        
        return Math.max(1, amount);
    }
    
    addFarmingExperience(amount) {
        this.game.player.farmingLevel += amount * 0.1;
        this.game.addExperience(amount);
    }
    
    showMessage(message) {
        if (this.game.ui) {
            this.game.ui.showMessage(message);
        }
        console.log(`Çiftlik: ${message}`);
    }
    
    // Efekt metodları
    createTillEffect(x, y) {
        for (let i = 0; i < 8; i++) {
            this.game.world.addParticle({
                type: 'dirt',
                x: x + (Math.random() - 0.5) * 30,
                y: y + (Math.random() - 0.5) * 30,
                vx: (Math.random() - 0.5) * 100,
                vy: -Math.random() * 50 - 10,
                life: 0.5 + Math.random() * 0.5,
                color: '#8b4513'
            });
        }
    }
    
    createPlantEffect(x, y) {
        for (let i = 0; i < 5; i++) {
            this.game.world.addParticle({
                type: 'plant',
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 30,
                vy: -Math.random() * 20 - 10,
                life: 1 + Math.random(),
                color: '#90ee90'
            });
        }
    }
    
    createWaterEffect(x, y) {
        for (let i = 0; i < 10; i++) {
            this.game.world.addParticle({
                type: 'water',
                x: x + (Math.random() - 0.5) * 25,
                y: y + (Math.random() - 0.5) * 25,
                vx: (Math.random() - 0.5) * 20,
                vy: -Math.random() * 10,
                life: 0.8 + Math.random() * 0.4,
                color: '#87ceeb'
            });
        }
    }
    
    createHarvestEffect(x, y, color) {
        for (let i = 0; i < 15; i++) {
            this.game.world.addParticle({
                type: 'harvest',
                x: x + (Math.random() - 0.5) * 40,
                y: y + (Math.random() - 0.5) * 40,
                vx: (Math.random() - 0.5) * 80,
                vy: -Math.random() * 60 - 20,
                life: 1.5 + Math.random(),
                color: color
            });
        }
    }
    
    render(ctx) {
        // Toprağı çiz
        this.soil.forEach((soilData, key) => {
            const [x, y] = key.split(',').map(Number);
            this.renderSoil(ctx, soilData, x, y);
        });
        
        // Bitkileri çiz
        this.crops.forEach((crop, key) => {
            const [x, y] = key.split(',').map(Number);
            this.renderCrop(ctx, crop, x, y);
        });
    }
    
    renderSoil(ctx, soil, x, y) {
        if (!this.game.player) return;
        
        const cameraX = this.game.player.x - this.game.canvas.width / 2;
        const cameraY = this.game.player.y - this.game.canvas.height / 2;
        
        const screenX = x * 32 - cameraX;
        const screenY = y * 32 - cameraY;
        
        if (screenX < -32 || screenX > this.game.canvas.width ||
            screenY < -32 || screenY > this.game.canvas.height) {
            return;
        }
        
        if (soil.tilled) {
            // İşlenmiş toprak
            ctx.fillStyle = '#654321';
            ctx.fillRect(screenX + 2, screenY + 2, 28, 28);
            
            // Çizgiler
            ctx.strokeStyle = '#8b4513';
            ctx.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(screenX + 4, screenY + 6 + i * 6);
                ctx.lineTo(screenX + 28, screenY + 6 + i * 6);
                ctx.stroke();
            }
        }
        
        if (soil.watered) {
            // Su efekti
            ctx.fillStyle = `rgba(135, 206, 235, ${soil.waterLevel * 0.5})`;
            ctx.fillRect(screenX + 4, screenY + 4, 24, 24);
        }
    }
    
    renderCrop(ctx, crop, x, y) {
        if (!this.game.player) return;
        
        const cameraX = this.game.player.x - this.game.canvas.width / 2;
        const cameraY = this.game.player.y - this.game.canvas.height / 2;
        
        const screenX = x * 32 - cameraX;
        const screenY = y * 32 - cameraY;
        
        if (screenX < -32 || screenX > this.game.canvas.width ||
            screenY < -32 || screenY > this.game.canvas.height) {
            return;
        }
        
        const centerX = screenX + 16;
        const centerY = screenY + 16;
        const stage = crop.stage;
        const maxStage = crop.type.stages.length - 1;
        
        // Büyüme animasyonu
        const time = Date.now() * 0.003;
        const sway = Math.sin(time + x + y) * 2;
        
        ctx.fillStyle = crop.type.color;
        
        switch(stage) {
            case 0: // Tohum
                ctx.fillRect(centerX - 1, centerY + 8, 2, 2);
                break;
                
            case 1: // Filiz
                ctx.fillRect(centerX - 1, centerY + 4, 2, 8);
                ctx.fillStyle = '#90ee90';
                ctx.fillRect(centerX - 2, centerY + 2, 4, 4);
                break;
                
            default: // Büyüyen/olgun
                const size = Math.min(stage / maxStage * 20 + 4, 20);
                const height = Math.min(stage / maxStage * 16 + 8, 24);
                
                // Gövde
                ctx.fillStyle = '#228b22';
                ctx.fillRect(centerX - 1 + sway, centerY + 16 - height, 2, height);
                
                // Yapraklar/meyve
                ctx.fillStyle = crop.type.color;
                if (crop.type.flower) {
                    // Çiçek
                    ctx.beginPath();
                    ctx.arc(centerX + sway, centerY + 6 - height, size/2, 0, 2 * Math.PI);
                    ctx.fill();
                } else {
                    // Normal bitki
                    ctx.fillRect(
                        centerX - size/2 + sway,
                        centerY + 8 - height,
                        size,
                        size
                    );
                }
                
                // Olgun durumda parıltı
                if (stage === maxStage) {
                    ctx.strokeStyle = '#ffd700';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(centerX + sway, centerY + 6 - height, size/2 + 2, 0, 2 * Math.PI);
                    ctx.stroke();
                }
                break;
        }
        
        // Büyülü bitkiler için özel efekt
        if (crop.type.magical && stage > 1) {
            const glowTime = Date.now() * 0.005;
            const glowIntensity = (Math.sin(glowTime) + 1) * 0.5;
            
            ctx.strokeStyle = `rgba(0, 255, 255, ${glowIntensity})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(centerX + sway, centerY, 20, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
    
    onNewDay() {
        console.log('Çiftlik: Yeni gün başladı');
        
        // Tüm bitkilerin büyümesini bir gün ilerlet
        this.crops.forEach((crop, key) => {
            crop.growthProgress += 1;
            this.updateCrop(crop, 0); // Aşama kontrolü
        });
        
        // Toprak verimliliğini yavaşça artır
        this.soil.forEach((soilData, key) => {
            if (soilData.fertility < 1.5) {
                soilData.fertility += 0.05;
            }
        });
    }
}