// Statistics tracking and display for the incremental game

let stats = {
    totalCoinsEarned: 0,
    totalClicks: 0,
    totalUpgrades: 0,
    totalAutoCollectors: 0,
    timePlayed: 0, // in seconds
    lastTick: Date.now()
};
window.stats = stats;

// Try to load stats from localStorage immediately (for timePlayed persistence)
try {
    const s = JSON.parse(localStorage.getItem('incrementalGameStats'));
    if (s) Object.assign(stats, s);
} catch (e) {}

function updateStatsDisplay() {
    const statsList = document.getElementById('stats-list');
    if (!statsList) return;
    statsList.innerHTML = `
        <li><b>Total Coins Earned:</b> <span id="stat-total-coins">${window.formatNumber ? window.formatNumber(stats.totalCoinsEarned) : stats.totalCoinsEarned}</span></li>
        <li><b>Total Clicks:</b> <span id="stat-total-clicks">${stats.totalClicks}</span></li>
        <li><b>Total Upgrades Bought:</b> <span id="stat-total-upgrades">${stats.totalUpgrades}</span></li>
        <li><b>Total Auto-Collectors Bought:</b> <span id="stat-total-autocollectors">${stats.totalAutoCollectors}</span></li>
        <li><b>Time Played:</b> <span id="stat-time-played">${formatTime(stats.timePlayed)}</span></li>
    `;
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
}

// Increment time played every second, and save to localStorage
setInterval(() => {
    stats.timePlayed++;
    updateStatsDisplay();
    try {
        localStorage.setItem('incrementalGameStats', JSON.stringify(window.getStatsState()));
    } catch (e) {}
}, 1000);


// Wrap the handler functions to update stats
const oldHandleCollectClick = window.handleCollectClick;
window.handleCollectClick = function() {
    let amount = window.getIncrementAmount ? window.getIncrementAmount() : 1;
    let multiplier = window.getPrestigeMultiplier ? window.getPrestigeMultiplier() : 1;
    stats.totalCoinsEarned += amount * multiplier;
    stats.totalClicks++;
    if (oldHandleCollectClick) oldHandleCollectClick();
    updateStatsDisplay();
};

const oldHandleUpgradeClick = window.handleUpgradeClick;
window.handleUpgradeClick = function() {
    if (window.coins >= (window.getUpgradeCost ? window.getUpgradeCost() : 10)) {
        stats.totalUpgrades++;
        updateStatsDisplay();
    }
    if (oldHandleUpgradeClick) oldHandleUpgradeClick();
};

const oldHandleAutoCollectorClick = window.handleAutoCollectorClick;
window.handleAutoCollectorClick = function() {
    if (window.coins >= (window.getAutoCollectorCost ? window.getAutoCollectorCost() : 50)) {
        stats.totalAutoCollectors++;
        updateStatsDisplay();
    }
    if (oldHandleAutoCollectorClick) oldHandleAutoCollectorClick();
};

// Save/load stats
window.getStatsState = () => ({ ...stats });
window.setStatsState = (obj) => {
    Object.assign(stats, obj);
    updateStatsDisplay();
};
window.updateStatsDisplay = updateStatsDisplay;

// Add to save/load system
const oldSaveGame = window.saveGame;
window.saveGame = function() {
    if (oldSaveGame) oldSaveGame();
    try {
        localStorage.setItem('incrementalGameStats', JSON.stringify(window.getStatsState()));
    } catch (e) {}
};
const oldLoadGame = window.loadGame;
window.loadGame = function() {
    if (oldLoadGame) oldLoadGame();
    try {
        const s = JSON.parse(localStorage.getItem('incrementalGameStats'));
        if (s) window.setStatsState(s);
    } catch (e) {}
};

// Initial display
setTimeout(updateStatsDisplay, 0);
