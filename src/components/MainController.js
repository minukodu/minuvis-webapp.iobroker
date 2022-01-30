import React from "react";
import Layout from "./Layout";
import io from "socket.io-client";

export default class MainController extends React.Component {
  constructor() {
    super();
    this.state = {
      states: {},
      socket: null,
      _socket_connected: false,
      appConfig: null,
    };
    this.StateIDNbAlarms = "";
    this.usedVariables = [];
    this.socket = null;
  }

  loadVariableNames = () => {
    let MyVariableNames = [];
    let states = {};

    //##########################################################################
    // TEST Alalmmeldesystem
    // AlarmAnzahl hinzufügen
    MyVariableNames.push(
      "myAlarme.VisuMeldungen.visuDaten.AnzahlAlarmeAnstehend"
    );
    MyVariableNames.push(
      "myAlarme.VisuMeldungen.visuDaten.AnzahlAlarmeAnstehendQuittiert"
    );
    MyVariableNames.push(
      "myAlarme.VisuMeldungen.visuDaten.AnzahlAlarmeAnstehendNichtQuittiert"
    );
    // AlarmListe Anstehend
    MyVariableNames.push(
      "myAlarme.VisuMeldungen.visuDaten.JSONAlarmeAnstehend"
    );
    // AlarmListe Historie
    MyVariableNames.push("myAlarme.VisuMeldungen.visuDaten.JSONAlarmHistorie");
    // AlarmListe Quittiervariable
    MyVariableNames.push(
      "myAlarme.VisuMeldungen.visuDaten.VarNameZumQuittieren"
    );

    // dieser Wert wird im Header angezeigt
    this.StateIDNbAlarms =
      "myAlarme.VisuMeldungen.visuDaten.AnzahlAlarmeAnstehendNichtQuittiert";

    //##########################################################################
    //##########################################################################

    //##########################################################################
    // add states of iobroker.minuaru
    MyVariableNames.push("minuaru.0.nbAlarmsActive");
    MyVariableNames.push("minuaru.0.nbAlarmsActiveNotAcknowledged");
    // AlarmListe Anstehend
    MyVariableNames.push("minuaru.0.jsonAlarmsActive");
    // AlarmListe Historie
    MyVariableNames.push("minuaru.0.jsonAlarmHistory");
    // AlarmListe Quittiervariable
    MyVariableNames.push("minuaru.0.stateIdToAcknowledge");
    // minuVis table settings
    MyVariableNames.push("minuaru.0.minuVisConfig");
    // dieser Wert wird im Header angezeigt
    this.StateIDNbAlarmsMinuaru = "minuaru.0.nbAlarmsActiveNotAcknowledged";

    //##########################################################################
    //##########################################################################

    //console.info(MyVariableNames);
    for (let v in MyVariableNames) {
      states[MyVariableNames[v]] = {};
      states[MyVariableNames[v]].val = null;
      states[MyVariableNames[v]].received = false;
      this.usedVariables.push(MyVariableNames[v]);
    }
    for (let v in this.props.usedStates) {
      states[this.props.usedStates[v]] = {};
      states[this.props.usedStates[v]].val = null;
      states[this.props.usedStates[v]].stateId = this.props.usedStates[v];
      this.usedVariables.push(this.props.usedStates[v]);
    }
    this.setState({
      states,
    });
  };

  componentWillMount() {

    if (this.props.hasAppConfig === false) {
      return;
    }
    let appConfig = this.props.appConfig;
    this.setState({
      appConfig,
    });

    console.info(new Date() + " WillMount HausController");
    // Read settings
    //let settings = ReadSettings();
    this.setState({
      settings: appConfig.settings,
    });
    this.loadVariableNames();
  }

  componentDidMount() {
    if (this.props.hasAppConfig === false) {
      return;
    }
    //######################################################
    // Verbindung aufbauen
    this.socket = io.connect(this.props.appConfig.dataprovider.url);
    //######################################################

    console.info(new Date() + " DidMount HausController");
    this.socket.connect();
    this._func_on_stateChange = this.socket.on(
      "stateChange",
      function (id, state) {
        //console.log(id + " :: " + state.val);
        // "normale" Variable
        let states = this.state.states;
        states[id] = state;
        states[id].received = true;
        this.setState({
          states: states,
        });
      }.bind(this)
    );

    this._func_on_Connect = this.socket.on("connect", () => {
      console.info(new Date() + " Connected HausController");

      // variablen subscriben und holen
      this.socket.emit("name", "minuvis.0");
      this.socket.emit("subscribe", this.usedVariables);
      console.log("Variables subscribed");

      this.socket.emit(
        "getStates",
        this.usedVariables,
        function (err, _states) {
          console.info(new Date() + " Received all States HausController");
          console.info(
            new Date() + " Received " + Object.keys(_states).length + " states."
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
          this.setState({
            socket: this.socket,
            states,
            _socket_connected: true,
          });
        }.bind(this)
      );
    });
    this._func_on_Disconnect = this.socket.on("disconnect", () => {
      console.info(new Date() + " Disconnected HausController");
      this.setState({
        _socket_connected: false,
      });
    });
  }
  componentWillUnmount() {
    if (this.props.hasAppConfig === false) {
      return;
    }
    //console.info("Willumount HausController");
    this.socket.disconnect();
  }

  render() {
    console.log("Render MainController");
    // console.log(this.state);
    console.log("Settings: " + JSON.stringify(this.state.appConfig.settings));
    // get number of alarms 
    let nbAlarm =
      this.state.states[this.StateIDNbAlarms]
        ? this.state.states[this.StateIDNbAlarms].val
        : 0;
    let nbAlarmMinuaru =
      this.state.states[this.StateIDNbAlarmsMinuaru]
        ? this.state.states[this.StateIDNbAlarmsMinuaru].val
        : 0;

    // is minuaru active ???
    if ( this.state.appConfig.minuaru && this.state.appConfig.minuaru === true ) {
      nbAlarm = nbAlarmMinuaru;
    }

    if (this.props.hasAppConfig === false) {
      return <div>trying to read config from ioBroker ...</div>;
    } else {
      return (
        <div>
          <div className={true ? "overlay connected" : "overlay notconnected"}>
            <div className="overlay inner">Daten werden geladen ....</div>
          </div>
          <Layout
            socket={this.socket}
            appConfig={this.state.appConfig}
            states={this.state.states}
            nbAlarm={nbAlarm}
            connected={this.state._socket_connected}
            version={this.props.version}
          />
        </div>
      );
    }
  }
}
