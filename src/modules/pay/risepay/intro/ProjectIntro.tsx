/*----------------------------------------------------------------------------------------------------------------------
  1. 项目名称：pay-static
  2. 文件功能：项目二级介绍
  3. 作者： zhenzikang@iquanwai.com
  4. 备注：
 ---------------------------------------------------------------------------------------------------------------------*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ProjectIntro.less'
import AssetImg from '../../../../components/AssetImg'

export default class ProjectIntro extends Component<any, any> {
  constructor() {
    super();
    this.state = {}
  }

  componentWillMount() {

  }

  render() {
    return <div className="project-intro">
      <div className="project-intro-wrapper">
        {/* 标题 */}
        <div className="project-title">
          <span className="title-text">
            <span className="text">《战略管理》课程大纲</span>
          </span>
        </div>
        {/* 老师介绍 */}
        <section className="project-card">
          <div className="project-left-avatar">
            <AssetImg url='https://static.iqycamp.com/images/fragment/hanzheng_head_0522.jpg?imageslim' size='100%'/>
          </div>
          <div className="project-right-desc">
            <h3 className="project-teacher-name">
              韩政
            </h3>
            <h4 className="project-teacher-desc">
              《战略管理》授课讲师
            </h4>
            <div className="project-teacher-tips">
              - 德国曼海姆商学院等欧洲TOP5商学院MBA/EMBA教授<br/>
              - 前德国麦肯锡咨询顾问，世界500强集团中国战略投资总监
            </div>
          </div>
        </section>
        {/* 章节信息 */}
        <section className="project-sub-area">
          <div className="project-sub-title">
            课程介绍
          </div>
          <div className="project-sub-context">
            这门课程的核心是战略的制定，我将通过战略管理的五个核心步骤的其中四个：目标规划、战略分析、战略制定和战略实施来一步一步帮你理解战略管理的核心元素。
          </div>
        </section>

        <section className="project-sub-area">
          <div className="project-sub-title">
            第一章 揭开战略管理神秘的面纱
          </div>
          <div className="project-sub-context">
            <span className="row">1.1 什么是战略</span>
            <span className="text-dot row">
              使用<span className="green-bg">三国“隆中对”案例</span>讲解三大战略误区
            </span>
            <span className="text-dot row">
              在<span className="green-bg">联想案例</span>中为你讲解战略的层级
            </span>
          </div>
        </section>


        <section className="project-sub-area">
          <div className="project-sub-title">
            第二章 目标制定——战略需要“北斗星
          </div>
          <div className="project-sub-context">
            <span className="row">2.1 你看得见你企业的北斗星吗？</span>
            <span className="text-dot row">
              运用<span className="green-bg">沃尔玛、乐视与福特公司的案例</span>分析企业金字塔的含义与业务铁三角、资源分析框架的使用方法
            </span>
          </div>
        </section>

        <section className="project-sub-area">
          <div className="project-sub-title">
            第三章 战略分析：知己知彼，百战不殆
          </div>
          <div className="project-sub-context">
            <span className="row">3.1 宏观环境分析</span>
            <span className="text-dot row">
              在<span className="green-bg">传音手机、共享单车、喜茶、京东与DNA检测技术案例</span>中讲解PEST分析工具
            </span>
            <span className="text-dot row">
              用3D技术带你了解新兴技术成熟曲线与康波周期模型
            </span>


            <span className="row">3.2 行业分析</span>
            <span className="text-dot row">
              使用<span className="green-bg">亚马逊的案例</span>深入讲解VUCA模型、价值链模型和波特五力模型
            </span>

            <span className="row">3.3 公司内部分析</span>
            <span className="text-dot row">
              用<span className="green-bg">苹果公司产品案例</span>将SWOT分析法与其运用中可使用的工具VRIO分析法、竞争态势矩阵（CPM）和TOWS分析矩阵进行了全面的分析
            </span>
          </div>
        </section>


        <section className="project-sub-area">
          <div className="project-sub-title">
            第四章 选择战略：选择要做什么，不做什么？
          </div>
          <div className="project-sub-context">
            <span className="row">4.1 起步阶段的战略选择</span>
            <span className="text-dot row">
              在<span className="green-bg">农夫山泉的各类产品分析</span>中讲解波士顿矩阵
            </span>
            <span className="text-dot row">
              用<span className="green-bg">苹果手机、小米公司、纬图手机、HTC与农夫山泉案例</span>带你学习波特的三种基本竞争战略
            </span>


            <span className="row">4.2 成长阶段的战略选择</span>
            <span className="text-dot row">
              使用<span className="green-bg">VR电子产品企业、肯德基、共享单车、强生、通用磨坊、Google Glass、Apple Watch案例</span>讲解安索夫矩阵
            </span>
            <span className="text-dot row">
              在<span className="green-bg">阿里小蜜与VR企业案例</span>中分析多角化战略
            </span>

            <span className="row">4.3 成熟阶段的战略选择</span>
            <span className="text-dot row">
              用<span className="green-bg">太阳马戏团案例</span>带你全面了解红海蓝海战略、标杆化分析、发掘蓝海市场六个途径、企业价值曲线
            </span>

            <span className="row">4.4 企业的“基因突变”</span>
            <span className="text-dot row">
              用<span className="green-bg">Airbnb（爱彼迎）</span>案例带你学习商业模式画布
            </span>
            <span className="text-dot row">
              以<span className="green-bg">劳斯莱斯案例</span>讲解价值主张画布与商业模式创新方法
            </span>
          </div>
        </section>

        <section className="project-sub-area">
          <div className="project-sub-title">
            第五章 战略实施：成败在此一举
          </div>
          <div className="project-sub-context">
            <span className="row">5.1 战略实施</span>
            <span className="text-dot row">
              在<span className="green-bg">太阳马戏团案例</span>中分析麦肯锡7S模型、麦肯锡7S矩阵、方针管理矩阵
            </span>
          </div>
        </section>
        <div className="more-project-tips">
          更多课程大纲持续更新中...
        </div>
      </div>

    </div>
  }
}