// Handles auto-collector logic for the incremental game
let autoCollectorCount = 0;
let autoCollectorCost = 50;
let autoCollectorInterval = null;
window.getAutoCollectorCount = () => autoCollectorCount;
window.setAutoCollectorCount = (val) => { autoCollectorCount = val; updateAutoCollectorDisplay(); };
window.getAutoCollectorCost = () => autoCollectorCost;
window.setAutoCollectorCost = (val) => { autoCollectorCost = val; updateAutoCollectorDisplay(); };
window.updateAutoCollectorDisplay = updateAutoCollectorDisplay;
window.startAutoCollector = startAutoCollector;

const autoCollectorBtn = document.getElementById('autocollector-btn');
const autoCollectorCostDisplay = document.getElementById('autocollector-cost');
const autoCollectorCountDisplay = document.getElementById('autocollector-count');

function updateAutoCollectorDisplay() {
    if (window.formatNumber) {
        autoCollectorCostDisplay.textContent = window.formatNumber(autoCollectorCost);
        autoCollectorCountDisplay.textContent = window.formatNumber(autoCollectorCount);
    } else {
        autoCollectorCostDisplay.textContent = autoCollectorCost;
        autoCollectorCountDisplay.textContent = autoCollectorCount;
    }
}

function startAutoCollector() {
    if (!autoCollectorInterval) {
        autoCollectorInterval = setInterval(() => {
            if (autoCollectorCount > 0) {
                let prestigeMult = window.getPrestigeMultiplier ? window.getPrestigeMultiplier() : 1;
                let shopMult = window.shopAutoCollectorMultiplier || 1;
                window.coins = Number(window.coins) + autoCollectorCount * prestigeMult * shopMult;
                window.updateDisplay();
            }
        }, 1000);
    }
}


window.handleAutoCollectorClick = function() {
    if (window.coins >= autoCollectorCost) {
        window.coins -= autoCollectorCost;
        autoCollectorCount++;
        autoCollectorCost = Math.floor(autoCollectorCost * 1.5);
        // Stats update
        if (window.stats) {
            window.stats.totalAutoCollectors = (window.stats.totalAutoCollectors || 0) + 1;
            if (window.updateStatsDisplay) window.updateStatsDisplay();
        }
        window.updateDisplay();
        updateAutoCollectorDisplay();
        startAutoCollector();
        // Visual feedback for auto-collector button
        autoCollectorBtn.classList.remove('coin-animate');
        void autoCollectorBtn.offsetWidth;
        autoCollectorBtn.classList.add('coin-animate');
    }
};
autoCollectorBtn.addEventListener('click', window.handleAutoCollectorClick);

updateAutoCollectorDisplay();
window.getAutoCollectorCount = () => autoCollectorCount;
