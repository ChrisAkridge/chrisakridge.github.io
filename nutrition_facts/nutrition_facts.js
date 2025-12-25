// Navigation controls
let currentPanelIndex = 0;
const panels = document.querySelectorAll('.row > div');
const totalPanels = panels.length;

function showPanel(index) {
    panels.forEach((panel, i) => {
        if (i === index) {
            panel.classList.add('panel-shown');
            panel.classList.remove('panel-hidden');
        } else {
            panel.classList.add('panel-hidden');
            panel.classList.remove('panel-shown');
        }
    });
    currentPanelIndex = index;
}

function setNavButtonStates() {
    const canGoBackToStart = currentPanelIndex > 0;
    const canGoBack = currentPanelIndex > 0;
    const canGoForward = currentPanelIndex < totalPanels - 1;

    document.getElementById('back-to-nutrition-facts').classList.toggle('nav-button-active', canGoBackToStart);
    document.getElementById('back-one-page').classList.toggle('nav-button-active', canGoBack);
    document.getElementById('forward-one-page').classList.toggle('nav-button-active', canGoForward);
}

document.getElementById('back-to-nutrition-facts').addEventListener('click', () => {
    if (currentPanelIndex > 0) {
        showPanel(0);
        setNavButtonStates();
    }
});

document.getElementById('back-one-page').addEventListener('click', () => {
    if (currentPanelIndex > 0) {
        showPanel(currentPanelIndex - 1);
        setNavButtonStates();
    }
});

document.getElementById('forward-one-page').addEventListener('click', () => {
    if (currentPanelIndex < totalPanels - 1) {
        showPanel(currentPanelIndex + 1);
        setNavButtonStates();
    }
});