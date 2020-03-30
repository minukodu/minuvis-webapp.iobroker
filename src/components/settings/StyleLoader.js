import React from 'react';

export default class StyleLoader extends React.Component {	
    render(){
        return(
            <link rel="stylesheet" type="text/css" href={this.props.stylesheetPath} />
        )
    }
};

