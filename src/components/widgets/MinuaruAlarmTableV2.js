import React from 'react';
import {memo} from 'react';
import {Grid, _} from 'gridjs-react';
import {html} from 'gridjs';
import {Button} from 'react-onsenui';
import moment from 'moment';
moment.locale ('de-DE');

const MinuaruAlarmTable = memo (function MinuaruAlarmTable (props) {
  const defaultConfig = {
    columnNames: 'time comes,time goes,time ack,alarmtext,area,acknowlegde',
    alarm_colorActive: '#ee2e2c',
    alarm_colorGone: '#f48382',
    alarm_foregroundColor: '#000000',
    warning_colorActive: '#d5ca00',
    warning_colorGone: '#d1cd86',
    warning_foregroundColor: '#000000',
    information_colorActive: '#4e88ca',
    information_colorGone: '#82a4cb',
    information_foregroundColor: '#000000',
  };

  // calculate column-widths
  let width = window.innerWidth > 0 ? window.innerWidth : window.screen.width;
  if (props.splitterOpen === true) {
    width = width - 200; // side-menu
  }

  let columnWidth = width / 6 - 10;
  let alarmTextColumnWidth = columnWidth;

  if (columnWidth > 200) {
    columnWidth = 200;
    alarmTextColumnWidth = width - 5 * columnWidth - 30;
  }

  function quitAlarm (variableName, e) {
    //e.preventDefault();
    console.log ('quitAlarm stateID=' + variableName);
    props.socket.emit ('setState', props.VarNameQuit, variableName);
    //props.quitAlarm(variableName);
  }

  // get data
  let data = [];
  if (props.state && props.state.val) {
    let newData = props.state.val;
    data = JSON.parse (newData);
    //console.log ("alarmdata");
    //console.log (data);
  } else {
    // Testdaten
    data = [];
    for (var i = 1; i < 37; i++) {
      data.push ({
        tsComes: moment ().unix () * 1000,
        tsGoes: Math.random () > 0.5 ? moment ().unix () * 1000 : 0,
        tsAck: Math.random () > 0.5 ? moment ().unix () * 1000 : 0,
        alarmText: 'my alarmtext ' + i,
        alarmClass: Math.random () > 0.5 ? 'Alarm' : 'Information', // 'Warning'
        alarmArea: 'my area',
        stateID: 'mystate_' + i,
      });
    }
  }
  // get settings
  let config = props.config && props.config.val
    ? JSON.parse (props.config.val)
    : defaultConfig;

  // console.log ('minuaru config');
  // console.log (props.config);
  // console.log (defaultConfig);

  // get header-titles
  let titles = config.columnNames;
  let arrTitles = titles.split (',');

  let columnNames = [];
  columnNames.push ({
    id: 'tsComes',
    name: arrTitles[0] || 'time comes',
    width: columnWidth + 'px',
    formatter: cell =>
      html (
        `<div>` +
          `<div class="date">${cell > 0 ? moment (cell).format ('DD.MM.YYYY') : '--'}</div>` +
          `<div class="time">${cell > 0 ? moment (cell).format ('HH:mm:ss') : ''}</div>` +
          `</div>`
      ),
    attributes: (cell, row, column) => {
      if (row) {
        return {
          className: 'tscomes class-' + row._cells[4].data.toLowerCase (),
        };
      }
    },
  });
  columnNames.push ({
    id: 'tsGoes',
    name: arrTitles[1] || 'time goes',
    width: columnWidth + 'px',
    formatter: cell =>
      html (
        `<div>` +
          `<div class="date">${cell > 0 ? moment (cell).format ('DD.MM.YYYY') : '--'}</div>` +
          `<div class="time">${cell > 0 ? moment (cell).format ('HH:mm:ss') : ''}</div>` +
          `</div>`
      ),
    attributes: (cell, row, column) => {
      if (row) {
        return {
          className: 'tsgoes class-' + row._cells[4].data.toLowerCase (),
        };
      }
    },
  });
  columnNames.push ({
    id: 'tsAck',
    name: arrTitles[2] || 'time ack',
    width: columnWidth + 'px',
    formatter: cell =>
      html (
        `<div>` +
          `<div class="date">${cell > 0 ? moment (cell).format ('DD.MM.YYYY') : '--'}</div>` +
          `<div class="time">${cell > 0 ? moment (cell).format ('HH:mm:ss') : ''}</div>` +
          `</div>`
      ),
    attributes: (cell, row, column) => {
      if (row) {
        return {
          className: 'tsack class-' + row._cells[4].data.toLowerCase (),
        };
      }
    },
  });
  columnNames.push ({
    id: 'alarmText',
    name: arrTitles[3] || 'alarmtext',
    width: alarmTextColumnWidth + 'px',
    attributes: (cell, row, column) => {
      if (row) {
        return {
          className: 'alarmtext class-' + row._cells[4].data.toLowerCase (),
        };
      }
    },
  });
  columnNames.push ({
    id: 'alarmClass',
    name: 'alarmclass',
    hidden: true,
    attributes: {
      className: 'hidden',
    },
  });
  columnNames.push ({
    id: 'alarmArea',
    name: arrTitles[4] || 'area',
    width: columnWidth + 'px',
    attributes: (cell, row, column) => {
      if (row) {
        return {
          className: 'tscomes class-' + row._cells[4].data.toLowerCase (),
        };
      }
    },
  });
  columnNames.push ({
    id: 'stateID',
    name: arrTitles[5] || 'acknowledge',
    width: columnWidth + 'px',
    formatter: cell =>
      _ (
        <Button
          onClick={() => {
            quitAlarm (cell);
          }}
        >
          {arrTitles[5] || 'acknowlegde'}
        </Button>
      ),
    attributes: {
      className: 'ackButton',
    },
  });

  let title = '';
  if (props.title !== 'NONE') {
    title = (
      <ons-list-item>
        <div className="left titel"> {props.title} </div>
      </ons-list-item>
    );
  }

  let ts = moment ();
  if (props.state && props.state.ts) {
    ts = props.state.ts;
  }

  let css = `
      .minuarutable.app {
        font-size: 80%;
        border: 1px solid #666666;
        width: 100%;
        table-layout: "fixed" ;
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
         
      .minuarutable.app .alarmarea {
        text-align: center;
      }
      .minuarutable.app .button {
        margin: 5px 0px;
      }`;

  // Grid
  const table = (
    <Grid
      data={data}
      columns={columnNames}
      search={false}
      fixedHeader={true}
      autoWidth={false}
      pagination={{
        limit: 50,
      }}
      className={{
        table: 'minuarutable app ' + props.tableClass,
      }}
      language={{
        pagination: {
          previous: '<<',
          next: '>>',
          showing: '\n',
          to: ' - ',
          of: '',
          results: 'Alarms',
        },
        loading: 'Loading...',
        noRecordsFound: 'No alarms found in list',
        error: 'An error happened while fetching the data',
      }}
    />
  );

  return (
    <ons-col>
      <ons-list>
        <ons-list-header>
          <span
            className="right lastupdate"
            style={{float: 'right', paddingRight: '5px'}}
          >
            {moment ().format ('LLL')}
          </span>
        </ons-list-header>
        {title}
        <ons-list-item>
          <div className="minuarutable-container">
            <style>{css}</style>
            {table}
          </div>
        </ons-list-item>
      </ons-list>
    </ons-col>
  );
});

export default MinuaruAlarmTable;
