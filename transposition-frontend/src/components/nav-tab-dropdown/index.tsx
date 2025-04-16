import { useEffect, useRef, useState } from 'react';
import type { ReactNode, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './navTabDropdown.css';

type LinkElementProps = {
    content: ReactNode;
    href: string;
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
    isCurrentPage: boolean;
};

type NavTabDropdownProps = {
    elements: LinkElementProps[];
    isCurrentPage: boolean;
    children: ReactNode;
    isMobile?: boolean;
};

function NavTabDropdown({
    elements,
    isCurrentPage,
    children,
    isMobile,
}: NavTabDropdownProps) {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isMobile) return;

        const handleClickOutside = (event: globalThis.MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsActive(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobile]);

    return (
        <div
            className={`nav-dropdown-container w-20 cursor-pointer ${
                isMobile ? 'nav-dropdown-container--mobile flex-grow' : ''
            }`}
            ref={dropdownRef}
        >
            <div
                className={`nav-dropdown-main h-full w-full flex items-center justify-center ${
                    isMobile ? '' : 'rounded-t-md'
                }  ${
                    isCurrentPage
                        ? 'bg-lime-300'
                        : 'bg-neutral-100 hover:bg-lime-100 '
                }`}
                onClick={isMobile ? () => setIsActive(!isActive) : undefined}
            >
                {elements.length < 2 &&
                    (() => {
                        const { isCurrentPage, href, onClick, content } =
                            elements[0];

                        const handleClick = (
                            e: React.MouseEvent<HTMLAnchorElement>
                        ) => {
                            if (isCurrentPage) {
                                e.preventDefault();
                                return;
                            }
                            if (onClick) onClick(e);
                            if (href && !e.defaultPrevented) {
                                e.preventDefault();
                                navigate(href);
                            }
                        };

                        return (
                            <a
                                className="flex justify-center items-center w-full h-full"
                                href={href}
                                onClick={handleClick}
                            >
                                {content}
                            </a>
                        );
                    })()}
                {elements.length > 1 &&
                    (() => {
                        return (
                            <div className={`nav-dropdown-parent`}>
                                {children}
                            </div>
                        );
                    })()}
            </div>
            {elements.length > 1 && (
                <div
                    className={`nav-dropdown-items-container w-48 hidden flex-col bg-neutral-50 rounded-lg border-2 border-lime-300 ${
                        isActive ? 'nav-dropdown-items-container--active' : ''
                    }`}
                >
                    {elements.map((element, k) => {
                        const { href, onClick, content } = element;

                        const handleClick = (
                            e: React.MouseEvent<HTMLAnchorElement>
                        ) => {
                            if (isMobile) {
                                setIsActive(false);
                            }
                            if (element.isCurrentPage) {
                                e.preventDefault();
                                return;
                            }
                            if (onClick) onClick(e);
                            if (href && !e.defaultPrevented) {
                                e.preventDefault();
                                navigate(href);
                            }
                        };

                        return (
                            <a
                                key={k}
                                href={href}
                                onClick={handleClick}
                                className={`nav-dropdown-item p-2 ${
                                    element.isCurrentPage
                                        ? 'nav-dropdown-item--active bg-lime-300'
                                        : 'hover:bg-lime-100'
                                }`}
                            >
                                {content}
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default NavTabDropdown;
