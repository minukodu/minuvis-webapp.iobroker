import React from "react";
import ReactTable from "react-table";
import { Button } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

class PrevButton extends React.Component {
  render() {
    return <Button {...this.props}>Zurück</Button>;
  }
}

class NextButton extends React.Component {
  render() {
    return <Button {...this.props}>vor</Button>;
  }
}

export default class BetterAlarmTable extends React.Component {
  constructor(props) {
    super(props);
  }

  quitAlarm(variableName, e) {
    //e.preventDefault();
    console.log("quitAlarm VarName=" + variableName);
    this.props.socket.emit("setState", this.props.VarNameQuit, variableName);
  }

  render() {
    let data = [];
    if (this.props.state && this.props.state.val) {
      data = JSON.parse(this.props.state.val);
      console.log(data);
    } else {
      // Testdaten
      data = [];
      for (var i = 1; i < 37; i++) {
        data.push({
          msTimeComes: moment().unix() * 1000,
          msTimeGoes: Math.random() > 0.5 ? moment().unix() * 1000 : 0,
          msTimeQuit: Math.random() > 0.5 ? moment().unix() * 1000 : 0,
          alarmText: "Mein Alarmtext " + i,
          alarmClass: Math.random() > 0.5 ? "S" : "W",
          alarmArea: "Mein Bereich",
          varName: "Meine.AlarmVariable" + i,
        });
      }
    }

    const columns = [
      {
        Header: "Zeit kommt",
        accessor: "msTimeComes",
        Cell: (row) => (
          <div>
            <div className="datum">
              {row.value > 0 ? moment(row.value).format("DD.MM.YYYY") : "--"}
            </div>
            <div className="uhrzeit">
              {row.value > 0 ? moment(row.value).format("HH:mm:ss") : ""}
            </div>
          </div>
        ),
        width: 100,
        className: "mstimecomes",
        show: true,
      },
      {
        Header: "Zeit geht",
        accessor: "msTimeGoes",
        Cell: (row) => (
          <div>
            <div className="datum">
              {row.value > 0 ? moment(row.value).format("DD.MM.YYYY") : "--"}
            </div>
            <div className="uhrzeit">
              {row.value > 0 ? moment(row.value).format("HH:mm:ss") : ""}
            </div>
          </div>
        ),
        width: 100,
        className: "mstimegoes",
        show: this.props.showTimeGoes,
      },
      {
        Header: "Zeit quittiert",
        accessor: "msTimeQuit",
        Cell: (row) => (
          <div>
            <div className="datum">
              {row.value > 0 ? moment(row.value).format("DD.MM.YYYY") : "--"}
            </div>
            <div className="uhrzeit">
              {row.value > 0 ? moment(row.value).format("HH:mm:ss") : ""}
            </div>
          </div>
        ),
        width: 100,
        className: "mstimequit",
        show: this.props.showTimeQuit,
      },
      {
        Header: "Alarmtext",
        accessor: "alarmText",
        className: "alarmtext",
        minWidth: 300,
      },
      {
        Header: "Klasse",
        accessor: "alarmClass",
        className: "alarmclass",
        show: false,
      },
      {
        Header: "Bereich",
        accessor: "alarmArea",
        width: 100,
        className: "alarmarea",
      },
      {
        Header: "Variable",
        accessor: "varName",
        className: "varname",
        show: false,
      },
      {
        Header: "Quittieren",
        accessor: "varName",
        Cell: (row) => (
          <Button
            onClick={() => {
              this.quitAlarm(row.value);
            }}
          >
            Quittieren
          </Button>
        ),
        className: "quitbutton",
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
              className={"alarmtable " + this.props.tableClass}
              data={data}
              columns={columns}
              defaultPageSize={5}
              minRows={5}
              previousText="zurück"
              nextText="vor"
              loadingText="Loading..."
              noDataText={this.props.noDataText}
              pageText="Seite"
              ofText="von"
              rowsText="Zeilen"
              pageJumpText="springe zu Seite"
              rowsSelectorText="Zeilen je Seite"
              getTrProps={(state, rowInfo, column) => {
                let trClassName = "class-u";
                if (rowInfo) {
                  trClassName = "class-" + rowInfo.row.alarmClass.toLowerCase();
                  if (rowInfo.row.msTimeQuit > 0) {
                    trClassName += " quittiert";
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
