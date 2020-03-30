import React from 'react';
import moment from 'moment';
moment.locale('de-DE');

export default function AlarmZeile (props) {
  

  return (
    <ons-col>
      <ons-list>
        <ons-list-header>
            {moment(props.state.ts).format('LLL')}
        </ons-list-header>
        <ons-list-item>
          <div className="left titel">
             {props.meldeText}
          </div>          
        </ons-list-item>
      </ons-list>
    </ons-col>
  );
}

