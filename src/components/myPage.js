import React from "react";
import { Page, Row, Col } from "react-onsenui";
import Toolbar from "./widgets/Toolbar";
import GridChanger from "./widgets/GridChanger";
import TimeStamp from "./widgets/TimeStamp";
import IframeOutput from "./widgets/IframeOutput";
import MySwitch from "./widgets/Switch";
import MySlider from "./widgets/Slider";
import MyRange from "./widgets/Range";
import Donut from "./widgets/Donut";
import JsonTable from "./widgets/JsonTable";
import HtmlOutput from "./widgets/HtmlOutput";
import IMGOutput from "./widgets/IMGOutput";
import Output from "./widgets/Output";
import Indicator from "./widgets/Indicator";
import Filler from "./widgets/Filler";
import TimePicker from "./widgets/TimePicker";
import DatePicker from "./widgets/DatePicker";
import ColorPicker from "./widgets/ColorPicker";
import HueColorPicker from "./widgets/HueColorPicker";
import FlotDiagrammPerZeitraumWrapper from "./widgets/FlotDiagrammPerZeitraumWrapper";
import ValueSwitcher from "./widgets/ValueSwitcher";
import TimeSwitch from "./widgets/TimeSwitch";
import OpenStreetMap from "./widgets/OpenStreetMap";
import CompactModeWrapper from "./widgets/CompactModeWrapper";
import LinkButton from "./widgets/LinkButton";
import Footer from "./widgets/Footer";
import Message from "./widgets/Message";
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
    let compactModeWrapper = {};
    compactModeWrapper.widgets = [];
    compactModeWrapper.title = "NONE";
    compactModeWrapper.titleIcon = "audio_play";
    compactModeWrapper.titleIconFamily = "mfd-icon";
    compactModeWrapper.UUID = "0000";
    let compactModeActive = false;
    let widget = "";

    if (this.props.pageConfig.widgets) {
      for (var widgetId in this.props.pageConfig.widgets) {
        let widgetData = this.props.pageConfig.widgets[widgetId];

        switch (widgetData.type) {
          case "compactModeStart":
            compactModeActive = true;
            compactModeWrapper.title = widgetData.title;
            compactModeWrapper.titleIcon = widgetData.titleIcon;
            compactModeWrapper.titleIconFamily = widgetData.titleIconFamily;
            compactModeWrapper.UUID = widgetData.UUID;
            break;
          case "compactModeEnd":
            compactModeActive = false;
            // now push all Widgets in Page
            pagewidgets.push(
              <CompactModeWrapper
                key={compactModeWrapper.UUID}
                UUID={compactModeWrapper.UUID}
                title={compactModeWrapper.title}
                titleIcon={compactModeWrapper.titleIcon}
                titleIconFamily={compactModeWrapper.titleIconFamily}
              >
                {compactModeWrapper.widgets}
              </CompactModeWrapper>
            );
            compactModeWrapper.widgets = [];
            compactModeWrapper.title = "NONE";
            compactModeWrapper.titleIcon = "audio_play";
            compactModeWrapper.titleIconFamily = "mfd-icon";
            compactModeWrapper.UUID = "0000";
            break;
          case "openstreetmap":
            widget = (
              <OpenStreetMap
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                stateId={widgetData.stateId}
                stateIdType={widgetData.stateIdType || "undefined"}
                height={widgetData.height}
                zoom={widgetData.zoom}
              />
            );
            pagewidgets.push(widget);
            break;
          case "iframe":
            widget = (
              <IframeOutput
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                IframeUrl={widgetData.url}
                IframeWidth={widgetData.width || "100%"}
                IframeHeight={widgetData.height}
                IframeUpdateInterval={widgetData.updateTimeSek * 1000}
              />
            );
            pagewidgets.push(widget);
            break;
          case "timestamp":
            widget = (
              <TimeStamp
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                stateId={widgetData.stateId}
                compactMode={compactModeActive}
              />
            );
            if (compactModeActive) {
              compactModeWrapper.widgets.push(widget);
            } else {
              pagewidgets.push(widget);
            }
            break;
          case "switch":
            widget = (
              <MySwitch
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                stateId={widgetData.stateId}
                stateIdType={widgetData.stateIdType || "undefined"}
                compactMode={compactModeActive}
              />
            );
            if (compactModeActive) {
              compactModeWrapper.widgets.push(widget);
            } else {
              pagewidgets.push(widget);
            }
            break;
          case "slider":
            widget = (
              <MySlider
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                stateId={widgetData.stateId}
                stateIdType={widgetData.stateIdType || "undefined"}
                min={widgetData.min}
                max={widgetData.max}
                step={widgetData.step}
                minIcon={widgetData.minIcon}
                minIconFamily={widgetData.minIconFamily}
                maxIcon={widgetData.maxIcon}
                maxIconFamily={widgetData.maxIconFamily}
                unit={widgetData.unit}
                compactMode={compactModeActive}
              />
            );
            if (compactModeActive) {
              compactModeWrapper.widgets.push(widget);
            } else {
              pagewidgets.push(widget);
            }
            break;
          case "range":
            widget = (
              <MyRange
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                stateId={widgetData.stateId}
                stateIdType={widgetData.stateIdType || "undefined"}
                min={widgetData.min}
                max={widgetData.max}
                step={widgetData.step}
                minIcon={widgetData.minIcon}
                minIconFamily={widgetData.minIconFamily}
                maxIcon={widgetData.maxIcon}
                maxIconFamily={widgetData.maxIconFamily}
                unit={widgetData.unit}
                updateOnComplete={widgetData.updateOnComplete}
                compactMode={compactModeActive}
              />
            );
            if (compactModeActive) {
              compactModeWrapper.widgets.push(widget);
            } else {
              pagewidgets.push(widget);
            }
            break;
          case "donut":
            widget = (
              <Donut
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                stateId={widgetData.stateId}
                stateIdType={widgetData.stateIdType || "undefined"}
                min={widgetData.min}
                max={widgetData.max}
                step={widgetData.step}
                unit={widgetData.unit}
                updateOnComplete={widgetData.updateOnComplete}
                readOnly={widgetData.readOnly}
                color={widgetData.color}
                minColor={widgetData.minColor}
                maxColor={widgetData.maxColor}
                minValue={widgetData.minValue}
                maxValue={widgetData.maxValue}
                compactMode={compactModeActive}
              />
            );
            if (compactModeActive) {
              compactModeWrapper.widgets.push(widget);
            } else {
              pagewidgets.push(widget);
            }
            break;
          case "jsontable":
            console.log("josntable DATA");
            console.log(widgetData);
            widget = (
              <JsonTable
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                stateId={widgetData.stateId}
                colheader={widgetData.colheader}
                colsize={widgetData.colsize}
                colsize={widgetData.colsize}
                lineBreaks={widgetData.lineBreaks}
                contentTypes={widgetData.contentTypes}
                rowsPerPage={widgetData.rowsPerPage || 5}
              />
            );
            pagewidgets.push(widget);
            break;
          case "html":
            widget = (
              <HtmlOutput
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                stateId={widgetData.stateId}
                css={this.props.pageConfig.css}
              />
            );
            pagewidgets.push(widget);
            break;
          case "imgoutput":
            widget = (
              <IMGOutput
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                IMGUrl={widgetData.url}
                IMGUpdateInterval={widgetData.updateTimeSek * 1000}
              />
            );
            pagewidgets.push(widget);
            break;
          case "output":
            widget = (
              <Output
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                stateId={widgetData.stateId}
                stateIdType={widgetData.stateIdType || "undefined"}
                unit={widgetData.unit}
                format={widgetData.format}
                color={widgetData.color}
                minColor={widgetData.minColor}
                maxColor={widgetData.maxColor}
                minValue={widgetData.minValue}
                maxValue={widgetData.maxValue}
                compactMode={compactModeActive}
              />
            );
            if (compactModeActive) {
              compactModeWrapper.widgets.push(widget);
            } else {
              pagewidgets.push(widget);
            }
            break;
          case "indicator":
            widget = (
              <Indicator
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                stateId={widgetData.stateId}
                stateIdType={widgetData.stateIdType || "undefined"}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                icon={widgetData.icon}
                iconFamily={widgetData.iconFamily}
                colorWhenTrue={widgetData.colorWhenTrue}
                colorWhenFalse={widgetData.colorWhenFalse}
                alwaysTrue={false}
                compactMode={compactModeActive}
              />
            );
            if (compactModeActive) {
              compactModeWrapper.widgets.push(widget);
            } else {
              pagewidgets.push(widget);
            }
            break;
          case "timepicker":
            widget = (
              <TimePicker
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                stateId={widgetData.stateId}
                compactMode={compactModeActive}
              />
            );
            if (compactModeActive) {
              compactModeWrapper.widgets.push(widget);
            } else {
              pagewidgets.push(widget);
            }
            break;
          case "datepicker":
            widget = (
              <DatePicker
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                stateId={widgetData.stateId}
                format={widgetData.format}
                compactMode={compactModeActive}
              />
            );
            if (compactModeActive) {
              compactModeWrapper.widgets.push(widget);
            } else {
              pagewidgets.push(widget);
            }
            break;
          case "colorpicker":
            widget = (
              <ColorPicker
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                stateId={widgetData.stateId}
                formatWithWhite={widgetData.formatWithWhite}
                compactMode={compactModeActive}
              />
            );
            if (compactModeActive) {
              compactModeWrapper.widgets.push(widget);
            } else {
              pagewidgets.push(widget);
            }
            break;
          case "huecolorpicker":
            widget = (
              <HueColorPicker
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                stateId={widgetData.stateId}
                formatWithWhite={widgetData.formatWithWhite}
                compactMode={compactModeActive}
              />
            );
            if (compactModeActive) {
              compactModeWrapper.widgets.push(widget);
            } else {
              pagewidgets.push(widget);
            }
            break;
          case "flot":
            widget = (
              <FlotDiagrammPerZeitraumWrapper
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
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
                  widgetData.area4Time,
                ]}
                timeFormat={["%h:%M", "%h:%M", "%a.", "%d.%m"]}
                rangeNames={[
                  widgetData.area1Name,
                  widgetData.area2Name,
                  widgetData.area3Name,
                  widgetData.area4Name,
                ]}
                defaultRange={1} // 0 .. 3;
                additionalClass={""} //{"chart-col"} // z.B. "chart-col" für 100% Breite
              />
            );
            pagewidgets.push(widget);
            break;
          case "valueswitcher":
            widget = (
              <ValueSwitcher
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                stateId={widgetData.stateId}
                stateIdType={widgetData.stateIdType || "undefined"}
                unit={widgetData.unit || ""}
                hideValue={widgetData.hideValue}
                hideText={widgetData.hideText}
                readOnly={widgetData.readOnly}
                showAsIndicator={widgetData.showAsIndicator}
                hightlightExactValueOnly={widgetData.hightlightExactValueOnly}
                nbOfButtons={widgetData.nbOfButtons}
                icon1={widgetData.icon1}
                iconFamily1={widgetData.iconFamily1}
                value1={widgetData.value1}
                icon2={widgetData.icon2}
                iconFamily2={widgetData.iconFamily2}
                value2={widgetData.value2}
                icon3={widgetData.icon3}
                iconFamily3={widgetData.iconFamily3}
                value3={widgetData.value3}
                icon4={widgetData.icon4}
                iconFamily4={widgetData.iconFamily4}
                value4={widgetData.value4}
                indicatorColor1={widgetData.indicatorColor1 || "#FFFFFF"}
                indicatorColor2={widgetData.indicatorColor2 || "#FFFFFF"}
                indicatorColor3={widgetData.indicatorColor3 || "#FFFFFF"}
                indicatorColor4={widgetData.indicatorColor4 || "#FFFFFF"}
                compactMode={compactModeActive}
              />
            );
            if (compactModeActive) {
              compactModeWrapper.widgets.push(widget);
            } else {
              pagewidgets.push(widget);
            }
            break;
          case "timeswitch":
            // console.log("insert timeswitch");
            // console.log(widgetData);
            widget = (
              <TimeSwitch
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                stateId={widgetData.stateId}
                triggers={widgetData.triggers}
                action={widgetData.action}
              />
            );
            pagewidgets.push(widget);
            break;
          case "linkbutton":
            widget = (
              <LinkButton
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                pageLinks={this.props.pageLinks}
                targetpage={widgetData.targetpage}
              />
            );
            pagewidgets.push(widget);
            break;
          case "gridChanger":
            widget = (
              <GridChanger
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                nbOfRows={widgetData.nbOfRows}
              />
            );
            pagewidgets.push(widget);
            break;
          case "filler":
            widget = (
              <Filler
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                title={widgetData.title}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                showAsHeader={widgetData.showAsHeader || false}
                compactMode={compactModeActive}
              />
            );
            if (compactModeActive) {
              compactModeWrapper.widgets.push(widget);
            } else {
              pagewidgets.push(widget);
            }
            break;
          default:
            pagewidgets.push(
              <Message
                text={"Widget " + widgetData.type + " nicht vorhanden"}
              />
            );
            break;
        } // switch
      } // for
    } // if WidgetData

    // close open compactModeWrapper.widgets
    if (compactModeActive === true) {
      compactModeActive = false;
      pagewidgets.push(compactModeWrapper.widgets);
      compactModeWrapper.widgets = null;
    }

    // inject css
    console.log("this.props.pageConfig.css");
    console.log(this.props.pageConfig.css);

    let styleToInject =
      "<style>" + CSSJSON.toCSS(this.props.pageConfig.css) + "</style>";

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
