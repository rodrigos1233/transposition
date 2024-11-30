import React from 'react';
import { useNavigate } from 'react-router-dom';
import Text from '../text';
import './navTabDropdown.css';

type LinkElementProps = {
    content: React.ReactNode;
    href: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    isCurrentPage: boolean;
};

type NavTabDropdownProps = {
    elements: LinkElementProps[];
    isCurrentPage: boolean;
    children: React.ReactNode;
    colour?: 'lime' | 'red' | 'sky' | 'yellow' | 'purple';
};

function NavTabDropdown({
    elements,
    isCurrentPage,
    children,
    colour = 'lime',
}: NavTabDropdownProps) {
    const navigate = useNavigate();

    return (
        <div
            className={`nav-dropdown-container ${
                isCurrentPage ? 'bg-amber-400' : ''
            }`}
        >
            <div className={`nav-dropdown-main`}>
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
                            <a href={href} onClick={handleClick}>
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
                    className={`nav-dropdown-items-container hidden flex-col bg-neutral-50 p-2 rounded-lg border-2 border-lime-300`}
                >
                    {elements.map((element, k) => {
                        const { href, onClick, content } = element;

                        const handleClick = (
                            e: React.MouseEvent<HTMLAnchorElement>
                        ) => {
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
                                className={`nav-dropdown-item ${
                                    isCurrentPage
                                        ? 'nav-dropdown-item--active'
                                        : ''
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
