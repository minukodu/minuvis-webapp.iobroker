import React from "react";
import { Button, List, ListItem, ListHeader } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

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
    let linkText = (
      <span className={"valueSwitcherValue"}>{this.props.linkText}</span>
    );

    if (this.props.linkText === "ICONONLY") {
      linkText = null;
    }
    // check if Link exists
    this.linkExists = true;
    if (this.props.extLink !== true && !this.props.pageLinks[this.props.targetpage]) {
      this.linkExists = false;
      linkText = (
        <span className={"valueSwitcherValue"}>
          {"Link does not exist !!!!"}
        </span>
      );
    }

    let timestamp = null;
    if (this.props.timestamp && this.props.timestamp === true) {
      timestamp = (
        <ListHeader>
          <span
            className="right lastupdate"
            style={{ float: "right", paddingRight: "5px" }}
          >
            {moment().format("DD.MM.YY HH:mm")}
          </span>
        </ListHeader>
      );
    }

    let button = (
      <Button
        disable-auto-styling={"disable-auto-styling"}
        onClick={this.gotoTarget.bind(this)}
        style={{ width: "98%", marginRight: 0 }}
      >
        <span
          className={
            "valueSwitcherIcon min " +
            this.props.linkIconFamily +
            " " +
            this.props.linkIcon
          }
        ></span>
        {linkText}
      </Button>
    );

    if (this.props.extLink === true) {
      button = (
        <Button
          disable-auto-styling={"disable-auto-styling"}
          style={{ width: "98%", marginRight: 0 }}
        >
          <a
            href={this.props.extUrl}
            style={{ textDecoration: "none" }}
          >
            <span
              className={
                "valueSwitcherIcon min " +
                this.props.linkIconFamily +
                " " +
                this.props.linkIcon
              }
            ></span>
            {linkText}
          </a>
        </Button>

      );
    }

    return (
      <List id={this.props.UUID}>
        {timestamp}
        <ListItem>
          {button}
        </ListItem>
      </List>
    );
  }
}
