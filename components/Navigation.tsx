'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'How To Use', path: '/how-to-use' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    // Apply theme to document
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark-theme')
      document.documentElement.classList.add('light-theme')
      document.body.classList.remove('dark-theme')
      document.body.classList.add('light-theme')
    } else {
      document.documentElement.classList.remove('light-theme')
      document.documentElement.classList.add('dark-theme')
      document.body.classList.remove('light-theme')
      document.body.classList.add('dark-theme')
    }
  }

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme) {
      setTheme(savedTheme)
      if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme')
        document.body.classList.add('light-theme')
      } else {
        document.documentElement.classList.add('dark-theme')
        document.body.classList.add('dark-theme')
      }
    } else {
      // Use system preference if no saved theme
      const initialTheme = systemPrefersDark ? 'dark' : 'light'
      setTheme(initialTheme)
      if (initialTheme === 'light') {
        document.documentElement.classList.add('light-theme')
        document.body.classList.add('light-theme')
      } else {
        document.documentElement.classList.add('dark-theme')
        document.body.classList.add('dark-theme')
      }
    }
  }, [])

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          EasyWebp Converter
        </Link>
        
        {/* Desktop Navigation */}
        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link 
                href={item.path} 
                className={`nav-link ${pathname === item.path ? 'active' : ''}`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Theme Toggle Button */}
        <button 
          className="macos-button secondary small" 
          onClick={toggleTheme}
          style={{ 
            position: 'absolute', 
            right: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {theme === 'dark' ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              Light
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              Dark
            </>
          )}
        </button>
        
        {/* Mobile Menu Toggle */}
        <div className="nav-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <ul className="nav-menu-mobile">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item-mobile">
              <Link 
                href={item.path} 
                className={`nav-link-mobile ${pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}

export default Navigation