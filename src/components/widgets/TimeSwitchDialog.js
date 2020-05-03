import React from "react";
import {
  List,
  ListHeader,
  ListItem,
  Button,
  Icon,
  Input,
  Dialog,
  Radio,
  Checkbox,
} from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

export default class TimeSwitchDialog extends React.Component {
  constructor() {
    super();
    this.trigger = null;
    this.newTrigger = null;
  }

  sortNumber(a, b) {
    return a - b;
  }

  sendValue(e) {
    return;
  }

  handleWeekdaysChange(weekdayNr, e) {
    console.log(weekdayNr);
    console.log(e.target.checked);
    if (e.target.checked) {
      // add weekday
      this.newTrigger.weekdays = this.newTrigger.weekdays.concat([weekdayNr]);
      this.newTrigger.weekdays = this.newTrigger.weekdays.filter(
        (item, pos) => this.newTrigger.weekdays.indexOf(item) === pos
      );
    } else {
      // remove weekday
      let index = this.newTrigger.weekdays.indexOf(weekdayNr);
      if (index !== -1) this.newTrigger.weekdays.splice(index, 1);
    }
    // sort by number
    this.newTrigger.weekdays.sort(this.sortNumber);
    console.log(this.newTrigger);
  }

  handleTimeChange(e) {
    if (e.type === "input") {
      console.log(e.target.value);
      let arrTime = e.target.value.split(":");
      // console.log(arrTime);
      this.newTrigger.hour = parseInt(arrTime[0], 10);
      this.newTrigger.minute = parseInt(arrTime[1], 10);
      console.log(this.newTrigger);
    }
  }

  handleValueChange(value, e) {
    console.log(value);
    console.log(e.target.checked);
    if (value == "onValue") {
      this.newTrigger.action.booleanValue = true;
    } else {
      this.newTrigger.action.booleanValue = false;
    }
    console.log(this.newTrigger);
  }

  submitDialog( command ) {
    //console.log(this.newTrigger)
    this.props.submitDialog( command, this.newTrigger);
  }

  render() {
    console.log("Render TimeSwitchDialog");
    console.log(this.props.trigger);
    // Time
    let time = "00:00";
    // Weekday
    const allWeekdays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const allWeekdayNr = [1, 2, 3, 4, 5, 6, 0];
    let checkboxes = [];
    // action
    let onValueChecked = true;
    let offValueChecked = false;

    if (this.props.trigger) {
      // update internal trigger object
      this.trigger = this.props.trigger;
      this.newTrigger = this.trigger;

      // time
      time =
        this.trigger.hour.toString(10).padStart(2, "0") +
        ":" +
        this.trigger.minute.toString(10).padStart(2, "0");
      // Weekdays
      let counter = 0;
      let checked = false;
      for (let weekday of allWeekdays) {
        if (this.trigger.weekdays.indexOf(allWeekdayNr[counter], 0) > -1) {
          checked = true;
        }
        checkboxes.push(
          <ListItem key={counter}>
            <div className="left">
              <Checkbox
                checked={checked}
                onChange={this.handleWeekdaysChange.bind(
                  this,
                  allWeekdayNr[counter]
                )}
              ></Checkbox>
            </div>
            <div className="center">{weekday}</div>
          </ListItem>
        );
        counter++;
        checked = false;
      }
      // action
      onValueChecked = this.trigger.action.booleanValue;
      offValueChecked = !this.trigger.action.booleanValue;
    }
    // console.log(weekdaysValue);

    return (
      <Dialog
        className={"timeswitchDialog"}
        isOpen={this.props.showDialog}
        onCancel={this.props.hideDialog}
      >
        <List>
          <ListHeader>{"Select start-time"}</ListHeader>
          <ListItem>
            <div className="center">
              <Input
                disable-auto-styling
                onChange={this.handleTimeChange.bind(this)}
                type={"time"}
                value={time}
              />
            </div>
          </ListItem>
          <ListHeader>{"Select weekday(s)"}</ListHeader>
          {checkboxes}
          <ListHeader>{"Select value"}</ListHeader>
          <ListItem>
            <div className="center">
              <Radio
                modifier="material"
                checked={onValueChecked}
                onChange={this.handleValueChange.bind(this, "onValue")}
                inputId={"R1" + this.props.UUID}
                name={"valueRadio"}
              />
              <label
                htmlFor={"R1" + this.props.UUID}
                style={{ marginLeft: "1em" }}
              >
                {this.props.onValueText}
              </label>
            </div>
            <div className="right">
              <Radio
                modifier="material"
                checked={offValueChecked}
                onChange={this.handleValueChange.bind(this, "offValue")}
                inputId={"R2" + this.props.UUID}
                name={"valueRadio"}
              />
              <label
                htmlFor={"R2" + this.props.UUID}
                style={{ marginLeft: "0.7em" }}
              >
                {this.props.offValueText}
              </label>
            </div>
          </ListItem>
          <ListItem>
            <div className="left">
              <Button onClick={this.submitDialog.bind(this, "cancel")} modifier={"quiet"}>
                <Icon icon="md-close" class="ListItem__icon"></Icon>
                {"  cancel"}
              </Button>
            </div>
            <div className="center">
              <Button onClick={this.submitDialog.bind(this, "delete")} modifier={"outline"}>
                <Icon icon="md-delete" class="ListItem__icon"></Icon>
                {"  delete"}
              </Button>
            </div>
            <div className="right">
              <Button onClick={this.submitDialog.bind(this, "submit")} modifier={"cta"}>
                <Icon icon="md-check" class="ListItem__icon"></Icon>
                {"  ok"}
              </Button>
            </div>
          </ListItem>
        </List>
      </Dialog>
    );
  }
}
