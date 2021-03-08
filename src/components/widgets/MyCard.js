import React from "react";
import { Card, Modal, List, ListItem, Fab } from "react-onsenui";
import IframeOutput from "./IframeOutput";
import MySwitch from "./Switch";
import TextInput from "./TextInput";
import ImgButton from "./ImgButton";
import MySlider from "./Slider";
import MyRange from "./Range";
import Donut from "./Donut";
import JsonTable from "./JsonTable";
import HtmlOutput from "./HtmlOutput";
import IMGOutput from "./IMGOutput";
import Output from "./Output";
import Indicator from "./Indicator";
import HeadLine from "./HeadLine";
import TimePicker from "./TimePicker";
import DatePicker from "./DatePicker";
import ColorPicker from "./ColorPicker";
import HueColorPicker from "./HueColorPicker";
import FlotDiagrammPerZeitraumWrapper from "./FlotDiagrammPerZeitraumWrapper";
import ValueSwitcher from "./ValueSwitcher";
import OpenStreetMap from "./OpenStreetMap";
import LinkButton from "./LinkButton";
import DateTime from "./DateTime";
import Message from "./Message";


import moment from "moment";
moment.locale("de-DE");

export default class MyCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  };

  showModal() {
    this.setState({ showModal: true });
  }
  hideModal() {
    this.setState({ showModal: false });
  }

  render() {
    let pagewidgets = [];
    let widget = "";

    //////////////////////////////////////////////////////////////////////////////////////////////
    let nbOfCols = 18;
    //////////////////////////////////////////////////////////////////////////////////////////////


    if (this.props.widgets) {

      //////////////////////////////////////////////////////////////////////////////////////////////
      var gridBoxes = [];
      var maxRow = 1;
      //////////////////////////////////////////////////////////////////////////////////////////////

      for (var widgetId in this.props.widgets) {
        let widgetData = this.props.widgets[widgetId];
        console.log("MyCard WidgetData");
        console.log(widgetData);

        switch (widgetData.type) {
          case "datetime":
            widget = (
              <DateTime
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                widgetHeight={widgetData.widgetHeight}
                rowHeight={67}
                fontSize={widgetData.fontSize}
                format={widgetData.format}
                timeOffsetMin={widgetData.timeOffsetMin}
                showAnalog={widgetData.showAnalog}
                timestamp={widgetData.timestamp}
              />
            );
            pagewidgets.push(widget);
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
                widgetHeight={widgetData.widgetHeight}
                rowHeight={67}
                zoom={widgetData.zoom}
                widgetWidth={widgetData.widgetWidth}
                timestamp={widgetData.timestamp}
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
                widgetWidth={widgetData.widgetWidth}
                widgetHeight={widgetData.widgetHeight}
                rowHeight={67}
                timestamp={widgetData.timestamp}
              />
            );
            pagewidgets.push(widget);
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
                widgetWidth={widgetData.widgetWidth}
                timestamp={widgetData.timestamp}
              />
            );
            pagewidgets.push(widget);
            break;
          case "textInput":
            widget = (
              <TextInput
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
                widgetWidth={widgetData.widgetWidth}
                timestamp={widgetData.timestamp}
              />
            );
            pagewidgets.push(widget);
            break;
          case "imgButton":
            widget = (
              <ImgButton
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                connected={this.props.connected}
                socket={this.props.socket}
                states={this.props.states}
                stateId={widgetData.stateId}
                stateIdType={widgetData.stateIdType || "undefined"}
                widgetWidth={widgetData.widgetWidth}
                timestamp={widgetData.timestamp}
                bgImage={widgetData.bgImage}
                setValue={widgetData.setValue}
              />
            );
            pagewidgets.push(widget);
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
                widgetWidth={widgetData.widgetWidth}
                timestamp={widgetData.timestamp}
              />
            );
            pagewidgets.push(widget);
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
                decimals={widgetData.decimals}
                minIcon={widgetData.minIcon}
                minIconFamily={widgetData.minIconFamily}
                maxIcon={widgetData.maxIcon}
                maxIconFamily={widgetData.maxIconFamily}
                unit={widgetData.unit}
                updateOnComplete={widgetData.updateOnComplete}
                widgetWidth={widgetData.widgetWidth}
                timestamp={widgetData.timestamp}
              />
            );
            pagewidgets.push(widget);
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
                decimals={widgetData.decimals}
                unit={widgetData.unit}
                updateOnComplete={widgetData.updateOnComplete}
                readOnly={widgetData.readOnly}
                color={widgetData.color}
                minColor={widgetData.minColor}
                maxColor={widgetData.maxColor}
                minValue={widgetData.minValue}
                maxValue={widgetData.maxValue}
                icon={widgetData.icon}
                iconFamily={widgetData.iconFamily}
                widgetWidth={widgetData.widgetWidth}
                widgetHeight={widgetData.widgetHeight}
                timestamp={widgetData.timestamp}
              />
            );
            pagewidgets.push(widget);
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
                lineBreaks={widgetData.lineBreaks}
                contentTypes={widgetData.contentTypes}
                rowsPerPage={widgetData.rowsPerPage || 5}
                widgetWidth={widgetData.widgetWidth}
                timestamp={widgetData.timestamp}
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
                widgetWidth={widgetData.widgetWidth}
                timestamp={widgetData.timestamp}
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
                stateId={widgetData.stateId}
                stateIdType={widgetData.stateIdType || "undefined"}
                IMGUrl={widgetData.url}
                IMGUpdateInterval={30000} //{widgetData.updateTimeSek * 1000}
                widgetWidth={widgetData.widgetWidth}
                timestamp={widgetData.timestamp}
                urlFromState={widgetData.urlFromState}
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
                widgetWidth={widgetData.widgetWidth}
                timestamp={widgetData.timestamp}
              />
            );
            pagewidgets.push(widget);
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
                widgetWidth={widgetData.widgetWidth}
                timestamp={widgetData.timestamp}
              />
            );
            pagewidgets.push(widget);
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
                widgetWidth={widgetData.widgetWidth}
                timestamp={widgetData.timestamp}
              />
            );
            pagewidgets.push(widget);
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
                widgetWidth={widgetData.widgetWidth}
                timestamp={widgetData.timestamp}
              />
            );
            pagewidgets.push(widget);
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
                widgetWidth={widgetData.widgetWidth}
                timestamp={widgetData.timestamp}
              />
            );
            pagewidgets.push(widget);
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
                widgetWidth={widgetData.widgetWidth}
                timestamp={widgetData.timestamp}
              />
            );
            pagewidgets.push(widget);
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
                widgetWidth={widgetData.widgetWidth}
                widgetHeight={widgetData.widgetHeight}
                rowHeight={67}
                timestamp={widgetData.timestamp}
                showInModal={widgetData.showInModal}
                modalWidgetHeight={widgetData.modalWidgetHeight}
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
                widgetWidth={widgetData.widgetWidth}
                timestamp={widgetData.timestamp}
              />
            );
            pagewidgets.push(widget);
            break;
          case "linkbutton":
            widget = (
              <LinkButton
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                linkText={widgetData.linkText}
                linkIcon={widgetData.linkIcon}
                linkIconFamily={widgetData.linkIconFamily}
                pageLinks={this.props.pageLinks}
                targetpage={widgetData.targetpage}
                extLink={widgetData.extLink}
                extUrl={widgetData.extUrl}
                widgetWidth={widgetData.widgetWidth}
                timestamp={widgetData.timestamp}
              />
            );
            pagewidgets.push(widget);
            break;
          case "filler":
          case "headline":
            widget = (
              <HeadLine
                key={widgetData.UUID}
                UUID={widgetData.UUID}
                title={widgetData.title}
                fontSize={widgetData.fontSize}
                titleIcon={widgetData.titleIcon}
                titleIconFamily={widgetData.titleIconFamily}
                showAsHeader={widgetData.showAsHeader || false}
                widgetWidth={widgetData.widgetWidth}
                timestamp={widgetData.timestamp}
              />
            );
            pagewidgets.push(widget);
            break;
          default:
            pagewidgets.push(
              <Message
                text={"Widget " + widgetData.type + " nicht vorhanden"}
              />
            );
            break;
        } // switch

        //////////////////////////////////////////////////////////////////////////////////////////////

        var borderClasses = "";
        if (widgetData.borderTop && widgetData.borderTop === true) {
          borderClasses += "borderTop ";
        }
        if (widgetData.borderRight && widgetData.borderRight === true) {
          borderClasses += "borderRight ";
        }
        if (widgetData.borderBottom && widgetData.borderBottom === true) {
          borderClasses += "borderBottom ";
        }
        if (widgetData.borderLeft && widgetData.borderLeft === true) {
          borderClasses += "borderLeft ";
        }
        gridBoxes.push(
          <div
            className={"gridBox " + borderClasses}
            style={{
              gridColumnStart: widgetData.widgetPosX + 1,
              gridColumnEnd: widgetData.widgetPosX + widgetData.widgetWidth + 1,
              gridRowStart: widgetData.widgetPosY + 1,
              gridRowEnd: widgetData.widgetPosY + widgetData.widgetHeight + 1,
              overflow: "hidden",
            }}
          >
            {widget}
          </div>
        );

        if ((widgetData.widgetPosY + widgetData.widgetHeight) > maxRow) {
          maxRow = parseFloat(widgetData.widgetPosY) + parseFloat(widgetData.widgetHeight);
        }
        //////////////////////////////////////////////////////////////////////////////////////////////



      } // for
    } // if WidgetData

    //////////////////////////////////////////////////////////////////////////////////////////////

    let pageGrid = [];
    let rowStyle = "repeat(" + maxRow + ", 67px)";  // 55px ListItem 12 px ListHeader
    let colWidth = 100 / nbOfCols;
    let colStyle = "repeat(" + nbOfCols + ", " + colWidth + "%)";

    // console.log("maxRow="+ maxRow);
    // console.log(rowStyle);


    pageGrid.push(
      <div
        className="gridWrapper"
        style={{
          display: "grid",
          gridGap: "0px",
          gridTemplateColumns: colStyle,
          gridTemplateRows: rowStyle,
          margin: "0 auto",
          width: "99%"
        }}
      >
        {gridBoxes}
      </div>
    );
    //////////////////////////////////////////////////////////////////////////////////////////////

    let height = this.props.widgetHeight * this.props.rowHeight;

    if (this.props.showInModal === true) {
      return (
        <List className="modalcard" style={{ height }}>
          <ListItem>
            <div className="center">
              <div className="centerFab" style={{ margin: "auto" }}>
                <Fab
                  mini
                  className="fab--mini"
                  modifier="material"
                  onClick={this.showModal.bind(this)}>
                  <i className="mdi-icon open-in-new fab--mini--icon" />
                </Fab>
              </div>
            </div>
            <Modal isOpen={this.state.showModal} isCancelable={true} modifier="material">
              <List className="iconbar">
                <ListItem>
                  <div className="right">
                    <Fab
                      mini
                      className="fab--mini"
                      modifier="material"
                      onClick={this.hideModal.bind(this)}>
                      <i className="mdi-icon window-close fab--mini--icon" />
                    </Fab>
                  </div>
                </ListItem>
              </List>
              <Card id={this.props.UUID} className="mycard" modifier="material">
                {pageGrid}
              </Card>
            </Modal>
          </ListItem >
        </List >
      );
    } else {
      return (
        <Card id={this.props.UUID} className="mycard" modifier="material">
          {pageGrid}
        </Card>
      );
    }
  }
}
