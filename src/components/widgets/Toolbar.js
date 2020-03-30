import React from 'react';
import * as Ons from 'react-onsenui';


export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Status negate for display
    this.connectedStatus = !this.props.connected;
    return (
      <Ons.Toolbar>
        <div className='left show-only-portait'>
          <Ons.ToolbarButton onClick={this.props.showMenu}>
            <Ons.Icon icon='ion-navicon, material:md-menu' />
          </Ons.ToolbarButton>
        </div>
        <div className='center'>{this.props.title}</div>
        <div className="right">
          <span 
            className={'mfd-icon it_wifi alarm toolbar-conn-icon ' + this.connectedStatus.toString() }
            style={{ display: "block", height: "40px", width: "40px", float: "right" }}
          ></span>
          <span className="alarme-icon notification"
            onClick={this.props.LinkAlarmPage}
            style={{ display: this.props.displayNbAlarm, verticalAlign: 0, marginRight: 10 }}>{this.props.nbAlarm}
          </span>
        </div>
      </Ons.Toolbar>

    );
  }
}
