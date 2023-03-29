import { useState, useEffect } from "react";
import styled from "styled-components";

const ListWrapper = styled.div`
  overflow-y: scroll;
  margin-left: 4px;
  padding-bottom: 20px;
  @media (max-width: 1000px) {
    margin-top: 12px;
    overflow-y: visible;
  }
`;
const Group = styled.div`
  &:not(:first-child) {
    margin: 10px 0;
  }
`;
const Title = styled.div`
  border-top: 1px solid;
  border-bottom: 1px solid;
  font-weight: bold;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 14px;
`;
const ListItem = styled.div`
  display: flex;
  cursor: pointer;
  color: #555;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  background-color: ${(props) =>
    props.selectedMaker ? "rgba(0,0,0,.1) !important" : "inherit"};
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
  setViewState,
}) {
  const [listGroups, setListGroups] = useState([]);

  useEffect(() => {
    const order = [
      "Local Business",
      "Community Hub",
      "Gallery",
      "Venue",
      "Art Installation",
    ];
    const groupBy = (key, array) =>
      array.reduce(
        (objectsByKeyValue, obj) => ({
          ...objectsByKeyValue,
          [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj),
        }),
        {}
      );

    const grouped = groupBy("Category", locations);
    setListGroups(order.map((o) => ({ key: o, values: grouped[o] || [] })));
  }, [locations]);

  return (
    <ListWrapper>
      {listGroups.map((group, i) => {
        return (
          <Group key={`group${i}`}>
            <Title>{group.key}</Title>
            {group.values.map((l, j) => (
              <div key={`list${j}`}>
                <ListItem
                  onClick={() => {
                    const isCurrentSelection =
                      selectedMarker && selectedMarker["Name"] === l["Name"];
                    if (isCurrentSelection) setSelectedMarker(null);
                    else {
                      setSelectedMarker(l);
                      setViewState({
                        longitude: l.Long,
                        latitude: l.Lat,
                        zoom: 17,
                      });
                      window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: "smooth",
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
                {/* {selectedMarker && selectedMarker["Name"] === l["Name"] && (
                  <div style={{ padding: "12px" }}>
                    <div>
                      <i>{l["Category"]}</i>
                    </div>
                    <div>{l["Artist(s)"]}</div>
                    <div style={{ color: "#888" }}>{l["Openness"]}</div>
                  </div>
                )} */}
              </div>
            ))}
          </Group>
        );
      })}
    </ListWrapper>
  );
}

export default List;
