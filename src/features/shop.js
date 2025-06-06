// Shop system for the incremental game
const shopItems = [
    {
        id: 'double-click',
        name: 'Double Click Power',
        desc: 'Doubles coins per click permanently.',
        cost: 500,
        bought: false,
        effect: () => {
            window.shopClickMultiplier = 2;
            if (window.updateUpgradeDisplay) window.updateUpgradeDisplay();
        }
    },
    {
        id: 'auto-collector-boost',
        name: 'Auto-Collector Boost',
        desc: 'Auto-collectors produce twice as many coins.',
        cost: 1000,
        bought: false,
        effect: () => { window.shopAutoCollectorMultiplier = 2; }
    },
    {
        id: 'coin-magnet',
        name: 'Coin Magnet',
        desc: 'Automatically collects 1 coin every second (affected by multipliers).',
        cost: 750,
        bought: false,
        effect: () => {
            if (!window.coinMagnetInterval) {
                window.coinMagnetInterval = setInterval(() => {
                    let base = 1;
                    let clickMult = window.shopClickMultiplier || 1;
                    let prestigeMult = window.getPrestigeMultiplier ? window.getPrestigeMultiplier() : 1;
                    let gain = base * clickMult * prestigeMult;
                    window.coins += gain;
                    if (window.stats) {
                        window.stats.totalCoinsEarned = (window.stats.totalCoinsEarned || 0) + gain;
                        if (window.updateStatsDisplay) window.updateStatsDisplay();
                    }
                    if (window.updateDisplay) window.updateDisplay();
                }, 1000);
            }
        }
    }
];

// Appearance Shop Items
const appearanceShopItems = [
    {
        id: 'appearance-classic',
        name: 'Classic Theme',
        desc: 'A nostalgic, blue-and-grey classic incremental look.',
        cost: 200,
        bought: false,
        effect: () => {
            document.body.classList.remove('appearance-retro', 'appearance-vaporwave');
            document.body.classList.add('appearance-classic');
            localStorage.setItem('incrementalGameAppearance', 'classic');
        }
    },
    {
        id: 'appearance-retro',
        name: 'Retro Theme',
        desc: 'A green-on-black retro terminal style.',
        cost: 300,
        bought: false,
        effect: () => {
            document.body.classList.remove('appearance-classic', 'appearance-vaporwave');
            document.body.classList.add('appearance-retro');
            localStorage.setItem('incrementalGameAppearance', 'retro');
        }
    },
    {
        id: 'appearance-vaporwave',
        name: 'Vaporwave Theme',
        desc: 'A pastel, purple-pink vaporwave look.',
        cost: 400,
        bought: false,
        effect: () => {
            document.body.classList.remove('appearance-classic', 'appearance-retro');
            document.body.classList.add('appearance-vaporwave');
            localStorage.setItem('incrementalGameAppearance', 'vaporwave');
        }
    }
];

window.shopClickMultiplier = 1;
window.shopAutoCollectorMultiplier = 1;


const shopPanel = document.getElementById('shop-panel');
const shopList = document.getElementById('shop-list');

// Appearance Shop Panel
let appearanceShopPanel = document.getElementById('appearance-shop-panel');
let appearanceShopList = document.getElementById('appearance-shop-list');
if (!appearanceShopPanel) {
    // Create panel if not present
    appearanceShopPanel = document.createElement('div');
    appearanceShopPanel.id = 'appearance-shop-panel';
    appearanceShopPanel.className = 'content-panel';
    appearanceShopPanel.style.display = 'none';
    appearanceShopPanel.style.textAlign = 'left';
    appearanceShopPanel.innerHTML = '<ul id="appearance-shop-list" style="list-style:none; padding-left:0;"></ul>';
    // Insert after shopPanel
    if (shopPanel && shopPanel.parentNode) {
        shopPanel.parentNode.insertBefore(appearanceShopPanel, shopPanel.nextSibling);
    }
    appearanceShopList = document.getElementById('appearance-shop-list');
}

function updateShopDisplay() {
    // Main shop
    shopList.innerHTML = '';
    shopItems.forEach((item, idx) => {
        const li = document.createElement('li');
        li.style.marginBottom = '1em';
        let costStr = window.formatNumber ? window.formatNumber(item.cost) : item.cost;
        li.innerHTML = `<b>${item.name}</b> <span class="info-icon" tabindex="0">ℹ️</span><span class="tooltip">${item.desc}</span><br>Cost: ${costStr} coins ` +
            (item.bought ? '<span style="color:green;">[BOUGHT]</span>' : `<button id="shop-buy-${item.id}">Buy</button>`);
        shopList.appendChild(li);
        if (!item.bought) {
            setTimeout(() => {
                const btn = document.getElementById(`shop-buy-${item.id}`);
                if (btn) {
                    btn.onclick = function() {
                        if (window.coins >= item.cost) {
                            window.coins -= item.cost;
                            item.bought = true;
                            if (localStorage.getItem('incrementalGameSound') !== '0') {
                                const audio = document.getElementById('audio-upgrade');
                                if (audio) { audio.currentTime = 0; audio.play(); }
                            }
                            item.effect();
                            window.updateDisplay();
                            updateShopDisplay();
                            if (window.saveGame) window.saveGame();
                        }
                    };
                }
            }, 0);
        }
    });
    // Appearance shop
    if (appearanceShopList) {
        appearanceShopList.innerHTML = '';
        appearanceShopItems.forEach((item, idx) => {
            const li = document.createElement('li');
            li.style.marginBottom = '1em';
            let costStr = window.formatNumber ? window.formatNumber(item.cost) : item.cost;
            let owned = item.bought;
            let isActive = document.body.classList.contains(item.id);
            li.innerHTML = `<b>${item.name}</b> <span class="info-icon" tabindex="0">ℹ️</span><span class="tooltip">${item.desc}</span><br>Cost: ${costStr} coins ` +
                (owned ? `<span style=\"color:green;\">[OWNED]</span> <button id=\"appearance-activate-${item.id}\">${isActive ? 'Active' : 'Activate'}</button>` : `<button id=\"appearance-buy-${item.id}\">Buy</button>`);
            appearanceShopList.appendChild(li);
            if (!owned) {
                setTimeout(() => {
                    const btn = document.getElementById(`appearance-buy-${item.id}`);
                    if (btn) {
                        btn.onclick = function() {
                            if (window.coins >= item.cost) {
                                window.coins -= item.cost;
                                item.bought = true;
                                if (localStorage.getItem('incrementalGameSound') !== '0') {
                                    const audio = document.getElementById('audio-upgrade');
                                    if (audio) { audio.currentTime = 0; audio.play(); }
                                }
                                item.effect();
                                window.updateDisplay();
                                updateShopDisplay();
                                if (window.saveGame) window.saveGame();
                            }
                        };
                    }
                }, 0);
            } else {
                setTimeout(() => {
                    const btn = document.getElementById(`appearance-activate-${item.id}`);
                    if (btn) {
                        btn.onclick = function() {
                            // Remove all appearance classes
                            document.body.classList.remove('appearance-classic', 'appearance-retro', 'appearance-vaporwave');
                            document.body.classList.add(item.id);
                            localStorage.setItem('incrementalGameAppearance', item.id.replace('appearance-', ''));
                            updateShopDisplay();
                        };
                    }
                }, 0);
            }
        });
        // Add "Base Look" toggle
        const baseLi = document.createElement('li');
        baseLi.style.marginBottom = '1em';
        let isBase = !document.body.classList.contains('appearance-classic') && !document.body.classList.contains('appearance-retro') && !document.body.classList.contains('appearance-vaporwave');
        baseLi.innerHTML = `<b>Base Look</b> <span class=\"info-icon\" tabindex=\"0\">ℹ️</span><span class=\"tooltip\">Return to the default appearance.</span><br><button id=\"appearance-base-toggle\">${isBase ? 'Active' : 'Activate'}</button>`;
        appearanceShopList.appendChild(baseLi);
        setTimeout(() => {
            const btn = document.getElementById('appearance-base-toggle');
            if (btn) {
                btn.onclick = function() {
                    document.body.classList.remove('appearance-classic', 'appearance-retro', 'appearance-vaporwave');
                    localStorage.removeItem('incrementalGameAppearance');
                    updateShopDisplay();
                };
            }
        }, 0);
    }
}

window.getShopState = () => [
    ...shopItems.map(i => i.bought ? 1 : 0),
    ...appearanceShopItems.map(i => i.bought ? 1 : 0)
];
window.setShopState = (arr) => {
    // Reset all effects to default before applying saved state
    window.shopClickMultiplier = 1;
    window.shopAutoCollectorMultiplier = 1;
    document.body.classList.remove('dark-theme', 'appearance-classic', 'appearance-retro', 'appearance-vaporwave');

    arr = arr || [];
    shopItems.forEach((item, i) => {
        item.bought = !!arr[i];
    });
    appearanceShopItems.forEach((item, i) => {
        item.bought = !!arr[shopItems.length + i];
    });
    // Apply effects for all bought upgrades (including after refresh)
    shopItems.forEach((item, i) => {
        if (item.bought) item.effect();
    });
    // Restore last selected appearance
    let lastAppearance = localStorage.getItem('incrementalGameAppearance');
    if (lastAppearance) {
        const found = appearanceShopItems.find(i => i.id.endsWith(lastAppearance));
        if (found && found.bought) found.effect();
    }
    updateShopDisplay();
};
window.updateShopDisplay = updateShopDisplay;

// Restore dark theme and appearance on load if needed
setTimeout(() => {
    if (localStorage.getItem('incrementalGameDarkTheme') === '1') {
        document.body.classList.add('dark-theme');
    }
    let lastAppearance = localStorage.getItem('incrementalGameAppearance');
    if (lastAppearance) {
        document.body.classList.remove('appearance-classic', 'appearance-retro', 'appearance-vaporwave');
        document.body.classList.add('appearance-' + lastAppearance);
    }
    updateShopDisplay();
}, 0);
