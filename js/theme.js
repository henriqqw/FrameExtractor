/**
 * Theme Management Module
 * Handles toggling between light and dark themes and persisting preference.
 */

const ThemeManager = (() => {
    const THEME_KEY = 'frame_extractor_theme';
    
    // DOM Elements
    const body = document.body;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.theme-icon-sun');
    const moonIcon = document.querySelector('.theme-icon-moon');

    function init() {
        if (!themeToggleBtn) return;

        // Load saved theme or default to dark
        const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
        applyTheme(savedTheme);

        // Event Listener
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    function toggleTheme() {
        const currentTheme = body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
    }

    function applyTheme(theme) {
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

    return { init };
})();

// Initialize on load
document.addEventListener('DOMContentLoaded', ThemeManager.init);
