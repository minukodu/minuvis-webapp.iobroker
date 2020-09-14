import React from 'react';
import Title from "./Title";
import numeral from "numeral";
import moment from 'moment';
moment.locale('de-DE');

export default class Output extends React.Component {

  constructor() {
    super();
    this._stateId_subscribed = false;
    this.state = {
      val: "---",
      ts: moment()
    };
  }

  componentWillMount() {

    // console.dir(this.props.states);
    // console.log(typeof this.props.states[this.props.stateId]);

    if (typeof this.props.states[this.props.stateId] === "undefined") {
      if (this._stateId_subscribed === false) {
        // Subscribe state
        // console.log("Subscribe " + this.props.stateId);
        this.props.socket.emit('subscribe', this.props.stateId);
        this._stateId_subscribed = true;
        // Read state
        this.props.socket.emit('getStates', [this.props.stateId], function (err, states) {
          // console.log("Received States");
          // console.dir(states);
          // eintragen
          this.setState(
            {
              val: states[this.props.stateId].val,
              ts: states[this.props.stateId].ts
            }
          );
        }.bind(this));

      }
    } else {
      // console.log("Read " + this.props.stateId);
      this.setState(
        {
          val: this.props.states[this.props.stateId].val,
          ts: this.props.states[this.props.stateId].ts
        }
      );
    }

    // console.log("Switch connected:");
    // console.log(this.props);
    // console.log(this.props.connected);
    // console.log(!this.props.connected);
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
  }

  render() {

    // console.debug("Render Output");

    // init
    let val = "---";
    let ts = moment();
    // read value and timestamp from props if available
    if (typeof this.props.states[this.props.stateId] !== "undefined" && this.props.states[this.props.stateId]) {
      val = this.props.states[this.props.stateId].val;
      ts = this.props.states[this.props.stateId].ts;
    } else {
      // read from this.state
      val = this.state.val;
      ts = this.state.ts;
    }
    let fontColor = this.props.color;
    let formatedValue = val;

    // check if value is numeric
    if (this.isNumeric(val)) {
      // Format Value
      // console.log("Output-Format: " + this.props.format)
      formatedValue = numeral(val).format(this.props.format);

      // calculate Color

      if (val <= this.props.minValue) {
        fontColor = this.props.minColor;
      }
      if (val >= this.props.maxValue) {
        fontColor = this.props.maxColor;
      }
    }

    let header =
      <ons-list-header>
        <span className="right lastupdate" style={{ float: 'right', paddingRight: '5px' }}>{moment(ts).format('LLL')}</span>
      </ons-list-header>

    let fontSize = "100%";

    if (this.props.compactMode === true){
      header = null;
      fontSize = "80%";
    }

    return (
      <ons-col id={this.props.UUID}>
        <ons-list>
          {header}
          <ons-list-item>
            <Title
              title={this.props.title}
              titleIcon={this.props.titleIcon}
              titleIconFamily={this.props.titleIconFamily}
              compactMode={this.props.compactMode}
            />
            <div className="right" style={{ fontSize }}>
              <output style={{ color: fontColor }} data-iobroker={this.props.stateId}>{formatedValue}</output>&nbsp;{this.props.unit}
            </div>
          </ons-list-item>
        </ons-list>
      </ons-col>
    );
  }

}

