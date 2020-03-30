import React from 'react';
import moment from 'moment';
moment.locale('de-DE');

export default class IframeOutputFullWidth extends React.Component {

  constructor(props) {
    super(props);
    this.state = {iframeKey: 0, lastUpdateDate: Date.now() };
    setInterval(() => this.setState(s => ({
      iframeKey: s.iframeKey + 1,
      lastUpdateDate: Date.now()
      })), this.props.IframeUpdateInterval);
  }
  render() {
    let title = "";
    if (this.props.title !== "NONE") {
      title = <ons-list-item><div className="left titel"> { this.props.title } </div></ons-list-item>;
    }
    return (
      <ons-col>
        <ons-list>
          <ons-list-header>
              <span className="right lastupdate" style={{float: 'right', paddingRight: '5px'}}>{moment(this.state.lastUpdateDate).format('LLL')}</span>
          </ons-list-header>
          {title}
          <ons-list-item>        
            <div className="iframeoutput" style={{ width: 100 + '%' }} >
              <iframe 
                key={this.state.iframeKey}
                src={ this.props.IframeUrl } 
                style={{ width: 100 +'%', height: this.props.IframeHeight + 'px' }} 
                frameBorder="0"
              />
            </div>
          </ons-list-item>
        </ons-list>
      </ons-col>
    );
  }
}



