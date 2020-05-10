import React from 'react';
import { Range } from 'react-onsenui';
import { Input } from 'react-onsenui';
import Title from "./Title";
import moment from 'moment';
moment.locale('de-DE');

export default class MySlider extends React.Component {

  constructor() {
    super();
    this._stateId_subscribed = false;
    this.state = {
      val: 0,
      ts: moment()
    };
  }

  sendValue(e) {

    let valueToSend = e.target.value;
    if ( this.props.stateIdType === "number") {
      valueToSend = parseInt(e.target.value, 10);
    } 

    this.props.socket.emit('setState', this.props.stateId,valueToSend);
    // State nachführen
    this.setState(
      {
        val: e.target.value,
        ts: moment()
      }
    );
  }

  componentWillMount() {

    // console.log("componentWillMount Switch");
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

  render() {
    // init
    let val = 0;
    let ts = moment();
    // read value and timestamp from props if available
    if (this.props.states[this.props.stateId] && typeof this.props.states[this.props.stateId] !== "undefined") {
      val = this.props.states[this.props.stateId].val || 0;
      ts = this.props.states[this.props.stateId].ts || moment();
    } else {
      // read from this.state
      val = this.state.val || 0;
      ts = this.state.ts;
    }

    let maxIcon = this.props.maxIcon || "text_max";
    let minIcon = this.props.minIcon || "text_min";

    let title =           
    <ons-list-item>
    <Title
        title={this.props.title}
        titleIcon={this.props.titleIcon}
      />
      <div className="right">
        <Input
          disable-auto-styling
          disabled={!this.props.connected}
          onChange={this.sendValue.bind(this)}
          type='number'
          placeholder=''
          value={val.toString()}
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
        >
        </Input>{this.props.unit}
      </div>
    </ons-list-item>

    if (this.props.title == "NONE") {
      title = null;
    }

    return (
      <ons-col id={this.props.UUID}>
        <ons-list>
          <ons-list-header>
            <span className="right lastupdate" style={{ float: 'right', paddingRight: '5px' }}>{moment(ts).format('LLL')}</span>
          </ons-list-header>
            {title}
          <ons-list-item>
            <ons-col style={{ minWidth: 0 + '%', borderLeft: 'none', width: 40 + 'px', textAlign: 'center', lineHeight: 31 + 'px' }}>
              <span className={"sliderIcon min mfd-icon " + minIcon}></span>
            </ons-col>
            <ons-col style={{ minWidth: 80 + '%', borderLeft: 'none' }}>
              <Range
                disable-auto-styling
                disabled={!this.props.connected}
                onChange={this.sendValue.bind(this)}
                value={parseInt(val, 10)}
                min={this.props.min}
                max={this.props.max}
                step={this.props.step}
                style={{ width: 100 + '%' }}
              >
              </Range>
            </ons-col>
            <ons-col style={{ minWidth: 0 + '%', borderLeft: 'none', width: 40 + 'px', textAlign: 'center', lineHeight: 31 + 'px' }}>
              <span className={"sliderIcon max mfd-icon " + maxIcon}></span>
            </ons-col>
          </ons-list-item>
        </ons-list>
      </ons-col>
    );
  };
}
