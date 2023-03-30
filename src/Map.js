import { useState, useEffect, useMemo, useCallback } from "react";

import Map, { NavigationControl, Marker, Popup } from "react-map-gl";
import { circle, booleanPointInPolygon } from "@turf/turf";

const GEOFENCE = circle([-115.729625, 33.351508], 1, { units: "miles" });

function MapWrapper({
  userLocation,
  markerColors,
  locations,
  selectedMarker,
  setSelectedMarker,
  viewState,
  setViewState,
}) {
  const [mapDimensions, setMapDimensions] = useState({
    width: "75vw",
    height: "100%",
  });

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
      [...locations]
        .map((l, i) => {
          return (
            <Marker
              key={`marker${i}`}
              longitude={l.Long}
              latitude={l.Lat}
              anchor="bottom"
              color={markerColors[l["Category"]]}
              scale={l.Category === "Art Installation" ? 0.45 : 0.65}
              onClick={() => setSelectedMarker(l)}
            ></Marker>
          );
        })
        .reverse(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locations]
  );

  // mapbox://styles/mapbox/satellite-v9
  // mapbox://styles/binx/cleyhulax000001r4oeh1qzy8

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
      {userLocation && (
        <Marker
          longitude={userLocation.longitude}
          latitude={userLocation.latitude}
          anchor="bottom"
        >
          <div
            style={{
              display: "inline-block",
              width: "15px",
              height: "15px",
              border: "2px solid white",
              borderRadius: "50%",
              background: "#4286F4",
            }}
          ></div>
        </Marker>
      )}
      {selectedMarker && (
        <Popup
          longitude={selectedMarker.Long}
          latitude={selectedMarker.Lat}
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
