import React from "react";
import ReactTable from "react-table";
import Title from "./Title";
import { Button } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

class PrevButton extends React.Component {
  render() {
    return <Button {...this.props}>prev</Button>;
  }
}

class NextButton extends React.Component {
  render() {
    return <Button {...this.props}>next</Button>;
  }
}

export default class JsonTable extends React.Component {
  constructor() {
    super();
    this._stateId_subscribed = false;
    this.state = {
      val: "[{}]",
      ts: moment(),
    };
  }

  componentWillMount() {
    // console.dir(this.props.states);
    // console.log(typeof this.props.states[this.props.stateId]);

    if (typeof this.props.states[this.props.stateId] === "undefined") {
      if (this._stateId_subscribed === false) {
        // Subscribe state
        // console.log("Subscribe " + this.props.stateId);
        this.props.socket.emit("subscribe", this.props.stateId);
        this._stateId_subscribed = true;
        // Read state
        this.props.socket.emit(
          "getStates",
          [this.props.stateId],
          function (err, states) {
            // console.log("Received States");
            // console.dir(states);
            // eintragen
            this.setState({
              val: states[this.props.stateId].val,
              ts: states[this.props.stateId].ts,
            });
          }.bind(this)
        );
      }
    } else {
      // console.log("Read " + this.props.stateId);
      try {
        this.setState({
          val: this.props.states[this.props.stateId].val,
          ts: this.props.states[this.props.stateId].ts,
        });
      } catch (e) {}
    }
  }

  render() {
    // init
    let val = '[{"noData":"noData"}]';
    let data = JSON.parse(val);
    let ts = moment();

    // read value and timestamp from props if available
    console.log(this.props.stateId);
    console.log(this.props.states[this.props.stateId]);
    if (
      typeof this.props.states[this.props.stateId] !== "undefined" &&
      this.props.states[this.props.stateId] &&
      this.props.states[this.props.stateId].val
    ) {
      val = this.props.states[this.props.stateId].val;
      ts = this.props.states[this.props.stateId].ts;
    }

    //val = '[{"ts":1601652352418,"time":"2020-10-02T17:25:52.418","zone":"Badezimmer","trigger":"Motion Bathroom","targetsAll":"Bathroom Light","targetsSet":"","targetsSkipped":"Bathroom Light","motionTimer":10,"alwaysOffTimer":0}]';

    let newData = JSON.parse(val);
    // check if data is object
    if (typeof newData === "object" && newData !== null) {
      data = newData;
    }
    console.log(data);

    // column headers
    let colHeaders = this.props.colheader.split(",");
    // column widths
    let colSizes = this.props.colsize.split(",");

    let columns = [];
    let keys = Object.keys(data[0]);
    for (let key in keys) {
      console.log(keys[key]);

      if (colSizes[key] && colSizes[key] === "0") {
        // do not show column
      } else {
        let column = {
          Header: colHeaders[key] || keys[key],
          accessor: keys[key],
          className: "jsontable-" + keys[key],
          minWidth: parseInt(colSizes[key], 10) || 100,
        };
        columns.push(column);
      }
    }
    console.log(columns);

    let title = "";
    if (this.props.title !== "NONE") {
      title = (
        <ons-list-item>
          <Title
            title={this.props.title}
            titleIcon={this.props.titleIcon}
            titleIconFamily={this.props.titleIconFamily}
            compactMode={false}
          />
        </ons-list-item>
      );
    }

    return (
      <ons-col>
        <ons-list>
          <ons-list-header>
            <span
              className="right lastupdate"
              style={{ float: "right", paddingRight: "5px" }}
            >
              {moment().format("LLL")}
            </span>
          </ons-list-header>
          {title}
          <ons-list-item>
            <ReactTable
              className={"jsontable alarmtable"}
              data={data}
              columns={columns}
              defaultPageSize={5}
              minRows={5}
              previousText="prev"
              nextText="next"
              loadingText="Loading..."
              noDataText="no data"
              pageText="page"
              ofText="of"
              rowsText="rows"
              pageJumpText="goto page"
              rowsSelectorText="rows per page"
              PreviousComponent={PrevButton}
              NextComponent={NextButton}
            />
          </ons-list-item>
        </ons-list>
      </ons-col>
    );
  }
}
