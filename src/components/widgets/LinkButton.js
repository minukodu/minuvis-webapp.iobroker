import React from "react";
import { Button, List, ListItem, ListHeader } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

export default class LinkButton extends React.Component {
  gotoTarget() {
    if (this.linkExists === true) {
      // console.log("this.props.widgetData.pageLinks:");
      // console.log(this.props.widgetData.pageLinks);
      this.props.widgetData.pageLinks[this.props.widgetData.targetpage]();
    }
  }

  render() {
    //console.debug("Render LinkButton");
    let linkText = (
      <span className={"valueSwitcherValue"}>{this.props.widgetData.linkText}</span>
    );

    if (this.props.widgetData.linkText === "ICONONLY") {
      linkText = null;
    }
    // check if Link exists
    this.linkExists = true;
    if (this.props.widgetData.extLink !== true && !this.props.widgetData.pageLinks[this.props.widgetData.targetpage]) {
      this.linkExists = false;
      linkText = (
        <span className={"valueSwitcherValue"}>
          {"Link does not exist !!!!"}
        </span>
      );
    }

    let timestamp = null;
    if (this.props.widgetData.timestamp && this.props.widgetData.timestamp === true) {
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

    let displayBtn = "block";
    if ( this.props.widgetData.linkIconFamily === "noIcon") {
      displayBtn = "flex";
    }

    let button = (
      <Button
        disable-auto-styling={"disable-auto-styling"}
        onClick={this.gotoTarget.bind(this)}
        style={{ width: "98%", marginRight: 0, display: displayBtn }}
      >
        <span
          className={
            "valueSwitcherIcon min " +
            this.props.widgetData.linkIconFamily +
            " " +
            this.props.widgetData.linkIcon
          }
        ></span>
        {linkText}
      </Button>
    );

    if (this.props.widgetData.extLink === true) {
      button = (
        <Button
          disable-auto-styling={"disable-auto-styling"}
          style={{ width: "98%", marginRight: 0, display: displayBtn }}
        >
          <a
            href={this.props.widgetData.extUrl}
            style={{ textDecoration: "none" }}
          >
            <span
              className={
                "valueSwitcherIcon min " +
                this.props.widgetData.linkIconFamily +
                " " +
                this.props.widgetData.linkIcon
              }
            ></span>
            {linkText}
          </a>
        </Button>

      );
    }

    return (
      <List class="linkbutton" id={this.props.widgetData.UUID}>
        {timestamp}
        <ListItem>
          {button}
        </ListItem>
      </List>
    );
  }
}
