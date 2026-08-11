import React from 'react';
import io from 'socket.io-client';
import ons from 'onsenui';
import {
  Page,
  Row,
  Col,
  List,
  ListItem,
  ProgressCircular,
  Input,
  Button,
  Icon,
} from 'react-onsenui';
import StyleLoader from './StyleLoader';
import MainController from './MainController';
import ConfigMessage from './utils/ConfigMessage';

import packageInfo from '../../package.json';

var queryString = require('querystring');

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
      _socket_connected: false,
      needsManualSetup: false,
      manualUrl: '',
      manualFile: '',
      manualAuthEnabled: false,
    };
    this.versionError = false;
    this.configFromLocalStorage = false;
    this.loadConfig = this.loadConfig.bind(this);
    this.findAllByKey = this.findAllByKey.bind(this);
    this.styleLoader = null;
    this.meta = '0_userdata.0';
    this.withAuth = false;
    this.configSocket = null;

    //#########################################################################
    // Mindest-Config-Version, unabhängig von der App-Version (packageInfo.version)
    this.minConfigVersion = '2.7.0';
    //#########################################################################
  }

  compareVersions = function (a, b) {
    const partsA = String(a).split('.').map(Number);
    const partsB = String(b).split('.').map(Number);
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const numA = partsA[i] || 0;
      const numB = partsB[i] || 0;
      if (numA !== numB) return numA - numB;
    }
    return 0;
  };

  findAllByKey = function (obj, keyToFind) {
    return Object.entries(obj).reduce(
      (acc, [key, value]) =>
        //key == keyToFind
        key.startsWith(keyToFind) && !key.includes('Type')
          ? acc.concat(value)
          : typeof value === 'object' && value
            ? acc.concat(this.findAllByKey(value, keyToFind))
            : acc,
      []
    );
  };

  clearCredentials = () => {
    localStorage.clear();
    window.location.reload();
  };

  resetServerConfig = () => {
    localStorage.removeItem('appProvider');
    localStorage.removeItem('appConfig');
    localStorage.removeItem('appAuthEnabled');
    window.location.reload();
  };

  saveManualServerConfig = () => {
    const url = (this.state.manualUrl || '').trim();
    const file = (this.state.manualFile || '').trim();
    if (!url || file.length < 6) {
      this.setState({
        loadFileError: 'Server-Adresse oder Dateiname ungültig (Dateiname min. 6 Zeichen)',
      });
      return;
    }
    localStorage.setItem(
      'appProvider',
      JSON.stringify({ appConfigFile: file, socketUrl: url })
    );
    localStorage.setItem(
      'appAuthEnabled',
      this.state.manualAuthEnabled ? '1' : '0'
    );
    this.setState({ needsManualSetup: false, loadFileError: null });
    this.loadConfig();
  };

  loadConfig = () => {
    console.log('load Config');
    //####################################################
    // try to read localStorage
    let appConfigLocal = localStorage.getItem('appConfig') || {
      noConfig: true,
    };
    let user = localStorage.getItem('user');
    this.setState({ user: user });
    let password = '';
    this.passwordEncrypted = localStorage.getItem('password');
    if (this.passwordEncrypted) {
      password = atob(this.passwordEncrypted);
      this.setState({ password: password });
    } else {
      this.setState({ password: "" });
    }
    // console.log( appConfigLocal );

    //#####################################################
    // parse URL
    let myUrl = window.location.search;
    let myUrlToParse = myUrl.substring(1, myUrl.length);
    let myUrlParsed = queryString.parse(myUrlToParse);
    let filePath = 'minukodu';
    console.log('this is myUrlParsed:');
    console.log(myUrlParsed);

    if ('forceUpdate' in myUrlParsed || appConfigLocal.noConfig) {
      // read config from file
      console.log('appConfig from file');
    } else {
      // read config from localStorage
      try {
        let appConfig = JSON.parse(appConfigLocal);
        this.configFromLocalStorage = true;
        console.log('appConfig from localStorage');
        let usedStates = this.findAllByKey(appConfig, 'stateId');
        console.log(appConfig);
        console.log('usedStates:');
        console.log(usedStates);
        this.setState({
          appConfig,
          hasAppConfig: true,
          usedStates,
        });
      } catch (e) { }
    }

    if (!('url' in myUrlParsed)) {
      // try reading url and filename from localstorage
      console.log(
        'no url in querystring: trying to read url and filename from localstorage'
      );
      try {
        let appProviderLocal = JSON.parse(
          localStorage.getItem('appProvider')
        );
        console.log(appProviderLocal);
        // overwrite values
        myUrlParsed.url = appProviderLocal.socketUrl;
        myUrlParsed.file = appProviderLocal.appConfigFile;
      } catch (e) { }
    }

    // no server configured at all (fresh install, no querystring possible e.g. in native app)
    if (!myUrlParsed.url || !myUrlParsed.file) {
      console.log('no server configured yet - showing manual setup');
      this.setState({ needsManualSetup: true });
      return;
    }
    this.setState({ needsManualSetup: false });

    // prepare authentication
    this.authQuery = {};
    if ('auth' in myUrlParsed || localStorage.getItem('appAuthEnabled') === '1') {
      this.withAuth = true;
      this.authQuery = {
        user: user,
        pass: password,
      };
      console.info('try to Connect configSocket with authQuery');
    }

    if (
      myUrlParsed.url &&
      myUrlParsed.file
    ) {
      console.log('url + file in querystring !');
      this.setState({
        appConfigFile: myUrlParsed.file,
        socketUrl: myUrlParsed.url,
      });
      // write url and file in localstorage
      localStorage.setItem(
        'appProvider',
        JSON.stringify({
          appConfigFile: myUrlParsed.file,
          socketUrl: myUrlParsed.url,
        })
      );
      // checkFileName
      if (myUrlParsed.file.length < 6) {
        this.setState({
          loadFileError: 'config-file: filename too short',
        });
        return;
      }
      // Verbindung aufbauen

      console.info('try to Connect configSocket');
      const query = this.authQuery;
      this.configSocket = io.connect(myUrlParsed.url, {
        query,
      });

      this.configSocket.on('disconnect', () => {
        console.warn(new Date() + ' disconnected configSocket');
        this.setState({
          _socket_connected: false,
        });
      });

      this.configSocket.on('connect', () => {
        console.warn(new Date() + ' Connected configSocket');
        console.info(
          new Date() +
          ' read config file: ' +
          filePath +
          '/' +
          myUrlParsed.file
        );
        this.configSocket.emit('name', 'minuvis.0');
        this.configSocket.emit(
          'readFile',
          this.meta,
          filePath + '/' + myUrlParsed.file,
          function (error, fileData, mimeType) {
            console.log(mimeType);
            // console.log(fileData);
            // console.log(error);
            if (error) {
              console.error(
                new Date() + ' Error loading file: ' + myUrlParsed.file
              );
              console.error(error);
              let errorText = JSON.stringify(error);
              if (Object.getOwnPropertyNames(error).length === 0) {
                errorText = 'not found';
              }
              this.setState({
                loadFileError: 'config-file ' + errorText,
              });
            } else {
              let appConfig = JSON.parse(fileData);
              if (
                !appConfig.version ||
                this.compareVersions(appConfig.version, this.minConfigVersion) < 0
              ) {
                let errorText = 'has wrong version: < ' + this.minConfigVersion;
                this.versionError = true;
                this.setState({
                  loadFileError: 'config-file ' + errorText,
                });
              } else {
                let usedStates = this.findAllByKey(appConfig, 'stateId');
                // console.log(fileData);
                console.log(appConfig);
                console.log('usedStates:');
                console.log(usedStates);
                this.setState({
                  appConfig,
                  hasAppConfig: true,
                  usedStates,
                  _socket_connected: true,
                });
                localStorage.setItem('appConfig', fileData);
              }
            }
          }.bind(this)
        );
      });
    }
  };

  componentDidMount() {
    this.loadConfig();
  }

  componentDidCatch(error) {
    console.log('componentDidCatch');
    console.log(error);
  }

  render() {
    console.log('Render ConfigLoader');
    console.log(this.state);

    //############################################
    ons.platform.select('android');
    //############################################

    let credentialsInput = null;
    if (this.withAuth === true) {
      credentialsInput = (
        <div>
          <ListItem>
            <div className="left titel">user:</div>
            <div className="right">
              <Input
                className="right"
                onChange={e => {
                  localStorage.setItem('user', e.target.value);
                  this.setState({ user: e.target.value });
                }}
                value={this.state.user}
              />
              <Button style={{ visibility: 'hidden' }} modifier="outline">
                <Icon icon={{ default: 'ion-eye', material: 'md-eye' }} />
              </Button>
            </div>
          </ListItem>
          <ListItem>
            <div className="right">
              <Input
                type={this.state.passwordFieldHidden ? 'password' : 'text'}
                onChange={e => {
                  localStorage.setItem('password', btoa(e.target.value));
                  this.setState({ password: e.target.value });
                }}
                value={this.state.password}
              />
              <Button
                onClick={e =>
                  this.setState({
                    passwordFieldHidden: !this.state.passwordFieldHidden,
                  })}
                modifier="outline"
              >
                <Icon icon={{ default: 'ion-eye', material: 'md-eye' }} />
              </Button>
            </div>
          </ListItem>
          <ListItem>
            <Button modifier="large--cta" onClick={this.loadConfig}>
              start
            </Button>
          </ListItem>
          <ListItem>
            <Button modifier="large--cta" onClick={this.clearCredentials}>
              clear user and password
            </Button>
          </ListItem>

        </div>
      );
    }

    if (this.state.hasAppConfig === false) {
      if (this.state.needsManualSetup) {
        return (
          <div>
            <StyleLoader theme={null} />
            <Page>
              <Row>
                <Col>
                  <List>
                    <ListItem>
                      <div className="left titel">Server-Einrichtung</div>
                    </ListItem>
                    <ListItem>
                      <div className="left">
                        ioBroker Socket-Adresse (z.B. http://192.168.1.10:8084):
                      </div>
                    </ListItem>
                    <ListItem>
                      <Input
                        style={{ width: '100%' }}
                        placeholder="http://192.168.1.10:8084"
                        onChange={e =>
                          this.setState({ manualUrl: e.target.value })}
                        value={this.state.manualUrl}
                      />
                    </ListItem>
                    <ListItem>
                      <div className="left">
                        Config-Dateiname (z.B. minukodu.json):
                      </div>
                    </ListItem>
                    <ListItem>
                      <Input
                        style={{ width: '100%' }}
                        placeholder="minukodu.json"
                        onChange={e =>
                          this.setState({ manualFile: e.target.value })}
                        value={this.state.manualFile}
                      />
                    </ListItem>
                    <ListItem>
                      <label>
                        <input
                          type="checkbox"
                          checked={this.state.manualAuthEnabled}
                          onChange={e =>
                            this.setState({
                              manualAuthEnabled: e.target.checked,
                            })}
                        />{' '}
                        Anmeldung mit Benutzername/Passwort erforderlich
                      </label>
                    </ListItem>
                    <ListItem
                      style={{
                        background: this.state.loadFileError
                          ? 'red'
                          : 'transparent',
                        fontWeight: 'bold',
                      }}
                    >
                      <div className="left titel">error:</div>
                      <div className="right">
                        {this.state.loadFileError
                          ? this.state.loadFileError
                          : 'no error'}
                      </div>
                    </ListItem>
                    <ListItem>
                      <Button
                        modifier="large--cta"
                        onClick={this.saveManualServerConfig}
                      >
                        Verbinden
                      </Button>
                    </ListItem>
                  </List>
                </Col>
              </Row>
            </Page>
          </div>
        );
      }
      return (
        <div>
          <StyleLoader theme={null} />
          <Page>
            <Row>
              <Col>
                <List>
                  <ListItem>
                    <div className="left titel">
                      trying to read config from ioBroker ...
                    </div>
                  </ListItem>
                  <ListItem>
                    <div className="center">
                      <ProgressCircular
                        style={{ margin: '0 auto' }}
                        indeterminate
                      />
                    </div>
                  </ListItem>
                  <ListItem>
                    <div className="left titel">url:</div>
                    <div className="right">{this.state.socketUrl}</div>
                  </ListItem>
                  <ListItem>
                    <div className="left titel">file:</div>
                    <div className="right">{this.state.appConfigFile}</div>
                  </ListItem>
                  {credentialsInput}
                  <ListItem>
                    <div className="left titel">version of app:</div>
                    <div className="right">{packageInfo.version}</div>
                  </ListItem>
                  <ListItem
                    style={{
                      background: this.state.loadFileError
                        ? 'red'
                        : 'transparent',
                      fontWeight: 'bold',
                    }}
                  >
                    <div className="left titel">error:</div>
                    <div className="right">
                      {this.state.loadFileError
                        ? this.state.loadFileError
                        : 'no error'}
                    </div>
                  </ListItem>
                  <ConfigMessage
                    show={this.versionError}
                    configFileName={this.state.appConfigFile}
                    builderLink="/minuvis/builder/"
                  />
                  <ListItem>
                    <Button
                      modifier="large--cta"
                      onClick={this.resetServerConfig}
                    >
                      Server-Adresse ändern
                    </Button>
                  </ListItem>
                </List>
              </Col>
            </Row>
          </Page>
        </div>
      );
    } else {
      return (
        <div>
          <StyleLoader theme={this.state.appConfig.theme} />
          {
            <MainController
              theme={this.state.appConfig.theme}
              socket={this.configSocket}
              connected={this.state._socket_connected}
              appConfig={this.state.appConfig}
              hasAppConfig={this.state.hasAppConfig}
              usedStates={this.state.usedStates}
              version={packageInfo.version}
            />
          }
        </div>
      );
    }
  }
}
