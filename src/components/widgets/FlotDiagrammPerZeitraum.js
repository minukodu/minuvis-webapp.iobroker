import React from 'react';
import moment from 'moment';
moment.locale('de-DE');

var queryString = require("querystring")
var urlParse = require("url-parse")

export default class FlotDiagrammPerZeitraum extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			iframeKey: 0,
			lastUpdateDate: Date.now(),
		};
		this.srcUrl = this.props.FlotUrl;
	}

	render() {

		// Set Auto-Time-Format
		// timeFormat={["%h:%M", "%h:%M", "%a.", "%d.%m"]}
		let timeFormat = "%h:%M";
		if (this.props.FlotRange > 3 * 60 * 24) {
			timeFormat = "%a.";
		}
		if (this.props.FlotRange > 14 * 60 * 24) {
			timeFormat = "%d.%m";
		}
		if (this.props.FlotRange > 3 * 30 * 60 * 24) {
			timeFormat = "%m/%Y";
		}


		// read and manipulate URL
		var srcUrlQuery = urlParse(this.srcUrl);
		//console.dir(srcUrlQuery);
		var srcUrlQueryString = srcUrlQuery.query;
		// remove ?
		srcUrlQueryString = srcUrlQueryString.substring(1, srcUrlQueryString.length);

		var srcUrlParsed = queryString.parse(srcUrlQueryString);
		//console.dir(srcUrlParsed);

		// manipulate Range in URL
		srcUrlParsed.range = this.props.FlotRange
		// manipulate TimeFormat: timeFormat: "%d.%m."
		srcUrlParsed.timeFormat = timeFormat; //this.props.FlotTimeFormat;
		// manipulate Background
		srcUrlParsed.window_bg = "#" + this.props.FlotWindowBG;
		// manipulate No-Edit
		srcUrlParsed.noedit = "true";
		// manipulate Zoom
		srcUrlParsed.zoom = this.props.FlotZoom;
		// manipulate Hover Detail (Wert Tooltip)
		srcUrlParsed.hoverDetail = this.props.FlotHoverDetail;

		// port
		let port = "";
		if (srcUrlQuery.port) {
			port = ":" + srcUrlQuery.port;
		}

		//console.log(queryString.stringify(srcUrlParsed));
		var srcUrlNew = srcUrlQuery.protocol + "//" + srcUrlQuery.hostname + port + srcUrlQuery.pathname + "?" + queryString.stringify(srcUrlParsed)
		//console.log(srcUrlNew);
		return (
			<ons-col>
				<ons-list>
					<ons-list-item>
						<div style={{ width: 100 + '%' }} >
							<iframe
								key={this.state.iframeKey}
								src={srcUrlNew}
								style={{ width: this.props.FlotWidth, height: this.props.FlotHeight }}
								frameBorder="0"
							/>
						</div>
					</ons-list-item>
				</ons-list> 
			</ons-col>
		);
	}
}




