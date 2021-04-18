import React from "react";
import { Card, Modal, List, ListItem, Fab } from "react-onsenui";
import IframeOutput from "./IframeOutput";
import MySwitch from "./Switch";
import TextInput from "./TextInput";
import ImgButton from "./ImgButton";
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
  }

  showModal() {
    this.setState({ showModal: true });
  }
  hideModal() {
    this.setState({ showModal: false });
  }

  render() {
    let widget = "";

    //////////////////////////////////////////////////////////////////////////////////////////////
    let nbOfCols = 18;
    //////////////////////////////////////////////////////////////////////////////////////////////

    if (this.props.widgetData.widgets) {
      //////////////////////////////////////////////////////////////////////////////////////////////
      var gridBoxes = [];
      var maxRow = 1;
      var rowHeight = 67;
      //////////////////////////////////////////////////////////////////////////////////////////////

      for (var widgetId in this.props.widgetData.widgets) {
        let widgetData = this.props.widgetData.widgets[widgetId];
        // console.log("MyCard WidgetData");
        // console.log(widgetData);
        // extend widgetData
        widgetData.rowHeight = rowHeight;
        widgetData.connected = this.props.widgetData.connected;
        widgetData.socket = this.props.widgetData.socket;
        widgetData.states = this.props.widgetData.states;

        switch (widgetData.type) {
          case "datetime":
            widget = <DateTime widgetData={widgetData} />;
            break;
          case "openstreetmap":
            widget = <OpenStreetMap widgetData={widgetData} />;
            break;
          case "iframe":
            widget = <IframeOutput widgetData={widgetData} />;
            break;
          case "switch":
            widget = <MySwitch widgetData={widgetData} />;
            break;
          case "textInput":
            widget = <TextInput widgetData={widgetData} />;
            break;
          case "imgButton":
            widget = <ImgButton widgetData={widgetData} />;
            break;
          case "slider":
          case "range":
            widget = <MyRange widgetData={widgetData} />;
            break;
          case "donut":
            widget = <Donut widgetData={widgetData} />;
            break;
          case "jsontable":
            widget = <JsonTable widgetData={widgetData} />;
            break;
          case "html":
            widget = <HtmlOutput widgetData={widgetData} />;
            break;
          case "imgoutput":
            widget = <IMGOutput widgetData={widgetData} />;
            break;
          case "output":
            widget = <Output widgetData={widgetData} />;
            break;
          case "indicator":
            widget = <Indicator widgetData={widgetData} />;
            break;
          case "timepicker":
            widget = <TimePicker widgetData={widgetData} />;
            break;
          case "datepicker":
            widget = <DatePicker widgetData={widgetData} />;
            break;
          case "colorpicker":
            widget = <ColorPicker widgetData={widgetData} />;
            break;
          case "huecolorpicker":
            widget = <HueColorPicker widgetData={widgetData} />;
            break;
          case "flot":
            widget = <FlotDiagrammPerZeitraumWrapper widgetData={widgetData} />;
            break;
          case "valueswitcher":
            widget = <ValueSwitcher widgetData={widgetData} />;
            break;
          case "linkbutton":
            widget = <LinkButton widgetData={widgetData} />;
            break;
          case "filler":
          case "headline":
            widget = <HeadLine widgetData={widgetData} />;
            break;
          default:
            widget = (
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

        if (widgetData.widgetPosY + widgetData.widgetHeight > maxRow) {
          maxRow =
            parseFloat(widgetData.widgetPosY) +
            parseFloat(widgetData.widgetHeight);
        }
        //////////////////////////////////////////////////////////////////////////////////////////////
      } // for
    } // if WidgetData
    //////////////////////////////////////////////////////////////////////////////////////////////

    let pageGrid = [];
    let rowStyle = "repeat(" + maxRow + ", 67px)"; // 55px ListItem 12 px ListHeader
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
          width: "99%",
        }}
      >
        {gridBoxes}
      </div>
    );
    //////////////////////////////////////////////////////////////////////////////////////////////

    let height =
      this.props.widgetData.widgetHeight * this.props.widgetData.rowHeight;

    if (this.props.widgetData.showInModal === true) {
      return (
        <List className="modalcard" style={{ height }}>
          <ListItem>
            <div className="center">
              <div className="centerFab" style={{ margin: "auto" }}>
                <Fab
                  mini
                  className="fab--mini"
                  modifier="material"
                  onClick={this.showModal.bind(this)}
                >
                  <i className="mdi-icon open-in-new fab--mini--icon" />
                </Fab>
              </div>
            </div>
            <Modal
              isOpen={this.state.showModal}
              isCancelable={true}
              modifier="material"
            >
              <List className="iconbar">
                <ListItem>
                  <div className="right">
                    <Fab
                      mini
                      className="fab--mini"
                      modifier="material"
                      onClick={this.hideModal.bind(this)}
                    >
                      <i className="mdi-icon window-close fab--mini--icon" />
                    </Fab>
                  </div>
                </ListItem>
              </List>
              <Card
                id={this.props.widgetData.UUID}
                className="mycard"
                modifier="material"
              >
                {pageGrid}
              </Card>
            </Modal>
          </ListItem>
        </List>
      );
    } else {
      return (
        <Card
          id={this.props.widgetData.UUID}
          className="mycard"
          modifier="material"
        >
          {pageGrid}
        </Card>
      );
    }
  }
}
