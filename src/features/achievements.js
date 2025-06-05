// Achievements system for the incremental game
const achievements = [
    { id: 'first-coin', name: 'First Coin', desc: 'Earn your first coin.', unlocked: false, check: () => window.coins >= 1 },
    { id: 'click-master', name: 'Click Master', desc: 'Reach 100 coins by clicking.', unlocked: false, check: () => window.coins >= 100 },
    { id: 'upgrade-buyer', name: 'Upgrade Buyer', desc: 'Buy your first upgrade.', unlocked: false, check: () => window.getIncrementAmount && window.getIncrementAmount() > 1 },
    { id: 'auto-tycoon', name: 'Auto Tycoon', desc: 'Own 10 auto-collectors.', unlocked: false, check: () => window.getAutoCollectorCount && window.getAutoCollectorCount() >= 10 },
];

const achievementsPanel = document.getElementById('achievements-panel');
const achievementsList = document.getElementById('achievements-list');
const achievementNotification = document.getElementById('achievement-notification');

function updateAchievementsDisplay() {
    achievementsList.innerHTML = '';
    achievements.forEach(a => {
        const li = document.createElement('li');
        li.innerHTML = `${a.name} <span class="info-icon" tabindex="0">ℹ️</span><span class="tooltip">${a.desc}</span> - ${a.unlocked ? 'Unlocked' : 'Locked'}`;
        if (a.unlocked) li.classList.add('unlocked');
        achievementsList.appendChild(li);
    });
}

function showAchievementNotification(name) {
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
};

// Save/load achievements
window.getAchievementsState = () => achievements.map(a => a.unlocked);
window.setAchievementsState = (arr) => {
    arr.forEach((val, i) => achievements[i].unlocked = val);
    updateAchievementsDisplay();
};

updateAchievementsDisplay();
