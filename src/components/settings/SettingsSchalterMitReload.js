import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-onsenui';
import moment from 'moment';
import { ReadSettings } from './settingsStorage.js';
import { SaveSetting } from './settingsStorage.js';
import { ReadSetting } from './settingsStorage.js';

moment.locale('de-DE');

export default function SettingsSchalterMitReload (props) {
  
  function sendValue(e) {
    SaveSetting ( props.settingsId, e.target.checked);
    window.location.reload();
  }
  function stringToBoolean (val){
      if (typeof(val) === "number") { return Boolean(val); }
      if (typeof(val) !== "string") { return val; }
      switch(val.toLowerCase().trim()){
          case "true": case "yes": case "1": return true;
          case "false": case "no": case "0": case null: return false;
          default: return Boolean(val);
      }
  }
  return (
    <ons-col>
      <ons-list>
        <ons-list-header>
            <span className="right lastupdate" style={{float: 'right', paddingRight: '5px'}}>{moment().format('LLL')}</span>
        </ons-list-header>
        <ons-list-item>
          <div className="left titel">
             {props.title}
          </div>          
          <div className="right">
             <Switch disable-auto-styling onChange={sendValue} checked={stringToBoolean(ReadSetting(props.settingsId, false))}></Switch>
          </div>
        </ons-list-item>
      </ons-list>
    </ons-col>
  );
}

SettingsSchalterMitReload.propTypes = {
  title:        PropTypes.string.isRequired,
  settingsId:   PropTypes.string.isRequired,
};