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

  return (
    <Col
      id={props.UUID}
      className="filler headline">
      <List>
        {header}
        <ListItem>
          <Title
            title={props.title}
            titleIcon={props.titleIcon}
            titleIconFamily={props.titleIconFamily}
            fontSize={fontSize}
            compactMode={props.compactMode}
          />
        </ListItem>
      </List>
    </Col>
  );

}
