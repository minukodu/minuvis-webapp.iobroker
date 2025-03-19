import React from 'react';
import { List, ListItem, Fab, ListHeader } from "react-onsenui";
// import SchedexDialog from "./SchedexDialog";
import moment from 'moment';
moment.locale('de-DE');

export default class Schedex extends React.Component {

  constructor() {
    super();
    this._stateId_subscribed = false;
    this.state = {
      val: "---",
      ts: moment(),
      showDialog: false
    }

    this.initSchedexData = {
      "suspended": true,
      "ontime": "08:00",
      "onoffset": 0,
      "offtime": "09:00",
      "offoffset": 0,
      "mon": false,
      "tue": false,
      "wed": false,
      "thu": false,
      "fri": false,
      "sat": false,
      "sun": false,
      "lon": 0,
      "lat": 0,
    };
    this.weekDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    this.suncalcValues = [
      "fixedTime",
      "sunrise",
      "sunriseEnd",
      "goldenHourEnd",
      "solarNoon",
      "goldenHour",
      "sunsetStart",
      "sunset",
      "dusk",
      "nauticalDusk",
      "night",
      "nadir",
      "nightEnd",
      "nauticalDawn",
      "dawn"
    ];

  };

  showDialog() {
    this.setState({ showDialog: true })
  }

  hideDialog() {
    this.setState({ showDialog: false })
  }
  submitDialog(newData) {
    console.log("schedex submit:");
    console.log(newData);
    this.setState({ showDialog: false })
    this.props.widgetData.socket.emit("setState", this.props.widgetData.stateId, JSON.stringify(newData));
  }

  render() {

    console.log("Render Schedex");

    // init
    let val = "---";
    let ts = moment();
    // read value and timestamp from props if available
    if (this.props.widgetData.states[this.props.widgetData.stateId] && this.props.widgetData.states[this.props.widgetData.stateId].received === true) {
      val = this.props.widgetData.states[this.props.widgetData.stateId].val;
      ts = this.props.widgetData.states[this.props.widgetData.stateId].ts;
    } else {
      // read from this.state
      val = this.state.val;
      ts = this.state.ts;
    }
    let schedexData = {};
    try {
      schedexData = JSON.parse(val);
    } catch (e) {
      schedexData = this.initSchedexData;
    }

    let timestamp = null;
    if (this.props.widgetData.timestamp && this.props.widgetData.timestamp === true) {
      timestamp = (
        <ListHeader>
          <span
            className="right lastupdate"
            style={{ float: "right", paddingRight: "5px" }}
          >
            {moment(ts).format("DD.MM.YY HH:mm")}
          </span>
        </ListHeader>
      );
    }

    return (
      <List id={this.props.widgetData.UUID} className="schedex">
        {/* <ListItem>{val}</ListItem> */}
        {timestamp}
        <ListItem>
        <div className="center">
              <div className="centerFab" style={{ margin: "auto" }}>
                <Fab
                  mini
                  className="fab--mini"
                  onClick={this.showDialog.bind(this)}>
                  <i className="mdi-icon square-edit-outline fab--mini--icon" />
                </Fab>
              </div>
            </div>
        </ListItem>
        {/* <SchedexDialog
          className={"schedexDialog"}
          showDialog={this.state.showDialog}
          hideDialog={this.hideDialog.bind(this)}
          widgetData={this.props.widgetData}
          submitDialog={this.submitDialog.bind(this)}
          schedexData={schedexData}
          weekDays={this.weekDays}
          suncalcValues={this.suncalcValues}
        /> */}
      </List>
    );
  }

}

