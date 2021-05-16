import React from "react";
import { List, ListItem } from "react-onsenui";

export default class Footer extends React.Component {
  render() {
    return (
        <List className={"appFooter"}>
          <ListItem>
            <div className="right" style={{ fontSize: "10px" }}>
              <output>
                {"minuvis for web version " + this.props.version}{" "}
              </output>
            </div>
          </ListItem>
        </List>
    );
  }
}
