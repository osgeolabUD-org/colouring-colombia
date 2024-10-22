import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import './header.css';

import { Logo } from './components/logo';
import { WithSeparator } from './components/with-separator';
import { useAuth } from './auth-context';
import {t} from'i18next';
import { CCConfig } from '../cc-config';
let config: CCConfig = require('../cc-config.json')

interface MenuLink {
    to: string;
    text: string;
    external?: boolean;
    disabled?: boolean;
    note?: string;
}


function getCurrentMenuLinks(username: string): MenuLink[][] {
    return [
        [
            ...(
                username != undefined ?
                    [
                        {
                            to: "/my-account.html",
                            text: `${t('Account')} (${username})`

                        }
                    ] :
                    [
                        {
                            to: "/login.html",
                            text: t("Log in")
                        },
                        {
                            to: "/sign-up.html",
                            text: t("Sign up")
                        }
                    ]
            )
        ],
        [
            {
                to: "/view/categories",
                text: t("View Maps")
            },
            {
                to: "/edit/categories",
                text: t("Edit Maps")
            },
            {
                to: "/data-extracts.html",
                text: t("Download data")
            },
            {
                to: "https://github.com/colouring-cities/manual/wiki",
                text: t("Colouring Cities Open Manual/Wiki"),
                disabled: false,
                external: true
            },
            {
                to: config.githubURL,
                text: t("Open code"),
                external: true
            },
            {
                to: "/showcase.html",
                text: t("Case Study Showcase"),
                disabled: true,
            },
        ],
        [
            {
                to: "https://github.com/colouring-cities/manual/wiki/A.-What-is-the-CCRP%3F",
                text: t("About the Colouring Cities Research Programme"),
                external: true
            },
            {
                to: "https://github.com/colouring-cities/manual/wiki/A2.-How-to%3F-Guides",
                text: t("How to Use"),
                external: true
            },
            {
                to: "https://github.com/colouring-cities/manual/wiki/I.--DATA",
                text: t("Data Categories"),
                external: true
            },
            {
                to: "https://pages.colouring.london/whoisinvolved",
                text: t("Who's Involved?"),
                external: true
            },
            {
                to: "https://github.com/colouring-cities/manual/wiki/C.-Ethical-framework-and-ethics-policies",
                text: t("Ethical Framework"),
                external: true
            }
        ],
        [
            {
                to: "/leaderboard.html",
                text: t("Top Contributors")
            },
            {
                to: config.githubURL+"/discussions",
                text: t("Discussion Forum"),
                external: true
            },
            // {
            //     to: "https://discuss.colouring.london/c/blog/9",
            //     text: "Blog",
            //     external: true
            // },
        ],
        [
            {
                to: "https://github.com/colouring-cities/manual/wiki/C1.-Protocols,-codes-of-conduct-&-data-sharing-agreements#ccrp-contributor-privacy-statement",
                text: t("Privacy Policy"),
                external: true
            },
            {
                to: "https://github.com/colouring-cities/manual/wiki/C1.-Protocols,-codes-of-conduct-&-data-sharing-agreements#ccrp-contributor--data-user-data-accuracy--ethical-use-agreement",
                text: t("Contributor Agreement"),
                external: true
            },
            {
                to: "/code-of-conduct.html",
                text: t("Code of Conduct")
            },
            {
                to: "https://github.com/colouring-cities/manual/wiki/C1.-Protocols,-codes-of-conduct-&-data-sharing-agreements#ccrp-contributor--data-user-data-accuracy--ethical-use-agreement",
                text: t("Data Accuracy and Use Agreement"),
                external: true
            },
            {
                to: "https://github.com/colouring-cities/manual/wiki/C1.-Protocols,-codes-of-conduct-&-data-sharing-agreements#ccrp-equality-diversity-and-inclusion-policy",
                text: t("Equality, Diversity and Inclusion"),
                external: true
            },
            {
                to: "https://github.com/colouring-cities/manual/wiki/C1.-Protocols,-codes-of-conduct-&-data-sharing-agreements#ccrp-protocols-for-international-academic-partners",
                text: t("CCRP Academic Partner Protocols"),
                external: true
            },
            {
                to: "/ordnance-survey-uprn.html",
                text: t("Ordnance Survey terms of UPRN usage")
            },
        ],
        [
            {
                to: "/contact.html",
                text: t("Contact")
            },
        ],
    ];
}

const Menu: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => {
    const { user } = useAuth();

    const menuLinkSections = getCurrentMenuLinks(user?.username);
    return (
        <WithSeparator separator={<hr />}>
            {menuLinkSections.map((section, idx) =>
                <ul key={`menu-section-${idx}`} className="navbar-nav flex-container">
                    {section.map(item => (
                        <li className='nav-item' key={`${item.to}-${item.text}`}>
                            {
                                item.disabled ?
                                    <LinkStub note={item.note}>{item.text}</LinkStub> :
                                    item.external ?
                                        <ExternalNavLink to={item.to}>{item.text}</ExternalNavLink> :
                                        <InternalNavLink to={item.to} onClick={onNavigate}>{item.text}</InternalNavLink>
                            }
                        </li>
                    ))}
                </ul>
            )}
        </WithSeparator>
    );
};

const InternalNavLink: React.FC<{to: string; onClick: () => void}> = ({ to, onClick, children}) => (
    <NavLink className="nav-link" to={to} onClick={onClick}>
        {children}
    </NavLink>
);

const ExternalNavLink: React.FC<{to: string}> = ({ to, children }) => (
    <a className="nav-link" href={to} target="_blank">
        {children}
    </a>
);

const LinkStub: React.FC<{note: string}> = ({note, children}) => (
    <a className="nav-link disabled">
        {children}
        <span className="link-note">{note}</span>
    </a>
);

export const Header: React.FC<{
    animateLogo: boolean;
}> = ({ animateLogo }) => {
    const [collapseMenu, setCollapseMenu] = useState(true);

    const toggleCollapse = () => setCollapseMenu(!collapseMenu);
    const handleNavigate = () => setCollapseMenu(true);

    return (
    <header className="main-header navbar navbar-light">
        <div className="nav-header">
            <NavLink to="/">
                <Logo variant={animateLogo ? 'animated' : 'default'}/>
            </NavLink>
            <button className="navbar-toggler" type="button"
                onClick={toggleCollapse} aria-expanded={!collapseMenu} aria-label="Toggle navigation">
                Menu&nbsp;
                {
                    collapseMenu ?
                        <span className="navbar-toggler-icon"></span>
                        : <span className="close">&times;</span>
                }
            </button>
        </div>
        <nav className={collapseMenu ? 'collapse navbar-collapse' : 'navbar-collapse'}>
            <Menu onNavigate={handleNavigate}></Menu>
        </nav>
    </header>
    );
}
