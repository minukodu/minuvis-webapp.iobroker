import React from "react";
import StyleLoader from "./settings/StyleLoader";
import io from "socket.io-client";
import {
  Page,
  Row,
  Col,
  List,
  ListHeader,
  ListItem,
  ProgressCircular,
} from "react-onsenui";

import HausController from "./HausController";

var queryString = require("querystring");

const myStyleSheet = "css/dark-onsen-css-components.css";

export default class ConfigLoader extends React.Component {
  constructor() {
    super();
    this.state = {
      appConfig: null,
      hasAppConfig: false,
      appConfigFile: null,
      socketUrl: null,
      loadFileError: null,
      usedStates: null,
    };
    this.configFromLocalStorage = false;
    this.loadConfig = this.loadConfig.bind(this);
    this.findAllByKey = this.findAllByKey.bind(this);
  }

  findAllByKey = function (obj, keyToFind) {
    return Object.entries(obj).reduce(
      (acc, [key, value]) =>
        key.startsWith(keyToFind)
          ? acc.concat(value)
          : typeof value === "object"
          ? acc.concat(this.findAllByKey(value, keyToFind))
          : acc,
      []
    );
  };

  loadConfig = () => {
    console.log("load Config");
    //####################################################
    // try to read localStorage
    let appConfigLocal = localStorage.getItem("appConfig") || {
      noConfig: true,
    };
    // console.log( appConfigLocal );

    //#####################################################
    // parse URL
    let myUrl = location.search;
    let myUrlToParse = myUrl.substring(1, myUrl.length);
    let myUrlParsed = queryString.parse(myUrlToParse);
    let filePath = "minukodu";
    console.log("this is myUrlParsed:");
    console.log(myUrlParsed);

    if ("forceUpdate" in myUrlParsed || appConfigLocal.noConfig) {
      // read config from file
      console.log("appConfig from file");
    } else {
      // read config from localStorage
      try {
        let appConfig = JSON.parse(appConfigLocal);
        this.configFromLocalStorage = true;
        console.log("appConfig from localStorage");
        let usedStates = this.findAllByKey(appConfig, "stateId");
        console.log(appConfig);
        console.log(usedStates);
        this.setState({
          appConfig,
          hasAppConfig: true,
          usedStates,
        });
      } catch (e) {}
    }

    if (
      this.configFromLocalStorage === false &&
      myUrlParsed.url &&
      myUrlParsed.file
    ) {
      console.log("url + file in querystring !");
      this.setState({
        appConfigFile: myUrlParsed.file,
        socketUrl: myUrlParsed.url,
      });
      // checkFileName
      if (myUrlParsed.file.length < 6) {
        this.setState({
          loadFileError: "filename too short",
        });
        return;
      }
      // Verbindung aufbauen
      const configSocket = io.connect(myUrlParsed.url);
      configSocket.on("connect", () => {
        console.info(new Date() + " Connected ConfigSocket");
        configSocket.emit(
          "readFile",
          null,
          filePath + "/" + myUrlParsed.file,
          function (error, fileData, mimeType) {
            console.log(mimeType);
            // console.log(fileData);
            console.log(error);
            if (error) {
              console.error(
                new Date() + " Error loding file: " + myUrlParsed.file
              );
              console.error(error);
              this.setState({
                loadFileError: "file " + error,
              });
            } else {
              let appConfig = JSON.parse(fileData);
              let usedStates = this.findAllByKey(appConfig, "stateId");
              // console.log(fileData);
              console.log(appConfig);
              console.log(usedStates);
              this.setState({
                appConfig,
                hasAppConfig: true,
                usedStates,
              });
              localStorage.setItem("appConfig", fileData);
            }
          }.bind(this)
        );
      });
    }
  };

  componentWillMount() {
    this.loadConfig();
  }

  componentDidMount() {
    //this.loadConfig();
  }

  render() {
    console.log("Render ConfigLoader");
    console.log(this.state);

    if (this.state.hasAppConfig === false) {
      return (
        <div>
          <StyleLoader stylesheetPath={myStyleSheet} />
          <Page>
            <Row>
              <Col>
                <List>
                  <ListHeader>
                    trying to read config from ioBroker ...
                  </ListHeader>
                  <ListItem>
                    <div className="left titel">url:</div>
                    <div className="right">{this.state.socketUrl}</div>
                  </ListItem>
                  <ListItem>
                    <div className="left titel">file:</div>
                    <div className="right">{this.state.appConfigFile}</div>
                  </ListItem>
                  <ListItem>
                    <div className="center">
                      <ProgressCircular
                        style={{ margin: "0 auto" }}
                        indeterminate
                      />
                    </div>
                  </ListItem>
                  <ListItem>
                    <div className="left titel">error:</div>
                    <div className="right">
                      {this.state.loadFileError
                        ? this.state.loadFileError
                        : "no error"}
                    </div>
                  </ListItem>
                </List>
              </Col>
            </Row>
          </Page>
        </div>
      );
    } else {
      return (
        <HausController
          appConfig={this.state.appConfig}
          hasAppConfig={this.state.hasAppConfig}
          usedStates={this.state.usedStates}
        />
      );
    }
  }
}
