#!/usr/bin/env bash

#
# Create corresponding 'building' record with
#     id: <building-guid>,
#     doc: {},
#     geom_id: <polygon-guid>
#

psql -c "
BEGIN;

-- Your INSERT statement
INSERT INTO public.geometries (source_id, geometry_geom)
SELECT lotcodigo, geom FROM demo_polygons_ideca;

SELECT *  FROM geometries;

INSERT INTO buildings ( geometry_id, ref_toid )
         SELECT geometry_id, source_id FROM geometries;

COMMIT;

"
