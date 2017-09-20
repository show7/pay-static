import * as React from "react"
import { config } from "modules/helpers/JsConfig"
import { Route } from "react-router"
import Base from "modules/base/Base"
import RisePay from "modules/pay/RisePay"

import NormalQuestion from "modules/pay/NormalQuestion";
import Pay from "modules/pay/PayPage"
import RiseMemberPaySuccess from "modules/pay/RiseMemberPaySuccess"

const routes = (
  <Route path="/">
    <Route component={Base} onChange={()=>{
        {/*if(window.ENV.osName !== 'ios'){*/}
          config(['chooseWXPay']);
        {/*}*/}
      }}>
      <Route path="/pay/pay" component={Pay}/>
      <Route path="/pay/risemember/success" component={RiseMemberPaySuccess}/>
      <Route path="/pay/risemember/normalquestion" component={NormalQuestion}/>

      <Route path="pay/rise" component={RisePay}/>
    </Route>
  </Route>
)

export default routes
