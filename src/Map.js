import { useState, useEffect, useMemo, useCallback } from "react";

import Map, { NavigationControl, Marker, Popup } from "react-map-gl";
import { circle, booleanPointInPolygon } from "@turf/turf";

const GEOFENCE = circle([-115.729625, 33.351508], 1, { units: "miles" });

function MapWrapper({
  markerColors,
  locations,
  selectedMarker,
  setSelectedMarker,
  viewState,
  setViewState,
}) {
  const [mapDimensions, setMapDimensions] = useState({
    width: "80vw",
    height: "100%",
  });

  console.log(process.env)

  const onMove = useCallback(
    ({ viewState }) => {
      const newCenter = [viewState.longitude, viewState.latitude];
      // Only update the view state if the center is inside the geofence
      if (booleanPointInPolygon(newCenter, GEOFENCE)) {
        setViewState({
          longitude: viewState.longitude,
          latitude: viewState.latitude,
          zoom: viewState.zoom,
        });
      }
    },
    [setViewState]
  );

  useEffect(() => {
    if (window.innerWidth < 1000) {
      setMapDimensions({
        width: "100%",
        height: "400px",
      });
      setViewState({
        longitude: viewState.longitude,
        latitude: viewState.latitude,
        zoom: 14.2,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markers = useMemo(
    () =>
      locations.map((l, i) => {
        if (!l.latitude) return null;
        return (
          <Marker
            key={`marker${i}`}
            longitude={l.longitude}
            latitude={l.latitude}
            anchor="bottom"
            color={markerColors[l["Category"]]}
            scale={0.7}
            onClick={() => setSelectedMarker(l)}
          ></Marker>
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locations]
  );

  return (
    <Map
      reuseMaps
      {...viewState}
      onMove={onMove}
      style={mapDimensions}
      mapStyle="mapbox://styles/binx/cleyhulax000001r4oeh1qzy8"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      attributionControl={false}
      dragRotate={false}
      minZoom={14}
    >
      <NavigationControl showCompass={false} />
      {markers}
      {selectedMarker && selectedMarker.latitude && (
        <Popup
          longitude={selectedMarker.longitude}
          latitude={selectedMarker.latitude}
          offset={30}
          anchor="bottom"
          closeOnClick={false}
          onClose={() => setSelectedMarker(null)}
        >
          <h3 style={{ margin: 0 }}>{selectedMarker["Name"]}</h3>
          <div>
            <i>{selectedMarker["Category"]}</i>
          </div>
          {selectedMarker["Artist Website"].length ? (
            <div>
              <a href={selectedMarker["Artist Website"]}>
                {selectedMarker["Artist(s)"]}
              </a>
            </div>
          ) : (
            <div>{selectedMarker["Artist(s)"]}</div>
          )}
          <div style={{ color: "#888" }}>{selectedMarker["Openness"]}</div>
        </Popup>
      )}
    </Map>
  );
}

export default MapWrapper;