import React from "react";
import "./roundslider.css";
import { fixOutputFloat } from "./Utils";
import moment from "moment";
moment.locale("de-DE");

export default class RoundSlider extends React.Component {
    constructor() {
        super();
        this.min = 17;
        this.max = 25;
        this.step = 0.5;
        this.startAngle = 135;
        this.arcLength = 270;
        this.handleSize = 6;
        this.handleZoom = 1;
        this.disabled = false;
        this.dragging = false;
        this.rtl = false;
        this._scale = 1;
        this.textFontsize = 20;
        this.state = {};
        this._rotation = null;
        this.staticBoundaries = null;
        this.parent = null;
        this.ts = 0;
        this.doNotUpdateValue = false;
        this.handles = null;
    }

    get _start() {
        return (this.startAngle * Math.PI) / 180;
    }
    get _len() {
        // Things get weird if length is more than a complete turn
        return Math.min((this.arcLength * Math.PI) / 180, 2 * Math.PI - 0.01);
    }
    get _end() {
        return this._start + this._len;
    }

    get _showHandle() {
        // If handle is shown
        if (this.props.settings.readOnly) return false;
        if (this.val == null && (this.high == null || this.low == null))
            return false;
        return true;
    }

    _angleInside(angle) {
        // Check if an angle is on the arc
        let a =
            ((this.startAngle + this.arcLength / 2 - angle + 180 + 360) % 360) - 180;
        let isInside = a < this.arcLength / 2 && a > -this.arcLength / 2;
        //console.log("isInside: " + isInside);
        return isInside;
    }
    _angle2xy(angle) {
        if (this.rtl) return { x: -Math.cos(angle), y: Math.sin(angle) };
        return { x: Math.cos(angle), y: Math.sin(angle) };
    }
    _xy2angle(x, y) {
        if (this.rtl) {
            x = -x;
        }
        let angle = (Math.atan2(y, x) - this._start + 2 * Math.PI) % (2 * Math.PI);
        // console.log("angle: " + angle);
        return angle;
    }

    _value2angle(value) {
        value = Math.min(
            this.props.settings.max,
            Math.max(this.props.settings.min, value)
        );
        const fraction =
            (value - this.props.settings.min) /
            (this.props.settings.max - this.props.settings.min);
        return this._start + fraction * this._len;
    }
    _angle2value(angle) {
        return (
            Math.round(
                ((angle / this._len) *
                    (this.props.settings.max - this.props.settings.min) +
                    this.props.settings.min) /
                this.props.settings.step
            ) * this.props.settings.step
        );
    }

    get _boundaries() {
        // Get the maximum extents of the bar arc
        const start = this._angle2xy(this._start);
        const end = this._angle2xy(this._end);

        let up = 1;
        if (!this._angleInside(270)) up = Math.max(-start.y, -end.y);

        let down = 1;
        if (!this._angleInside(90)) down = Math.max(start.y, end.y);

        let left = 1;
        if (!this._angleInside(180)) left = Math.max(-start.x, -end.x);

        let right = 1;
        if (!this._angleInside(0)) right = Math.max(start.x, end.x);

        return {
            up,
            down,
            left,
            right,
            height: up + down,
            width: left + right,
        };
    }

    _mouse2value(ev) {
        let mouseX = ev.type.startsWith("touch")
            ? ev.touches[0].clientX
            : ev.clientX;
        let mouseY = ev.type.startsWith("touch")
            ? ev.touches[0].clientY
            : ev.clientY;

        const rect = this.parentRect;
        const boundaries = this.staticBoundaries;

        // console.log(mouseX + "##" + mouseY);
        const x =
            mouseX - (rect.left + (boundaries.left * rect.width) / boundaries.width);
        const y =
            mouseY - (rect.top + (boundaries.up * rect.height) / boundaries.height);

        let angle = this._xy2angle(x, y);
        if (angle > 5.5) {
            angle = 0;
        }
        const pos = this._angle2value(angle);
        // console.log(boundaries);
        // console.log(rect);
        // console.log(x + "#" + y)
        // console.log(pos);
        // console.log(angle);

        return pos;
    }

    dragStart(ev) {
        // console.log("Roundslider dragStart");
        // console.log(this);

        if (!this._showHandle || this.disabled) return;
        let handle = ev.target;

        // Avoid double events mouseDown->focus
        if (this._rotation && this._rotation.type !== "focus") return;

        const min = this.props.settings.min;
        const max = this.props.settings.max;
        this._rotation = {
            handle,
            min,
            max,
            start: this[handle.id],
            type: ev.type,
        };
        // console.log("_rotation");
        // console.log(this._rotation);
        this.dragging = true;
    }

    _stopDragging() {
        //console.log("stop dragging");
        this._rotation = null;
        this.dragging = false;
    }

    dragEnd(ev) {
        console.log("Roundslider dragEnd");
        // console.log(ev.type);
        // console.log(this);
        console.log(this._showHandle);
        console.log(this.disabled);
        console.log(this._rotation);

        if (!this._showHandle || this.disabled) return;
        //if (!this._rotation) return;
        this._stopDragging();
        this.doNotUpdateValue = true;
        this.sendValue(this.val);
    }

    sendValue(value) {
        console.log("roundSlider sendValue: " + value);

        let valueToSend = parseFloat(value);
        this.props.settings.socket.emit(
            "setState",
            this.props.settings.stateId,
            valueToSend
        );
        // State nachführen
        this.setState({
            val: valueToSend,
            ts: moment(),
        });
        this.val = valueToSend;
    }

    drag(ev) {
        ev.preventDefault();
        if (!this._showHandle || this.disabled) return;
        if (!this._rotation) return;
        if (this._rotation && this._rotation.type === "focus") return;

        // console.log("drag");
        // console.log(this._rotation);

        window.clearTimeout(this.noDragTimer);
        this.noDragTimer = window.setTimeout(
            function () {
                //console.log("reset dragging")
                this._stopDragging();
            }.bind(this),
            100
        );

        //console.log("Roundslider drag");

        const pos = this._mouse2value(ev);
        let newVal = this._dragpos(pos);
        this.setState({ val: newVal });
        this.val = newVal;
    }

    _dragpos(pos) {
        //console.log(pos);
        let newVal = 0;
        if (pos < this.props.settings.min) {
            this.setState({ val: this.props.settings.min });
            console.log("min reached " + this.props.settings.min);
            pos = this.props.settings.min;
            newVal = this.props.settings.min;
            const handle = this._rotation.handle;
            this[handle.id] = pos;
            return newVal;
        }
        if (pos > this.props.settings.max) {
            this.setState({ val: this.props.settings.max });
            pos = this.props.settings.max;
            newVal = this.props.settings.max;
            const handle = this._rotation.handle;
            this[handle.id] = pos;
            console.log("max reached " + this.props.settings.max);
            return newVal;
        }

        const handle = this._rotation.handle;
        this[handle.id] = pos;
        newVal = pos;
        return newVal;
    }

    componentDidMount() {
        this.staticBoundaries = this._boundaries;
        this.parent = document.getElementById(this.props.parentId);

        if (this.props.settings.readOnly === true) {
            return;
        }

        this.parent.addEventListener("touchmove", this.drag.bind(this), {
            passive: false,
        });
        this.parent.addEventListener("touchend", this.dragEnd.bind(this));
        this.parent.addEventListener("mousemove", this.drag.bind(this), {
            passive: false,
        });
        this.parent.addEventListener("mouseup", this.dragEnd.bind(this));
    }

    componentWillUnmount() {
        if (this.props.settings.readOnly === true) {
            return;
        }

        this.parent.removeEventListener("touchmove", this.drag.bind(this), {
            passive: false,
        });
        this.parent.removeEventListener("touchend", this.dragEnd.bind(this));
        this.parent.removeEventListener("mousemove", this.drag.bind(this), {
            passive: false,
        });
        this.parent.removeEventListener("mouseup", this.dragEnd.bind(this));
    }

    _renderArc(start, end) {
        const diff = end - start;
        start = this._angle2xy(start);
        end = this._angle2xy(end + 0.001); // Safari doesn't like arcs with no length
        return (
            "M " +
            start.x +
            " " +
            start.y +
            " A 1 1,0," +
            (diff > Math.PI ? "1" : "0") +
            " " +
            (this.rtl ? "0" : "1") +
            "," +
            end.x +
            " " +
            end.y
        );
    }

    _renderHandle(id) {
        let theta = this._value2angle(this[id]);
        if (id === "value") {
            theta = this._value2angle(this.val);
        } else {
            return;
        }
        const pos = this._angle2xy(theta);
        // Two handles are drawn. One visible, and one invisible that's twice as
        // big. Makes it easier to click.
        return (
            <g className={id + " handle"}>
                <path
                    id={id}
                    className="overflow"
                    d={
                        "M " +
                        pos.x +
                        " " +
                        pos.y +
                        " L " +
                        (pos.x + 0.001) +
                        " " +
                        (pos.y + 0.001)
                    }
                    vectorEffect="non-scaling-stroke"
                    stroke="rbga(0,0,0,0)"
                    strokeWidth={7 * this.handleSize * this._scale}
                    onMouseDown={this.dragStart.bind(this)}
                    onTouchStart={this.dragStart.bind(this)}
                />
                <path
                    id={id}
                    className="handle"
                    d={
                        "M " +
                        pos.x +
                        " " +
                        pos.y +
                        " L " +
                        (pos.x + 0.001) +
                        " " +
                        (pos.y + 0.001)
                    }
                    vectorEffect="non-scaling-stroke"
                    strokeWidth={2 * this.handleSize * this._scale}
                    fill="var(--highlight-color)"
                    stroke="var(--highlight-color)"
                    tabIndex="0"
                    role="slider"
                    onMouseDown={this.dragStart.bind(this)}
                    onTouchStart={this.dragStart.bind(this)}
                />
            </g>
        );
    }

    render() {
        // console.log("render RoundSlider");
        // console.log(this.props);

        // do we have a value ??
        if (
            this.props.settings.states[this.props.settings.stateId] &&
            typeof this.props.settings.states[this.props.settings.stateId] !==
            "undefined" &&
            this.dragging === false &&
            this.doNotUpdateValue === false
        ) {
            this.val =
                this.props.settings.states[this.props.settings.stateId].val || 0;
            this.ts = this.props.settings.states[this.props.settings.stateId].ts;
        } else {
            // read from this
            this.val = this.val || 0;
            this.ts = this.state.ts;
        }

        // if (this.dragging === false) {
        //     console.log("RoundSlider Value: " + this.val + "#################################");
        //     console.log("RoundSlider this.State.Value: ");
        //     console.log( this.state.val);
        //     console.log("RoundSlider State Value: " + this.props.settings.states[this.props.settings.stateId].val + "#################################");
        //     console.log("RoundSlider dragging: " + this.dragging + "#################################");
        //     console.log("RoundSlider doNotUpdateValue: " + this.doNotUpdateValue + "#################################");
        // }

        // prevent flickering
        this.doNotUpdateValue = false;

        if (!this.staticBoundaries) {
            return null;
        }
        if (!this.parent) {
            return null;
        }
        const view = this.staticBoundaries;
        this.parentRect = this.parent.getBoundingClientRect();
        //console.log(this.parentRect);

        let dPath = this._renderArc(this._start, this._end);

        // default
        let progessStrokeWidth = (this.parentRect.height / 171) * 4; // at 171px height = 4px stroke
        let progessStroke = "var(--highlight-color)";
        // readOnly
        if (this.props.settings.readOnly === true) {
            progessStrokeWidth = (this.parentRect.height / 171) * 10; // at 171px height = 10px stroke
            progessStroke = this.props.settings.color;
            if (this.val <= this.props.settings.minValue) {
                progessStroke = this.props.settings.minColor;
            }
            if (this.val >= this.props.settings.maxValue) {
                progessStroke = this.props.settings.maxColor;
            }
        }

        let iconSize = (this.parentRect.width / 300) * 85;
        //console.log("iconSize: " + iconSize);

        let displayIcon = "block";
        if (this.parentRect.height < 70) {
            displayIcon = "none";
        }
        if (this.props.settings.iconFamily === "noIcon") {
            displayIcon = "none";
        }

        return (
            <div>
                <svg
                    xmln="http://www.w3.org/2000/svg"
                    viewBox={
                        -view.left + " " + -view.up + " " + view.width + " " + view.height
                    }
                    style={{ margin: this.handleSize * this.handleZoom + "px" }}
                    disabled={this.disabled}
                    focusable={false}
                    id={this.props.parentId + "_svg"}
                    className="RoundSliderSVG"
                >
                    <g className="slider">
                        <path
                            className="shadowpath"
                            d={dPath}
                            vectorEffect="non-scaling-stroke"
                            strokeWidth={20}
                            stroke={"rgba(0,0,0,0)"}
                        />
                        <path
                            className="path"
                            d={dPath}
                            vectorEffect="non-scaling-stroke"
                            stroke="var(--material-switch-active-background-color)"
                        />
                        <path
                            className="bar"
                            vectorEffect="non-scaling-stroke"
                            d={this._renderArc(
                                this._value2angle(this.props.settings.min),
                                this._value2angle(this.val)
                            )}
                            strokeWidth={progessStrokeWidth}
                            stroke={progessStroke}
                        />
                    </g>
                    <g id={this.props.parentId + "_handles"} className="handles">
                        {this._showHandle ? this._renderHandle("value") : ""}
                    </g>
                    <text
                        className="valueText"
                        x={0}
                        y={0}
                        fontSize={"0.2px"}
                        fill="var(--text-color)"
                        textAnchor="middle"
                    >
                        {fixOutputFloat(this.val, this.props.settings.decimals) +
                            this.props.settings.unit}
                    </text>
                </svg>
                <span
                    style={{
                        display: displayIcon,
                        position: "absolute",
                        left:
                            this.props.settings.iconFamily === "mdi-icon"
                                ? "calc(50% - " + (iconSize * 0.5) / 2 + "px)"
                                : "calc(50% - " + (iconSize * 0.7) / 2 + "px)",
                        top:
                            this.props.settings.iconFamily !== "mfd-icon" 
                                ? this.parentRect.height - iconSize / 2 + "px"
                                : this.parentRect.height - iconSize * 0.7 + "px", // this.parentRect.height - iconSize + "px",
                        backgroundColor:
                            this.props.settings.iconFamily !== "mfd-icon"
                                ? "transparent"
                                : "var(--text-color)",
                        color: "var(--text-color)",
                        height:
                            this.props.settings.iconFamily === "mdi-icon"
                                ? iconSize
                                : iconSize * 0.7,
                        width:
                            this.props.settings.iconFamily === "mdi-icon"
                                ? iconSize
                                : iconSize * 0.7,
                        fontSize: iconSize * 0.7,
                    }}
                    className={
                        "roundSliderIcon " +
                        this.props.settings.icon +
                        " " +
                        this.props.settings.iconFamily
                    }
                ></span>
            </div>
        );
    }
}
