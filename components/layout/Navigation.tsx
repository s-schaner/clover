'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { NAV_LINKS, COMPANY, NAV_HEIGHT_PX, SECTION_IDS } from '@/lib/constants';

export default function Navigation() {
  const [activeSection, setActiveSection] = useState<string>(SECTION_IDS.HERO);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // useEffect 1: Scroll-Spy via IntersectionObserver
  useEffect(() => {
    const sectionIds = Object.values(SECTION_IDS);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      {
        rootMargin: `-${NAV_HEIGHT_PX}px 0px -55% 0px`,
        threshold: 0,
      }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // useEffect 2: Body Scroll Lock
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // useEffect 3: Focus Trap + Escape Key
  useEffect(() => {
    if (!isMenuOpen) return;

    const overlay = overlayRef.current;
    if (!overlay) return;

    const focusableSelector = 'a[href], button, [tabindex]:not([tabindex="-1"])';

    // Focus first element on open
    const firstFocusable = overlay.querySelector<HTMLElement>(focusableSelector);
    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = Array.from(
          overlay.querySelectorAll<HTMLElement>(focusableSelector)
        );
        if (focusableElements.length === 0) return;

        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift+Tab: wrap from first to last
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          // Tab: wrap from last to first
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleNavLinkClick = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-[--nav-height] bg-surface border-b border-surface-border">
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="flex items-center justify-between h-full px-[--section-padding-x] max-w-screen-2xl mx-auto"
      >
        {/* Wordmark */}
        <Link
          href="#hero"
          className="font-display font-semibold text-on-surface text-lg tracking-tight"
          onClick={handleNavLinkClick}
        >
          {COMPANY.name}
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex gap-8 list-none m-0 p-0">
          {NAV_LINKS.map((link) => (
            <li key={link.sectionId}>
              <Link
                href={link.href}
                className={clsx(
                  'text-sm font-body transition-colors duration-base',
                  activeSection === link.sectionId
                    ? 'text-on-surface font-medium'
                    : 'text-on-surface-muted hover:text-on-surface'
                )}
                aria-current={activeSection === link.sectionId ? 'true' : undefined}
                onClick={handleNavLinkClick}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger button */}
        <button
          ref={menuButtonRef}
          className="md:hidden text-on-surface p-2"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile overlay */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 top-0 z-40 bg-surface flex flex-col items-center justify-center gap-8"
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 text-on-surface p-2"
            aria-label="Close menu"
            onClick={() => {
              setIsMenuOpen(false);
              menuButtonRef.current?.focus();
            }}
          >
            <X size={24} />
          </button>

          {/* Nav links list */}
          <ul className="flex flex-col items-center gap-8 list-none m-0 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.sectionId}>
                <Link
                  href={link.href}
                  onClick={handleNavLinkClick}
                  className="font-display text-3xl text-on-surface hover:text-on-surface-muted transition-colors duration-base"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
