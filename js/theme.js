/**
 * Theme Management Module
 * Handles toggling between light and dark themes and persisting preference.
 */

class ThemeManager {
    constructor() {
        this.THEME_KEY = 'frame_extractor_theme';
        this.elements = {
            body: document.body,
            themeToggleBtn: document.getElementById('theme-toggle'),
            sunIcon: document.querySelector('.theme-icon-sun'),
            moonIcon: document.querySelector('.theme-icon-moon')
        };
        this.init();
    }

    init() {
        if (!this.elements.themeToggleBtn) return;

        // Load saved theme or default to dark
        const savedTheme = localStorage.getItem(this.THEME_KEY) || 'dark';
        this.applyTheme(savedTheme);

        // Event Listener
        this.elements.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        const currentTheme = this.elements.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        this.applyTheme(newTheme);
        localStorage.setItem(this.THEME_KEY, newTheme);
    }

    applyTheme(theme) {
        const { body, sunIcon, moonIcon } = this.elements;

        if (theme === 'light') {
            body.setAttribute('data-theme', 'light');
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');

            // Show Moon (to switch to dark), Hide Sun
            sunIcon?.classList.add('hidden');
            moonIcon?.classList.remove('hidden');
        } else {
            body.setAttribute('data-theme', 'dark');
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');

            // Show Sun (to switch to light), Hide Moon
            sunIcon?.classList.remove('hidden');
            moonIcon?.classList.add('hidden');
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});
