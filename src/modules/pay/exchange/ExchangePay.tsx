import * as React from 'react'
import SaleShow from '../../../components/SaleShow'
import { connect } from 'react-redux'
import { alertMsg,startLoad,endLoad } from '../../../redux/actions'
import { exchangeRiseMemberByCode, getRiseMember } from '../async'

import './ExchangePay.less'

@connect(state => state)
export default class ExchangePay extends React.Component {

  constructor () {
    super()
    this.state = {
      exchangeCode: '',
      exchangeGoodsInfo: {},
      submitable: true,
    }
  }

  componentDidMount () {
    const { goodsId } = this.props.location.query
    getRiseMember(goodsId).then(res => {
      if (res.code === 200) {
        this.setState({ exchangeGoodsInfo: res.msg })
      }
    })
  }

  handleChangeValue (e) {
    this.setState({
      exchangeCode: e.target.value,
    })
  }

  handleExchange () {
    const { submitable, exchangeCode } = this.state
    const { dispatch } = this.props
    const { goodsId } = this.props.location.query
    if (exchangeCode.length == 0) {
      dispatch(alertMsg('请输入兑换码'))
      return
    }
    if (submitable) {
      this.setState({ submitable: false }, () => {
        dispatch(startLoad())
        exchangeRiseMemberByCode(exchangeCode, goodsId).then(exchangeResult => {
          dispatch(endLoad())
          dispatch(alertMsg(exchangeResult.msg))
          this.setState({ submitable: true, exchangeCode: '' })
        })
      })
    }
  }

  render () {
    const { exchangeGoodsInfo, exchangeCode } = this.state
    const { quanwaiGoods = {} } = exchangeGoodsInfo

    return (
      <div className="exchange-pay-container">
        <SaleShow showList={quanwaiGoods.saleImg}/>
        <div className="bottom-exchange-block">
          <input className="code-input"
                 type="text"
                 placeholder="请输入您的兑换码"
                 value={exchangeCode}
                 onChange={(e) => this.handleChangeValue(e)}/>
          <div className="submit-btn"
               onClick={() => this.handleExchange()}>兑换
          </div>
        </div>
      </div>
    )
  }

}