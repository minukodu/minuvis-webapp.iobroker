import React from "react";
import * as Ons from "react-onsenui";
import Toolbar from "./widgets/Toolbar";
import Footer from "./widgets/Footer";
import { openSourceLicensesHtml } from "./utils/OpenSourceLicenses";

import moment from "moment";
moment.locale("de-DE");

export default class PageInfo extends React.Component {
  renderToolbar() {
    return (
      <Toolbar
        title="Info"
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

  pushPage() {}

  render() {
    console.info("Render PageInfo.js");
    console.info(this.props);

    return (
      <Ons.Page renderToolbar={this.renderToolbar.bind(this)}>
        <ons-row>
          <ons-col id={"appVersion"}>
            <ons-list>
              <ons-list-item>
                <div className="right">
                  <output>
                    {"minuvis for web version " + this.props.version}{" "}
                  </output>
                </div>
              </ons-list-item>
              <ons-list-item>
                <div className="left titel">url:</div>
                <div className="right">{this.props.pageConfig.url}</div>
              </ons-list-item>
              <ons-list-item>
                <div className="left titel">file:</div>
                <div className="right">{this.props.pageConfig.file}</div>
              </ons-list-item>
            </ons-list>
          </ons-col>
          <ons-col id={"pagInfoSourceCodeList"}>
            <ons-list>
              <ons-list-header>
                <span
                  className="right lastupdate"
                  style={{ float: "right", paddingRight: "5px" }}
                >
                  {"" /*moment().format("LLL")*/}
                </span>
              </ons-list-header>
              <ons-list-item>
                <div className="left titel titleIcon">
                  <span className={"titleIcon mfd-icon message_info"}></span>
                  OpenSource Licenses
                </div>
              </ons-list-item>
              <ons-list-item>
                <div style={{ width: 100 + "%" }}>
                  <div
                    className="htmloutput"
                    style={{ width: 100 + "%" }}
                    dangerouslySetInnerHTML={{
                      __html: openSourceLicensesHtml()
                    }}
                  ></div>
                </div>
              </ons-list-item>
            </ons-list>
          </ons-col>
        </ons-row>
        <Footer version={this.props.version} />
      </Ons.Page>
    );
  }
}
