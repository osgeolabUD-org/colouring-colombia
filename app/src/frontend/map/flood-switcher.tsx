import React from 'react';

import './map-button.css';
import { useDisplayPreferences } from '../displayPreferences-context';

export const FloodSwitcher: React.FC<{}> = () => {
    const { flood, floodSwitch, darkLightTheme } = useDisplayPreferences();
    return (
        <form className={`flood-switcher map-button ${darkLightTheme}`} onSubmit={floodSwitch}>
            <button className="btn btn-outline btn-outline-dark"
                type="submit">
                {(flood === 'enabled')? 'Flood Zones on' : 'Flood Zones of'}
            </button>
        </form>
    );
}
