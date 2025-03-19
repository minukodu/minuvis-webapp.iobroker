import React from 'react';
import { Page } from 'react-onsenui';
import Toolbar from './widgets/Toolbar';
import MyCard from './widgets/MyCard';
import IframeOutput from './widgets/IframeOutput';
import MySwitch from './widgets/Switch';
import TextInput from './widgets/TextInput';
import DropDown from './widgets/DropDown';
import ImgButton from './widgets/ImgButton';
import MyRange from './widgets/Range';
import Donut from './widgets/Donut';
import JsonTable from './widgets/JsonTable';
import HtmlOutput from './widgets/HtmlOutput';
import IMGOutput from './widgets/IMGOutput';
import Output from './widgets/Output';
import Schedex from './widgets/Schedex';
import Indicator from './widgets/Indicator';
import HeadLine from './widgets/HeadLine';
import TimePicker from './widgets/TimePicker';
import DatePicker from './widgets/DatePicker';
import ColorPicker from './widgets/ColorPicker';
import HueColorPicker from './widgets/HueColorPicker';
import FlotDiagrammPerZeitraumWrapper
  from './widgets/FlotDiagrammPerZeitraumWrapper';
import MyChartPerZeitraumWrapper from './widgets/MyChartPerZeitraumWrapper';
import ValueSwitcher from './widgets/ValueSwitcher';
import OpenStreetMap from './widgets/OpenStreetMap';
import LinkButton from './widgets/LinkButton';
import DateTime from './widgets/DateTime';
import Banner from './widgets/Banner';
import Footer from './widgets/Footer';
import Message from './widgets/Message';
import CSSJSON from 'cssjson';

export default class myPage extends React.Component {
  constructor(props) {
    super(props);
  }

  renderToolbar() {
    return (
      <Toolbar
        title={this.props.pageConfig.title}
        showMenu={this.showMenu.bind(this)}
        nbAlarm={this.props.nbAlarm}
        displayNbAlarm={this.props.displayNbAlarm}
        LinkAlarmPage={this.props.LinkAlarmPage}
        connected={this.props.connected}
      />
    );
  }

  showMenu() {
    //console.log(this.props);
    this.props.showMenu();
  }

  pushPage() { }

  render() {
    console.log('render mypage ' + this.props.pageConfig.title);
    console.log(this.props);

    let widget = '';

    //////////////////////////////////////////////////////////////////////////////////////////////
    let innerWidth = window.innerWidth;
    let nbOfCols = 18;
    // if (innerWidth < 1200) { nbOfCols = 12 }
    // if (innerWidth < 600) { nbOfCols = 6 }
    //////////////////////////////////////////////////////////////////////////////////////////////

    if (this.props.pageConfig.widgets) {
      //////////////////////////////////////////////////////////////////////////////////////////////
      var gridBoxes = [];
      var maxRow = 1;
      var rowHeight = 67;
      //////////////////////////////////////////////////////////////////////////////////////////////

      for (var widgetId in this.props.pageConfig.widgets) {
        let widgetData = this.props.pageConfig.widgets[widgetId];

        // extend widgetData
        widgetData.rowHeight = rowHeight;
        widgetData.connected = this.props.connected;
        widgetData.socket = this.props.socket;
        widgetData.states = this.props.states;
        widgetData.theme = this.props.theme;

        switch (widgetData.type) {
          case 'card':
            widgetData.pageLinks = this.props.pageLinks;
            widget = <MyCard widgetData={widgetData} />;
            break;
          case 'datetime':
            widget = <DateTime widgetData={widgetData} />;
            break;
          case 'schedex':
            widget = <Schedex widgetData={widgetData} />;
            break;
          case 'openstreetmap':
            widget = <OpenStreetMap widgetData={widgetData} />;
            break;
          case 'iframe':
            widget = <IframeOutput widgetData={widgetData} />;
            break;
          case 'switch':
            widget = <MySwitch widgetData={widgetData} />;
            break;
          case 'textInput':
            widget = <TextInput widgetData={widgetData} />;
            break;
          case 'dropDown':
            widget = <DropDown widgetData={widgetData} />;
            break;
          case 'imgButton':
            widget = <ImgButton widgetData={widgetData} />;
            break;
          case 'slider':
          case 'range':
            widget = <MyRange widgetData={widgetData} />;
            break;
          case 'donut':
            widget = <Donut widgetData={widgetData} />;
            break;
          case 'jsontable':
            widget = <JsonTable widgetData={widgetData} />;
            break;
          case 'html':
            widget = <HtmlOutput widgetData={widgetData} />;
            break;
          case 'imgoutput':
            widget = <IMGOutput widgetData={widgetData} />;
            break;
          case 'output':
            widget = <Output widgetData={widgetData} />;
            break;
          case 'indicator':
            widget = <Indicator widgetData={widgetData} />;
            break;
          case 'timepicker':
            widget = <TimePicker widgetData={widgetData} />;
            break;
          case 'datepicker':
            widget = <DatePicker widgetData={widgetData} />;
            break;
          case 'colorpicker':
            widget = <ColorPicker widgetData={widgetData} />;
            break;
          case 'huecolorpicker':
            widget = <HueColorPicker widgetData={widgetData} />;
            break;
          case 'flot':
            widget = <FlotDiagrammPerZeitraumWrapper widgetData={widgetData} />;
            break;
          case 'chart':
            widget = <MyChartPerZeitraumWrapper widgetData={widgetData} />;
            break;
          case 'valueswitcher':
            widget = <ValueSwitcher widgetData={widgetData} />;
            break;
          case 'linkbutton':
            widgetData.pageLinks = this.props.pageLinks;
            widget = <LinkButton widgetData={widgetData} />;
            break;
          case 'filler':
          case 'headline':
            widget = <HeadLine widgetData={widgetData} />;
            break;
          default:
            widget = (
              <Message
                text={'Widget ' + widgetData.type + ' nicht vorhanden'}
              />
            );
            break;
        } // switch

        //////////////////////////////////////////////////////////////////////////////////////////////
        console.log(this.props.windowWidth);
        var borderClasses = '';
        if (widgetData.borderTop && widgetData.borderTop === true) {
          borderClasses += 'borderTop ';
        }
        if (widgetData.borderRight && widgetData.borderRight === true) {
          borderClasses += 'borderRight ';
        }
        if (widgetData.borderBottom && widgetData.borderBottom === true) {
          borderClasses += 'borderBottom ';
        }
        if (widgetData.borderLeft && widgetData.borderLeft === true) {
          borderClasses += 'borderLeft ';
        }
        // only 1 high  if schowInModal
        if (widgetData.showInModal === true) {
          widgetData.widgetHeight = 1;
        }

        gridBoxes.push(
          <div
            key={
              'gridBox_' + widgetData.widgetPosX + '_' + widgetData.widgetPosY
            }
            className={'gridBox ' + borderClasses}
            style={{
              gridColumnStart: widgetData.widgetPosX + 1,
              gridColumnEnd: widgetData.widgetPosX + widgetData.widgetWidth + 1,
              gridRowStart: widgetData.widgetPosY + 1,
              gridRowEnd: widgetData.widgetPosY + widgetData.widgetHeight + 1,
              overflow: 'hidden',
            }}
          >
            {widget}
          </div>
        );

        if (widgetData.widgetPosY + widgetData.widgetHeight > maxRow) {
          maxRow =
            parseFloat(widgetData.widgetPosY) +
            parseFloat(widgetData.widgetHeight);
        }
        //////////////////////////////////////////////////////////////////////////////////////////////
      } // for
    } // if WidgetData

    // inject css
    console.log('this.props.pageConfig.css');
    console.log(this.props.pageConfig.css);

    let styleToInject =
      '<style>' + CSSJSON.toCSS(this.props.pageConfig.css) + '</style>';

    //////////////////////////////////////////////////////////////////////////////////////////////

    let pageGrid = [];
    let rowStyle = 'repeat(' + maxRow + ', 67px)'; // 55px ListItem 12 px ListHeader
    let colWidth = 100 / nbOfCols;
    let colStyle = 'repeat(' + nbOfCols + ', ' + colWidth + '%)';

    // console.log("maxRow="+ maxRow);
    // console.log(rowStyle);
    //console.log(innerWidth);

    pageGrid.push(
      <div
        key="gridWrapper"
        className="gridWrapper"
        style={{
          display: 'grid',
          gridGap: '0px',
          gridTemplateColumns: colStyle,
          gridTemplateRows: rowStyle,
          margin: '0 auto',
          width: '99%',
        }}
      >
        {gridBoxes}
      </div>
    );
    //////////////////////////////////////////////////////////////////////////////////////////////

    console.log('render myPage');
    console.log(this.props);
    console.log(this.props.socket);

    console.log(
      'MyPage check UUID: ' +
      this.props.pageConfig.UUID +
      ' active: ' +
      this.props.activePageName
    );

    // nur anzeigen wenn erforderlich
    if (this.props.pageConfig.UUID !== this.props.activePageName) {
      return null;
    }

    return (
      <Page renderToolbar={this.renderToolbar.bind(this)}>
        <span
          style={{ display: 'none' }}
          dangerouslySetInnerHTML={{ __html: styleToInject }}
        />
        <Banner
          config={this.props.pageConfig.banner}
          connected={this.props.connected}
          socket={this.props.socket}
          states={this.props.states}
        />
        <div>{pageGrid}</div>
        <Footer version={this.props.version} />
      </Page>
    );
  }
}
