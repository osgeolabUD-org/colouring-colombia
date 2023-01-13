import React from 'react';

import './map-button.css';
import { useDisplayPreferences } from '../displayPreferences-context';

export const BoroughSwitcher: React.FC<{}> = () => {
    const { borough, boroughSwitch, darkLightTheme } = useDisplayPreferences();
    return (
        <form className={`borough-switcher map-button ${darkLightTheme}`} onSubmit={boroughSwitch}>
            <button className="btn btn-outline btn-outline-dark"
                type="submit">
                {(borough === 'enabled')? 'Borough Boundaries on' : 'Borough Boundaries off'}
            </button>
        </form>
    );
}