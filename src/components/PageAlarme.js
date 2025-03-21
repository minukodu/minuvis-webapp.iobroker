import React from 'react';
import {Page, Row, List, ListItem, Button} from 'react-onsenui';
import Toolbar from './widgets/Toolbar';
import MinuaruAlarmTable from './widgets/MinuaruAlarmTableV2';
import Footer from './widgets/Footer';
import Banner from './widgets/Banner';

export default class PageAlarme extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      showHistory: false,
      pageTitle: 'anstehende Alarme',
      iconClass: 'mdi-icon format-list-bulleted-triangle active',
    };
    // console.log("Super: Alarmpage hide History");
  }

  renderToolbar () {
    return (
      <Toolbar
        title="Alarme"
        showMenu={this.showMenu.bind (this)}
        nbAlarm={this.props.nbAlarm}
        displayNbAlarm={this.props.displayNbAlarm}
        LinkAlarmPage={this.props.LinkAlarmPage}
        connected={this.props.connected}
      />
    );
  }

  showMenu () {
    this.props.showMenu ();
  }

  showHistory () {
    this.setState ({
      showHistory: true,
      pageTitle: 'Alarmhistorie',
      iconClass: 'mdi-icon format-list-bulleted-type history',
    });
    // console.log("Alarmpage show History");
    // console.log(this.state.showHistory);
  }
  hideHistory () {
    this.setState ({
      showHistory: false,
      pageTitle: 'Anstehende Alarme',
      iconClass: 'mdi-icon format-list-bulleted-triangle active',
    });
    // console.log("Alarmpage hide History");
    // console.log(this.state.showHistory);
  }

  quitAlarm(variableName) {
    //e.preventDefault();
    console.log('quitAlarm stateID=' + variableName);
    this.props.socket.emit('setState', "minuaru.0.stateIdToAcknowledge", variableName);
  }

  pushPage () {}

  render () {
    // console.log("render PAgeAlarm");
    // console.log(this.props);

    // nur anzeigen wenn erforderlich
    if (this.props.pageConfig.UUID !== this.props.activePageName) {
      return null;
    }

    return (
      <Page renderToolbar={this.renderToolbar.bind (this)}>
        <Banner
          config={this.props.pageConfig.banner}
          connected={this.props.connected}
          socket={this.props.socket}
          states={this.props.states}
        />
        <Row>
          <List>
            <ListItem>
              <div className="left titel alarmPageTitle">
                <span>{this.state.pageTitle}</span>
                <i className={this.state.iconClass + ' alarmPageIcon'} />
              </div>
              <div className="center" />
              <div className="right">
                <Button
                  className="alarmPageButton"
                  style={
                    this.state.showHistory
                      ? {display: 'block'}
                      : {display: 'none'}
                  }
                  disable-auto-styling
                  onClick={this.hideHistory.bind (this)}
                >
                  <span>Anstehende Alarme</span>
                  <i
                    className={
                      'mdi-icon format-list-bulleted-triangle active' +
                        ' alarmPageIcon'
                    }
                  />
                </Button>
                <Button
                  className="alarmPageButton"
                  style={
                    this.state.showHistory
                      ? {display: 'none'}
                      : {display: 'block'}
                  }
                  disable-auto-styling
                  onClick={this.showHistory.bind (this)}
                >
                  <span>Historie</span>
                  <i
                    className={
                      'mdi-icon format-list-bulleted-type history' +
                        ' alarmPageIcon'
                    }
                  />
                </Button>
              </div>
            </ListItem>
          </List>
          <span
            className="alarm-col"
            style={
              this.props.pageConfig.minuaru && !this.state.showHistory
                ? {display: 'block'}
                : {display: 'none'}
            }
          >
            <MinuaruAlarmTable
              socket={this.props.socket}
              quitAlarm={this.quitAlarm}
              title="NONE"
              stateId="minuaru.0.jsonAlarmsActive"
              state={this.props.states['minuaru.0.jsonAlarmsActive']}
              config={this.props.states['minuaru.0.minuVisConfig']}
              tableClass="active"
              VarNameQuit="minuaru.0.stateIdToAcknowledge"
              noDataText="keine anstehenden Alarme"
              showTimeGoes={false}
              showTimeQuit={true}
            />
          </span>
          <span
            className="alarm-col"
            style={
              this.state.showHistory && this.props.pageConfig.minuaru
                ? {display: 'block'}
                : {display: 'none'}
            }
          >
            <MinuaruAlarmTable
              socket={this.props.socket}
              splitterOpen={this.props.appConfig.settings.SplitterOpen}
              quitAlarm={this.quitAlarm}
              title="NONE"
              stateId="minuaru.0.jsonAlarmHistory"
              state={this.props.states['minuaru.0.jsonAlarmHistory']}
              config={this.props.states['minuaru.0.minuVisConfig']}
              tableClass="history"
              VarNameQuit="minuaru.0.stateIdToAcknowledge"
              noDataText="keine Alarme in der Datenbank"
              showTimeGoes={true}
              showTimeQuit={true}
            />
          </span>
        </Row>
        <Footer version={this.props.version} />
      </Page>
    );
  }
}
