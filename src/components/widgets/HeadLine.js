import React from 'react';
import Title from './Title';
import {Col, List, ListItem, ListHeader} from 'react-onsenui';

export default function HeadLine (props) {
  console.log ('############## HeadLine Start #################');
  console.log (props);

  function gotoTarget () {
    if (props.widgetData.isLink === true) {
      // console.warn ('props.widgetData.pageLinks:');
      // console.warn (props.widgetData.pageLinks);
      // console.warn (props.widgetData.targetpage);
      props.widgetData.pageLinks[props.widgetData.targetpage] ();
    }
  }

  let header = null;
  if (props.widgetData.timestamp && props.widgetData.timestamp === true) {
    header = <ListHeader />;
  }
  let fontSize = props.widgetData.fontSize || 100;
  let classes = props.widgetData.classes || 'left';

  let color = props.widgetData.color;
  if (
    props.widgetData.useThemeColor &&
    props.widgetData.useThemeColor === true
  ) {
    color = 'var(--text-color)';
  }

  return (
    <Col id={props.widgetData.UUID} className={'filler headline ' + classes}>
      <List>
        {header}
        <ListItem onClick={gotoTarget} style={{padding: 0}}>
          <Title
            title={props.widgetData.title}
            titleIcon={props.widgetData.titleIcon}
            titleIconFamily={props.widgetData.titleIconFamily}
            fontSize={fontSize}
            compactMode={props.widgetData.compactMode}
            classes={classes}
            widgetHeight={props.widgetData.widgetHeight}
            color={color}
          />
        </ListItem>
      </List>
    </Col>
  );
}
