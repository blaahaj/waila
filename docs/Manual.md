# How to use "What am I looking at?"

Given an image, Waila works by combining three bits of data:

- "Image items", which are rectangles you draw on the image around e.g. a building;
- "World items", which are polygons of latitude- & longitude-points;
- The camera position (latitude & longitude).

## Providing an image

On the first page, you'll be prompted to provide an image, via any of:

- Choosing an image file
- Drag and drop an image file into the page
- Paste an image file or content into the page

## Setting the camera position

Go to "Camera position" and enter the latitude and longitude, as decimal degrees, separated by a comma.

For example, [52.516357981728646,13.378868409981067](https://geohack.toolforge.org/geohack.php?params=52_30_58_N_13_22_43_E).

## Adding and removing image items

Go to the "Image items" tab.

To add an image item, just click-and-drag in the image to draw a rectangle in the image.
The new image item will be shown in the list.

You may want to give the item a label. To do so, simply edit the label field in the list of items.

To remove an image item, click "Remove".

## Adding and removing world items

This is a bit clunky. Here's how I've been doing it, using (GeoJSON.io)[https://geojson.io/].

- Go to https://geojson.io/
- Use the map to find the thing you want to add. Zoom in so you can see its position clearly.
- Draw a polygon (using either the "polygon" or "rectangle" tool) around the thing, closely
  matching its position. For example, if you're adding a skyscraper with a rectangular footprint,
  then draw a rectangle to match the walls (at ground level).
- Click on the item you just added to edit its properties:
  - add one row saying "id", with any unique value;
  - add one row saying "label", with a name for the item;
  - save.
- Copy the JSON shown
- Back in WAILA, select the "World items" tab, then click "Paste GeoJSON (replace all)". Paste
  in the JSON you just copied, and press return.
- The item should now be shown in the list.

To add more items, repeat the process (so that the geojson.io window contains more multiple
items). Each time, copy over the whole JSON (i.e. representing all the items).

You might also want to save this JSON to a file somewhere.

To remove or rename world items, make the change in geojson.io, then copy and paste over the JSON.

## Link image items to world items

Linking items allows WAILA to understand the relationship between a position in the image
(specifically, its X co-ordinate) and a location in the real world (or, more accurately, a bearing
from the camera's position). For example, that the vertical center line of the image corresponds
to a bearing of (say) 235&deg;.

Go to the "Image items" tab, find the item you want to link, then use the "Linked world item" field
to select the world item that it should be linked to.

Each image item can only be linked to one world item, and vice versa.

## Finding unknown items

After adding and linking the first few items, WAILA can start to help you identify the rest.

- Add an image item for the thing you can see, but can't yet identify
- Click the "Find..." link. A window will open to geojson.io, but this time showing a (probably)
  very close together) pair of lines emanating from a point — the camera position. The lines
  represent the bearings, i.e. lines of sight, towards the left and right edges of the image item.
- Use the map to scan along the lines, looking for something that lines up between them (and which
  you think matches what you see in the image. For example, a castle and a shopping centre
  probably look very different).
- In your original geojso.io window (the one where you've been adding items, add add item for
  the thing you just found (see "Adding and removing world items").
- Link the image item you start with, to the world item you just added.
