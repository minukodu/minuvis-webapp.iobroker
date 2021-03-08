import React from "react";
import { Button, List, ListItem, ListHeader } from "react-onsenui";
import ReactTable from "react-table";
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
    // lineBreaks
    let lineBreaks = this.props.lineBreaks.split(",");
    // contentTypes
    let contentTypes = this.props.contentTypes.split(",");
    console.log("contentTypes");
    console.log(contentTypes);
    
    
    let columns = [];
    let keys = Object.keys(data[0]);
    for (let key in keys) {
      console.log(keys[key]);
      if (colSizes[key] && colSizes[key] === "0") {
        // do not show column
      } else {
        // init
        let cWidth = parseInt(colSizes[key], 10) || 100;
        let accessor = keys[key];

        // handle lineBreaks
        if (lineBreaks[key] && lineBreaks[key] === "1") {
          accessor = d =>
          <div
            dangerouslySetInnerHTML={{
              __html: "<span style='white-space: normal;'>" + d[keys[key]] + "</span>"
            }}
        />
        }
        // handle imgUrl = contentType = i
        if ( contentTypes[key] === "i") {
          accessor = d =>
          <div
          dangerouslySetInnerHTML={{
            __html: "<img width='" + cWidth + "' src='" +  d[keys[key]] + "'/>"
          }}
        />
        } 
        let column = {
          Header: colHeaders[key] || keys[key],
          id: keys[key],
          accessor,
          className: "jsontable-" + keys[key],
          minWidth: cWidth,
        };
        columns.push(column);
      }
    }
    console.log(columns);


    let timestamp = null;
    if (this.props.timestamp && this.props.timestamp === true) {
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
      <List id={this.props.UUID}>
          {timestamp}
          <ListItem>
            <ReactTable
              className={"jsontable alarmtable"}
              data={data}
              columns={columns}
              defaultPageSize={this.props.rowsPerPage}
              minRows={this.props.rowsPerPage}
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
          </ListItem>
      </List>
    );
  }
}
