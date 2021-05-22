import React, { useState, useEffect } from "react";
import { Col, List, ListItem, ListHeader } from "react-onsenui";
import AnalogClock from "../utils/AnalogClock";
import moment from "moment";
moment.locale("de-DE");

const DateTime = (props) => {
  const [actDate, setActDate] = useState(moment());

  useEffect(() => {
    const interval = setInterval(() => {
      setActDate((actDate) => moment());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  let header = null;
  if (props.widgetData.timestamp && props.widgetData.timestamp === true) {
    header = <ListHeader></ListHeader>;
  }
  let fontSize = props.widgetData.fontSize || 100;

  let dateTimeToShow = actDate + props.widgetData.timeOffsetMin * 60 * 1000;

  let clockBackgroundColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--background-color");
  let clockSecColor = "red";
  let clockColor = getComputedStyle(document.documentElement).getPropertyValue(
    "--text-color"
  );

  let myClock = (
    <div className="center">
      <div
        className="innerCenter"
        style={{ margin: "auto", fontSize: fontSize + "%" }}
      >
        <span
          className="date"
          style={{
            display: "inline-block",
            textAlign: "center",
            lineHeight: fontSize + "%",
          }}
        >
          {moment(dateTimeToShow).format(props.widgetData.format)}
        </span>
      </div>
    </div>
  );

  if (props.widgetData.showAnalog === true) {
    myClock = (
      <AnalogClock
        size={props.widgetData.widgetHeight * props.widgetData.rowHeight * 0.9}
        dateTime={dateTimeToShow + 1000} // corrected by 1000 ms
        color={clockColor}
        secColor={clockSecColor}
        backgroundColor={clockBackgroundColor}
      />
    );
  }

  return (
    <Col id={props.widgetData.UUID} class="datetime">
      <List>
        {header}
        <ListItem>
          <div
            className="center"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {myClock}
          </div>
        </ListItem>
      </List>
    </Col>
  );
};
export default DateTime;
