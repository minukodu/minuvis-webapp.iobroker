import React from 'react';
import Layout from './Layout';
import {ContextData} from './ContextData';

export default class MainController extends React.Component {
  static contextType = ContextData;
  constructor () {
    super ();
    this.state = {
      states: {},
      socket: null,
      _socket_connected: false,
      appConfig: null,
    };
    this.StateIDNbAlarms = '';
    this.usedVariables = [];
  }

  loadVariableNames = () => {
    let MyVariableNames = [];
    let states = {};

    //##########################################################################
    // TEST Alalmmeldesystem
    // AlarmAnzahl hinzufügen
    MyVariableNames.push (
      'myAlarme.VisuMeldungen.visuDaten.AnzahlAlarmeAnstehend'
    );
    MyVariableNames.push (
      'myAlarme.VisuMeldungen.visuDaten.AnzahlAlarmeAnstehendQuittiert'
    );
    MyVariableNames.push (
      'myAlarme.VisuMeldungen.visuDaten.AnzahlAlarmeAnstehendNichtQuittiert'
    );
    // AlarmListe Anstehend
    MyVariableNames.push (
      'myAlarme.VisuMeldungen.visuDaten.JSONAlarmeAnstehend'
    );
    // AlarmListe Historie
    MyVariableNames.push ('myAlarme.VisuMeldungen.visuDaten.JSONAlarmHistorie');
    // AlarmListe Quittiervariable
    MyVariableNames.push (
      'myAlarme.VisuMeldungen.visuDaten.VarNameZumQuittieren'
    );

    // dieser Wert wird im Header angezeigt
    this.StateIDNbAlarms =
      'myAlarme.VisuMeldungen.visuDaten.AnzahlAlarmeAnstehendNichtQuittiert';

    //##########################################################################
    //##########################################################################

    //##########################################################################
    // add states of iobroker.minuaru
    MyVariableNames.push ('minuaru.0.nbAlarmsActive');
    MyVariableNames.push ('minuaru.0.nbAlarmsActiveNotAcknowledged');
    // AlarmListe Anstehend
    MyVariableNames.push ('minuaru.0.jsonAlarmsActive');
    // AlarmListe Historie
    MyVariableNames.push ('minuaru.0.jsonAlarmHistory');
    // AlarmListe Quittiervariable
    MyVariableNames.push ('minuaru.0.stateIdToAcknowledge');
    // minuVis table settings
    MyVariableNames.push ('minuaru.0.minuVisConfig');
    // dieser Wert wird im Header angezeigt
    this.StateIDNbAlarmsMinuaru = 'minuaru.0.nbAlarmsActiveNotAcknowledged';

    //##########################################################################
    //##########################################################################

    //console.info(MyVariableNames);
    for (let v in MyVariableNames) {
      states[MyVariableNames[v]] = {};
      states[MyVariableNames[v]].val = null;
      states[MyVariableNames[v]].received = false;
      this.usedVariables.push (MyVariableNames[v]);
    }
    for (let v in this.context.data.usedStates) {
      states[this.context.data.usedStates[v]] = {};
      states[this.context.data.usedStates[v]].val = null;
      states[this.context.data.usedStates[v]].stateId = this.context.data.usedStates[v];
      this.usedVariables.push (this.context.data.usedStates[v]);
    }
    this.setState ({
      states,
    });
  };

  UNSAFE_componentWillMount () {
    // const contextData = this.context;
    // console.warn ('maincontroller will mount contextData');
    // console.warn (contextData);

    if (this.context.data.hasAppConfig === false) {
      return;
    }
    let appConfig = this.context.data.appConfig;
    this.setState ({
      appConfig,
    });

    console.info (new Date () + ' WillMount MainController');
    // Read settings
    //let settings = ReadSettings();
    this.setState ({
      settings: appConfig.settings,
    });
    this.loadVariableNames ();
  }

  componentDidMount () {
    if (this.context.data.hasAppConfig === false) {
      return;
    }

    console.info (new Date () + ' DidMount MainController');

    this.context.data.socket.on (
      'stateChange',
      function (id, state) {
        //console.log(id + " :: " + state.val);
        // "normale" Variable
        let states = this.state.states;
        states[id] = state;
        states[id].received = true;
        this.setState ({
          states: states,
        });
      }.bind (this)
    );

    // variables subscribe and fetch
    this.context.data.socket.emit ('subscribe', this.usedVariables);
    console.log ('Variables subscribed');
    console.log ('now read all Variables');
    this.context.data.socket.emit (
      'getStates',
      this.usedVariables,
      function (err, _states) {
        console.info (new Date () + ' Received all States MainController');
        console.info (
          new Date () + ' Received ' + Object.keys (_states).length + ' states.'
        );
        let states = _states;
        // console.log("states");
        // console.log(states);
        for (var stateID in states) {
          if (states[stateID]) {
            states[stateID].received = true;
          }
        }
        //console.debug (states);
        console.log ('states received and connected');
        this.setState ({
          //socket: this.context.data.socket,
          states,
          _socket_connected: true,
        });
      }.bind (this)
    );
    // });
    this.context.data.socket.on ('disconnect', () => {
      console.info (new Date () + ' Disconnected MainController');
      this.setState ({
        _socket_connected: false,
      });
    });
  }
  componentWillUnmount () {
    if (this.context.data.hasAppConfig === false) {
      return;
    }
    //console.info("Willumount MainController");
    this.context.data.socket.disconnect ();
  }

  render () {
    console.log ('Render MainController');

    // console.log(this.state);
    console.log ('Settings: ' + JSON.stringify (this.state.appConfig.settings));
    // get number of alarms
    let nbAlarm = this.state.states[this.StateIDNbAlarms]
      ? this.state.states[this.StateIDNbAlarms].val
      : 0;
    let nbAlarmMinuaru = this.state.states[this.StateIDNbAlarmsMinuaru]
      ? this.state.states[this.StateIDNbAlarmsMinuaru].val
      : 0;

    // is minuaru active ???
    if (this.state.appConfig.minuaru && this.state.appConfig.minuaru === true) {
      console.log ('minuaru alarm count: ' + nbAlarmMinuaru);
      nbAlarm = nbAlarmMinuaru || 0;
    }

    if (this.context.data.hasAppConfig === false) {
      return <div>trying to read config from ioBroker ...</div>;
    } else {
      return (
        <div>
          <div className={true ? 'overlay connected' : 'overlay notconnected'}>
            <div className="overlay inner">Daten werden geladen ....</div>
          </div>
          <Layout
            theme={this.context.data.theme}
            socket={this.context.data.socket}
            appConfig={this.state.appConfig}
            states={this.state.states}
            nbAlarm={nbAlarm}
            connected={this.state._socket_connected}
            version={this.context.data.version}
          />
        </div>
      );
    }
  }
}
