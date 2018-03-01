require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

function getRangeRandom(low,high){
	return Math.floor(Math.random() * (high - low) + low);
}

// 将图片名信息转化为图片URL信息
function getImageURL(imageDatasArr){
	for (var i = 0; i < imageDatasArr.length; i++) {
		let singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
}
imageDatas = getImageURL(imageDatas);

class ImgFigure extends React.Component {
	render(){

		let styleObj = {};

		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}

		return (
			<figure className="img-figure" style={styleObj}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
}

class AppComponent extends React.Component {

	constructor(props){
		super(props);
		// 存储排布的取值范围
		this.Constant = {
			// 中心图片位置点
			centerPos : {
				left : 0,
				top : 0
			},
			// 左侧和右侧区域的取值范围
			hPosRange : {
				leftSecX : [0,0],
				rightSecX : [0,0],
				y : [0,0]
			},
			// 上侧区域的取值范围
			vPosRange : {
				x : [0,0],
				topY : [0,0]
			}
		};
		//es5--getInitialState
		this.state = {
			// 存储图片位置状态
			imgsArrangeArr : [
				/*{
					pos : {
						left : '0',
						top : '0'
					}
				}*/
			]
			
		};
	}

	/*
	 * 重新布局所有图片
	 * @param centerIndex 指定居中的图片
	 */
	rearrange(centerIndex){
		let imgsArrangeArr = this.state.imgsArrangeArr,//所有图片的位置状态信息
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeX = vPosRange.x,
			vPosRangeY = vPosRange.topY;

		/* 首先处理居中图片 */
		// 取出图片
		let imgArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
		// 进行布局
		imgArrangeCenterArr[0].pos = centerPos;

		/* 处理上侧区域图片 */
		let topImgNum = Math.ceil(Math.random() * 2);//取一个或零个
		// 取出图片
		let topImgIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
		let imgsArrangeTopArr = imgsArrangeArr.splice(topImgIndex,topImgNum);
		// 进行布局
		imgsArrangeTopArr.forEach(function(value,index){
			imgsArrangeTopArr[index].pos = {
				left : getRangeRandom(vPosRangeX[0],vPosRangeX[1]),
				top : getRangeRandom(vPosRangeY[0],vPosRangeY[1])
			};
		});

		/* 处理左侧和右侧区域的图片 */
		for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			let hPosRangeLORX = null;

			if(i < k){
				hPosRangeLORX = hPosRangeLeftSecX;
			}else{
				hPosRangeLORX = hPosRangeRightSecX;
			}

			imgsArrangeArr[i].pos = {
				left : getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1]),
				top : getRangeRandom(hPosRangeY[0],hPosRangeY[1])
			}
		}

		//重新合并
		if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
			imgsArrangeArr.splice(topImgIndex,0,imgsArrangeTopArr[0]);
		}

		imgsArrangeArr.splice(centerIndex,0,imgArrangeCenterArr[0]);

		this.setState({
			imgsArrangeArr : imgsArrangeArr
		});
	}; 


	// 组件加载后，为每张图片初始化排布的取值范围
	componentDidMount(){
		// 获取舞台大小
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.floor(stageW / 2),
			halfStageH = Math.floor(stageH / 2);
		// 获取imgFigure的大小
		let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgFigureW = imgFigureDOM.scrollWidth,
			imgFigureH = imgFigureDOM.scrollHeight,
			halfImgFigureW = Math.floor(imgFigureW / 2),
			halfImgFigureH = Math.floor(imgFigureH / 2);

		/* 计算Constant值 */
		// 计算中心图片的位置点
		this.Constant.centerPos = {
			left : halfStageW - halfImgFigureW,
			top : halfStageH - halfImgFigureH
		};
		// 计算左侧和右侧区域的范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgFigureW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgFigureW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgFigureW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgFigureW;
		this.Constant.hPosRange.y[0] = -halfImgFigureH;
		this.Constant.hPosRange.y[1] = stageH - halfImgFigureH;
		// 计算上侧区域的范围
		this.Constant.vPosRange.x[0] = halfStageW - halfImgFigureW;
		this.Constant.vPosRange.x[1] = halfStageW;
		this.Constant.vPosRange.topY[0] = -halfImgFigureH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgFigureH * 3;

		this.rearrange(0);

	};

	render() {
		let controllerUnits = [];
		let imgFigures = [];

		// bind-将AppComponent导入,以便让this指向AppComponent对象
		imageDatas.forEach(function(value,index){
			
			// 如果该图片位置信息为空则初始化
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index] = {
					pos : {
						left : 0,
						top : 0
					}
				};
			}

			imgFigures.push(<ImgFigure data={value} 
				ref={'imgFigure' + index} 
				arrange={this.state.imgsArrangeArr[index]} 
				key={index}/>);

		}.bind(this));

	    return (
	    	<section className="stage" ref="stage">
	    		<section className="img-sec">
					{imgFigures}
	    		</section>
	    		<nav className="controller-nav">
					{controllerUnits}
	    		</nav>
	    	</section>
	    );
	}
}

AppComponent.defaultProps = {
};

export default AppComponent;
