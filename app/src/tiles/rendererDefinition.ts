import { parseBooleanExact } from '../helpers';
import { getAllLayerNames, getBuildingLayerNames, getDataConfig, getLayerVariables } from "./dataDefinition";
import { createBlankTile } from "./renderers/createBlankTile";
import { getTileWithCaching } from "./renderers/getTileWithCaching";
import { renderDataSourceTile } from "./renderers/renderDataSourceTile";
import { stitchTile } from "./renderers/stitchTile";
import { TileCache } from "./tileCache";
import { BoundingBox, Tile, TileParams } from "./types";
import { isOutsideExtent } from "./util";

/**
 * A list of all tilesets handled by the tile server
 */
const allTilesets = getAllLayerNames();

/**
 * Zoom level when we switch from rendering direct from database to instead composing tiles
 * from the zoom level below - gets similar effect, with much lower load on Postgres
 */
const STITCH_THRESHOLD = 12;

/**
 * Hard-code extent so we can short-circuit rendering and return empty/transparent tiles outside the area of interest
 * bbox in CRS epsg:3857 in form: [w, s, e, n]
 */
//const EXTENT_BBOX: BoundingBox = [-61149.622628, 6667754.851372, 37183, 6744803.375884];

const EXTENT_BBOX: BoundingBox = [-8820000, -480000, -7435000, 1700000];

const allLayersCacheSwitch = parseBooleanExact(process.env.CACHE_TILES) ?? true;
const dataLayersCacheSwitch = parseBooleanExact(process.env.CACHE_DATA_TILES) ?? true;
let shouldCacheFn: (t: TileParams) => boolean;

if(!allLayersCacheSwitch) {
    shouldCacheFn = t => false;
} else if(dataLayersCacheSwitch) {
    shouldCacheFn = ({ tileset, z }: TileParams) => z <= 18;
} else {
    shouldCacheFn = ({ tileset, z }: TileParams) =>
        ['base_light', 'base_night', 'base_night_outlines', 'base_boroughs'].includes(tileset) && z <= 18;
}

const tileCache = new TileCache(
    process.env.TILECACHE_PATH,
    {
        tilesets: getBuildingLayerNames(),
        minZoom: 9,
        maxZoom: 19,
        scales: [1, 2]
    },
    shouldCacheFn,
    
    // don't clear on bounding box cache clear tilesets not affected by user-editable data
    (tileset: string) => tileset !== 'base_light' && tileset !== 'base_night' && tileset !== 'base_night_outlines' && tileset !== 'base_borough' && tileset !== "planning_applications_status_recent" && tileset !== "planning_applications_status_very_recent" && tileset !== "planning_applications_status_all"
);

const renderBuildingTile = (t: TileParams, d: any) => renderDataSourceTile(t, d, getDataConfig, getLayerVariables);

function cacheOrCreateBuildingTile(tileParams: TileParams, dataParams: any): Promise<Tile> {
    return getTileWithCaching(tileParams, dataParams, tileCache, stitchOrRenderBuildingTile);
}

function stitchOrRenderBuildingTile(tileParams: TileParams, dataParams: any): Promise<Tile> {
    if (tileParams.z <= STITCH_THRESHOLD && tileParams.tileset != "base_boroughs") {
        // stitch tile, using cache recursively
        return stitchTile(tileParams, dataParams, cacheOrCreateBuildingTile);
    } else {
        return renderBuildingTile(tileParams, dataParams);
    }
}

function renderTile(tileParams: TileParams, dataParams: any): Promise<Tile> {
    if (isOutsideExtent(tileParams, EXTENT_BBOX)) {
        return createBlankTile();
    }

    if (tileParams.tileset === 'highlight') {
        return renderBuildingTile(tileParams, dataParams);
    }

    return cacheOrCreateBuildingTile(tileParams, dataParams);
}

export {
    allTilesets,
    renderTile,
    tileCache
};
