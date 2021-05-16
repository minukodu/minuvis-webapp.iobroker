import React from "react";
import moment from "moment";
moment.locale("de-DE");

export default class AnalogClock extends React.Component {
    constructor(props) {
        super(props);
        this.radius = this.props.size / 2;
        this.drawingContext = null;
        this.draw24hour = false;
        this.drawRoman = false;
    }

    componentDidMount() {
        this.getDrawingContext();
        this.timerId = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    getDrawingContext() {
        this.drawingContext = this.refs.clockCanvas.getContext('2d');
        this.drawingContext.translate(this.radius, this.radius);
        this.radius *= 0.9;
    }

    tick() {
        this.setState({ time: this.props.dateTime });
        const radius = this.radius;
        let ctx = this.drawingContext;
        this.drawFace(ctx, radius);
        this.drawNumbers(ctx, radius, this.props.color);
        this.drawTicks(ctx, radius);
        this.drawTime(ctx, radius);
    }

    drawFace(ctx, radius) {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.props.backgroundColor || "white";
        ctx.fill();

        const grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
        grad.addColorStop(0, this.props.color ||"#333");
        grad.addColorStop(0.5, this.props.color ||"white");
        grad.addColorStop(1, this.props.color ||"#333");
        ctx.strokeStyle = grad;
        ctx.lineWidth = radius * 0.03;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
        ctx.fillStyle = this.props.color ||"#333";
        ctx.fill();
    }

    drawNumbers(ctx, radius, color, secColor) {
        color = color || "black";
        secColor = secColor || "red";
        const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
        const fontBig = radius * 0.15 + "px Arial";
        const fontSmall = radius * 0.075 + "px Arial";
        let ang, num;

        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        for (num = 1; num < 13; num++) {
            ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.78);
            ctx.rotate(-ang);
            ctx.font = fontBig;
            ctx.fillStyle = color;
            ctx.fillText(this.drawRoman ? romans[num - 1] : num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.78);
            ctx.rotate(-ang);

            // Draw inner numerals for 24 hour time format
            if (this.draw24hour) {
                ctx.rotate(ang);
                ctx.translate(0, -radius * 0.60);
                ctx.rotate(-ang);
                ctx.font = fontSmall;
                ctx.fillStyle = secColor;
                ctx.fillText((num + 12).toString(), 0, 0);
                ctx.rotate(ang);
                ctx.translate(0, radius * 0.60);
                ctx.rotate(-ang);
            }
        }

        // // Write author text
        // ctx.font = fontSmall;
        // ctx.fillStyle = "black";
        // ctx.translate(0, radius * 0.30);
        // ctx.fillText("minuVis", 0, 0);
        // ctx.translate(0, -radius * 0.30);
    }

    drawTicks(ctx, radius) {
        let numTicks, tickAng, tickX, tickY;
        let color = this.props.color || "black";

        for (numTicks = 0; numTicks < 60; numTicks++) {

            tickAng = (numTicks * Math.PI / 30);
            tickX = radius * Math.sin(tickAng);
            tickY = -radius * Math.cos(tickAng);

            ctx.beginPath();
            //ctx.fillStyle = color;
            //ctx.strokeStyle = color;
            ctx.lineWidth = radius * 0.010;
            ctx.moveTo(tickX, tickY);
            if (numTicks % 5 === 0) {
                ctx.lineTo(tickX * 0.88, tickY * 0.88);
            } else {
                ctx.lineTo(tickX * 0.92, tickY * 0.92);
            }
            ctx.stroke();
        }
    }

    drawTime(ctx, radius) {
        let hour = moment(this.props.dateTime).format("h");
        let minute = moment(this.props.dateTime).format("m");
        let second = moment(this.props.dateTime).format("s");

        // hour
        hour %= 12;
        hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
        this.drawHand(ctx, hour, radius * 0.5, radius * 0.05, this.props.color || "black");
        // minute
        minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
        this.drawHand(ctx, minute, radius * 0.8, radius * 0.05, this.props.color || "black");
        // second
        second = (second * Math.PI / 30);
        this.drawHand(ctx, second, radius * 0.9, radius * 0.02, this.props.secColor || "red");
    }

    drawHand(ctx, position, length, width, color) {
        color = color || "black";
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.moveTo(0, 0);
        ctx.rotate(position);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-position);
    }

    render() {
        return (
            <div className="Clock" style={{ width: String(this.props.size) + 'px' }}>
                <canvas width={this.props.size} height={this.props.size} ref="clockCanvas" />
            </div>
        );
    }
}


