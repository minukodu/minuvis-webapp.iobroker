import React from 'react';
import Title from "./Title";
import moment from 'moment';
moment.locale('de-DE');

export default class IframeOutput extends React.Component {

  constructor(props) {
    super(props);
    this.state = { iframeKey: 0, lastUpdateDate: Date.now() };
    setInterval(() => this.setState(s => ({
      iframeKey: s.iframeKey + 1,
      lastUpdateDate: Date.now()
    })), this.props.IframeUpdateInterval);
  }
  render() {

    console.dir(this.props);

    let title =
      <ons-list-item>
        <Title
          title={this.props.title}
          titleIcon={this.props.titleIcon}
        />
      </ons-list-item>

    if (this.props.title == "NONE") {
      title = null;
    }

    return (
      <ons-col id={this.props.UUID}>
        <ons-list>
          <ons-list-header>
            <span className="right lastupdate" style={{ float: 'right', paddingRight: '5px' }}>{moment(this.state.lastUpdateDate).format('LLL')}</span>
          </ons-list-header>
          {title}
          <ons-list-item>
            <div className="iframeoutput" style={{ width: 100 + '%' }} >
              <iframe
                key={this.state.iframeKey}
                src={this.props.IframeUrl}
                style={{ width: this.props.IframeWidth, height: this.props.IframeHeight }}
                frameBorder="0"
              />
            </div>
          </ons-list-item>
        </ons-list>
      </ons-col>
    );
  }
}




