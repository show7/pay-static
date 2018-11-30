import React, { Component } from 'react';
import SequenceDisplay from './picture/SequenceDisplay'

interface SaleShowProps {
  showList: object
}

export default class SaleShow extends Component<SaleShowProps, any> {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillReceiveProps(nextProps, preProps) {

  }

  componentDidMount() {

  }

  convertPropsToState() {

  }

  render() {
    return (
      <div className="sale-show-component" id="sale-show">
        <SequenceDisplay/>
      </div>
    )
  }

}

