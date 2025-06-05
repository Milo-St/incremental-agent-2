// Prestige system for the incremental game
let prestigePoints = 0;
let prestigeThreshold = 1000; // Coins needed to prestige
let prestigeMultiplier = 1;

const prestigeBtn = document.getElementById('prestige-btn');
const prestigePanel = document.getElementById('prestige-panel');
const prestigePointsDisplay = document.getElementById('prestige-points');
const prestigeMultiplierDisplay = document.getElementById('prestige-multiplier');

function updatePrestigeDisplay() {
    prestigePointsDisplay.textContent = prestigePoints;
    prestigeMultiplierDisplay.textContent = (1 + prestigePoints * 0.1).toFixed(1) + 'x';
    if (window.coins >= prestigeThreshold) {
        prestigeBtn.disabled = false;
    } else {
        prestigeBtn.disabled = true;
    }
}

prestigeBtn.addEventListener('click', () => {
    if (window.coins >= prestigeThreshold) {
        prestigePoints++;
        prestigeMultiplier = 1 + prestigePoints * 0.1;
        // Reset game state except prestige
        window.coins = 0;
        if (window.setIncrementAmount) window.setIncrementAmount(1);
        if (window.setUpgradeCost) window.setUpgradeCost(10);
        if (window.setAutoCollectorCount) window.setAutoCollectorCount(0);
        if (window.setAutoCollectorCost) window.setAutoCollectorCost(50);
        if (window.setAchievementsState) window.setAchievementsState([false, false, false, false]);
        window.updateDisplay();
        if (window.updateUpgradeDisplay) window.updateUpgradeDisplay();
        if (window.updateAutoCollectorDisplay) window.updateAutoCollectorDisplay();
        updatePrestigeDisplay();
        if (window.saveGame) window.saveGame();
    }
});

window.getPrestigePoints = () => prestigePoints;
window.setPrestigePoints = (val) => { prestigePoints = val; prestigeMultiplier = 1 + prestigePoints * 0.1; updatePrestigeDisplay(); };
window.getPrestigeMultiplier = () => prestigeMultiplier;
window.setPrestigeMultiplier = (val) => { prestigeMultiplier = val; updatePrestigeDisplay(); };
window.updatePrestigeDisplay = updatePrestigeDisplay;

updatePrestigeDisplay();
