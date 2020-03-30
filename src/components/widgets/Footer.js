import React from "react";

export default class Footer extends React.Component {
  render() {
    return (
      <ons-col className={"appFooter"}>
        <ons-list>
          <ons-list-item>
            <div className="right" style={{ fontSize: "10px" }}>
              <output>
                {"minuvis for web version " + this.props.version}{" "}
              </output>
            </div>
          </ons-list-item>
        </ons-list>
      </ons-col>
    );
  }
}
