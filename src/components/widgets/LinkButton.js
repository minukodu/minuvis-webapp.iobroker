import React from "react";
import { Button } from "react-onsenui";

export default class LinkButton extends React.Component {
  gotoTarget() {
    if (this.linkExists === true) {
      // console.log("this.props.pageLinks:");
      // console.log(this.props.pageLinks);
      this.props.pageLinks[this.props.targetpage]();
    }
  }

  render() {
    //console.debug("Render LinkButton");
    let title = (
      <span className={"valueSwitcherValue"}>{this.props.title}</span>
    );

    if (this.props.title === "ICONONLY") {
      title = null;
    }
    // check if Link exists
    this.linkExists = true;
    if (!this.props.pageLinks[this.props.targetpage]) {
      this.linkExists = false;
      title = (
        <span className={"valueSwitcherValue"}>
          {"Link does not exist !!!!"}
        </span>
      );
    }

    return (
      <ons-col id={this.props.UUID}>
        <ons-list>
          <ons-list-item>
            <Button
              disable-auto-styling={"disable-auto-styling"}
              onClick={this.gotoTarget.bind(this)}
              style={{ width: "98%", marginRight: 0 }}
            >
              <span
                className={
                  "valueSwitcherIcon min " +
                  this.props.titleIconFamily +
                  " " +
                  this.props.titleIcon
                }
              ></span>
              {title}
            </Button>
          </ons-list-item>
        </ons-list>
      </ons-col>
    );
  }
}
