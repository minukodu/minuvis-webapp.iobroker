import React from "react";
import { List, ListItem, Splitter, SplitterContent, SplitterSide, Page, Navigator, Icon } from "react-onsenui";
import PageAlarme from "./PageAlarme";
import PageInfo from "./PageInfo";
import myPage from "./myPage";

export default class Layout extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
    this.loadPage = this.loadPage.bind(this);
    this.windowWidth = 600;
  }

  _reloadPage() {
    window.location.reload();
  }

  hide() {
    this.setState({ isOpen: false });
  }

  show() {
    this.setState({ isOpen: true });
  }

  loadPage(page, pageName, pageConfig) {
    console.log("page, pageName");
    console.log(page);
    console.log(pageName);
    console.log(pageConfig);

    this.hide();
    if (pageName !== this.navigator.pageName) {
      this.navigator.pageName = pageName;
      this.navigator.resetPage(
        {
          component: page,
          props: {
            key: pageConfig.UUID,
            pageConfig: pageConfig,
            children: this.props.children
          }
        },
        { animation: "none" }
      );
    }
  }

  renderPage(route, navigator) {

    let pageConfigAlarm = {};
    pageConfigAlarm.UUID = "PageAlarm";
    pageConfigAlarm.banner = this.props.appConfig.banner;

    route.props = route.props || {};
    route.props.navigator = navigator;
    route.props.showMenu = this.show.bind(this);
    route.props.socket = this.props.socket;
    route.props.states = this.props.states;
    route.props.connected = this.props.connected;
    route.props.nbAlarm = this.props.nbAlarm;
    route.props.displayNbAlarm = this.props.nbAlarm > 0 ? "inline" : "none";
    route.props.AlarmStates = this.props.AlarmStates;
    route.props.LinkAlarmPage = this.loadPage.bind(
      this,
      PageAlarme,
      "PageAlarme",
      pageConfigAlarm
    );
    route.props.flotUrls = this.props.flotUrls;
    route.props.version = this.props.version;
    route.props.pageLinks = this.pageLinks;
    route.props.windowWidth = this.windowWidth;

    return React.createElement(route.component, route.props);
  }

  render() {
    console.log("Render Layout.js");
    // Init
    this.startpageKey = "";
    this.startpageConfig = {};

    // Splitter collapse einstellen
    let splitterCollapse = "collapse";
    if (
      this.props.appConfig.settings.SplitterOpen === true ||
      this.props.appConfig.settings.SplitterOpen === "true"
    ) {
      splitterCollapse = "none"; //"portrait";
    }
    console.log("SplitterOpen: " + this.props.appConfig.settings.SplitterOpen);
    // Anzahl Alarme einstellen
    let displayNbAlarm = "none";
    if (this.props.nbAlarm > 0) {
      displayNbAlarm = "block";
    }

    //###########################################################################################
    // Pages bauen
    // console.log("Layout Props");
    // console.log(this.props);

    let pageList = [];
    this.pageLinks = [];
    if (this.props.appConfig.pages) {
      // Menu-Item in Splitter
      for (var pageId in this.props.appConfig.pages) {
        // console.log("Pages");
        // console.dir(Page);
        let pageTitle = this.props.appConfig.pages[pageId].title;
        let pageConfig = this.props.appConfig.pages[pageId];
        // global css to page
        pageConfig.css = this.props.appConfig.css || "";
        // banner to page
        pageConfig.banner = this.props.appConfig.banner;

        // Create Array with possible Links
        this.pageLinks[pageTitle] = this.loadPage.bind(this, myPage, pageTitle, pageConfig);

        // Create Menu-Entry
        pageList.push(
          <ListItem
            key={this.props.appConfig.pages[pageId].UUID}
            onClick={this.loadPage.bind(this, myPage, pageTitle, pageConfig)} //pages[pageId], pageTitle)}
            tappable
          >
            <div className="left pageIconHolder">
              <span
                className={
                  "pageIcon " + this.props.appConfig.pages[pageId].iconFamily + " " + this.props.appConfig.pages[pageId].icon
                }
              ></span>
            </div>
            <div className="center">{pageTitle}</div>
            <div className="right"></div>
          </ListItem>
        );


        // console.log("pageId");
        // console.log(pageId);

        // set default  startpage
        if (pageId == 0) {
          this.startpageKey = "start" + pageTitle;
          this.startpageConfig = pageConfig;
        }
        // is new startpage ??
        if (
          this.props.appConfig.pages[pageId].startpage &&
          this.props.appConfig.pages[pageId].startpage === true
        ) {
          this.startpageKey = "start" + pageTitle;
          this.startpageConfig = pageConfig;
        }
      }
    }

    // Menu-Item alarmPage
    let pageConfigAlarm = {};
    pageConfigAlarm.UUID = "PageAlarm";
    pageConfigAlarm.banner = this.props.appConfig.banner;

    if (this.props.appConfig.alarmpage === true) {
      pageList.push(
        <ListItem
          key={"PageAlarme"}
          onClick={this.loadPage.bind(this, PageAlarme, "PageAlarme", pageConfigAlarm)}
          tappable
        >
          <div className="left">
            <Icon
              fixed-width
              className="list-item__icon"
              icon="ion-ios-warning"
            ></Icon>
          </div>
          <div className="center">Alarme</div>
          <div className="right">
            <span
              className="alarme-icon notification"
              style={{ display: displayNbAlarm, verticalAlign: -4 }}
            >
              {this.props.nbAlarm}
            </span>
          </div>
        </ListItem>
      );
    }

    // Menu-Item InfoPage
    let pageConfigInfo = {};
    pageConfigInfo.UUID = "PageInfo";
    pageConfigInfo.url = this.props.appConfig.dataprovider.url;
    pageConfigInfo.file = this.props.appConfig.dataprovider.fileName;
    pageConfigInfo.css = this.props.appConfig.css || "";
    pageConfigInfo.banner = this.props.appConfig.banner;

    pageList.push(
      <ListItem
        key={PageInfo.name}
        onClick={this.loadPage.bind(this, PageInfo, "PageInfo", pageConfigInfo)}
        tappable
      >
        <div className="left pageIconHolder">
          <span className={"pageIcon mfd-icon info_info"}></span>
        </div>
        <div className="center">Info</div>
        <div className="right"></div>
      </ListItem>
    );

    return (
      <Splitter>
        <SplitterSide
          side="left"
          width={220}
          collapse={splitterCollapse}
          swipeable={false}
          isOpen={this.state.isOpen}
          onClose={this.hide.bind(this)}
          onOpen={this.show.bind(this)}
        >
          <Page>
            <List>
              {pageList}

              <ListItem key="Reload" onClick={this._reloadPage} tappable>
                <div className="left">
                  <Icon
                    fixed-width
                    className="list-item__icon"
                    icon="ion-ios-refresh"
                  ></Icon>
                </div>
                <div className="center">reload App</div>
                <div className="right"></div>
              </ListItem>
            </List>
          </Page>
        </SplitterSide>
        <SplitterContent>
          <Navigator
            initialRoute={{
              component: myPage,
              props: {
                key: this.startpageKey,
                pageConfig: this.startpageConfig,
              }
            }}
            renderPage={this.renderPage.bind(this)}
            ref={navigator => {
              this.navigator = navigator;
            }}
          />
        </SplitterContent>
      </Splitter>
    );
  }
}
