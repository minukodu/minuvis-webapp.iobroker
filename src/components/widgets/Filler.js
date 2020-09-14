import React from "react";
import Title from "./Title";

export default function Filler(props) {
  console.log("############## Filler Start #################");
  console.log(props);

  if ( props.showAsHeader === true ) {
    return (
      <ons-col id={props.UUID} class="filler">
        <ons-list-header>
          <span
            // className="right lastupdate"
            // style={{ float: "right", paddingRight: "5px" }}
          >
           {props.title}
          </span>
        </ons-list-header>
      </ons-col>
    );
  } else {
    return (
      <ons-col id={props.UUID} class="filler">
        <ons-list-item>
          <Title
            title={props.title}
            titleIcon={props.titleIcon}
            titleIconFamily={props.titleIconFamily}
            compactMode={props.compactMode}
          />
        </ons-list-item>
      </ons-col>
    );
  }
}
