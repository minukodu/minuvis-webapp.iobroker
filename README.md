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
### 2.3.4 (2023-12-01)
* (ph) enable invisible for switch-widget
* (ph) enable invisible for donut-widget
* (ph) enable invisible for range-widget
* (ph) enable disabled for switch-widget
* (ph) enable disabled for donut-widget
* (ph) enable disabled for range-widget


### 2.3.3 (2023-04-04)
* (svallant) enable invisible for textinput-widget
* (svallant) enable invisible for dropdown-widget
* (svallant) enable invisible for valueswitcher-widget

### 2.3.2 (2023-03-26)
* (svallant) fix bug in color-picker
* (svallant) fix bug in hue-color-picker
* (svallant) enable disabled for textinput-widget
* (svallant) enable disabled for dropdown-widget
* (svallant) enable disabled for valueswitcher-widget

### 2.3.1 (2023-03-16)
* (svallant) improve usage of textinput-widget

### 2.3.0 (2022-01-30)
* (svallant) fix bug in jsonTable when value is empty
* (svallant) support for ioBroker.minuaru
* (svallant) "useThemeColor" for headline-widget

### 2.2.1 (2021-10-30)
* (svallant) fix bug in indicator when selected from valueswitcher
* (svallant) fix bug in manifest at add to homescreen in iOS

### 2.2.0 (2021-09-03)
* (svallant) custom classnames for card-widget

### 2.1.0 (2021-07-31)
* (svallant) new schedex-widget
* (svallant) new dropDown-widget
* (svallant) new unicode-emoji-icons

### 2.0.0 (2021-05-22)
* (svallant) security-updates

### 2.0.0-rc.2 (2021-05-16)
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


