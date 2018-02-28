require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

//将图片名信息转化为图片URL信息
function getImageURL(imageDatasArr){
	for (var i = 0; i < imageDatasArr.length; i++) {
		let singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
}
imageDatas = getImageURL(imageDatas);


class AppComponent extends React.Component {
  render() {
    return (
    	<section className="stage">
    		<section className="img-sec"></section>
    		<nav className="controller-nav">sss</nav>
    	</section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
