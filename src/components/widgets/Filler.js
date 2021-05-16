import React from "react";
import Title from "./Title";
import { Col, List, ListItem, ListHeader } from "react-onsenui";

export default function Filler(props) {
  console.log("############## Filler Start #################");
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
    <Col id={props.UUID} class="filler">
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
