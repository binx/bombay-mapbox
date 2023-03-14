import { useState, useEffect } from "react";
import styled from "styled-components";

import Banner from "./Banner";
import MapWrapper from "./Map";
import List from "./List";

import locationsJSON from "./locations.json";

const markerColors = {
  "Local Business": "#DDA390",
  "Community Hub": "#FFD2B7",
  Museum: "#A17A7B",
  Gallery: "#C98A76",
  Studio: "#B8A5BF",
  Venue: "#48564D",
  "Art Installation": "#9AA367",
};

const ContentWrapper = styled.div`
  display: flex;
  height: calc(100vh - 35px);
  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

function App() {
  const [selectedMarker, setSelectedMarker] = useState();
  const [locations, setLocations] = useState([]);
  const [viewState, setViewState] = useState({
    longitude: -115.729625,
    latitude: 33.35,
    zoom: 15.3,
  });

  useEffect(() => {
    const newLocations = locationsJSON.map((l) => {
      const latLng = l["LatLng"].split(",");
      if (latLng) {
        l.latitude = latLng[0];
        l.longitude = latLng[1];
      }
      return l;
    });
    setLocations(newLocations);
  }, []);

  return (
    <>
      <Banner />
      <ContentWrapper>
        <div>
          <MapWrapper
            markerColors={markerColors}
            locations={locations}
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
            viewState={viewState}
            setViewState={setViewState}
          />
        </div>
        <List
          markerColors={markerColors}
          locations={locations}
          selectedMarker={selectedMarker}
          setSelectedMarker={setSelectedMarker}
          viewState={viewState}
          setViewState={setViewState}
        />
      </ContentWrapper>
    </>
  );
}

export default App;
