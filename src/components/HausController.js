import React from "react";
import StyleLoader from "./settings/StyleLoader";
import Layout from "./Layout";
import io from "socket.io-client";

export default class HausController extends React.Component {
  constructor() {
    super();
    this.state = {
      states: {},
      socket: null,
      _socket_connected: false,
      appConfig: null,
    };
    this.myStyleSheet = "";
    this.StateIDNbAlarms = "";
    this.usedVariables = [];
    this.socket = null;

    //#########################################################################
    this.version = "1.10.0";
    //#########################################################################
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

    //console.info(MyVariableNames);
    for (let v in MyVariableNames) {
      states[MyVariableNames[v]] = {};
      states[MyVariableNames[v]].val = null;
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
    // hell/dunkel einstellen
    this.myStyleSheet = "css/onsen-css-components.css";
    document.body.classList.add("hell");
    document.body.classList.remove("dunkel");
    if (
      appConfig.settings.LayoutDunkel === true ||
      appConfig.settings.LayoutDunkel === "true"
    ) {
      this.myStyleSheet = "css/dark-onsen-css-components.css";
      document.body.classList.add("dunkel");
      document.body.classList.remove("hell");
    }
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
        this.setState({
          states: states,
        });
      }.bind(this)
    );

    this._func_on_Connect = this.socket.on("connect", () => {
      console.info(new Date() + " Connected HausController");

      // variablen subscriben und holen
      this.socket.emit("name", "minukodu.0");
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
    console.log("Render Hauscontroller");
    // console.log(this.state);
    console.log("Settings: " + JSON.stringify(this.state.appConfig.settings));

    if (this.props.hasAppConfig === false) {
      return <div>trying to read config from ioBroker ...</div>;
    } else {
      return (
        <div>
          <StyleLoader stylesheetPath={this.myStyleSheet} />
          <div className={true ? "overlay connected" : "overlay notconnected"}>
            <div className="overlay inner">Daten werden geladen ....</div>
          </div>
          <Layout
            socket={this.socket}
            appConfig={this.state.appConfig}
            states={this.state.states}
            nbAlarm={
              this.state.states[this.StateIDNbAlarms]
                ? this.state.states[this.StateIDNbAlarms].val
                : 0
            }
            connected={this.state._socket_connected}
            version={this.version}
          />
        </div>
      );
    }
  }
}
