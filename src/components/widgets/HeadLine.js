import React from "react";
import Title from "./Title";
import { Col, List, ListItem, ListHeader } from "react-onsenui";

export default function HeadLine(props) {
  console.log("############## HeadLine Start #################");
  console.log(props);

  let header = null;
  if (props.timestamp && props.timestamp === true) {
    header = (
      <ListHeader>
      </ListHeader>
    );
  }
  let fontSize = props.fontSize || 100;
  let classes = props.classes || "left";

  return (
    <Col
      id={props.UUID}
      className={"filler headline " + classes} >
      <List>
        {header}
        <ListItem style={{ padding: 0 }}>
          <Title
            title={props.title}
            titleIcon={props.titleIcon}
            titleIconFamily={props.titleIconFamily}
            fontSize={fontSize}
            compactMode={props.compactMode}
            classes={classes}
            widgetHeight={props.widgetHeight}
          />
        </ListItem>
      </List>
    </Col>
  );

}
