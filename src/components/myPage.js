import React from "react";
import { Page, Row, Col } from "react-onsenui";
import Toolbar from "./widgets/Toolbar";
import IframeOutput from "./widgets/IframeOutput";
import MySwitch from "./widgets/Switch";
import MySlider from "./widgets/Slider";
import HtmlOutput from "./widgets/HtmlOutput";
import IMGOutput from "./widgets/IMGOutput";
import Output from "./widgets/Output";
import Indicator from "./widgets/Indicator";
import Filler from "./widgets/Filler";
import TimePicker from "./widgets/TimePicker";
import FlotDiagrammPerZeitraumWrapper from "./widgets/FlotDiagrammPerZeitraumWrapper";
import ValueSwitcher from "./widgets/ValueSwitcher";
import TimeSwitch from "./widgets/TimeSwitch";
import Footer from "./widgets/Footer";
import CSSJSON from "cssjson";

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
    this.props.showMenu();
  }

  pushPage() { }

  render() {
    console.log("render mypage " + this.props.pageConfig.title);
    console.log(this.props);

    let pagewidgets = [];

    if (this.props.pageConfig.widgets) {
      for (var widgetId in this.props.pageConfig.widgets) {
        let widgetData = this.props.pageConfig.widgets[widgetId];

        switch (widgetData.type) {
          case "iframe":
            pagewidgets.push(
              <IframeOutput
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                IframeUrl={widgetData.url}
                IframeWidth={widgetData.width || "100%"}
                IframeHeight={widgetData.height}
                IframeUpdateInterval={widgetData.updateTimeSek * 1000}
              />
            );
            break;
          case "switch":
            pagewidgets.push(
              <MySwitch
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                stateId={widgetData.stateId}
              />
            );
            break;
          case "slider":
            pagewidgets.push(
              <MySlider
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                stateId={widgetData.stateId}
                min={widgetData.min}
                max={widgetData.max}
                step={widgetData.step}
                minIcon={widgetData.minIcon}
                maxIcon={widgetData.maxIcon}
                unit={widgetData.unit}
              />
            );
            break;
          case "html":
            pagewidgets.push(
              <HtmlOutput
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                stateId={widgetData.stateId}
                css={this.props.pageConfig.css}
              />
            );
            break;
          case "imgoutput":
            pagewidgets.push(
              <IMGOutput
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                IMGUrl={widgetData.url}
                IMGUpdateInterval={widgetData.updateTimeSek * 1000}
              />
            );
            break;
          case "output":
            pagewidgets.push(
              <Output
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                stateId={widgetData.stateId}
                unit={widgetData.unit}
                format={widgetData.format}
                color={widgetData.color}
                minColor={widgetData.minColor}
                maxColor={widgetData.maxColor}
                minValue={widgetData.minValue}
                maxValue={widgetData.maxValue}
              />
            );
            break;
          case "indicator":
            pagewidgets.push(
              <Indicator
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                stateId={widgetData.stateId}
                titleIcon={widgetData.titleIcon}
                icon={widgetData.icon}
                colorWhenTrue={widgetData.colorWhenTrue}
                colorWhenFalse={widgetData.colorWhenFalse}
              />
            );
            break;
          case "timepicker":
            pagewidgets.push(
              <TimePicker
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                stateId={widgetData.stateId}
              />
            );
            break;
          case "flot":
            pagewidgets.push(
              <FlotDiagrammPerZeitraumWrapper
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                FlotUrl={widgetData.url}
                FlotWidth={"100%"}
                FlotHeight={widgetData.height}
                FlotWindowBG={"282828"}
                FlotZoom={"false"}
                FlotHoverDetail={"true"}
                ranges={[
                  widgetData.area1Time,
                  widgetData.area2Time,
                  widgetData.area3Time,
                  widgetData.area4Time
                ]}
                timeFormat={["%h:%M", "%h:%M", "%a.", "%d.%m"]}
                rangeNames={[
                  widgetData.area1Name,
                  widgetData.area2Name,
                  widgetData.area3Name,
                  widgetData.area4Name
                ]}
                defaultRange={1} // 0 .. 3;
                additionalClass={""} //{"chart-col"} // z.B. "chart-col" für 100% Breite
              />
            );
            break;
          case "valueswitcher":
            pagewidgets.push(
              <ValueSwitcher
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                stateId={widgetData.stateId}
                unit={widgetData.unit || ""}
                nbOfButtons={widgetData.nbOfButtons}
                icon1={widgetData.icon1}
                value1={widgetData.value1}
                icon2={widgetData.icon2}
                value2={widgetData.value2}
                icon3={widgetData.icon3}
                value3={widgetData.value3}
                icon4={widgetData.icon4}
                value4={widgetData.value4}
              />
            );
            break;
          case "timeswitch":
            // console.log("insert timeswitch");
            // console.log(widgetData);
            pagewidgets.push(
              <TimeSwitch
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                stateId={widgetData.stateId}
                triggers={widgetData.triggers}
                action={widgetData.action}
              />
            );
            break;
          case "filler":
            pagewidgets.push(<Filler key={widgetData.UUID} UUID={widgetData.UUID} />);
            break;
          default:
            pagewidgets.push(
              <Col>
                <div>Widget {widgetData.type} nicht vorhanden</div>
              </Col>
            );
            break;
        } // switch
      } // for
    } // if WidgetData

    // inject css
    console.log("this.props.pageConfig.css");
    console.log(this.props.pageConfig.css);

    let styleToInject = "<style>" + CSSJSON.toCSS(this.props.pageConfig.css) + "</style>";

    return (
      <Page renderToolbar={this.renderToolbar.bind(this)}>
        <span
          style={{ display: "none" }}
          dangerouslySetInnerHTML={{ __html: styleToInject }}
        ></span>
        <Row>{pagewidgets}</Row>
        <Footer version={this.props.version} />
      </Page>
    );
  }
}
