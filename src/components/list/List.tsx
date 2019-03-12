import React, { Component } from 'react';
import './List.less'

export default class List extends Component<any, any> {
    state = {
        ...this.props
    }
    public componentDidMount() {
        console.log(this.state)
    }
}