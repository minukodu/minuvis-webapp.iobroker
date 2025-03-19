import React from 'react';
import {List, ListItem} from 'react-onsenui';
import moment from 'moment';
moment.locale ('de-DE');

export default class Banner extends React.Component {
  constructor () {
    super ();
    this.state = {
      val: 'no data',
      ts: moment (),
    };
  }

  render () {
    // console.debug("Render banner");
    // console.log(this.props);

    // init
    let val = 'no data';
    let ts = moment ();

    if (this.props.config.useBanner === true && val && val.length > 3) {
      // read value and timestamp from props if available
      if (
        this.props.widgetData.states &&
        this.props.states[this.props.config.stateId] &&
        this.props.states[this.props.config.stateId].received === true
      ) {
        val = this.props.states[this.props.config.stateId].val;
        ts = this.props.states[this.props.config.stateId].ts;
      } else {
        // read from this.state
        val = this.state.val;
        ts = this.state.ts;
      }

      return (
        <List className="banner">
          <ListItem>
            <div style={{width: 99 + '%', margin: '0 auto'}}>
              <div
                className="banner"
                style={{width: 100 + '%'}}
                dangerouslySetInnerHTML={{__html: val}}
              />
            </div>
          </ListItem>
        </List>
      );
    } else {
      return null;
    }
  }
}
