import * as React from "react"
import { config } from "modules/helpers/JsConfig"
import {Route} from "react-router"

import Base from "modules/base/Base"

const routes = (
  <Route path="/" >
    <Route component={Base} onChange={()=>{
        {/*if(window.ENV.osName !== 'ios'){*/}
          config(['chooseWXPay']);
        {/*}*/}
      }}>

    </Route>
  </Route>
)

export default routes
