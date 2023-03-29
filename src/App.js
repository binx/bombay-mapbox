import { useState, useEffect } from "react";
import styled from "styled-components";

import Banner from "./Banner";
import MapWrapper from "./Map";
import List from "./List";

import locationsJSON from "./locations.json";

const markerColors = {
  "Local Business": "#C98A76",
  "Community Hub": "#FFD2B7",
  Museum: "#A17A7B",
  Gallery: "#B8A5BF",
  Studio: "#DDA390",
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
  const [userLocation, setUserLocation] = useState();

  useEffect(() => {
    setLocations(locationsJSON);

    function success(position) {
      setUserLocation(position.coords);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success)
    }
  }, []);

  return (
    <>
      <Banner />
      <ContentWrapper>
        <div>
          <MapWrapper
            userLocation={userLocation}
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
          setViewState={setViewState}
        />
      </ContentWrapper>
    </>
  );
}

export default App;
