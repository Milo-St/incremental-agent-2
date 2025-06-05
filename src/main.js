// Auto-save indicator logic
let autosaveTimeout = null;
function showAutosaveIndicator() {
    const el = document.getElementById('autosave-indicator');
    if (!el) return;
    el.textContent = '💾 Saved';
    clearTimeout(autosaveTimeout);
    autosaveTimeout = setTimeout(() => { el.textContent = ''; }, 1200);
}

window.coins = 0;

const coinsDisplay = document.getElementById('coins');
const incrementBtn = document.getElementById('increment-btn');

function formatNumber(num) {
    if (num >= 1e12) return (num/1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num/1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num/1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num/1e3).toFixed(2) + 'K';
    return Number(num).toFixed(1);
}

window.formatNumber = formatNumber;

window.updateDisplay = function() {
    coinsDisplay.textContent = formatNumber(window.coins);
    // Also update autosave indicator position if present
    const autosaveBtn = document.getElementById('manual-save-btn');
    if (autosaveBtn) {
        autosaveBtn.style.verticalAlign = 'middle';
    }
    if (window.updatePrestigeDisplay) window.updatePrestigeDisplay();
};





// Debounce and visual feedback for collect button
let lastCollectTime = 0;
window.handleCollectClick = function() {
    const now = Date.now();
    if (now - lastCollectTime < 200) return;
    lastCollectTime = now;
    let amount = window.getIncrementAmount ? window.getIncrementAmount() : 1;
    let multiplier = window.getPrestigeMultiplier ? window.getPrestigeMultiplier() : 1;
    window.coins += amount * multiplier;
    // Stats update
    if (window.stats) {
        window.stats.totalCoinsEarned = (window.stats.totalCoinsEarned || 0) + amount * multiplier;
        window.stats.totalClicks = (window.stats.totalClicks || 0) + 1;
        if (window.updateStatsDisplay) window.updateStatsDisplay();
    }
    window.updateDisplay();
    // Animate button
    incrementBtn.classList.remove('coin-animate');
    void incrementBtn.offsetWidth; // force reflow
    incrementBtn.classList.add('coin-animate');
    // Coin fly animation
    const coinFly = document.createElement('span');
    coinFly.className = 'coin-fly';
    coinFly.textContent = '+ ' + (amount * multiplier);
    incrementBtn.parentNode.insertBefore(coinFly, incrementBtn);
    setTimeout(() => coinFly.remove(), 700);
};
incrementBtn.addEventListener('click', window.handleCollectClick);

window.updateDisplay();
