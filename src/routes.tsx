import * as React from 'react'
import {config} from 'modules/helpers/JsConfig'
import {Route} from 'react-router'
import Base from 'modules/base/Base'
import PayL2 from 'modules/pay/risepay/PayL2'
import CampPay from 'modules/pay/camppay/CampPay'
import CombatPay from 'modules/pay/combatpay/CombatPay'
import CoinAudioPay from './modules/pay/audiopay/CoinAudioPay'
import BusinessApply from './modules/pay/bsapply/BusinessApply'
import BusinessApplyChoice from './modules/pay/bsapply/BusinessApplyChoice'
import ApplySuccess from 'modules/pay/risepay/ApplySuccess'
import MemberPaySuccess from 'modules/pay/paysuccess/MemberPaySuccess'
import CollegeAudioPay from 'modules/pay/audiopay/CollegeAudioPay'
import BusinessApplySubmitSuccess from './modules/pay/bsapply/BusinessApplySubmitSuccess'
import ExchangePay from './modules/pay/exchange/ExchangePay'
import PayGuide from './modules/pay/guide/PayGuide'
import Subscribe from './modules/subscribe/Subscribe'
import RiseAlipay from './modules/pay/risepay/RiseAlipay'
import AlipayReturn from './modules/pay/risepay/AlipayReturn'
import PayL3 from './modules/pay/risepay/PayL3'
import {notLoadInfoUrls, sa} from './utils/helpers'
import PageNotFound from './modules/others/pageNotFound/PageNotFound'
import PayL1 from 'modules/pay/risepay/PayL1'
import PayGift from 'modules/pay/payGift/PayGift'
import AudioCourse from 'modules/pay/audio/AudioCourse'
import AutoOpen from 'modules/pay/audio/AutoOpen'
import ChallengeAudio from './modules/pay/audio/ChallengeAudio'
import ReadCourse from './modules/pay/read/ReadCourse'
import payEval from './modules/pay/PayEval1/PayEval'
import evalSellCourse from './modules/pay/EvalSellCourse1/EvalSellCourse'
// import Paper from './modules/others/paper/paper'

import Paper from './modules/pay/paper/Paper'
const routes = (
  <Route path="/">
    <Route
      component={Base}
      onChange={() => {
        config(['chooseWXPay'])
        window.scrollTo(0, 0)
        let loadInfo = true
        for (let i = 0; i < notLoadInfoUrls.length; i++) {
          let url = notLoadInfoUrls[i]
          if (url.indexOf(window.location.pathname) !== -1) {
            loadInfo = false
            break
          }
        }
        if (loadInfo) {
          sa.quick('autoTrackSinglePage')
        }
      }}
    >
      <Route path="subscribe" component={Subscribe} />
      <Route path="pay/member/success" component={MemberPaySuccess} />
      <Route path="pay/thought" component={PayL3} />
      <Route path="pay/combat" component={CombatPay} />
      <Route path="pay/rise" component={PayL2} />
      <Route path="pay/camp" component={CampPay} />
      <Route path="pay/apply" component={ApplySuccess} />
      <Route path="pay/bsstart" component={BusinessApply} />
      <Route path="pay/applychoice" component={BusinessApplyChoice} />
      <Route path="pay/applysubmit" component={BusinessApplySubmitSuccess} />
      <Route path="pay/alipay/rise" component={RiseAlipay} />
      <Route path="pay/alipay/return" component={AlipayReturn} />
      <Route path="pay/l1" component={PayL1} />
      <Route path="pay/gift" component={PayGift} />
      <Route path="pay/guide" component={PayGuide} />
      <Route path="pay/audiocourse" component={AudioCourse} />
      <Route path="pay/audiocourse/autoopen" component={AutoOpen} />
      <Route path="pay/collegeaudio" component={CollegeAudioPay} />
      <Route path="pay/challengeaudio" component={ChallengeAudio} />
      <Route path="pay/coinaudio" component={CoinAudioPay} />
      <Route path="pay/exchange" component={ExchangePay} />
      <Route path="pay/read" component={ReadCourse} />
      <Route path="pay/eval" component={payEval} />
      <Route path="pay/evalSellCourse" component={evalSellCourse} />
      <Route path="pay/paper" component={Paper} />
    </Route>
    <Route path="*" component={PageNotFound} />
  </Route>
)

export default routes
