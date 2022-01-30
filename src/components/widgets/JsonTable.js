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

  render() {
    // init
    let val = '[{"noData":"noData"}]';
    let data = JSON.parse(val);
    let ts = moment();

    // read value and timestamp from props if available
    // console.log(this.props.widgetData.stateId);
    // console.log(this.props.widgetData.states[this.props.widgetData.stateId]);
    if (
      this.props.widgetData.states[this.props.widgetData.stateId] &&
      this.props.widgetData.states[this.props.widgetData.stateId].received === true
    ) {
      val = this.props.widgetData.states[this.props.widgetData.stateId].val;
      ts = this.props.widgetData.states[this.props.widgetData.stateId].ts;
    }

    //val = '[{"ts":1601652352418,"time":"2020-10-02T17:25:52.418","zone":"Badezimmer","trigger":"Motion Bathroom","targetsAll":"Bathroom Light","targetsSet":"","targetsSkipped":"Bathroom Light","motionTimer":10,"alwaysOffTimer":0}]';

    // check for emptiness
    if ( val.length < 5 ) {
      val = "[{}]";
    }  

    let newData = JSON.parse(val);
    // check if data is object
    if (typeof newData === "object" && newData !== null) {
      data = newData;
    }
    console.log(data);

    // column headers
    let colHeaders = this.props.widgetData.colheader.split(",");
    // column widths
    let colSizes = this.props.widgetData.colsize.split(",");
    // lineBreaks
    let lineBreaks = this.props.widgetData.lineBreaks.split(",");
    // contentTypes
    let contentTypes = this.props.widgetData.contentTypes.split(",");
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
      <List id={this.props.widgetData.UUID}>
          {timestamp}
          <ListItem>
            <ReactTable
              className={"jsontable alarmtable"}
              data={data}
              columns={columns}
              defaultPageSize={this.props.widgetData.rowsPerPage}
              minRows={this.props.widgetData.rowsPerPage || 5}
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
