import React from 'react';
import * as Ons from 'react-onsenui';
import Toolbar from './widgets/Toolbar';
import SettingsSchalterMitReload from './settings/SettingsSchalterMitReload';
import SettingsSchalter from './settings/SettingsSchalter';

export default class PageSettings extends React.Component {
  
  renderToolbar() {
    return (
      <Toolbar
        title='Einstellungen'
        showMenu={this.showMenu.bind(this)}
        nbAlarm={this.props.nbAlarm}
        displayNbAlarm={this.props.displayNbAlarm}
        LinkAlarmPage={this.props.LinkAlarmPage}
      />
    )
  }

  showMenu() {
    this.props.showMenu();
  }

  pushPage() {}

  render() {
    console.info('Render PageSettings.js')
    console.info(this.props.settinga)
    
    return (
      <Ons.Page renderToolbar={this.renderToolbar.bind(this)}>
        <ons-row>
          <SettingsSchalterMitReload
                  title='dunkles Layout' 
                  settingsId='LayoutDunkel' 
          />   
        </ons-row>
        <ons-row>
          <SettingsSchalterMitReload
                  title='Menu immer auf' 
                  settingsId='SplitterOpen' 
          />   
        </ons-row>
      </Ons.Page>
    );
  }
}




