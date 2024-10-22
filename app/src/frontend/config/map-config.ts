import { CCConfig } from '../../cc-config';
let config: CCConfig = require('../../cc-config.json')

interface MapViewport {
    position: [number, number];
    zoom: number;
}

export const initialMapViewport: MapViewport = {
  position: [config.initialMapPosition[0], config.initialMapPosition[1]], // lat,lng
  zoom: config.initialZoomLevel,
};

export type MapTheme = 'light' | 'night' | 'night_outlines' | 'boroughs';

export type LayerEnablementState = 'enabled' | 'disabled';

export const mapBackgroundColor: Record<MapTheme, string> = {
    light: '#F0EEEB',
    night: '#162639',
    night_outlines: '#162639',
    boroughs: '#ff0000',
};
