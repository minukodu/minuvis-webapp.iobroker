import React from "react";
import { Range } from "react-onsenui";
import { Input } from "react-onsenui";
import Title from "./Title";
import moment from "moment";
moment.locale("de-DE");

export default class MySlider extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0,
      ts: moment(),
    };
  }

  sendValue(e) {
    let valueToSend = e.target.value;
    if (this.props.widgetData.stateIdType === "number") {
      valueToSend = parseInt(e.target.value, 10);
    }

    this.props.widgetData.socket.emit("setState", this.props.widgetData.stateId, valueToSend);
    // State nachführen
    this.setState({
      val: e.target.value,
      ts: moment(),
    });
  }

  render() {
    // init
    let val = 0;
    let ts = moment();
    // read value and timestamp from props if available
    if (
      this.props.widgetData.states[this.props.widgetData.stateId] &&
      this.props.widgetData.states[this.props.widgetData.stateId].received === true 
    ) {
      val = this.props.widgetData.states[this.props.widgetData.stateId].val || 0;
      ts = this.props.widgetData.states[this.props.widgetData.stateId].ts || moment();
    } else {
      // read from this.state
      val = this.state.val || 0;
      ts = this.state.ts;
    }

    let maxIcon = this.props.widgetData.maxIcon || "text_max";
    let minIcon = this.props.widgetData.minIcon || "text_min";

    let title = (
      <ons-list-item>
        <Title
          title={this.props.widgetData.title}
          titleIcon={this.props.widgetData.titleIcon}
          titleIconFamily={this.props.widgetData.titleIconFamily}
        />
        <div className="right">
          <Input
            disable-auto-styling
            disabled={!this.props.widgetData.connected}
            onChange={this.sendValue.bind(this)}
            type="number"
            placeholder=""
            value={val.toString()}
            min={this.props.widgetData.min}
            max={this.props.widgetData.max}
            step={this.props.widgetData.step}
          ></Input>
          {this.props.widgetData.unit}
        </div>
      </ons-list-item>
    );

    if (this.props.widgetData.title == "NONE") {
      title = null;
    }

    let header = (
      <ons-list-header>
        <span
          className="right lastupdate"
          style={{ float: "right", paddingRight: "5px" }}
        >
          {moment(ts).format("LLL")}
        </span>
      </ons-list-header>
    );

    let compactModeClass = "";
    let disableAutoStyling = "true";
    let modifier = null;

    if (this.props.widgetData.compactMode === true) {
      title = null;
      header = null;
      compactModeClass = "compactMode";
      disableAutoStyling = "false";
      modifier = "material";

    }

    return (
      <ons-col id={this.props.widgetData.UUID} class={"sliderWidget " + compactModeClass} >
        <ons-list>
          {header}
          {title}
          <ons-list-item style={{ padding: 0 }}>
            <div style={{ display: "flex", width: "100%", flexDirection: "row", flexWrap: "nowrap" }}>
              <ons-col
                class={"sliderIconMin"}
                style={{ flexBasis: "50px", minWidth: "50px" }}
              >
                <span
                  className={
                    "sliderIcon min  " +
                    compactModeClass +
                    " " +
                    this.props.widgetData.minIconFamily +
                    " " +
                    minIcon
                  }
                ></span>
              </ons-col>
              <ons-col style={{ minWidthhh: 80 + "%", borderLeft: "none", flexBasis: "auto", flexGrow: 1, alignSelf: "center" }}>
                <Range
                  disable-auto-styling={disableAutoStyling}
                  modifier={modifier}
                  disabled={!this.props.widgetData.connected}
                  onChange={this.sendValue.bind(this)}
                  value={parseInt(val, 10)}
                  min={this.props.widgetData.min}
                  max={this.props.widgetData.max}
                  step={this.props.widgetData.step}
                  style={{ width: 100 + "%" }}
                  className={compactModeClass}
                ></Range>
              </ons-col>
              <ons-col
                class={"sliderIconMax"}
                style={{ flexBasis: "50px", minWidth: "50px" }}
              >
                <span
                  className={
                    "sliderIcon max " +
                    compactModeClass +
                    " " +
                    this.props.widgetData.maxIconFamily +
                    " " +
                    maxIcon
                  }
                ></span>
              </ons-col>
            </div>
          </ons-list-item>
        </ons-list>
      </ons-col>
    );
  }
}
