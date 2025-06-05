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
        id: 'theme-dark',
        name: 'Dark Theme',
        desc: 'Switch to a dark theme for the game.',
        cost: 200,
        bought: false,
        effect: () => {
            document.body.classList.add('dark-theme');
            try { localStorage.setItem('incrementalGameDarkTheme', '1'); } catch (e) {}
        }
    }
];

window.shopClickMultiplier = 1;
window.shopAutoCollectorMultiplier = 1;

const shopPanel = document.getElementById('shop-panel');
const shopList = document.getElementById('shop-list');

function updateShopDisplay() {
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
}

window.getShopState = () => shopItems.map(i => i.bought ? 1 : 0);
window.setShopState = (arr) => {
    // Reset all effects to default before applying saved state
    window.shopClickMultiplier = 1;
    window.shopAutoCollectorMultiplier = 1;
    document.body.classList.remove('dark-theme');

    arr.forEach((v, i) => {
        shopItems[i].bought = !!v;
    });
    // Apply effects for all bought upgrades (including after refresh)
    shopItems.forEach((item, i) => {
        if (item.bought) item.effect();
    });
    updateShopDisplay();
};
window.updateShopDisplay = updateShopDisplay;

// Restore dark theme on load if needed
setTimeout(() => {
    if (localStorage.getItem('incrementalGameDarkTheme') === '1') {
        document.body.classList.add('dark-theme');
    }
    updateShopDisplay();
}, 0);
