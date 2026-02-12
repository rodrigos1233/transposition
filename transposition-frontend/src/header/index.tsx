import { useState, useEffect, useRef } from 'react';
import NotationSelector from './NotationSelector';

import './header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';
import Text from '../components/text';
import { HamburgerMenu } from './hamburgerMenu';
import LanguageSelector from './LanguageSelector';
import { handleNavigate } from '../utils/handleNavigate';
import NavTabDropdown from '../components/nav-tab-dropdown';
import { useTranslation } from 'react-i18next';

export function Header() {
  const location = window.location.pathname.substring(1);
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const { t } = useTranslation();

  const isMobile = useIsMobile();

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scaleLinkElements = [
    {
      content: t('common.header.scale'),
      href: '/scale',
      isCurrentPage: location.startsWith('scale'),
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        handleNavigate(navigate, '/scale');
      },
    },
  ];

  const noteLinkElements = [
    {
      content: t('common.header.note'),
      href: '/note',
      isCurrentPage: location.startsWith('note'),
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        handleNavigate(navigate, '/note');
      },
    },
  ];

  const aboutLinkElement = [
    {
      content: t('common.header.about'),
      href: '/about',
      isCurrentPage: location === 'about',
    },
  ];

  return (
    <header
      ref={headerRef}
      className={`header z-10 fixed ${
        isMobile ? 'header--mobile sticky top-0 bg-white/95 pl-4 pr-4' : ''
      }`}
    >
      <div className="header__content">
        {/* Left side: Logo + Navigation */}
        <div className="flex items-end">
          <Link to="/" className="h-12 pr-4 flex items-center gap-1.5 group">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-emerald-600">Clave</span>
              <span className="text-neutral-700">Shift</span>
            </span>
            <span className="text-emerald-500 text-xl transition-transform group-hover:rotate-12">
              ♪
            </span>
          </Link>
          {!isMobile && (
            <nav className="h-14 flex">
              <NavTabDropdown
                elements={scaleLinkElements}
                isCurrentPage={scaleLinkElements.some(
                  (link) => link.isCurrentPage
                )}
              >
                {t('common.header.scale')}
              </NavTabDropdown>

              <NavTabDropdown
                elements={noteLinkElements}
                isCurrentPage={noteLinkElements.some(
                  (link) => link.isCurrentPage
                )}
              >
                {t('common.header.note')}
              </NavTabDropdown>

              <NavTabDropdown
                elements={aboutLinkElement}
                isCurrentPage={aboutLinkElement.some(
                  (link) => link.isCurrentPage
                )}
              >
                {t('common.header.about')}
              </NavTabDropdown>
            </nav>
          )}
        </div>

        {/* Right side: Language & Notation selectors */}
        {!isMobile && (
          <div className="flex flex-col gap-1 items-end py-1">
            <LanguageSelector />
            <NotationSelector />
          </div>
        )}

        {isMobile && (
          <div className="h-full flex justify-center items-center">
            <HamburgerMenu
              isOpen={openMenu}
              toggleOpen={() => setOpenMenu(!openMenu)}
            />
          </div>
        )}
      </div>
      {isMobile && (
        <div
          className={`collapsed-menu p-4 shadow-lg rounded-b-xl flex flex-col gap-3 bg-white/95 backdrop-blur-sm ${
            openMenu ? 'collapsed-menu--open' : 'collapsed-menu--closed'
          }`}
        >
          <NotationSelector />
          <LanguageSelector />
        </div>
      )}
    </header>
  );
}

export function BottomNav() {
  const isMobile = useIsMobile();
  const location = window.location.pathname.substring(1);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const startLinkElement = [
    {
      content: t('common.header.home'),
      href: '/',
      isCurrentPage: location === '',
    },
  ];

  const scaleLinkElements = [
    {
      content: t('common.header.scale'),
      href: '/scale',
      isCurrentPage: location.startsWith('scale'),
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        handleNavigate(navigate, '/scale');
      },
    },
  ];

  const noteLinkElements = [
    {
      content: t('common.header.note'),
      href: '/note',
      isCurrentPage: location.startsWith('note'),
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        handleNavigate(navigate, '/note');
      },
    },
  ];

  const aboutLinkElement = [
    {
      content: t('common.header.about'),
      href: '/about',
      isCurrentPage: location === 'about',
    },
  ];

  return (
    <>
      {isMobile && (
        <div className="shadow-[0_-4px_20px_rgb(0,0,0,0.1)] fixed bottom-0 bg-white w-screen">
          <nav className="h-12 flex gap-0.5 bg-neutral-200">
            <NavTabDropdown
              elements={startLinkElement}
              isCurrentPage={startLinkElement.some(
                (link) => link.isCurrentPage
              )}
              isMobile
            >
              {t('common.header.home')}
            </NavTabDropdown>
            <NavTabDropdown
              elements={scaleLinkElements}
              isCurrentPage={scaleLinkElements.some(
                (link) => link.isCurrentPage
              )}
              isMobile
            >
              {t('common.header.scale')}
            </NavTabDropdown>

            <NavTabDropdown
              elements={noteLinkElements}
              isCurrentPage={noteLinkElements.some(
                (link) => link.isCurrentPage
              )}
              isMobile
            >
              {t('common.header.note')}
            </NavTabDropdown>

            <NavTabDropdown
              elements={aboutLinkElement}
              isCurrentPage={aboutLinkElement.some(
                (link) => link.isCurrentPage
              )}
              isMobile
            >
              {t('common.header.about')}
            </NavTabDropdown>
          </nav>
        </div>
      )}
    </>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const startYear = 2022;
  const isMobile = useIsMobile();

  return (
    <footer className={`p-4 ${isMobile ? 'mb-20' : ''}`}>
      <p className="text-neutral-500">
        <Text size={'small'}>
          &copy; {startYear} - {currentYear} Rodrigo Salazar. All rights
          reserved.
        </Text>
      </p>
    </footer>
  );
}
