import * as React from "react"
import { config } from "modules/helpers/JsConfig"
import { Route } from "react-router"
import Base from "modules/base/Base"
import RisePay from "modules/pay/RisePay"
import CampPay from "modules/pay/CampPay"
import RiseApply from "modules/pay/RiseApply"

import NormalQuestion from "modules/pay/NormalQuestion";
import Pay from "modules/pay/PayPage"
import RiseMemberPaySuccess from "modules/pay/RiseMemberPaySuccess"
import AuditionSuccess from "modules/pay/AuditionSuccess";

const routes = (
  <Route path="/">
    <Route component={Base} onChange={() => {
      config([ 'chooseWXPay' ]);
    }}>
      {/*<Route path="/pay/pay" component={Pay}/>*/}
      <Route path="/pay/risemember/success" component={RiseMemberPaySuccess}/>
      <Route path="/pay/risemember/normalquestion" component={NormalQuestion}/>

      <Route path="pay/rise" component={RisePay}/>
      <Route path="pay/camp" component={CampPay}/>
      <Route path="pay/static/rise" component={RiseApply}/>
      <Route path="pay/static/audition/success" component={AuditionSuccess}/>
    </Route>
  </Route>
)

export default routes
