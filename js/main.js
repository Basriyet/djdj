// Ana oyun başlatma dosyası
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mystic Valley yükleniyor...');
    
    // Ses sistemini başlat
    window.audioSystem = new AudioSystem();
    
    // Oyunu başlat
    game = new Game();
    
    // Oyunu başlatmadan önce kısa bir gecikme
    setTimeout(async () => {
        try {
            await game.init();
            game.start();
            
            // Mobil optimizasyonları
            setupMobileOptimizations();
            
            // Oyun kontrolleri
            setupGameControls();
            
            // Otomatik kaydetme
            setupAutoSave();
            
            console.log('Mystic Valley başarıyla başlatıldı!');
            
        } catch (error) {
            console.error('Oyun başlatma hatası:', error);
            showErrorMessage('Oyun başlatılamadı. Lütfen sayfayı yenileyin.');
        }
    }, 1000);
});

function setupMobileOptimizations() {
    // Mobil cihaz tespiti
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        console.log('Mobil cihaz tespit edildi, optimizasyonlar uygulanıyor...');
        
        // Dokunmatik kontrolleri etkinleştir
        document.body.classList.add('mobile');
        
        // Zoom'u engelle
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        });
        
        // Double tap zoom'u engelle
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Ekran yönlendirme kontrolü
        window.addEventListener('orientationchange', function() {
            setTimeout(() => {
                game.resizeCanvas();
                if (game.ui) {
                    game.ui.checkOrientation();
                }
            }, 100);
        });
        
        // Performans optimizasyonları
        if (game.ui) {
            game.ui.optimizeForMobile();
        }
    }
    
    // Tam ekran desteği
    setupFullscreenSupport();
}

function setupFullscreenSupport() {
    // Tam ekran butonu ekle (mobil için)
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.innerHTML = '⛶';
    fullscreenBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 1000;
        background: rgba(0,0,0,0.7);
        color: white;
        border: 2px solid #ffd700;
        border-radius: 5px;
        padding: 10px;
        font-size: 16px;
        cursor: pointer;
    `;
    
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    document.body.appendChild(fullscreenBtn);
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Tam ekran modu desteklenmiyor:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

function setupGameControls() {
    // Klavye kısayolları
    document.addEventListener('keydown', function(e) {
        if (!game || game.gameState !== 'playing') return;
        
        switch(e.code) {
            case 'KeyP':
                // Pause/Resume
                if (game.running) {
                    game.stop();
                    game.gameState = 'paused';
                } else {
                    game.start();
                    game.gameState = 'playing';
                }
                break;
                
            case 'KeyS':
                if (e.ctrlKey) {
                    e.preventDefault();
                    if (game.ui) {
                        game.ui.showSaveDialog();
                    }
                }
                break;
                
            case 'KeyL':
                if (e.ctrlKey) {
                    e.preventDefault();
                    if (game.ui) {
                        game.ui.loadGame();
                    }
                }
                break;
                
            case 'KeyC':
                if (game.ui) {
                    game.ui.showCraftingMenu();
                }
                break;
                
            case 'KeyB':
                if (game.ui) {
                    game.ui.showSpellMenu();
                }
                break;
                
            case 'F1':
                e.preventDefault();
                showHelpDialog();
                break;
                
            case 'F11':
                e.preventDefault();
                toggleFullscreen();
                break;
        }
    });
    
    // Inventory slot seçimi (1-8 tuşları)
    for (let i = 1; i <= 8; i++) {
        document.addEventListener('keydown', function(e) {
            if (e.code === `Digit${i}` && game && game.inventory) {
                game.inventory.activeSlot = i - 1;
                game.inventory.updateUI();
            }
        });
    }
    
    // Mouse kontrolleri
    game.canvas.addEventListener('click', function(e) {
        if (!game || game.gameState !== 'playing') return;
        
        const rect = game.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Kamera offset'ini hesapla
        const cameraX = game.player ? game.player.x - game.canvas.width / 2 : 0;
        const cameraY = game.player ? game.player.y - game.canvas.height / 2 : 0;
        
        const worldX = x + cameraX;
        const worldY = y + cameraY;
        
        // Sağ tık - büyü kullan
        if (e.button === 2) {
            if (game.magic) {
                game.magic.castSelectedSpell(worldX, worldY);
            }
        }
    });
    
    // Sağ tık menüsünü engelle
    game.canvas.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
}

function setupAutoSave() {
    // Her 5 dakikada bir otomatik kaydet
    setInterval(() => {
        if (game && game.ui && game.gameState === 'playing') {
            game.ui.showSaveDialog();
        }
    }, 5 * 60 * 1000); // 5 dakika
    
    // Sayfa kapatılırken kaydet
    window.addEventListener('beforeunload', function(e) {
        if (game && game.ui) {
            game.ui.showSaveDialog();
        }
    });
}

function showHelpDialog() {
    const helpText = `
    🎮 MYSTIC VALLEY - OYUN REHBERİ 🎮
    
    🎯 TEMEL KONTROLLER:
    • WASD / Ok tuşları - Hareket
    • Space / Enter - Eylem
    • I - Envanter
    • M - Büyü kullan
    • P - Duraklat
    
    🌱 ÇİFTLİK:
    • Çapa ile toprağı işleyin
    • Tohum ekin
    • Sulama kabı ile sulayın
    • Orak ile hasat yapın
    
    ✨ BÜYÜLER:
    • Fireball - Saldırı büyüsü
    • Heal - İyileştirme
    • Grow - Bitki büyütme
    • Rain - Yağmur çağırma
    
    📱 MOBİL KONTROLLER:
    • Ekran butonlarını kullanın
    • Envanter slotlarına dokunun
    • Aksiyon butonuna basın
    
    💾 KAYDETME:
    • Ctrl+S - Manuel kaydet
    • Ctrl+L - Oyunu yükle
    • Otomatik kaydetme aktif
    
    🏆 İPUÇLARI:
    • Mevsimlere uygun tohum ekin
    • Büyüleri akıllıca kullanın
    • Altın biriktirin
    • Farklı bölgeleri keşfedin
    `;
    
    alert(helpText);
}

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 10000;
        text-align: center;
        font-family: Arial, sans-serif;
    `;
    errorDiv.innerHTML = `
        <h3>Hata!</h3>
        <p>${message}</p>
        <button onclick="location.reload()" style="margin-top: 10px; padding: 5px 15px;">Yenile</button>
    `;
    document.body.appendChild(errorDiv);
}

// Service Worker kaydı (offline oyun için)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('Service Worker kayıtlı:', registration.scope);
            })
            .catch(function(error) {
                console.log('Service Worker kaydı başarısız:', error);
            });
    });
}

// Performans izleme
function monitorPerformance() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function checkFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // Düşük FPS uyarısı
            if (fps < 20) {
                console.warn(`Düşük FPS tespit edildi: ${fps}`);
                
                // Performans optimizasyonları
                if (game && game.world) {
                    game.world.maxParticles = Math.max(10, game.world.maxParticles * 0.8);
                }
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(checkFPS);
    }
    
    checkFPS();
}

// Performans izlemeyi başlat
setTimeout(monitorPerformance, 5000);

// Debug modu (geliştirme için)
window.addEventListener('keydown', function(e) {
    if (e.code === 'F12' || (e.ctrlKey && e.shiftKey && e.code === 'KeyD')) {
        if (game) {
            game.debug = !game.debug;
            console.log('Debug modu:', game.debug ? 'Açık' : 'Kapalı');
        }
    }
});

// Oyun verilerini global olarak erişilebilir yap (debug için)
window.gameDebug = {
    addGold: (amount) => game && game.addGold(amount),
    addExp: (amount) => game && game.addExperience(amount),
    learnSpell: (spellId) => game && game.magic && game.magic.learnSpell(spellId),
    addItem: (itemId, count) => game && game.inventory && game.inventory.addItem(itemId, count),
    teleport: (x, y) => {
        if (game && game.player) {
            game.player.x = x;
            game.player.y = y;
        }
    },
    setWeather: (weather) => {
        if (game) {
            game.gameData.weather = weather;
        }
    },
    setSeason: (season) => {
        if (game) {
            game.gameData.season = season;
        }
    }
};

console.log('Mystic Valley - Fantastik RPG Çiftlik Oyunu');
console.log('Debug komutları için window.gameDebug kullanın');
console.log('F1 - Yardım, F11 - Tam ekran, F12 - Debug modu');