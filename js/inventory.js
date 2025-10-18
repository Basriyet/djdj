// Envanter sistemi
class Inventory {
    constructor(game) {
        this.game = game;
        this.items = new Map();
        this.maxSlots = 20;
        this.activeSlot = 0;
        
        // Eşya türleri
        this.itemTypes = this.initializeItemTypes();
        
        // Crafting tarifleri
        this.recipes = this.initializeRecipes();
        
        console.log('Envanter sistemi başlatıldı');
    }
    
    initializeItemTypes() {
        return {
            // Tohumlar
            seeds: {
                name: 'Tohum',
                type: 'seed',
                stackable: true,
                maxStack: 99,
                value: 10,
                description: 'Çeşitli bitki tohumları',
                icon: '🌱'
            },
            
            // Aletler
            sword: {
                name: 'Kılıç',
                type: 'weapon',
                stackable: false,
                damage: 25,
                durability: 100,
                value: 200,
                description: 'Keskin demir kılıç',
                icon: '⚔️'
            },
            hoe: {
                name: 'Çapa',
                type: 'tool',
                stackable: false,
                durability: 80,
                value: 50,
                description: 'Toprak işlemek için',
                icon: '🔨'
            },
            watering_can: {
                name: 'Sulama Kabı',
                type: 'tool',
                stackable: false,
                durability: 60,
                value: 30,
                description: 'Bitkileri sulamak için',
                icon: '🪣'
            },
            scythe: {
                name: 'Orak',
                type: 'tool',
                stackable: false,
                durability: 70,
                value: 75,
                description: 'Hasat yapmak için',
                icon: '🗡️'
            },
            pickaxe: {
                name: 'Kazma',
                type: 'tool',
                stackable: false,
                durability: 90,
                value: 100,
                description: 'Maden çıkarmak için',
                icon: '⛏️'
            },
            axe: {
                name: 'Balta',
                type: 'tool',
                stackable: false,
                durability: 85,
                value: 80,
                description: 'Ağaç kesmek için',
                icon: '🪓'
            },
            fishing_rod: {
                name: 'Olta',
                type: 'tool',
                stackable: false,
                durability: 50,
                value: 60,
                description: 'Balık tutmak için',
                icon: '🎣'
            },
            
            // Tüketilebilir eşyalar
            potion: {
                name: 'İksir',
                type: 'consumable',
                stackable: true,
                maxStack: 10,
                value: 50,
                effect: 'heal',
                power: 30,
                description: 'Can yeniler',
                icon: '🧪'
            },
            mana_potion: {
                name: 'Mana İksiri',
                type: 'consumable',
                stackable: true,
                maxStack: 10,
                value: 75,
                effect: 'mana',
                power: 40,
                description: 'Mana yeniler',
                icon: '💙'
            },
            bread: {
                name: 'Ekmek',
                type: 'food',
                stackable: true,
                maxStack: 20,
                value: 15,
                effect: 'stamina',
                power: 25,
                description: 'Enerji verir',
                icon: '🍞'
            },
            
            // Büyü eşyaları
            magic_scroll: {
                name: 'Büyü Parşömeni',
                type: 'magic',
                stackable: true,
                maxStack: 5,
                value: 100,
                spell: 'fireball',
                description: 'Ateş topu büyüsü',
                icon: '📜'
            },
            crystal: {
                name: 'Büyü Kristali',
                type: 'magic',
                stackable: true,
                maxStack: 10,
                value: 200,
                manaBonus: 10,
                description: 'Mana kapasitesini artırır',
                icon: '💎'
            },
            
            // Kaynaklar
            wood: {
                name: 'Odun',
                type: 'resource',
                stackable: true,
                maxStack: 50,
                value: 5,
                description: 'Yapı malzemesi',
                icon: '🪵'
            },
            stone: {
                name: 'Taş',
                type: 'resource',
                stackable: true,
                maxStack: 50,
                value: 3,
                description: 'Yapı malzemesi',
                icon: '🪨'
            },
            iron_ore: {
                name: 'Demir Cevheri',
                type: 'resource',
                stackable: true,
                maxStack: 30,
                value: 20,
                description: 'Metal işçiliği için',
                icon: '⚫'
            },
            gold_ore: {
                name: 'Altın Cevheri',
                type: 'resource',
                stackable: true,
                maxStack: 20,
                value: 100,
                description: 'Değerli maden',
                icon: '🟡'
            },
            
            // Yiyecekler (hasat ürünleri)
            patates: {
                name: 'Patates',
                type: 'food',
                stackable: true,
                maxStack: 30,
                value: 50,
                effect: 'heal',
                power: 15,
                description: 'Besleyici sebze',
                icon: '🥔'
            },
            havuç: {
                name: 'Havuç',
                type: 'food',
                stackable: true,
                maxStack: 30,
                value: 35,
                effect: 'stamina',
                power: 20,
                description: 'Taze havuç',
                icon: '🥕'
            },
            domates: {
                name: 'Domates',
                type: 'food',
                stackable: true,
                maxStack: 25,
                value: 80,
                effect: 'heal',
                power: 25,
                description: 'Sulu domates',
                icon: '🍅'
            }
        };
    }
    
    initializeRecipes() {
        return {
            bread: {
                name: 'Ekmek',
                ingredients: { wheat: 3 },
                result: { bread: 2 },
                category: 'cooking'
            },
            iron_sword: {
                name: 'Demir Kılıç',
                ingredients: { iron_ore: 5, wood: 2 },
                result: { sword: 1 },
                category: 'smithing'
            },
            magic_scroll: {
                name: 'Büyü Parşömeni',
                ingredients: { crystal: 1, wood: 1 },
                result: { magic_scroll: 1 },
                category: 'magic'
            },
            advanced_hoe: {
                name: 'Gelişmiş Çapa',
                ingredients: { iron_ore: 3, wood: 2 },
                result: { hoe: 1 },
                category: 'smithing'
            }
        };
    }
    
    addItem(itemId, quantity = 1) {
        const itemType = this.itemTypes[itemId];
        if (!itemType) {
            console.error(`Bilinmeyen eşya: ${itemId}`);
            return false;
        }
        
        if (itemType.stackable) {
            // Yığılabilir eşya
            const currentAmount = this.items.get(itemId) || 0;
            const maxStack = itemType.maxStack || 99;
            const newAmount = Math.min(currentAmount + quantity, maxStack);
            
            this.items.set(itemId, newAmount);
            
            if (newAmount < currentAmount + quantity) {
                console.log(`Envanter dolu! Sadece ${newAmount - currentAmount} adet eklendi.`);
            }
        } else {
            // Yığılamayan eşya
            const currentAmount = this.items.get(itemId) || 0;
            if (currentAmount + quantity <= this.maxSlots) {
                this.items.set(itemId, currentAmount + quantity);
            } else {
                console.log('Envanter dolu!');
                return false;
            }
        }
        
        this.updateUI();
        return true;
    }
    
    removeItem(itemId, quantity = 1) {
        const currentAmount = this.items.get(itemId) || 0;
        if (currentAmount < quantity) {
            return false;
        }
        
        const newAmount = currentAmount - quantity;
        if (newAmount <= 0) {
            this.items.delete(itemId);
        } else {
            this.items.set(itemId, newAmount);
        }
        
        this.updateUI();
        return true;
    }
    
    hasItem(itemId, quantity = 1) {
        const currentAmount = this.items.get(itemId) || 0;
        return currentAmount >= quantity;
    }
    
    getItemCount(itemId) {
        return this.items.get(itemId) || 0;
    }
    
    useItem(itemId) {
        const itemType = this.itemTypes[itemId];
        if (!itemType) return false;
        
        if (!this.hasItem(itemId)) return false;
        
        switch(itemType.type) {
            case 'consumable':
            case 'food':
                this.consumeItem(itemType);
                this.removeItem(itemId, 1);
                return true;
                
            case 'magic':
                if (itemType.spell) {
                    this.castSpellFromItem(itemType);
                    this.removeItem(itemId, 1);
                    return true;
                }
                break;
                
            case 'tool':
            case 'weapon':
                this.equipItem(itemId);
                return true;
        }
        
        return false;
    }
    
    consumeItem(itemType) {
        const player = this.game.player;
        if (!player) return;
        
        switch(itemType.effect) {
            case 'heal':
                player.heal(itemType.power);
                this.showMessage(`${itemType.name} kullandınız. +${itemType.power} can`);
                break;
                
            case 'mana':
                player.mana = Math.min(player.maxMana, player.mana + itemType.power);
                this.showMessage(`${itemType.name} kullandınız. +${itemType.power} mana`);
                break;
                
            case 'stamina':
                player.stamina = Math.min(player.maxStamina, player.stamina + itemType.power);
                this.showMessage(`${itemType.name} kullandınız. +${itemType.power} enerji`);
                break;
        }
    }
    
    castSpellFromItem(itemType) {
        if (this.game.magic && itemType.spell) {
            this.game.magic.castSpell(itemType.spell);
            this.showMessage(`${itemType.name} kullandınız!`);
        }
    }
    
    equipItem(itemId) {
        // Basit ekipman sistemi - aktif slot'a koy
        this.activeSlot = this.getSlotForItem(itemId);
        this.showMessage(`${this.itemTypes[itemId].name} kuşandınız`);
    }
    
    getSlotForItem(itemId) {
        // Eşyanın ilk bulunduğu slot'u döndür
        let slot = 0;
        for (let [id, count] of this.items) {
            if (id === itemId) return slot;
            slot++;
        }
        return 0;
    }
    
    getActiveItem() {
        const items = Array.from(this.items.keys());
        return items[this.activeSlot] || null;
    }
    
    getActiveTool() {
        const activeItem = this.getActiveItem();
        if (!activeItem) return null;
        
        const itemType = this.itemTypes[activeItem];
        return itemType && itemType.type === 'tool' ? activeItem : null;
    }
    
    craft(recipeId) {
        const recipe = this.recipes[recipeId];
        if (!recipe) return false;
        
        // Malzeme kontrolü
        for (let [itemId, needed] of Object.entries(recipe.ingredients)) {
            if (!this.hasItem(itemId, needed)) {
                this.showMessage(`Yetersiz malzeme: ${this.itemTypes[itemId]?.name || itemId}`);
                return false;
            }
        }
        
        // Malzemeleri tüket
        for (let [itemId, needed] of Object.entries(recipe.ingredients)) {
            this.removeItem(itemId, needed);
        }
        
        // Sonucu ver
        for (let [itemId, amount] of Object.entries(recipe.result)) {
            this.addItem(itemId, amount);
        }
        
        this.showMessage(`${recipe.name} üretildi!`);
        
        // Deneyim ver
        this.game.addExperience(10);
        
        return true;
    }
    
    getAvailableRecipes() {
        return Object.entries(this.recipes).filter(([id, recipe]) => {
            // Tüm malzemeler mevcut mu?
            return Object.entries(recipe.ingredients).every(([itemId, needed]) => {
                return this.hasItem(itemId, needed);
            });
        });
    }
    
    sellItem(itemId, quantity = 1) {
        if (!this.hasItem(itemId, quantity)) return false;
        
        const itemType = this.itemTypes[itemId];
        if (!itemType) return false;
        
        const totalValue = itemType.value * quantity;
        
        if (this.removeItem(itemId, quantity)) {
            this.game.addGold(totalValue);
            this.showMessage(`${quantity}x ${itemType.name} sattınız. +${totalValue} altın`);
            return true;
        }
        
        return false;
    }
    
    updateUI() {
        // Envanter UI'sini güncelle
        const inventoryElement = document.getElementById('inventory');
        if (!inventoryElement) return;
        
        const slots = inventoryElement.querySelectorAll('.inventory-slot');
        const items = Array.from(this.items.entries());
        
        slots.forEach((slot, index) => {
            slot.classList.remove('active');
            
            if (index < items.length) {
                const [itemId, count] = items[index];
                const itemType = this.itemTypes[itemId];
                
                if (itemType) {
                    slot.textContent = itemType.icon;
                    slot.title = `${itemType.name} (${count})`;
                    
                    if (index === this.activeSlot) {
                        slot.classList.add('active');
                    }
                }
            } else {
                slot.textContent = '';
                slot.title = '';
            }
        });
    }
    
    showMessage(message) {
        if (this.game.ui) {
            this.game.ui.showMessage(message);
        }
        console.log(`Envanter: ${message}`);
    }
    
    // Envanter durumunu kaydet/yükle
    save() {
        return {
            items: Array.from(this.items.entries()),
            activeSlot: this.activeSlot
        };
    }
    
    load(data) {
        if (data.items) {
            this.items = new Map(data.items);
        }
        if (data.activeSlot !== undefined) {
            this.activeSlot = data.activeSlot;
        }
        this.updateUI();
    }
    
    // Debug: Tüm eşyaları listele
    listItems() {
        console.log('Envanter içeriği:');
        this.items.forEach((count, itemId) => {
            const itemType = this.itemTypes[itemId];
            console.log(`- ${itemType?.name || itemId}: ${count}`);
        });
    }
    
    // Envanter kapasitesi kontrolü
    getUsedSlots() {
        let used = 0;
        this.items.forEach((count, itemId) => {
            const itemType = this.itemTypes[itemId];
            if (itemType && !itemType.stackable) {
                used += count;
            } else {
                used += 1; // Yığılabilir eşyalar 1 slot kaplar
            }
        });
        return used;
    }
    
    isFull() {
        return this.getUsedSlots() >= this.maxSlots;
    }
    
    // Envanter sıralama
    sortItems() {
        const sortedItems = new Map();
        const categories = ['tool', 'weapon', 'seed', 'food', 'consumable', 'magic', 'resource'];
        
        categories.forEach(category => {
            this.items.forEach((count, itemId) => {
                const itemType = this.itemTypes[itemId];
                if (itemType && itemType.type === category) {
                    sortedItems.set(itemId, count);
                }
            });
        });
        
        // Kategorisiz eşyalar
        this.items.forEach((count, itemId) => {
            if (!sortedItems.has(itemId)) {
                sortedItems.set(itemId, count);
            }
        });
        
        this.items = sortedItems;
        this.updateUI();
    }
}