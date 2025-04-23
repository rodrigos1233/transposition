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
      content: t('common.header.crossInstruments'),
      href: '/scale-cross-instruments',
      isCurrentPage: location.startsWith('scale-cross-instruments'),
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        handleNavigate(navigate, '/scale-cross-instruments');
      },
    },
    {
      content: t('common.header.intervals'),
      href: '/scale-intervals',
      isCurrentPage: location.startsWith('scale-intervals'),
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        handleNavigate(navigate, '/scale-intervals');
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
      className={`header shadow-lg z-10 fixed ${
        isMobile ? 'header--mobile sticky top-0 bg-white pl-4 pr-4' : ''
      }`}
    >
      <div className="header__content">
        <div className="flex justify-between items-end">
          <Link to="/" className={'h-12 pr-3'}>
            <h1 className="font-bold m-2">ClaveShift</h1>
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

        {!isMobile && (
          <div className="flex flex-col gap-1 items-end pt-2 pb-2">
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
          className={`collapsed-menu p-4 shadow-lg rounded-sm flex flex-col gap-2 bg-white ${
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
      content: t('common.header.crossInstruments'),
      href: '/scale-cross-instruments',
      isCurrentPage: location.startsWith('scale-cross-instruments'),
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        handleNavigate(navigate, '/scale-cross-instruments');
      },
    },
    {
      content: t('common.header.intervals'),
      href: '/scale-intervals',
      isCurrentPage: location.startsWith('scale-intervals'),
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        handleNavigate(navigate, '/scale-intervals');
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
        <div className="shadow-[0_8px_30px_rgb(0,0,0,0.4)] fixed bottom-0 bg-white w-screen">
          <nav className="h-10 flex gap-0.5 bg-neutral-600">
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
    <footer className={`p-2 ${isMobile ? 'mb-20' : ''}`}>
      <p>
        <Text size={'small'}>
          &copy; {startYear} - {currentYear} Rodrigo Salazar. All rights
          reserved.
        </Text>
      </p>
    </footer>
  );
}
