"""Download and load a small open dataset for testing

Run this to create a CSV of buildings geometries.

Then run:
- load_geometries.sh (loading geometries to the database)
- create_buildings.sh (creating empty building records for each geometry)
"""
# -*- coding: utf-8 -*-
# -*- coding: utf-8 -*-
import os
import subprocess
import osmnx as ox

# Configure logging/caching
ox.config(log_console=True, use_cache=True)

# Configure the image display
size = 256

# Load buildings from about 1.5km² around UCL
point = (4.714514667535731, -74.05960852749604)
dist = 612

# Define the tags for buildings
tags = {'building': True}

# Fetch geometries (building footprints) using the tags
gdf = ox.geometries_from_point(point, tags, dist=dist)

# Project the geometries to EPSG:3857
gdf_proj = ox.project_gdf(gdf, to_crs='EPSG:3857')

# Filter out multipolygons if needed
gdf_proj = gdf_proj[gdf_proj.geometry.apply(lambda g: g.geom_type != 'MultiPolygon')]

# Plot the footprints
fig, ax = ox.plot_graph(ox.graph_from_place("Bogotá, Colombia"),
                        bgcolor='#333333', node_color='w',
                        edge_color='w', show=False, close=False)

# Save the plot manually
fig.savefig('test_buildings_preview.png', dpi=600, bbox_inches='tight', facecolor='#333333')

# Reset the index and add an 'fid' column
gdf_proj = gdf_proj.reset_index(drop=True)
gdf_proj['fid'] = gdf_proj.index

# Create a GeoDataFrame with only 'fid' and 'geometry' columns
gdf_to_save = gdf_proj[['fid', 'geometry']]

# Save the GeoDataFrame to GeoJSON
test_dir = os.path.dirname(__file__)
test_data_geojson = str(os.path.join(test_dir, 'test_buildings.geojson'))
subprocess.run(["rm", test_data_geojson])

gdf_to_save.to_file(test_data_geojson, driver='GeoJSON')

# Convert to CSV
test_data_csv = str(os.path.join(test_dir, 'test_buildings.3857.csv'))
subprocess.run(["rm", test_data_csv])
subprocess.run(["ogr2ogr", "-f", "CSV", test_data_csv, test_data_geojson, "-lco", "GEOMETRY=AS_WKT"])

# Add SRID for ease of loading to PostgreSQL
subprocess.run(["sed", "-i", "s/^\"POLYGON/\"SRID=3857;POLYGON/", test_data_csv])
