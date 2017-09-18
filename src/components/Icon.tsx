import * as React from "react"
import "./Icon.less"
import * as _ from "lodash"

export default class Icon extends React.Component<any, any> {
	constructor(props) {
		super(props)
	}

	render() {
		const { size, type, width, height, marginTop, style } = this.props

		const _style = {
			width: size || width,
			height: size || height,
			marginTop: marginTop,
		}

		return (
			<img src={require(`../../assets/icons/${type}.png`)} style={_.merge(_style, style)}/>
		)
	}
}
