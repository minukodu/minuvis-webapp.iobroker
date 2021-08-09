import React from "react";
import {
  Row,
  Col,
  List,
  ListItem,
  Button,
  Input,
  Dialog,
  Checkbox,
  Select,
} from "react-onsenui";
import SunCalc from "suncalc2"
import moment from "moment";
moment.locale("de-DE");

export default class SchedexDialog extends React.Component {
  constructor() {
    super();
    this.newSchedexData = {
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
    this.suncalcValueOnTimeTime = "00:00";
    this.suncalcValueOffTimeTime = "00:00";
  }

  sendValue() {
    //console.log(this.newSchedexData)
    this.props.submitDialog(this.newSchedexData);
  }

  onChangeSuspended(event) {
    this.newSchedexData.suspended = !event.target.checked;
  }
  onChangeWeekday(event, weekday) {
    this.newSchedexData[weekday] = event;
  }
  onChangeTimeInput(event, target) {
    this.newSchedexData[target] = event.target.value;
  }
  onChangeOffsetInput(event, target) {
    this.newSchedexData[target] = parseInt(event.target.value, 10);
  }
  onChangeSunCalcInput(event, target) {
    if (event.target.value === "fixedTime" && target === "ontime") {
      this.newSchedexData["ontime"] = this.suncalcValueOnTimeTime;
    } else if (event.target.value === "fixedTime" && target === "offtime") {
      this.newSchedexData["offtime"] = this.suncalcValueOffTimeTime;
    } else {
      this.newSchedexData[target] = event.target.value;
    }
  }

  render() {
    //console.log("Render SchedexDialog");
    //console.log(this.props);

    let cbWeekDays = [];
    let weekDayNames = this.props.widgetData.weekdayNames.split(",");

    this.newSchedexData = this.props.schedexData;

    for (let w in this.props.weekDays) {
      let cbWeekDay = (
        <ListItem key={"li-" + w}>
          <div className="left">
            <Checkbox
              //onChange={this.onChangeWeekday(event, this.props.weekDays[w]).bind(this)}
              onChange={() => this.onChangeWeekday(event.target.checked, this.props.weekDays[w])}
              checked={this.props.schedexData[this.props.weekDays[w]]}
              disabled={this.props.widgetData.readOnly}
              modifier="material"
            />
          </div>
          <div className="center">{weekDayNames[w] || "??"}</div>
        </ListItem>
      );
      cbWeekDays.push(cbWeekDay);
    }

    // generate suncalc options
    let suncalcOptions = [];
    for (let s in this.props.suncalcValues) {
      suncalcOptions.push(
        <option key={"o-" + s} value={this.props.suncalcValues[s]}>{this.props.suncalcValues[s]}</option>
      )
    }
    // set suncalc value to fixedTime if time is selected
    let now = new Date();
    let suncalcTimes = SunCalc.getTimes(now, this.props.schedexData.lat, this.props.schedexData.lon);
    //console.log("suncalcTimes")
    //console.log(suncalcTimes);

    let suncalcValueOnTime = this.props.schedexData.ontime;
    let suncalcValueOnTimeTime = this.props.schedexData.ontime;

    if (this.props.schedexData.ontime.indexOf(":") != -1) {
      suncalcValueOnTime = this.props.suncalcValues[0];
    } else {
      suncalcValueOnTimeTime = moment(suncalcTimes[suncalcValueOnTime]).format("HH:mm");
    }

    let suncalcValueOffTime = this.props.schedexData.offtime;
    let suncalcValueOffTimeTime = this.props.schedexData.offtime;
    if (this.props.schedexData.offtime.indexOf(":") != -1) {
      suncalcValueOffTime = this.props.suncalcValues[0];
    } else {
      suncalcValueOffTimeTime = moment(suncalcTimes[suncalcValueOffTime]).format("HH:mm");
    }

    //save this values for chnghe to "fixedTime"
    this.suncalcValueOnTimeTime = suncalcValueOnTimeTime;
    this.suncalcValueOffTimeTime = suncalcValueOffTimeTime;


    return (
      <Dialog
        className={"schedexDialog"}
        isOpen={this.props.showDialog}
        onCancel={this.props.hideDialog}
        isCancelable={true}
      >
        <div className="dialog-content">
          <Row>
            <Col>
              <List>
                <ListItem>
                  <div className="left">
                    <Checkbox
                      onChange={() => this.onChangeSuspended(event)}
                      checked={!this.props.schedexData.suspended}
                      disabled={this.props.widgetData.readOnly}
                      modifier="material"
                    />
                  </div>
                  <div className="center">{this.props.widgetData.activateLabel}</div>
                </ListItem>
                <ListItem className="time-input">
                  <span className="icon mdi-icon clock-start"></span>
                  <Input
                    onChange={() => this.onChangeTimeInput(event, "ontime")}
                    disable-auto-styling
                    type={"time"}
                    value={suncalcValueOnTimeTime}
                    disabled={this.props.widgetData.readOnly}
                  ></Input>
                </ListItem>
                <ListItem>
                  <Select
                    onChange={() => this.onChangeSunCalcInput(event, "ontime")}
                    disabled={this.props.widgetData.readOnly}
                    value={suncalcValueOnTime}
                    modifier="material">
                    {suncalcOptions}
                  </Select>
                </ListItem>
                <ListItem className="offset-input">
                  <div className="left">
                    <span className="entityIcon">&harr;</span>
                  </div>
                  <div className="center">
                    <Input
                      onChange={() => this.onChangeOffsetInput(event, "onoffset")}
                      disable-auto-styling
                      value={this.props.schedexData.onoffset.toString()}
                      type="number"
                      disabled={this.props.widgetData.readOnly}
                    ></Input>
                  </div>
                  <div className="right">
                    <span className="offsetUnit">min</span>
                  </div>
                </ListItem>
                <ListItem className="time-input">
                  <span className="icon mdi-icon clock-end"></span>
                  <Input
                    onChange={() => this.onChangeTimeInput(event, "offtime")}
                    disable-auto-styling
                    type={"time"}
                    value={suncalcValueOffTimeTime}
                    disabled={this.props.widgetData.readOnly}
                  ></Input>
                </ListItem>
                <ListItem>
                  <Select
                    onChange={() => this.onChangeSunCalcInput(event, "offtime")}
                    disabled={this.props.widgetData.readOnly}
                    modifier="material"
                    value={suncalcValueOffTime}>
                    {suncalcOptions}
                  </Select>
                </ListItem>
                <ListItem className="offset-input">
                  <div className="left">
                    <span className="entityIcon">&harr;</span>
                  </div>
                  <div className="center">
                    <Input
                      onChange={() => this.onChangeOffsetInput(event, "offoffset")}
                      disable-auto-styling
                      value={this.props.schedexData.offoffset.toString()}
                      type="number"
                      disabled={this.props.widgetData.readOnly}
                    ></Input>
                  </div>
                  <div className="right">
                    <span className="offsetUnit">min</span>
                  </div>
                </ListItem>

              </List>
            </Col>
            <Col>
              <List>
                {cbWeekDays}
              </List>
            </Col>
          </Row>
          <div className={this.props.widgetData.readOnly ? "dialog-footer noOkButton" : "dialog-footer withOkButton"}>
            <Button
              className="alert-dialog-button cancelButton"
              onClick={this.props.hideDialog}
            >
              <span className={"valueSwitcherIcon mfd-icon control_cancel"} />
            </Button>
            <Button
              className="alert-dialog-button okButton"
              onClick={this.sendValue.bind(this)}
            >
              <span className={"valueSwitcherIcon mfd-icon control_ok"} />
            </Button>
          </div>
        </div>

      </Dialog >
    );
  }
}
