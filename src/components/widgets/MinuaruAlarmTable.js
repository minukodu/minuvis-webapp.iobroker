import React from "react";
import ReactTable from "react-table";
import { Button } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

class PrevButton extends React.Component {
  render() {
    return <Button {...this.props}>{"<<"}</Button>;
  }
}

class NextButton extends React.Component {
  render() {
    return <Button {...this.props}>{">>"}</Button>;
  }
}

export default class MinuaruAlarmTable extends React.Component {
  constructor(props) {
    super(props);
  }

  quitAlarm(variableName, e) {
    //e.preventDefault();
    console.log("quitAlarm stateID=" + variableName);
    this.props.socket.emit("setState", this.props.VarNameQuit, variableName);
  }

  render() {
    // get data
    let data = [];
    if (this.props.state && this.props.state.val) {
      data = JSON.parse(this.props.state.val);
      console.log(data);
    } else {
      // Testdaten
      data = [];
      for (var i = 1; i < 37; i++) {
        data.push({
          tsComes: moment().unix() * 1000,
          tsGoes: Math.random() > 0.5 ? moment().unix() * 1000 : 0,
          tsAck: Math.random() > 0.5 ? moment().unix() * 1000 : 0,
          alarmText: "my alarmtext " + i,
          alarmClass: Math.random() > 0.5 ? "Alarm" : "Warning",
          alarmArea: "my area",
          stateID: "mystate_" + i,
        });
      }
    }
    // get settings 
    let config = this.props.config ? JSON.parse(this.props.config.val) : {};
    // console.log("minuaru config");
    // console.log(config);
    // get header-titles
    let titles = config.columnNames || "time comes,time goes,time ack,alarmtext,area,acknowledge";
    let arrTitles = titles.split(",");

    const columns = [
      {
        Header: arrTitles[0] || "time comes",
        accessor: "tsComes",
        Cell: (row) => (
          <div>
            <div className="date">
              {row.value > 0 ? moment(row.value).format("DD.MM.YYYY") : "--"}
            </div>
            <div className="time">
              {row.value > 0 ? moment(row.value).format("HH:mm:ss") : ""}
            </div>
          </div>
        ),
        width: 100,
        className: "tscomes",
        show: true,
      },
      {
        Header: arrTitles[1] || "time goes",
        accessor: "tsGoes",
        Cell: (row) => (
          <div>
            <div className="date">
              {row.value > 0 ? moment(row.value).format("DD.MM.YYYY") : "--"}
            </div>
            <div className="time">
              {row.value > 0 ? moment(row.value).format("HH:mm:ss") : ""}
            </div>
          </div>
        ),
        width: 100,
        className: "tsgoes",
        show: this.props.showTimeGoes,
      },
      {
        Header: arrTitles[2] || "time ack",
        accessor: "tsAck",
        Cell: (row) => (
          <div>
            <div className="date">
              {row.value > 0 ? moment(row.value).format("DD.MM.YYYY") : "--"}
            </div>
            <div className="time">
              {row.value > 0 ? moment(row.value).format("HH:mm:ss") : ""}
            </div>
          </div>
        ),
        width: 100,
        className: "tsack",
        show: this.props.showTimeQuit,
      },
      {
        Header: arrTitles[3] || "alarmtext",
        accessor: "alarmText",
        className: "alarmtext",
        minWidth: 300,
      },
      {
        Header: "class",
        accessor: "alarmClass",
        className: "alarmclass",
        show: false,
      },
      {
        Header: arrTitles[4] || "area",
        accessor: "alarmArea",
        width: 100,
        className: "alarmarea",
      },
      {
        Header: "state-ID",
        accessor: "stateID",
        className: "stateid",
        show: false,
      },
      {
        Header: arrTitles[5] || "acknowlegde",
        accessor: "stateID",
        Cell: (row) => (
          <Button
            onClick={() => {
              this.quitAlarm(row.value);
            }}
          >
            {arrTitles[5] || "acknowlegde"}
          </Button>
        ),
        className: "ackButton",
        minWidth: 120,
        show: true,
      },
    ];
    let title = "";
    if (this.props.title !== "NONE") {
      title = (
        <ons-list-item>
          <div className="left titel"> {this.props.title} </div>
        </ons-list-item>
      );
    }

    let ts = moment();
    if (this.props.state && this.props.state.ts) {
      ts = this.props.state.ts;
    }

    let css = `
      .minuarutable.app {
        font-size: 80%;
        border: 1px solid #666666;
        width: 100%;
      }
      .minuarutable.app .class-alarm {
        background: ${config.alarm_colorActive};
        color: ${config.alarm_foregroundColor};
      }
      .minuarutable.app .class-warning {
        background:  ${config.warning_colorActive};
        color: ${config.warning_foregroundColor};
      }
      .minuarutable.app .class-information {
        background:  ${config.information_colorActive};
        color: ${config.information_foregroundColor};
      }
      .minuarutable.app .class-alarm.gone {
        background: ${config.alarm_colorGone};
      }
      .minuarutable.app .class-warning.gone {
        background: ${config.warning_colorGone};
      }
      .minuarutable.app .class-information.gone {
        background: ${config.information_colorGone};
      }
      .minuarutable.app td,
      .minuarutable.app th {
        padding: 0 5px;
      }
      .minuarutable.app .titlerow {
        background: var(--highlight-color);
        color: var(--text-color);
      }
      .minuarutable.app span {
        display: inline-block;
        width: 100%;
      }
      .minuarutable.app .date,
      .minuarutable.app .time {
        border: none;
        float: none;
        border-right: none;
        width: 100%;
      }
      .minuarutable.app .time {
        font-weight: bold;
      }
      
      .minuarutable.app .tsgoes,
      .minuarutable.app .tscomes,
      .minuarutable.app .tsack,
      .minuarutable.app .ackButton {
        text-align: center;
      }
      
      .minuarutable.app.active .tsgoes {
        display: none;
      }
      
      .minuarutable.app.active .tsquit {
        display: none;
      }
      
      .minuarutable.app .stateid {
        display: none;
      }
      
      .minuarutable.app .alarmclass {
        text-align: center;
        display: none;
      }
      
      .minuarutable.app .alarmarea {
        text-align: center;
      }
      .minuarutable.app .button {
        margin: 5px 0px;
      }
      
      .minuarutable.app .rt-td .button {
        margin: 0;
      }
      
      .minuarutable.app .pagination-bottom span {
        display: inline;
        width: auto;
      }
      
      .minuarutable.app .rt-thead .rt-td.-sort-asc,
      .minuarutable.app .rt-thead .rt-th.-sort-asc {
        box-shadow: inset 0 3px 0 0 #ffffff !important;
      }
      .minuarutable.app .rt-thead .rt-td.-sort-desc,
      .minuarutable.app .rt-thead .rt-th.-sort-desc {
        box-shadow: inset 0 -3px 0 0 #ffffff !important;
      }
      
      .minuarutable.app .rt-thead .rt-td,
      .minuarutable.app .rt-thead .rt-th {
        background: var(--highlight-color) !important;
        color: var(--button-bar-active-text-color) !important;
        border-right: 1px solid #303030 !important;
      }
      
      .minuarutable.app .rt-tbody .rt-td {
        border-right: 1px solid #303030 !important;
      }
    `;

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
          <style>{css}</style>
            <ReactTable
              className={"minuarutable app " + this.props.tableClass}
              data={data}
              columns={columns}
              defaultPageSize={5}
              minRows={5}
              previousText="<<"
              nextText=">>"
              loadingText="Loading..."
              noDataText={this.props.noDataText}
              pageText="page"
              ofText="/"
              rowsText="rows"
              pageJumpText="jump to page"
              rowsSelectorText="rows per page"
              getTrProps={(state, rowInfo, column) => {
                let trClassName = "class-undefined";
                if (rowInfo) {
                  trClassName = "class-" + rowInfo.row.alarmClass.toLowerCase();
                  if (rowInfo.row.tsAck > 0) {
                    trClassName += " acknowledged";
                  }
                  if (rowInfo.row.tsGoes > 0) {
                    trClassName += " gone";
                  }
                }
                return {
                  className: trClassName,
                };
              }}
              PreviousComponent={PrevButton}
              NextComponent={NextButton}
            />
          </ons-list-item>
        </ons-list>
      </ons-col>
    );
  }
}
