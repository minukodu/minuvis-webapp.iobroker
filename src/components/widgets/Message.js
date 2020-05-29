import React from 'react';
import { Col } from "react-onsenui";


export default class Message extends React.Component {

    render() {
        return (
            <Col>
                <div>
                    {this.props.text}
                </div>
            </Col>
        );
    }
}