import React from 'react';
import {Col, List, ListItem, ListHeader} from 'react-onsenui';
import {Range, getTrackBackground} from 'react-range';
import moment from 'moment';
import {fixOutputFloat} from '../utils/Utils';

moment.locale ('de-DE');

export default class MyRange extends React.Component {
  constructor () {
    super ();
    this.state = {
      val: 0,
      ts: moment (),
    };
    this.ts = moment ();
    this.val = 0;
    this.changing = false;
    this.decimals = 0;
  }

  stringToBoolean (val) {
    if (val === null) {
      return false;
    }
    if (typeof val === 'number') {
      return Boolean (val);
    }
    if (typeof val !== 'string') {
      return val;
    }
    switch (val.toLowerCase ().trim ()) {
      case 'on':
      case 'true':
      case 'yes':
      case '1':
        return true;
      case 'off':
      case 'false':
      case 'no':
      case '0':
      case null:
        return false;
      default:
        return Boolean (val);
    }
  }

  RangeOnChange (values) {
    // console.log("MyRange OnChannge:");
    // console.log(values);
    let valueToSend = values[0];
    if (this.props.widgetData.stateIdType === 'number') {
      valueToSend = parseFloat (values[0]);
    }
    this.props.widgetData.socket.emit (
      'setState',
      this.props.widgetData.stateId,
      valueToSend
    );

    //this.props.widgetData.socket.emit('setState', this.props.widgetData.stateId, valueToSend);
    console.debug (this.props.widgetData.stateId + ' :: ' + values[0]);
    // State nachführen
    this.setState ({
      val: values[0],
      ts: moment (),
    });
    this.val = values[0];
  }

  sendValue (e) {
    let valueToSend = e.target.value;
    if (this.props.widgetData.stateIdType === 'number') {
      valueToSend = parseFloat (e.target.value);
    }

    this.props.widgetData.socket.emit (
      'setState',
      this.props.widgetData.stateId,
      valueToSend
    );
    // State nachführen
    this.setState ({
      val: e.target.value,
      ts: moment (),
    });
  }

  render () {
    console.log ('render myRange');
    console.log (this.props);
    // console.log("this.val: " + this.val);
    // console.log("this.ts: " + this.ts);
    // console.log("this.changing: " + this.changing);
    // read value and timestamp from props if available
    if (
      this.props.widgetData.states[this.props.widgetData.stateId] &&
      this.props.widgetData.states[this.props.widgetData.stateId].received ===
        true &&
      this.changing === false
    ) {
      this.val =
        this.props.widgetData.states[this.props.widgetData.stateId].val || 0;
      this.ts = this.props.widgetData.states[this.props.widgetData.stateId].ts;
    } else {
      // read from this.state
      this.val = this.val || 0;
      this.ts = this.state.ts;
    }

    // check boundaries
    if (this.val < this.props.widgetData.min) {
      this.val = this.props.widgetData.min;
    }
    if (this.val > this.props.widgetData.max) {
      this.val = this.props.widgetData.max;
    }

    // console.log("this.val: " + this.val);
    // console.log("this.ts: " + this.ts);

    // decimals
    this.decimals = this.props.widgetData.decimals;
    if (this.decimals < 0) {
      this.decimals = 0;
    }
    if (this.decimals > 5) {
      this.decimals = 5;
    }

    let maxIcon = this.props.widgetData.maxIcon || 'text_max';
    let minIcon = this.props.widgetData.minIcon || 'text_min';

    let displayIconMax = 'block';
    if (this.props.widgetData.maxIconFamily === 'noIcon') {
      displayIconMax = 'none';
    }
    let displayIconMin = 'block';
    if (this.props.widgetData.minIconFamily === 'noIcon') {
      displayIconMin = 'none';
    }

    let timestamp = null;
    if (
      this.props.widgetData.timestamp &&
      this.props.widgetData.timestamp === true
    ) {
      timestamp = (
        <ListHeader>
          <span
            className="right lastupdate"
            style={{float: 'right', paddingRight: '5px'}}
          >
            {moment (this.ts).format ('DD.MM.YY HH.mm')}
          </span>
        </ListHeader>
      );
    }

    // disbaled from connected or disabled-state
    let disabled = !this.props.widgetData.connected;
    if (
      this.props.widgetData.stateIdDisabled &&
      this.props.widgetData.stateIdDisabled != 'undefined' &&
      this.props.widgetData.states[this.props.widgetData.stateIdDisabled] &&
      this.props.widgetData.states[this.props.widgetData.stateIdDisabled]
        .received === true
    ) {
      disabled =
        disabled ||
        this.stringToBoolean (
          this.props.widgetData.states[this.props.widgetData.stateIdDisabled]
            .val
        );
    }
    //console.log("MyRange disabled: " + disabled);

    // display from invisible-state
    let display = true;
    if (
      this.props.widgetData.stateIdInvisible &&
      this.props.widgetData.stateIdInvisible != 'undefined' &&
      this.props.widgetData.states[this.props.widgetData.stateIdInvisible] &&
      this.props.widgetData.states[this.props.widgetData.stateIdInvisible]
        .received === true
    ) {
      display = !this.stringToBoolean (
        this.props.widgetData.states[this.props.widgetData.stateIdInvisible].val
      );
    }

    return (
      <List
        id={this.props.widgetData.UUID}
        class={'sliderWidget'}
        style={{display: display ? 'block' : 'none'}}
      >
        {timestamp}
        <ListItem style={{padding: 0}}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              flexDirection: 'row',
              flexWrap: 'nowrap',
            }}
          >
            <Col
              class={'sliderIconMin'}
              style={{
                display: displayIconMin,
                flexBasis: '50px',
                minWidth: '50px',
              }}
            >
              <span
                className={
                  'sliderIcon min  ' +
                    this.props.widgetData.minIconFamily +
                    ' ' +
                    minIcon
                }
              />
            </Col>
            <Col
              style={{
                borderLeft: 'none',
                flexBasis: 'auto',
                flexGrow: 1,
                alignSelf: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Range
                  disabled={disabled}
                  values={[this.val]}
                  step={this.props.widgetData.step}
                  min={this.props.widgetData.min}
                  max={this.props.widgetData.max}
                  rtl={false}
                  onChange={this.RangeOnChange.bind (this)}
                  renderTrack={({props, children}) => (
                    <div style={{width: '95%'}}>
                      <output
                        style={{
                          height: '10px',
                          marginTop: '-20px',
                          display: 'block',
                          textAlign: 'center',
                        }}
                        id="output"
                      >
                        {`${fixOutputFloat (this.val, this.decimals)} ${this.props.widgetData.unit}`}
                      </output>
                      <div
                        style={{
                          ...props.style,
                          height: '36px',
                          display: 'flex',
                          width: '100%',
                        }}
                      >
                        <div
                          ref={props.ref}
                          style={{
                            height: '2px',
                            width: '100%',
                            borderRadius: '1px',
                            background: getTrackBackground ({
                              values: [this.val],
                              colors: ['#00828b', '#ccc'],
                              min: this.props.widgetData.min,
                              max: this.props.widgetData.max,
                              rtl: false,
                            }),
                            alignSelf: 'center',
                          }}
                        >
                          {children}
                        </div>
                      </div>
                    </div>
                  )}
                  renderThumb={({props, isDragged}) => (
                    <div
                      {...props}
                      key={props.key}
                      style={{
                        ...props.style,
                        height: '16px',
                        width: '16px',
                        borderRadius: '8px',
                        backgroundColor: '#FFF',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: '0px 1px 3px #AAA',
                      }}
                    />
                  )}
                />
              </div>

            </Col>
            <Col
              class={'sliderIconMax'}
              style={{
                display: displayIconMax,
                flexBasis: '50px',
                minWidth: '50px',
              }}
            >
              <span
                className={
                  'sliderIcon max ' +
                    this.props.widgetData.maxIconFamily +
                    ' ' +
                    maxIcon
                }
              />
            </Col>
          </div>
        </ListItem>
      </List>
    );
  }
}
