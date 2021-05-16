# minuvis-webapp.iobroker
WebApp for ioBroker


We use, with others, the Iconsets from

Web: http://knx-user-forum.de Mail: mfd.gfx@gmail.com User: mfd

and the Material Design Icons Community Icons from https://github.com/Templarian/MaterialDesign

Big thanks to authors for these icon sets.

## Quick Start:

- goto https://github.com/SVallant/minuvis-webapp.iobroker/releases
- download and put on your WebServer on WEBROOT/minuvis/app/

### OR

- Clone repository
- npm install
- npm start or npm build

Love it !!

## Changelog
### 2.0.0-rc.2 (2021-05-07)
* (svallant) zoom for output-widget
* (svallant) zoom for switch-widget
* (svallant) update for app-icon

### 2.0.0-rc.1 (2021-05-02)
* (svallant) bug-fix in linkbutton

### 2.0.0-beta.1 (2021-04-18)
* (svallant) color for headline
* (svallant) "noIcon"-Icon to hide icon
* (svallant) code- and performance improvements
* (svallant) configfile version check
* (svallant) "noIcon"-icon

### 2.0.0-alpha.2 (2021-04-05)
* (svallant) scaleWidth for imgoutpout and imgbutton
* (svallant) classes for headline

### 2.0.0-alpha (2021-03-08)
* (svallant) new grid with 18 rows, every widget has X rows and Y columns
* (svallant) new widget-border property 
* (svallant) no more responsive layout, maybe you need mor ethen 1 configuration (e.g. for smartphone and tablet)
* (svallant) title and title-icon dropped, can be done with headline-widget (instead of filler) with adjustable font-size
* (svallant) import-funktion of V1-configuration-files
* (svallant) new card-widget to host other widgets
* (svallant) new imgbutton-widget (button with image as background)
* (svallant) new design of donut-widget
* (svallant) new datetime-widget (also available as analog clock)
* (svallant) new textInput-widget
* (svallant) new banner (display of messages on every page)
* (svallant) global themes: dark and light designs build in; simple adjustment possible
* (svallant) improvement of imgOutput-widget: url of image can be dynamic from data-point
* (svallant) timestamp is optionally now
* (svallant) improvement of link-button: external link also possible
* (svallant) card- and flot-widget have modal-mode

### 1.13.0 (2021-03-07)
* (svallant) compact.mode for html-widget

### 1.12.1 (2021-01-21)
* (svallant) fix bug when reading file from "0_userdata.0"

### 1.12.0 (2021-01-21)
* (svallant) new donut-widget
* (svallant) improvement of range-widget (fraction number as step possible)

### 1.11.0 (2020-12-06)
* (svallant) fix for boolean values for valueswitcher

### 1.10.0 (2020-12-01)
* (svallant) new timestamp-widget
* (svallant) new gridchanger-widget
* (svallant) improvements of jsontable-widget

### 1.9.0 (2020-11-20)
* (svallant) new openstreetmap-widget

### 1.8.0 (2020-11-15)
* (svallant) new colorpicker-widget
* (svallant) new huecolorpicker-widget
* (svallant) new range-widget
* (svallant) format for datepicker-widget

### 1.7.0 (2020-10-11)
* (svallant) format for datepicker-widget
* (svallant) format for timepicker-widget
* (svallant) headertext and column-width for jsontable-widget

### 1.6.0 (2020-10-02)
* (svallant) new datepicker-widget
* (svallant) EXPERIMENTAL: new jsontable-widget

### 1.5.0 (2020-09-24)
* (svallant) compact-mode for valueswitcher-widget
* (svallant) compact-mode for timepicker-widget
* (svallant) compact-mode for slider-widget
* (svallant) some css improvements

### 1.4.0 (2020-09-13)
* (svallant) added "read-only" for valueswitcher-Widget
* (svallant) added "show as indicator" with different colors for valueswitcher-Widget
* (svallant) added "hightlightExactValueOnly" with different colors for valueswitcher-Widget
* (svallant) added MaterialDesign-Icons
* (svallant) added title-text to compactMode-Wrapper
* (svallant) added title and icon for Filler-Widget
* (svallant) added "show as small header" for Filler-Widget
* (svallant) small css-impovement

### 1.2.1 (2020-06-05)
* (svallant) added support for iOS "add to homescreen"

### 1.2.0 (2020-06-01)
* (svallant) added "hide Text" for valueswitcher-Widget

### 1.1.0 (2020-05-29)
* (svallant) added compact-mode
* (svallant) added linkbutton
* (svallant) serveral improvements

### 1.0.0 (2020-05-02)
* (svallant) fix paths

### 0.9.2 (2020-04-21)
* (svallant) initial release


