import React from "react";

export default function GridChanger(props) {
  console.log("############## gridChanger #################");
  console.log(props);

  let nbOfRows = props.nbOfRows || 2;
  let gridPercentage = 100 / parseInt(nbOfRows);
  // limit
  if (gridPercentage > 100) {
    gridPercentage = 100;
  }
  if (gridPercentage < 20) {
    gridPercentage = 20;
  }

  let styleToInject =
    "<style>" +
    "[id='" +
    props.UUID +
    "']~ons-col { min-width: " +
    gridPercentage +
    "%;} " +
    "</style>";

  return (
    <div className="gridChanger" id={props.UUID} style={{ display: "none" }}>
      <span
        style={{ display: "none" }}
        dangerouslySetInnerHTML={{ __html: styleToInject }}
      ></span>
    </div>
  );
}
