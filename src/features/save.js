// Handles saving, loading, and resetting game state

function saveGame() {
    const state = {
        coins: window.coins,
        incrementAmount: window.getIncrementAmount ? window.getIncrementAmount() : 1,
        upgradeCost: window.getUpgradeCost ? window.getUpgradeCost() : 10,
        autoCollectorCount: window.getAutoCollectorCount ? window.getAutoCollectorCount() : 0,
        autoCollectorCost: window.getAutoCollectorCost ? window.getAutoCollectorCost() : 50,
        achievements: window.getAchievementsState ? window.getAchievementsState() : [],
        prestigePoints: window.getPrestigePoints ? window.getPrestigePoints() : 0,
        shop: window.getShopState ? window.getShopState() : []
    };
    localStorage.setItem('incrementalGameSave', JSON.stringify(state));
    if (window.showAutosaveIndicator) window.showAutosaveIndicator();
}

function loadGame() {
    const state = JSON.parse(localStorage.getItem('incrementalGameSave'));
    if (state) {
        window.coins = state.coins;
        if (window.setIncrementAmount) window.setIncrementAmount(state.incrementAmount);
        if (window.setUpgradeCost) window.setUpgradeCost(state.upgradeCost);
        if (window.setAutoCollectorCount) window.setAutoCollectorCount(state.autoCollectorCount);
        if (window.setAutoCollectorCost) window.setAutoCollectorCost(state.autoCollectorCost);
        if (window.setAchievementsState && state.achievements) window.setAchievementsState(state.achievements);
        if (window.setPrestigePoints && state.prestigePoints !== undefined) window.setPrestigePoints(state.prestigePoints);
        if (window.setShopState && state.shop) window.setShopState(state.shop);
        window.updateDisplay();
        if (window.updateUpgradeDisplay) window.updateUpgradeDisplay();
        if (window.updateAutoCollectorDisplay) window.updateAutoCollectorDisplay();
        if (window.updatePrestigeDisplay) window.updatePrestigeDisplay();
        if (window.updateShopDisplay) window.updateShopDisplay();
        if (window.startAutoCollector) window.startAutoCollector();
    }
}

function resetGame() {
    localStorage.removeItem('incrementalGameSave');
    location.reload();
}


// (Removed auto-save interval. Only manual save will show the indicator.)

// Manual save button event with debounce to prevent rapid auto-repeat
window.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('manual-save-btn');
    if (btn) {
        let lastSaveTime = 0;
        btn.addEventListener('click', function() {
            const now = Date.now();
            if (now - lastSaveTime < 200) return;
            lastSaveTime = now;
            saveGame();
        });
    }
});

// Expose for manual save/load/reset
window.saveGame = saveGame;
window.loadGame = loadGame;
window.resetGame = resetGame;

document.getElementById('reset-btn').addEventListener('click', resetGame);

// Do not auto-load here; loadGame will be called after all scripts are loaded in index.html
