import React from "react";
import { Input, List, ListItem, ListHeader } from "react-onsenui";
import PinInput from "../utils/PinInput";


import moment from "moment";
moment.locale("de-DE");

export default class TextInput extends React.Component {
  constructor() {
    super();
    this.state = {
      val: false,
      ts: moment(),
      showSubmit: "none",
      inputWidth: "99%",
      showPinDialog: false
    };
    this.val = "";
    this.waitForData = false;
    this.onChangePinInput = this.onChangePinInput.bind(this);
    this.onCancelPinInput = this.onCancelPinInput.bind(this);
  }


  sendValue(e) {
    this.props.widgetData.socket.emit("setState", this.props.widgetData.stateId, this.val);
    // State nachführen
    this.setState({
      showSubmit: "none",
      inputWidth: "99%",
      ts: moment(),
    });
    this.waitForData = true;
    // reset wait for data after 500ms
    setTimeout(() => { this.waitForData = false; }, 500)
    this.hidePinDialog();
  }

  sendValueByEnter(e) {
    // console.log("keypress textinput");
    // console.log(e.which);
    if (e.which == 13) {
      e.preventDefault();
      this.props.widgetData.socket.emit("setState", this.props.widgetData.stateId, this.val);
      // State nachführen
      this.setState({
        showSubmit: "none",
        inputWidth: "99%",
        ts: moment(),
      });
      console.log("Textinput hide submit");
      this.waitForData = true;
      // reset wait for data after 500ms
      setTimeout(() => { this.waitForData = false; }, 500)
      this.hidePinDialog();
    }
  }

  showSubmit(e) {
    this.showPinDialog();
    this.val = e.target.value;
    this.setState({
      showSubmit: "inline-block",
      inputWidth: "80%",
    });
  }

  showPinDialog() {
    this.setState({
      showPinDialog: true
    });
  }

  hidePinDialog() {
    this.setState({
      showPinDialog: false
    });
  }

  onCancelPinInput() {
    this.setState({
      showPinDialog: false
    });
  }

  onChangePinInput(e) {
    console.log("onChangePinInput");
    console.log(e.target.value);
    if (e.target.value === "1122") {
      this.hidePinDialog();
    }
  }

  render() {

    let ts = moment();
    let val;

    if (this.state.showSubmit === "none" && this.waitForData === false) {
      // init
      console.log("init textinput")

      val = "";

      if (
        this.props.widgetData.states[this.props.widgetData.stateId] &&
        this.props.widgetData.states[this.props.widgetData.stateId].received === true
      ) {
        val = this.props.widgetData.states[this.props.widgetData.stateId].val;
        ts = this.props.widgetData.states[this.props.widgetData.stateId].ts;
      } else {
        // read from this.state
        val = this.state.val;
        ts = this.state.ts;
      }

      this.val = val || "";

    }

    ts = ts || moment();

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
      <React.Fragment>
        <PinInput
          show={this.state.showPinDialog}
          onCancel={this.onCancelPinInput}
          onChange={this.onChangePinInput}
          onKeypress={this.onKeypressPinInput}
        />
        <List id={this.props.widgetData.UUID}>
          {timestamp}
          <ListItem>
            <div className="center textinputwidget">
              <Input
                style={{ width: this.state.inputWidth }}
                value={this.val.toString()}
                disabled={!this.props.widgetData.connected}
                onChange={this.showSubmit.bind(this)}
                onKeyPress={this.sendValueByEnter.bind(this)}
              ></Input>
              <span
                className="submitbutton"
                style={{ display: this.state.showSubmit }}
                onClick={this.sendValue.bind(this)}
              >
                <span className="pageIcon textinputSendIcon mdi-icon send-circle-outline"></span>
              </span>
            </div>
          </ListItem>
        </List>


      </React.Fragment>
    );
  }
}
