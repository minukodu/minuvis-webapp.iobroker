import React from 'react';
import {
  List,
  ListItem,
  Splitter,
  SplitterContent,
  SplitterSide,
  Page,
  Icon,
} from 'react-onsenui';
import PageAlarme from './PageAlarme';
import PageInfo from './PageInfo';
import MyPage from './MyPage';

export default class Layout extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      collapsed: 'collapse',
      activePage: null,
      activePageName: 'PageInfo',
    };
    this.loadPage = this.loadPage.bind(this);
    this.windowWidth = 600;
    this.routeProps = {};
    this.startPageName = 'PageInfo';
    this.splitterLocked = false;
    this.allHiddenCards = [];
  }

  _reloadPage() {
    window.location.reload();
  }

  findAllHiddenCards(appconfig) {
    //console.warn ("findAllHiddenCards");
    this.allHiddenCards = [];
    for (const page of appconfig.pages) {
      //console.warn (page);
      let pageUUID = page.UUID;
      for (let widget of page.widgets) {
        if (widget.type === "card" && widget.hideModalIcon === true) {
          widget._parentPageUUID = pageUUID;
          this.allHiddenCards.push(widget);
        }
      }
    }
    //console.warn (this.allHiddenCards)
  }

  hide() {
    if (this.splitterLocked === false) {
      this.setState({ isOpen: false, collapsed: 'collapse' });
    }
  }

  show() {
    if (this.splitterLocked === false) {
      this.setState({ isOpen: true, collapsed: 'open' });
    }
  }

  makePageElement(PageElem, pageName, pageConfig) {
    return (
      <PageElem
        {...this.props}
        key={pageName}
        theme={this.props.theme}
        pageConfig={pageConfig}
        showMenu={this.show.bind(this)}
        LinkAlarmPage={this.loadPage.bind(this, 'PageAlarme')}
        displayNbAlarm={this.props.nbAlarm > 0 ? 'inline' : 'none'}
        activePageName={this.state.activePageName}
      />
    );
  }

  loadPage(pageName) {
    console.log('loadPage:: ' + pageName);
    this.setState({
      activePageName: pageName,
    });
    // hide menu
    this.hide();
  }

  createRouteProps() {
    //console.log('createRouteProps with this.props:');
    //console.log(this.props);

    let pageConfigAlarm = {};
    pageConfigAlarm.UUID = 'PageAlarme';
    pageConfigAlarm.banner = this.props.appConfig.banner;
    pageConfigAlarm.minuaru = this.props.appConfig.minuaru;

    let routeProps = {};
    routeProps.showMenu = this.show.bind(this);
    routeProps.socket = this.props.socket;
    routeProps.states = this.props.states;
    routeProps.connected = this.props.connected;
    routeProps.nbAlarm = this.props.nbAlarm;
    routeProps.displayNbAlarm = this.props.nbAlarm > 0 ? 'inline' : 'none';
    routeProps.AlarmStates = this.props.AlarmStates;
    routeProps.LinkAlarmPage = this.loadPage.bind(this, 'PageAlarme');
    routeProps.flotUrls = this.props.flotUrls;
    routeProps.version = this.props.version;
    routeProps.windowWidth = this.windowWidth;

    return routeProps;
  }

  UNSAFE_componentWillMount() {
    // get overall props
    this.routeProps = this.createRouteProps();
    // find all hidden cards
    this.findAllHiddenCards(this.props.appConfig);
  }

  componentDidMount() {
    // launch Startpage
    this.loadPage(this.startPageName);
  }

  render() {
    console.log('Render Layout.js');
    // Init
    this.startpageKey = '';
    this.startpageConfig = {};

    // Splitter collapse einstellen
    let splitterCollapse = 'collapse';
    if (
      this.props.appConfig.settings.SplitterOpen === true ||
      this.props.appConfig.settings.SplitterOpen === 'true'
    ) {
      splitterCollapse = 'none'; //"portrait";
    }
    console.log('SplitterOpen: ' + this.props.appConfig.settings.SplitterOpen);
    // Anzahl Alarme einstellen
    let displayNbAlarm = 'none';
    if (this.props.nbAlarm > 0) {
      displayNbAlarm = 'block';
    }

    //###########################################################################################
    // build Pages
    // console.log("Layout Props");
    // console.log(this.props);
    let pages = [];
    let pageList = [];
    this.pageLinks = [];
    if (this.props.appConfig.pages) {
      for (var pageId in this.props.appConfig.pages) {
        // Create Array with possible Links
        this.pageLinks[
          this.props.appConfig.pages[pageId].title
        ] = this.loadPage.bind(this, this.props.appConfig.pages[pageId].UUID);
      }
      // Menu-Item in Splitter
      for (var pageId in this.props.appConfig.pages) {
        // console.log("Pages");
        // console.dir(Page);
        let pageTitle = this.props.appConfig.pages[pageId].title;
        let pageConfig = this.props.appConfig.pages[pageId];
        // global css to page
        pageConfig.css = this.props.appConfig.css || '';
        // banner to page
        pageConfig.banner = this.props.appConfig.banner;
        // add pageLinks
        pageConfig.pageLinks = this.pageLinks;

        // console.warn("V2.6.5 add hidden Cards for popup");
        // console.warn(this.props.appConfig.pages[pageId].UUID);
        // console.warn("Nr of allHiddenCards: " + this.allHiddenCards.length);
        // console.warn(pageConfig);

        // V2.6.5 add hidden Cards for popup
        for (const card of this.allHiddenCards) {
          // nur hinzufügen wenn noch nicht auf page vorhanden
          if (card._parentPageUUID !== this.props.appConfig.pages[pageId].UUID) {
            let hiddenCardUUID = card.UUID;
            let pushCardToPage = true;
            for (const widget of this.props.appConfig.pages[pageId].widgets) {
              if (widget.UUID === hiddenCardUUID) {
                pushCardToPage = false;
                break;
              }
            }
            if (pushCardToPage === true) {
              pageConfig.widgets.push(card)
            }
          }
        }
        // console.warn(pageConfig);
        // console.warn(pageConfig.widgets.length);

        // make page elements
        pages.push(this.makePageElement(MyPage, pageConfig.UUID, pageConfig));

        // Create Menu-Entry
        pageList.push(
          <ListItem
            key={this.props.appConfig.pages[pageId].UUID}
            onClick={this.loadPage.bind(
              this,
              this.props.appConfig.pages[pageId].UUID
            )} //pages[pageId], pageTitle)}
            tappable
          >
            <div className="left pageIconHolder">
              <span
                className={
                  'pageIcon ' +
                  this.props.appConfig.pages[pageId].iconFamily +
                  ' ' +
                  this.props.appConfig.pages[pageId].icon
                }
              />
            </div>
            <div className="center">{pageTitle}</div>
            <div className="right" />
          </ListItem>
        );

        //console.log("pageId");
        //console.log(pageId);

        // set default  startpage
        if (pageId == 0) {
          this.startPageName = this.props.appConfig.pages[pageId].UUID;
        }
        // is new startpage ??
        if (
          this.props.appConfig.pages[pageId].startpage &&
          this.props.appConfig.pages[pageId].startpage === true
        ) {
          this.startPageName = this.props.appConfig.pages[pageId].UUID;
        }
      }
    }

    // Menu-Item alarmPage
    let pageConfigAlarm = {};
    pageConfigAlarm.UUID = 'PageAlarme';
    pageConfigAlarm.banner = this.props.appConfig.banner;
    pageConfigAlarm.minuaru = this.props.appConfig.minuaru;

    if (this.props.appConfig.alarmpage === true) {
      pageList.push(
        <ListItem
          key={'PageAlarme'}
          onClick={this.loadPage.bind(this, 'PageAlarme')}
          tappable
        >
          <div className="left">
            <Icon
              fixed-width
              className="list-item__icon"
              icon="ion-ios-warning"
            />
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
      // make page element
      pages.push(
        this.makePageElement(PageAlarme, pageConfigAlarm.UUID, pageConfigAlarm)
      );
    }

    // Menu-Item InfoPage
    let pageConfigInfo = {};
    pageConfigInfo.UUID = 'PageInfo';
    pageConfigInfo.url = this.props.appConfig.dataprovider.url;
    pageConfigInfo.file = this.props.appConfig.dataprovider.fileName;
    pageConfigInfo.css = this.props.appConfig.css || '';
    pageConfigInfo.banner = this.props.appConfig.banner;

    //console.log("Render Layout.js before pageList.push");

    pageList.push(
      <ListItem
        key={PageInfo.name}
        onClick={this.loadPage.bind(this, 'PageInfo')}
        tappable
      >
        <div className="left pageIconHolder">
          <span className={'pageIcon mfd-icon info_info'} />
        </div>
        <div className="center">Info</div>
        <div className="right" />
      </ListItem>
    );
    // make page element
    pages.push(
      this.makePageElement(PageInfo, pageConfigInfo.UUID, pageConfigInfo)
    );

    //console.log("Render Layout.js after pageList.push");
    //console.log('pages');
    //console.log(pages);

    return (
      <Splitter swipeable={false}>
        <SplitterSide
          id="mysplitterside"
          className={
            'mysplitterside-' + this.state.collapsed + ' ' + splitterCollapse
          } // new way with css and without Errors
          side="left"
          width={'220px'}
          collapse={splitterCollapse}
          swipeable={false}
          //isOpen={this.state.isOpen} //old way with Errors
          onPreClose={() => {
            this.splitterLocked = true;
          }}
          onPreOpen={() => {
            this.splitterLocked = true;
          }}
          onPostClose={() => {
            this.splitterLocked = false;
          }}
          onPostOpen={() => {
            this.splitterLocked = false;
          }}
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
                  />
                </div>
                <div className="center">reload App</div>
                <div className="right" />
              </ListItem>
            </List>
          </Page>
        </SplitterSide>
        <SplitterContent>

          {pages}

        </SplitterContent>
      </Splitter>
    );
  }
}
