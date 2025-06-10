// Achievements system for the incremental game
const achievements = [
    { id: 'first-coin', name: 'First Coin', desc: 'Earn your first coin.', unlocked: false, check: () => window.coins >= 1 },
    { id: 'click-master', name: 'Click Master', desc: 'Reach 100 coins by clicking.', unlocked: false, check: () => window.coins >= 100 },
    { id: 'upgrade-buyer', name: 'Upgrade Buyer', desc: 'Buy your first upgrade.', unlocked: false, check: () => window.getIncrementAmount && window.getIncrementAmount() > 1 },
    { id: 'auto-tycoon', name: 'Auto Tycoon', desc: 'Own 10 auto-collectors.', unlocked: false, check: () => window.getAutoCollectorCount && window.getAutoCollectorCount() >= 10 },
];


function getAchievementsPanel() {
    return document.getElementById('achievements-panel');
}
function getAchievementsList() {
    return document.getElementById('achievements-list');
}
function getAchievementNotification() {
    return document.getElementById('achievement-notification');
}

function updateAchievementsDisplay() {
    const achievementsList = getAchievementsList();
    if (!achievementsList) return;
    achievementsList.innerHTML = '';
    achievements.forEach(a => {
        const li = document.createElement('li');
        li.innerHTML = `${a.name} <span class='tooltip-container'><span class='info-icon' tabindex='0' aria-label='More info' aria-describedby='achievement-tooltip-${a.id}'>ℹ️</span><span class='tooltip' id='achievement-tooltip-${a.id}' role='tooltip'>${a.desc}</span></span> - ${a.unlocked ? 'Unlocked' : 'Locked'}`;
        if (a.unlocked) li.classList.add('unlocked');
        achievementsList.appendChild(li);
    });
}

function showAchievementNotification(name) {
    const achievementNotification = getAchievementNotification();
    if (!achievementNotification) return;
    achievementNotification.textContent = `Achievement Unlocked: ${name}!`;
    achievementNotification.style.display = 'block';
    if (localStorage.getItem('incrementalGameSound') !== '0') {
        const audio = document.getElementById('audio-achievement');
        if (audio && audio.src && audio.canPlayType && audio.canPlayType('audio/ogg')) {
            try {
                audio.currentTime = 0;
                audio.play().catch(() => {});
            } catch (e) {}
        }
    }
    setTimeout(() => { achievementNotification.style.display = 'none'; }, 2500);
}

function checkAchievements() {
    achievements.forEach(a => {
        if (!a.unlocked && a.check()) {
            a.unlocked = true;
            updateAchievementsDisplay();
            showAchievementNotification(a.name);
        }
    });
}


// Hook into game updates
const oldUpdateDisplay = window.updateDisplay;
window.updateDisplay = function() {
    oldUpdateDisplay();
    checkAchievements();
    // Defensive: if the achievements tab is visible and the list is empty, re-render
    const achievementsTab = document.getElementById('achievements-tab');
    const achievementsList = getAchievementsList();
    if (achievementsTab && achievementsTab.style.display !== 'none' && achievementsList && achievementsList.children.length === 0) {
        updateAchievementsDisplay();
    }
};

// Expose updateAchievementsDisplay globally so index.html can call it
window.updateAchievementsDisplay = updateAchievementsDisplay;

// Save/load achievements
window.getAchievementsState = () => achievements.map(a => a.unlocked);
window.setAchievementsState = (arr) => {
    arr.forEach((val, i) => achievements[i].unlocked = val);
    updateAchievementsDisplay();
};

// Ensure achievements display is updated after DOM is ready
window.addEventListener('DOMContentLoaded', updateAchievementsDisplay);
