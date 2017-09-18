import * as React from "react"
import { config } from "modules/helpers/JsConfig"
import {Route} from "react-router"

import Base from "modules/base/Base"
import RisePay from "modules/pay/RisePay"

const routes = (
  <Route path="/" >
    <Route component={Base} onChange={()=>{
        {/*if(window.ENV.osName !== 'ios'){*/}
          config(['chooseWXPay']);
        {/*}*/}
      }}>
      <Route path="pay/rise" component={RisePay}/>
    </Route>
  </Route>
)

export default routes
