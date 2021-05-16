import React from "react";
import { List, ListItem } from "react-onsenui";

export default function ConfigMessage(props) {
  if (props.show === false) {
    return null;
  }

  return (
    <List>
      <ListItem className="ConfigMessage">
        The configuration file has the wrong version. Please open the file{" --- "}
        {props.configFileName}{" --- "} with the{" "}
        <a className="ConfigMessageLink" href={props.builderLink}>
          Builder
        </a>
      </ListItem>
      <ListItem className="ConfigMessage">
        Die Konfiguration hat die falsche Version. Bitte die Datei{" --- "}
        {props.configFileName}{" --- "} mit dem{" "}
        <a className="ConfigMessageLink" href={props.builderLink}>
          Builder
        </a>{" "}
        öffnen.
      </ListItem>
    </List>
  );
}
