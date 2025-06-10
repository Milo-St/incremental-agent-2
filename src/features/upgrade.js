// Handles upgrade logic for the incremental game
let upgradeCost = 10;
let incrementAmount = 1;
window.getUpgradeCost = () => upgradeCost;
window.setUpgradeCost = (val) => { upgradeCost = val; updateUpgradeDisplay(); };
window.setIncrementAmount = (val) => { incrementAmount = val; updateUpgradeDisplay(); };

const upgradeBtn = document.getElementById('upgrade-btn');
const upgradeCostDisplay = document.getElementById('upgrade-cost');
const incrementAmountDisplay = document.getElementById('increment-amount');

function updateUpgradeDisplay() {
    let clickMult = window.shopClickMultiplier || 1;
    // Add info icon and tooltip for upgrade (show tooltip only on hover/focus, not always visible)
    upgradeCostDisplay.innerHTML =
        (window.formatNumber ? window.formatNumber(upgradeCost) : upgradeCost) +
        ' <span class="tooltip-container"><span class="info-icon" tabindex="0" aria-label="More info" aria-describedby="upgrade-cost-tooltip">ℹ️</span>' +
        '<span class="tooltip" id="upgrade-cost-tooltip" role="tooltip">Spend coins to increase coins per click. Each upgrade increases your coin gain per click by 1.</span></span>';
    incrementAmountDisplay.innerHTML =
        (window.formatNumber ? window.formatNumber(incrementAmount * clickMult) : (incrementAmount * clickMult)) +
        ' <span class="tooltip-container"><span class="info-icon" tabindex="0" aria-label="More info" aria-describedby="increment-amount-tooltip">ℹ️</span>' +
        '<span class="tooltip" id="increment-amount-tooltip" role="tooltip">Current coins gained per click, including all upgrades and shop bonuses.</span></span>';
    // Visual feedback for upgrade button
    upgradeBtn.classList.remove('coin-animate');
    void upgradeBtn.offsetWidth;
    upgradeBtn.classList.add('coin-animate');
}


window.handleUpgradeClick = function() {
    if (window.coins >= upgradeCost) {
        window.coins -= upgradeCost;
        incrementAmount++;
        upgradeCost = Math.floor(upgradeCost * 1.5);
        // Stats update
        if (window.stats) {
            window.stats.totalUpgrades = (window.stats.totalUpgrades || 0) + 1;
            if (window.updateStatsDisplay) window.updateStatsDisplay();
        }
        window.updateDisplay();
        updateUpgradeDisplay();
    }
};
upgradeBtn.addEventListener('click', window.handleUpgradeClick);

updateUpgradeDisplay();
window.getIncrementAmount = () => incrementAmount;
