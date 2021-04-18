import React from "react";
import Title from "./Title";
import { Col, List, ListItem, ListHeader } from "react-onsenui";

export default function HeadLine(props) {
  console.log("############## HeadLine Start #################");
  console.log(props);

  let header = null;
  if (props.widgetData.timestamp && props.widgetData.timestamp === true) {
    header = (
      <ListHeader>
      </ListHeader>
    );
  }
  let fontSize = props.widgetData.fontSize || 100;
  let classes = props.widgetData.classes || "left";

  return (
    <Col
      id={props.widgetData.UUID}
      className={"filler headline " + classes} >
      <List>
        {header}
        <ListItem style={{ padding: 0 }}>
          <Title
            title={props.widgetData.title}
            titleIcon={props.widgetData.titleIcon}
            titleIconFamily={props.widgetData.titleIconFamily}
            fontSize={fontSize}
            compactMode={props.widgetData.compactMode}
            classes={classes}
            widgetHeight={props.widgetData.widgetHeight}
            color={props.widgetData.color}
          />
        </ListItem>
      </List>
    </Col>
  );

}
