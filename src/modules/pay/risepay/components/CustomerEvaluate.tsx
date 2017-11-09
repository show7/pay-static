import * as React from 'react'
import './CustomerEvaluate.less'

export class CustomerEvaluate extends React.Component {

  constructor() {
    super()
  }

  render() {

    return (
      <section className="customer-evaluate-component">
        <img className="evaluate-tag" src="https://static.iqycamp.com/images/rise_pay_tag.png?imageslim" alt=""/>
        <EvaluateCard
          headImage="https://static.iqycamp.com/images/case_headimage_1.png?imageslim"
          nickname="Roger" description="网易游戏项目管理">
          “给我一个支点，我将撬动地球。”古希腊数学家阿基米德的这句名言到如今依旧还被人们传诵不绝。我对撬动地球暂时没有兴趣，目前致力于撬动人生的思考中。<br/><br/>
          三十岁是人生旅程中的一个重要“支点”，支点的一端是职场中我的“重量”，支点的另外一端是我的人生，当然包括我的家庭。有幸在这个重要“支点”遇见了圈外，我在圈外学到的知识、提升的能力、遇到过的圈柚，都为我杠杆的这一端增加了沉甸甸的重量，让我在三十岁的支点上撬动我的小星球。
        </EvaluateCard>

        <EvaluateCard
          headImage="https://static.iqycamp.com/images/case_headimage_2.png?imageslim"
          nickname="lanlan" description="大学教授">
          都说这个时代需要终身学习才能跟上迅猛发展的变革大潮，可是在职场外有限的时间里到底学点什么才是“性价比”最高的？圈外商学院给了我们最好的答案，它为职场人打造出一套完整的知识体系，从根本上帮助职场人掌握提高个人能力的方法，让人受益良多。<br/><br/>
          自从加入圈外以来，我在工作中多次体会到所学方法的实用性和指导意义。同时，圈外商学院还架起了一座学校与职场之间的桥梁。在这里能够接触到人们常说的在学校里学不到的知识，而这些也是在校学生进入社会最需要的知识。
        </EvaluateCard>

        <EvaluateCard
          headImage="https://static.iqycamp.com/images/case_headimage_3.png?imageslim"
          nickname="张良计张鹏" description="知名广告公司品牌战略负责人">
          这个时代最重要的职场核心竞争力就是学习力。如今的知识量以几何级增长，只有掌握了底层逻辑才能在面对不同种类的知识时都做到游刃有余。<br/><br/>
          那么如何做到呢？圈外商学院给了我们最好的答案。它着眼于通用能力的打造，从根基上帮我们塑造了横跨行业的学习技能，让人受益良多。<br/><br/>
          而圈圈也是我认识的，少有的逻辑清晰，思维全面的人。她非常善于提炼和总结，大家能在这里学到许多学校和公司里学不到的知识，因此Boy 在这里强烈推荐！
        </EvaluateCard>
      </section>
    )
  }

}

class EvaluateCard extends React.Component<> {
  constructor() {
    super()
    this.state = {
      showAll: false
    }
  }

  render() {
    const { headImage, nickname, description } = this.props
    const { showAll } = this.state

    return (
      <div className="evaluate">
        <img className="head-image" src={headImage} alt="头像"/>
        <span className="nickname">{nickname}</span>
        <span className="description">{description}</span>
        <article className={`content ${showAll ? 'all' : ''}`}>
          {this.props.children}
        </article>
        <div className={`exchange ${showAll ? 'all' : '' }` }>
          <span className="exchange-text"
                onClick={() => this.setState({ showAll: !showAll })}>
            {`${showAll ? '收起' : '查看全部'}`}
          </span>
        </div>
      </div>
    )
  }
}