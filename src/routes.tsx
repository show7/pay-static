import * as React from 'react'
import { config } from 'modules/helpers/JsConfig'
import { Route } from 'react-router'
import Base from 'modules/base/Base'
import RisePay from 'modules/pay/risepay/RisePay'
import CampPay from 'modules/pay/camppay/CampPay'
import RiseApply from 'modules/pay/risepay/RiseApply'
import RiseShare from 'modules/pay/risepay/RiseShare'
import BusinessApply from './modules/pay/bsapply/BusinessApply'
import BusinessApplyChoice from './modules/pay/bsapply/BusinessApplyChoice'
import PreacherPage from 'modules/pay/preacher/PreacherPage'
import CampPaySuccess from 'modules/pay/paysuccess/CampPaySuccess'
import AuditionSuccess from 'modules/pay/paysuccess/AuditionSuccess'
import ApplySuccess from 'modules/pay/risepay/ApplySuccess'
import MemberPaySuccess from 'modules/pay/paysuccess/MemberPaySuccess'
import BusinessApplySubmitSuccess from './modules/pay/bsapply/BusinessApplySubmitSuccess'
import Subscribe from './modules/subscribe/Subscribe'
import CampPayGuest from './modules/pay/camppay/CampPayGuest'
import RiseAlipay from './modules/pay/risepay/RiseAlipay'
import AlipayReturn from './modules/pay/risepay/AlipayReturn'
import ExperienceDay from './modules/pay/preacher/ExperienceDay'
import sa from 'sa-sdk-javascript';

const routes = (
  <Route path="/">
    <Route component={Base}
           onChange={() => {
             config([ 'chooseWXPay' ])
             window.scrollTo(0, 0)
             sa.quick('autoTrackSinglePage');
           }}>
      <Route path="subscribe" component={Subscribe}/>
      <Route path="pay/camp/success" component={CampPaySuccess}/>
      <Route path="pay/member/success" component={MemberPaySuccess}/>
      <Route path="pay/audition/success" component={AuditionSuccess}/>
      <Route path="pay/rise" component={RisePay}/>
      <Route path="pay/static/camp" component={CampPayGuest}/>
      <Route path="pay/camp" component={CampPay}/>
      {/*<Route path="pay/static/rise" component={RiseApply}/>*/}
      <Route path="pay/static/rise" component={RisePay}/>
      <Route path="pay/static/share" component={RiseShare}/>
      <Route path="pay/apply" component={ApplySuccess}/>
      <Route path="pay/pay" component={RisePay}/>
      <Route path="pay/preacher" component={PreacherPage}/>
      <Route path="pay/experience/day" component={ExperienceDay}/>
      <Route path="pay/bsstart" component={BusinessApply}/>
      <Route path="pay/applychoice" component={BusinessApplyChoice}/>
      <Route path="pay/applysubmit" component={BusinessApplySubmitSuccess}/>
      <Route path="pay/alipay/rise" component={RiseAlipay}/>
      <Route path="pay/alipay/return" component={AlipayReturn}/>
    </Route>
  </Route>
)

export default routes
