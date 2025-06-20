// Auto-save indicator logic

function showAutosaveIndicator() {
    const el = document.getElementById('autosave-indicator');
    if (!el) return;
    el.textContent = '💾 Saved';
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 1200);
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
    // Update coins per second display
    const cpsEl = document.getElementById('cps-display');
    if (cpsEl && window.getCoinsPerSecond) {
        let cps = window.getCoinsPerSecond();
        let displayCps = (Math.abs(cps) >= 1 ? cps.toFixed(2) : cps.toPrecision(2)).replace(/\.00$/, '');
        cpsEl.textContent = `(+${displayCps}/sec)`;
    }
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
    let clickMult = window.shopClickMultiplier || 1;
    let multiplier = window.getPrestigeMultiplier ? window.getPrestigeMultiplier() : 1;
    let totalGain = amount * clickMult * multiplier;
    window.coins += totalGain;
    // Stats update
    if (window.stats) {
        window.stats.totalCoinsEarned = (window.stats.totalCoinsEarned || 0) + totalGain;
        window.stats.totalClicks = (window.stats.totalClicks || 0) + 1;
        if (window.updateStatsDisplay) window.updateStatsDisplay();
    }
    window.updateDisplay();
    // Animate button
    incrementBtn.classList.remove('coin-animate');
    void incrementBtn.offsetWidth; // force reflow
    incrementBtn.classList.add('coin-animate');
    // Coin fly animation (limit decimals to 2 max)
    const coinFly = document.createElement('span');
    coinFly.className = 'coin-fly';
    let displayGain = (Math.abs(totalGain) >= 1 ? totalGain.toFixed(2) : totalGain.toPrecision(2)).replace(/\.00$/, '');
    coinFly.textContent = '+ ' + displayGain;
    incrementBtn.parentNode.insertBefore(coinFly, incrementBtn);
    setTimeout(() => coinFly.remove(), 700);
};
incrementBtn.addEventListener('click', window.handleCollectClick);

window.updateDisplay();
