import { useState, useEffect, Fragment } from "react";
import styled from "styled-components";

const ListWrapper = styled.div`
  overflow-y: scroll;
  margin: 0 4px;
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
  color: ${(props) => (props.selectedMaker ? "#000" : "#555")};
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  font-weight: ${(props) => (props.selectedMaker ? "bold" : "inherit")};
  margin-top: ${(props) => (props.selectedMaker && props.hasEvents ? "20px" : "0")};
`;
const CloseX = styled.div`
  font-size: 36px;
  line-height: 16px;
  color: #555;
`;
const Dot = styled.div`
  display: inline-block;
  box-sizing: border-box;
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
  schedule,
  selectedMarker,
  setSelectedMarker,
  setViewState,
}) {
  const [listGroups, setListGroups] = useState([]);

  useEffect(() => {
    const order = [
      "Local Business",
      "Community Hub",
      "Venue",
      "Gallery",
      "Parking",
      "Bathroom",
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
    const newGroups = order.map((o) => {
      const values = grouped[o] || [];

      values.forEach((v) => {
        const events = schedule.find((s) => s.Name === v.Name);
        if (events) v.Events = events.Events;
        else v.Events = null;
      });

      return { key: o, values };
    });
    setListGroups(newGroups);
  }, [locations, schedule]);

  return (
    <ListWrapper>
      <div style={{ marginBottom: "20px" }}>
        <Dot style={{ background: "#555" }} /> Has a scheduled event(s)
        <div>
          <Dot style={{ border: "3px solid #555" }} /> Open, no schedule
        </div>
        <div style={{ fontStyle: "italic", color: "#888", marginTop: "10px", fontSize: "14px" }}>click on a venue to see events</div>
      </div>
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
                      // window.scrollTo({
                      //   top: 0,
                      //   left: 0,
                      //   behavior: "smooth",
                      // });
                    }
                  }}
                  selectedMaker={
                    selectedMarker && selectedMarker["Name"] === l["Name"]
                  }
                  hasEvents={!!l.Events}
                >
                  <Dot
                    style={{
                      background: l["Events"]
                        ? markerColors[l["Category"]]
                        : "transparent",
                      border: l["Events"]
                        ? "none"
                        : `3px solid ${markerColors[l["Category"]]}`,
                    }}
                  />
                  <span style={{ flex: 1 }}>{l["Name"]}</span>
                  { selectedMarker && selectedMarker["Name"] === l["Name"] && selectedMarker["Events"] && (
                    <CloseX>×</CloseX>
                  )}
                </ListItem>
                {selectedMarker &&
                  selectedMarker["Name"] === l["Name"] &&
                  selectedMarker["Events"] && (
                    <table
                      style={{
                        borderCollapse: "collapse",
                        margin: "10px 0 30px",
                        width: "100%",
                      }}
                    >
                      <tbody>
                        {selectedMarker.Events.map((e, i) => (
                          <Fragment key={`event${i}`}>
                            <tr>
                              <td
                                style={{
                                  borderTop: "1px solid #ccc",
                                  color: "#888",
                                }}
                              >
                                {e.Day}
                              </td>
                              <td
                                style={{
                                  borderTop: "1px solid #ccc",
                                  color: "#888",
                                  textAlign: "right",
                                  paddingRight: "10px",
                                }}
                              >
                                {e.Time}
                              </td>
                            </tr>
                            <tr>
                              <td
                                colSpan="2"
                                style={{ borderBottom: "1px solid #ccc" }}
                              >
                                {e.Event}
                              </td>
                            </tr>
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  )}
              </div>
            ))}
          </Group>
        );
      })}
    </ListWrapper>
  );
}

export default List;
