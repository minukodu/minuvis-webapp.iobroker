import React from "react";
import { Col, List, ListHeader, ListItem, Button, Icon } from "react-onsenui";
import Title from "./Title";
import TimeSwitchDialog from "./TimeSwitchDialog";

import moment from "moment";
moment.locale("de-DE");

export default class TimeSwitch extends React.Component {
  constructor(props) {
    super();
    this._stateId_subscribed = false;
    this.intervalSubscribe = null;
    this.triggerForDialog = null;

    this.triggerSkeleton = {
      type: props.triggers.type,
      hour: 12,
      minute: 0,
      weekdays: [0, 1, 2, 3, 4, 5, 6],
      id: "0",
      action: {
        type: props.action.type,
        name: "On"
      },
    };

    this.state = {
      val: "",
      ts: moment(),
      showDialog: false,
    };
  }

  addTrigger(e) {
    //console.log("add new trigger with id: " + newTrigger.id);
    try {
      let newVal = JSON.parse(this.props.states[this.props.stateId].val);
      //console.log(newVal);
      // clone trigger with JSON
      let newTrigger = {};
      if (newVal.triggers.length == 0) {
        newTrigger = this.triggerSkeleton;
      } else {
        let newTriggerString = JSON.stringify(
          newVal.triggers[newVal.triggers.length - 1]
        );
        newTrigger = JSON.parse(newTriggerString);
      }
      newTrigger.id = Date.now();
      newVal.triggers.push(newTrigger);
      console.log("add new trigger with id: " + newTrigger.id);
      this.sendValue(JSON.stringify(newVal));
    } catch (e) {
      console.error(e);
    }
  }

  editTrigger(triggerId) {
    console.log("EDIT triggerId: " + triggerId);
    let editTrigger = {};
    try {
      let objVal = JSON.parse(this.props.states[this.props.stateId].val);
      objVal.triggers.forEach(function (trigger, index) {
        if (trigger.id == triggerId) {
          editTrigger = objVal.triggers[index];
        }
      });
      this.triggerForDialog = editTrigger;
      this.setState({ showDialog: true });
      console.log(this.triggerForDialog);
    } catch (error) {
      alert(error);
    }
  }

  submitDialog(command, newTrigger) {
    this.setState({ showDialog: false });

    console.log(command);
    console.log(newTrigger);

    switch (command) {
      case "submit":
        console.log("submit trigger with id: " + newTrigger.id);
        try {
          let newVal = JSON.parse(this.props.states[this.props.stateId].val);
          //console.log(newVal);
          newVal.triggers.forEach(function (trigger, index) {
            if (trigger.id == newTrigger.id) {
              newVal.triggers[index] = newTrigger;
              console.log(newVal);
            }
          });
          this.sendValue(JSON.stringify(newVal));
        } catch (e) {
          console.error(e);
        }
        break;
      case "delete":
        console.log("delete trigger with id: " + newTrigger.id);
        try {
          let newVal = JSON.parse(this.props.states[this.props.stateId].val);
          //console.log(newVal);
          if (newVal.triggers.length > 1) {
            newVal.triggers.forEach(function (trigger, index) {
              if (trigger.id == newTrigger.id) {
                newVal.triggers.splice(index, 1);
                console.log(newVal);
              }
            });
          } else {
            alert("cannot delete last trigger");
          }
          this.sendValue(JSON.stringify(newVal));
        } catch (e) {
          console.error(e);
        }
        break;
      default:
        return;
    }
  }

  sendValue(newVal) {
    this.props.socket.emit("setState", this.props.stateId, newVal);
    console.log("TimeSwitch SEND NewValue:");
    console.log(this.props.stateId);
    //console.log(newVal);
    // State nachführen
    this.setState({
      val: newVal,
      ts: moment(),
    });
  }

  componentWillUnMount() {
    console.log("WillUnMount TimeSwitch");
    clearInterval(this.intervalSubscribe);
  }

  componentWillMount() {
    console.log("WillMount TimeSwitch");
    this.intervalSubscribe = setInterval(
      this.subscribeAndSetState.bind(this),
      2000
    );
  }

  subscribeAndSetState() {
    // console.dir(this.props.states);
    console.log("subscribeAndSetState TimeSwitch");
    if (this._stateId_subscribed !== true) {
      // Subscribe state
      console.log("TimeSwitch Subscribe " + this.props.stateId);
      this.props.socket.emit("subscribe", this.props.stateId);
      this._stateId_subscribed = true;
      clearInterval(this.intervalSubscribe);
      // Read state
      this.props.socket.emit(
        "getStates",
        [this.props.stateId],
        function (err, states) {
          console.log("timeSwitch Received State");
          console.dir(states);
          // eintragen
          this.setState({
            val: states[this.props.stateId].val,
            ts: states[this.props.stateId].ts,
          });
          // now set idsOfStatesToSet in onAction ans offAction
          let objVal = JSON.parse(states[this.props.stateId].val);
          objVal.onAction.idsOfStatesToSet = this.props.action.idsOfStatesToSet;
          objVal.offAction.idsOfStatesToSet = this.props.action.idsOfStatesToSet;
          //set title
          objVal.name = this.props.title;
          console.log("objVal");
          console.log(objVal);
          this.sendValue(JSON.stringify(objVal));
        }.bind(this)
      );
    }
  }

  showWeekdays(arrWeekdays) {
    //console.log(arrWeekdays);
    const allWeekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    let arrOutput = [];
    for (let weekdayNr of arrWeekdays) {
      //console.log(weekdayNr);
      arrOutput.push(
        <span key={weekdayNr} className="notification notification-quiet">
          {allWeekdays[weekdayNr]}
        </span>
      );
    }
    //console.log(arrOutput)
    return arrOutput;
  }

  render() {
    console.debug("Render TimeSwitch");
    // console.log("this.triggerSkeleton");
    // console.log(this.triggerSkeleton);

    // init
    let val = "";
    let ts = moment();
    // read value and timestamp from props if available
    if (typeof this.props.states[this.props.stateId] !== "undefined") {
      val = JSON.parse(this.props.states[this.props.stateId].val);
      ts = this.props.states[this.props.stateId].ts;
    } else {
      // read from this.state
      val = JSON.parse(this.state.val);
      ts = this.state.ts;
    }

    let title = [];
    if (this.props.title !== "NONE") {
      title.push(
        <ListItem>
          <Title title={this.props.title} titleIcon={this.props.titleIcon} />
          {/* <div className="right">
            {"number of triggers:"}
            {val ? val.triggers.length : "no triggers"}
          </div> */}
        </ListItem>
      );
    }


    console.log("show triggers");
    console.log(val);
    

    let triggerList = [];

    let triggerCounter = 1;
    let plusButtonClass = "vishidden";
    if (val && val.triggers) {
      if (val.triggers.length == 0) {
        triggerList.push(
          <ListItem key={performance.now()}>
            <div className="left">
              <Button
                onClick={this.addTrigger.bind(this)}
                style={{ marginLeft: "10px" }}
              >
                <Icon icon="md-plus"></Icon>
              </Button>
            </div>
          </ListItem>
        );
      }

      for (let trigger of val.triggers) {
        //console.log(trigger);
        // console.log(triggerCounter);
        // console.log(val.triggers.length);
        console.log("trigger.id: " + trigger.id);
        if (triggerCounter === val.triggers.length) {
          plusButtonClass = "";
        }
        triggerList.push(
          <ListItem key={trigger.id}>
            <div className="left">
              <Button onClick={this.editTrigger.bind(this, trigger.id)}>
                <Icon icon="md-edit"></Icon>
              </Button>
              <Button
                onClick={this.addTrigger.bind(this)}
                className={plusButtonClass}
                style={{ marginLeft: "10px", marginRight: "10px" }}
              >
                <Icon icon="md-plus"></Icon>
              </Button>
            </div>
            <div className="center">
              {trigger.action.booleanValue
                ? trigger.action.onText
                : trigger.action.offText}
            </div>
            <div className="right">
              <div className="timeSwitchWeekdays">
                {this.showWeekdays(trigger.weekdays)}
              </div>
              <div className="timeSwitchTime">
                {trigger.hour.toString(10).padStart(2, "0") +
                  ":" +
                  trigger.minute.toString(10).padStart(2, "0")}
              </div>
            </div>
          </ListItem>
        );
        triggerCounter++;
      }
    }

    return (
      <Col key={performance.now()} id={this.props.UUID}>
        <List>
          <ListHeader>
            <span
              className="right lastupdate"
              style={{ float: "right", paddingRight: "5px" }}
            >
              {moment(ts).format("LLL")}
            </span>
          </ListHeader>
          {title}
          {triggerList}
        </List>
        <TimeSwitchDialog
          className={"timeswitchDialog"}
          showDialog={this.state.showDialog}
          submitDialog={this.submitDialog.bind(this)}
          trigger={this.triggerForDialog}
          onValueText={this.props.action.onText}
          offValueText={this.props.action.offText}
        />
      </Col>
    );
  }
}
