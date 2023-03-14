import styled from "styled-components";

const ListWrapper = styled.div`
  overflow-y: scroll;
  margin-left: 4px;
  @media (max-width: 1000px) {
    margin-top: 12px;
    overflow-y: visible;
  }
`;
const ListItem = styled.div`
  display: flex;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  background-color: ${(props) =>
    props.selectedMaker ? "rgba(0,0,0,.2) !important" : "inherit"};
`;
const Dot = styled.div`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 4px;
  flex-shrink: 0;
  margin-top: 4px;
`;

function List({
  markerColors,
  locations,
  selectedMarker,
  setSelectedMarker,
  viewState,
  setViewState,
}) {
  return (
    <ListWrapper>
      {locations.map((l, i) => {
        return (
          <div key={`list${i}`}>
            <ListItem
              onClick={() => {
                const isCurrentSelection =
                  selectedMarker && selectedMarker["Name"] === l["Name"];
                if (isCurrentSelection) setSelectedMarker(null);
                else {
                  setSelectedMarker(l);
                  if (!l.latitude) return;
                  setViewState({
                    longitude: l.longitude,
                    latitude: l.latitude,
                    zoom: 17,
                  });
                }
              }}
              selectedMaker={
                selectedMarker && selectedMarker["Name"] === l["Name"]
              }
            >
              <Dot style={{ background: markerColors[l["Category"]] }} />
              {l["Name"]}
            </ListItem>
            {selectedMarker && selectedMarker["Name"] === l["Name"] && (
              <div style={{ padding: "12px" }}>
                <div>
                  <i>{l["Category"]}</i>
                </div>
                <div>{l["Artist(s)"]}</div>
                <div style={{ color: "#888" }}>{l["Openness"]}</div>
              </div>
            )}
          </div>
        );
      })}
    </ListWrapper>
  );
}

export default List;
