// Dünya ve harita sistemi
class World {
    constructor(game) {
        this.game = game;
        this.tileSize = 32;
        this.width = 0;
        this.height = 0;
        this.tiles = [];
        this.objects = [];
        this.npcs = [];
        
        // Çevre efektleri
        this.particles = [];
        this.weather = 'sunny';
        this.timeOfDay = 'day';
        
        // Harita verileri
        this.scenes = {
            farm: this.generateFarmScene(),
            forest: this.generateForestScene(),
            village: this.generateVillageScene(),
            dungeon: this.generateDungeonScene()
        };
        
        this.currentScene = 'farm';
        
        console.log('Dünya sistemi oluşturuldu');
    }
    
    async loadScene(sceneName) {
        if (!this.scenes[sceneName]) {
            console.error(`Sahne bulunamadı: ${sceneName}`);
            return;
        }
        
        this.currentScene = sceneName;
        const scene = this.scenes[sceneName];
        
        this.width = scene.width;
        this.height = scene.height;
        this.tiles = scene.tiles;
        this.objects = scene.objects || [];
        this.npcs = scene.npcs || [];
        
        console.log(`Sahne yüklendi: ${sceneName}`);
    }
    
    generateFarmScene() {
        const width = 25;
        const height = 20;
        const tiles = [];
        
        // Temel çim zemini
        for (let y = 0; y < height; y++) {
            tiles[y] = [];
            for (let x = 0; x < width; x++) {
                tiles[y][x] = {
                    type: 'grass',
                    variant: Math.floor(Math.random() * 3),
                    walkable: true,
                    farmable: true
                };
            }
        }
        
        // Çiftlik evi
        for (let y = 2; y < 6; y++) {
            for (let x = 2; x < 6; x++) {
                tiles[y][x] = {
                    type: 'house',
                    walkable: false
                };
            }
        }
        
        // Kapı
        tiles[5][4] = {
            type: 'door',
            walkable: true,
            interactive: true
        };
        
        // Su kuyusu
        tiles[8][12] = {
            type: 'well',
            walkable: false,
            interactive: true
        };
        
        // Ağaçlar
        const treePositions = [
            [1, 1], [1, 18], [23, 1], [23, 18],
            [10, 3], [15, 7], [8, 15], [20, 12]
        ];
        
        treePositions.forEach(([x, y]) => {
            if (x < width && y < height) {
                tiles[y][x] = {
                    type: 'tree',
                    walkable: false,
                    interactive: true,
                    resource: 'wood'
                };
            }
        });
        
        // Taş yığınları
        const rockPositions = [
            [18, 4], [22, 8], [5, 16], [14, 18]
        ];
        
        rockPositions.forEach(([x, y]) => {
            if (x < width && y < height) {
                tiles[y][x] = {
                    type: 'rock',
                    walkable: false,
                    interactive: true,
                    resource: 'stone'
                };
            }
        });
        
        return {
            width,
            height,
            tiles,
            objects: [
                { type: 'chest', x: 3, y: 3, contents: ['gold', 'seeds'] },
                { type: 'workbench', x: 10, y: 8 }
            ],
            npcs: []
        };
    }
    
    generateForestScene() {
        const width = 30;
        const height = 25;
        const tiles = [];
        
        // Orman zemini
        for (let y = 0; y < height; y++) {
            tiles[y] = [];
            for (let x = 0; x < width; x++) {
                const random = Math.random();
                if (random < 0.7) {
                    tiles[y][x] = {
                        type: 'forest_ground',
                        variant: Math.floor(Math.random() * 2),
                        walkable: true
                    };
                } else if (random < 0.9) {
                    tiles[y][x] = {
                        type: 'tree',
                        walkable: false,
                        interactive: true,
                        resource: 'wood'
                    };
                } else {
                    tiles[y][x] = {
                        type: 'bush',
                        walkable: true,
                        interactive: true,
                        resource: 'berries'
                    };
                }
            }
        }
        
        // Patika
        for (let x = 0; x < width; x++) {
            tiles[12][x] = {
                type: 'path',
                walkable: true
            };
        }
        
        return {
            width,
            height,
            tiles,
            objects: [
                { type: 'shrine', x: 15, y: 8 }
            ],
            npcs: [
                { type: 'forest_spirit', x: 15, y: 10, name: 'Orman Ruhu' }
            ]
        };
    }
    
    generateVillageScene() {
        const width = 20;
        const height = 15;
        const tiles = [];
        
        // Köy zemini
        for (let y = 0; y < height; y++) {
            tiles[y] = [];
            for (let x = 0; x < width; x++) {
                tiles[y][x] = {
                    type: 'cobblestone',
                    walkable: true
                };
            }
        }
        
        // Evler
        const houses = [
            { x: 2, y: 2, w: 3, h: 3 },
            { x: 7, y: 2, w: 3, h: 3 },
            { x: 12, y: 2, w: 3, h: 3 },
            { x: 2, y: 8, w: 3, h: 3 },
            { x: 12, y: 8, w: 3, h: 3 }
        ];
        
        houses.forEach(house => {
            for (let y = house.y; y < house.y + house.h; y++) {
                for (let x = house.x; x < house.x + house.w; x++) {
                    tiles[y][x] = {
                        type: 'house',
                        walkable: false
                    };
                }
            }
            // Kapı
            tiles[house.y + house.h - 1][house.x + 1] = {
                type: 'door',
                walkable: true,
                interactive: true
            };
        });
        
        // Mağaza
        for (let y = 6; y < 10; y++) {
            for (let x = 8; x < 12; x++) {
                tiles[y][x] = {
                    type: 'shop',
                    walkable: y === 9 && x === 10,
                    interactive: y === 9 && x === 10
                };
            }
        }
        
        return {
            width,
            height,
            tiles,
            objects: [
                { type: 'fountain', x: 10, y: 7 }
            ],
            npcs: [
                { type: 'merchant', x: 9, y: 9, name: 'Tüccar Ahmet' },
                { type: 'villager', x: 5, y: 12, name: 'Köylü Ayşe' }
            ]
        };
    }
    
    generateDungeonScene() {
        const width = 15;
        const height = 15;
        const tiles = [];
        
        // Zindan duvarları
        for (let y = 0; y < height; y++) {
            tiles[y] = [];
            for (let x = 0; x < width; x++) {
                if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                    tiles[y][x] = {
                        type: 'wall',
                        walkable: false
                    };
                } else {
                    tiles[y][x] = {
                        type: 'dungeon_floor',
                        walkable: true
                    };
                }
            }
        }
        
        // İç duvarlar (labirent)
        const walls = [
            [3, 3], [3, 4], [3, 5],
            [7, 2], [7, 3], [7, 4],
            [5, 7], [6, 7], [7, 7],
            [10, 5], [10, 6], [10, 7],
            [2, 10], [3, 10], [4, 10]
        ];
        
        walls.forEach(([x, y]) => {
            tiles[y][x] = {
                type: 'wall',
                walkable: false
            };
        });
        
        return {
            width,
            height,
            tiles,
            objects: [
                { type: 'treasure_chest', x: 12, y: 12, contents: ['magic_gem', 'gold'] },
                { type: 'torch', x: 2, y: 2 },
                { type: 'torch', x: 12, y: 2 }
            ],
            npcs: [
                { type: 'skeleton', x: 8, y: 8, hostile: true }
            ]
        };
    }
    
    update(deltaTime) {
        // Partikülleri güncelle
        this.particles = this.particles.filter(particle => {
            particle.life -= deltaTime;
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            return particle.life > 0;
        });
        
        // Hava durumu efektleri
        this.updateWeatherEffects(deltaTime);
        
        // NPC'leri güncelle
        this.npcs.forEach(npc => {
            if (npc.update) {
                npc.update(deltaTime);
            }
        });
    }
    
    updateWeatherEffects(deltaTime) {
        const weather = this.game.gameData.weather;
        
        if (weather === 'rainy' && Math.random() < 0.3) {
            // Yağmur damlası ekle
            this.addParticle({
                type: 'rain',
                x: Math.random() * this.game.canvas.width,
                y: -10,
                vx: -20,
                vy: 200,
                life: 2,
                color: '#87ceeb'
            });
        } else if (weather === 'snowy' && Math.random() < 0.1) {
            // Kar tanesi ekle
            this.addParticle({
                type: 'snow',
                x: Math.random() * this.game.canvas.width,
                y: -10,
                vx: Math.random() * 20 - 10,
                vy: 50,
                life: 5,
                color: '#ffffff'
            });
        }
    }
    
    addParticle(particle) {
        this.particles.push(particle);
    }
    
    render(ctx) {
        // Kamera pozisyonu (oyuncuyu merkeze al)
        const cameraX = this.game.player ? this.game.player.x - this.game.canvas.width / 2 : 0;
        const cameraY = this.game.player ? this.game.player.y - this.game.canvas.height / 2 : 0;
        
        // Görünür alan hesapla
        const startX = Math.max(0, Math.floor(cameraX / this.tileSize));
        const startY = Math.max(0, Math.floor(cameraY / this.tileSize));
        const endX = Math.min(this.width, startX + Math.ceil(this.game.canvas.width / this.tileSize) + 1);
        const endY = Math.min(this.height, startY + Math.ceil(this.game.canvas.height / this.tileSize) + 1);
        
        // Karoları çiz
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                if (this.tiles[y] && this.tiles[y][x]) {
                    this.renderTile(ctx, this.tiles[y][x], x, y, cameraX, cameraY);
                }
            }
        }
        
        // Objeleri çiz
        this.objects.forEach(obj => {
            this.renderObject(ctx, obj, cameraX, cameraY);
        });
        
        // NPC'leri çiz
        this.npcs.forEach(npc => {
            this.renderNPC(ctx, npc, cameraX, cameraY);
        });
        
        // Partikülleri çiz
        this.renderParticles(ctx, cameraX, cameraY);
        
        // Hava durumu efektleri
        this.renderWeatherEffects(ctx);
    }
    
    renderTile(ctx, tile, x, y, cameraX, cameraY) {
        const screenX = x * this.tileSize - cameraX;
        const screenY = y * this.tileSize - cameraY;
        
        // Ekran dışındaysa çizme
        if (screenX < -this.tileSize || screenX > this.game.canvas.width ||
            screenY < -this.tileSize || screenY > this.game.canvas.height) {
            return;
        }
        
        switch(tile.type) {
            case 'grass':
                ctx.fillStyle = tile.variant === 0 ? '#4a7c59' : 
                               tile.variant === 1 ? '#5a8c69' : '#3a6c49';
                break;
            case 'house':
                ctx.fillStyle = '#8b4513';
                break;
            case 'door':
                ctx.fillStyle = '#654321';
                break;
            case 'tree':
                ctx.fillStyle = '#228b22';
                break;
            case 'rock':
                ctx.fillStyle = '#696969';
                break;
            case 'well':
                ctx.fillStyle = '#4682b4';
                break;
            case 'forest_ground':
                ctx.fillStyle = tile.variant === 0 ? '#2d5016' : '#3d6026';
                break;
            case 'bush':
                ctx.fillStyle = '#228b22';
                break;
            case 'path':
                ctx.fillStyle = '#daa520';
                break;
            case 'cobblestone':
                ctx.fillStyle = '#708090';
                break;
            case 'shop':
                ctx.fillStyle = '#cd853f';
                break;
            case 'wall':
                ctx.fillStyle = '#2f4f4f';
                break;
            case 'dungeon_floor':
                ctx.fillStyle = '#1c1c1c';
                break;
            case 'water':
                ctx.fillStyle = '#4169e1';
                break;
            default:
                ctx.fillStyle = '#8fbc8f';
        }
        
        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
        
        // Karo detayları
        this.renderTileDetails(ctx, tile, screenX, screenY);
    }
    
    renderTileDetails(ctx, tile, screenX, screenY) {
        const centerX = screenX + this.tileSize / 2;
        const centerY = screenY + this.tileSize / 2;
        
        switch(tile.type) {
            case 'tree':
                // Ağaç gövdesi
                ctx.fillStyle = '#8b4513';
                ctx.fillRect(centerX - 4, centerY, 8, 12);
                // Yapraklar
                ctx.fillStyle = '#228b22';
                ctx.beginPath();
                ctx.arc(centerX, centerY - 5, 12, 0, 2 * Math.PI);
                ctx.fill();
                break;
                
            case 'rock':
                // Taş detayları
                ctx.fillStyle = '#a9a9a9';
                ctx.fillRect(screenX + 4, screenY + 4, 8, 6);
                ctx.fillRect(screenX + 16, screenY + 8, 6, 8);
                ctx.fillRect(screenX + 8, screenY + 16, 10, 6);
                break;
                
            case 'well':
                // Kuyu
                ctx.fillStyle = '#2f4f4f';
                ctx.beginPath();
                ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
                ctx.fill();
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
                ctx.fill();
                break;
                
            case 'door':
                // Kapı
                ctx.fillStyle = '#8b4513';
                ctx.fillRect(centerX - 6, screenY + 8, 12, 20);
                ctx.fillStyle = '#ffd700';
                ctx.beginPath();
                ctx.arc(centerX + 4, centerY + 2, 2, 0, 2 * Math.PI);
                ctx.fill();
                break;
        }
    }
    
    renderObject(ctx, obj, cameraX, cameraY) {
        const screenX = obj.x * this.tileSize - cameraX;
        const screenY = obj.y * this.tileSize - cameraY;
        
        switch(obj.type) {
            case 'chest':
                ctx.fillStyle = '#8b4513';
                ctx.fillRect(screenX + 4, screenY + 8, 24, 16);
                ctx.fillStyle = '#ffd700';
                ctx.fillRect(screenX + 12, screenY + 12, 8, 4);
                break;
                
            case 'workbench':
                ctx.fillStyle = '#daa520';
                ctx.fillRect(screenX, screenY + 8, 32, 20);
                ctx.fillStyle = '#8b4513';
                ctx.fillRect(screenX + 2, screenY + 10, 28, 4);
                break;
                
            case 'shrine':
                ctx.fillStyle = '#dcdcdc';
                ctx.fillRect(screenX + 8, screenY + 4, 16, 24);
                ctx.fillStyle = '#ffd700';
                ctx.beginPath();
                ctx.arc(screenX + 16, screenY + 12, 4, 0, 2 * Math.PI);
                ctx.fill();
                break;
        }
    }
    
    renderNPC(ctx, npc, cameraX, cameraY) {
        const screenX = npc.x * this.tileSize - cameraX;
        const screenY = npc.y * this.tileSize - cameraY;
        
        // Basit NPC çizimi
        ctx.fillStyle = npc.hostile ? '#ff0000' : '#0000ff';
        ctx.fillRect(screenX + 8, screenY + 4, 16, 24);
        
        // İsim etiketi
        if (npc.name && !npc.hostile) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(npc.name, screenX + 16, screenY - 2);
        }
    }
    
    renderParticles(ctx, cameraX, cameraY) {
        this.particles.forEach(particle => {
            const screenX = particle.x - cameraX;
            const screenY = particle.y - cameraY;
            
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.life / 2;
            
            if (particle.type === 'rain') {
                ctx.fillRect(screenX, screenY, 2, 8);
            } else if (particle.type === 'snow') {
                ctx.beginPath();
                ctx.arc(screenX, screenY, 2, 0, 2 * Math.PI);
                ctx.fill();
            }
            
            ctx.globalAlpha = 1;
        });
    }
    
    renderWeatherEffects(ctx) {
        const weather = this.game.gameData.weather;
        
        if (weather === 'stormy') {
            // Şimşek efekti
            if (Math.random() < 0.01) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
            }
        }
    }
    
    // Çarpışma kontrolü
    isCollision(x, y, width, height) {
        const tileX1 = Math.floor(x / this.tileSize);
        const tileY1 = Math.floor(y / this.tileSize);
        const tileX2 = Math.floor((x + width - 1) / this.tileSize);
        const tileY2 = Math.floor((y + height - 1) / this.tileSize);
        
        for (let ty = tileY1; ty <= tileY2; ty++) {
            for (let tx = tileX1; tx <= tileX2; tx++) {
                if (this.tiles[ty] && this.tiles[ty][tx] && !this.tiles[ty][tx].walkable) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    getTile(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }
        return this.tiles[y] ? this.tiles[y][x] : null;
    }
    
    setTile(x, y, tile) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return false;
        }
        if (!this.tiles[y]) {
            this.tiles[y] = [];
        }
        this.tiles[y][x] = tile;
        return true;
    }
}