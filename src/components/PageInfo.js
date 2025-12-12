import React from 'react';
import {Page, List, ListItem, Button} from 'react-onsenui';
import Toolbar from './widgets/Toolbar';
import Footer from './widgets/Footer';
import Banner from './widgets/Banner';
import CSSJSON from 'cssjson';
import {openSourceLicensesHtml} from './utils/OpenSourceLicenses';

import moment from 'moment';
moment.locale ('de-DE');

export default class PageInfo extends React.Component {
  renderToolbar () {
    return (
      <Toolbar
        title="Info"
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

  pushPage () {}

  clearCredentials = () => {
    localStorage.clear ();
    window.location.reload();
  };

  render () {
    console.info ('Render PageInfo.js');
    console.info (this.props);

    let styleToInject =
      '<style>' + CSSJSON.toCSS (this.props.pageConfig.css) + '</style>';

    let width = window.innerWidth > 0 ? window.innerWidth : window.screen.width;
    // console.log(width);

    // nur anzeigen wenn erforderlich
    if (this.props.pageConfig.UUID !== this.props.activePageName) {
      return null;
    }

    return (
      <Page renderToolbar={this.renderToolbar.bind (this)}>
        <span
          style={{display: 'none'}}
          dangerouslySetInnerHTML={{__html: styleToInject}}
        />
        <Banner
          config={this.props.pageConfig.banner}
          connected={this.props.connected}
          socket={this.props.socket}
          states={this.props.states}
        />

        <List id={'appVersion'}>
          <ListItem>
            <div className="right">
              <output>
                {'minuvis for web version ' + this.props.version}{' '}
              </output>
            </div>
          </ListItem>
          <ListItem>
            <div className="left titel">url:</div>
            <div className="right">{this.props.pageConfig.url}</div>
          </ListItem>
          <ListItem>
            <div className="left titel">file:</div>
            <div className="right">{this.props.pageConfig.file}</div>
          </ListItem>
          <ListItem>
            <div className="left titel">device width:</div>
            <div className="right">{width + 'px'}</div>
          </ListItem>
          <ListItem>
            <Button modifier="large--cta" onClick={this.clearCredentials}>
              clear user and password
            </Button>
          </ListItem>
          <ListItem>
            <div className="left titel titleIcon">
              <span className={'titleIcon mfd-icon message_info'} />
              OpenSource Licenses
            </div>
          </ListItem>
          <ListItem>
            <div style={{width: 100 + '%'}}>
              <div
                className="htmloutput"
                style={{width: 100 + '%'}}
                dangerouslySetInnerHTML={{
                  __html: openSourceLicensesHtml (),
                }}
              />
            </div>
          </ListItem>
        </List>
        <Footer version={this.props.version} />
      </Page>
    );
  }
}
