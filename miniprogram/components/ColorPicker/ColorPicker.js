// components/ColorPicker/ColorPicker.js
Component({

  options: {
    virtualHost: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    type:{
      type:String,           // brightness：亮度    color: 颜色
      value:'brightness'
    },
    initColor:{            // 初始颜色
      type:String,
      value:'rgb(255,0,0)'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  lifetimes: {
    attached() {

    },
    ready() {
      this.initData();
      this.initBackgroudCanvas();
      this.initDragBlock();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initData(){
      this.mBgCanvasWidth = 1000; // 整个背景canvas的宽高
      this.mBgBorderRadius = 50; // 背景圆角
    },
    initBackgroudCanvas(){
      let query = this.createSelectorQuery()
      query.select('#backgroundCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          console.log('lvjie', res);
          this.mBgCanvas = res[0].node;
          this.mViewWidth = res[0].width;
          this.mBgCanvasContext = this.mBgCanvas.getContext('2d');
          this.drawBackgroundCanvas();
        })
    },
    initDragBlock(){
      let query = this.createSelectorQuery()
      query.select('#dragBlockCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          this.mDragBlockCanvas = res[0].node;
          this.mDragBlockCanvasContext = this.mDragBlockCanvas.getContext('2d');

          let position = {};
          if (this.properties.type === 'brightness') {
            let hsv = this.rgb2hsv(this.properties.initColor);
            let devide = this.mBgCanvasWidth/100;
            position.x = Math.round(hsv.s * devide);
            position.y = Math.round((100 - hsv.v) * devide);
            console.log('lvjie position', position, 'hsv',hsv, 'width',res[0].width);
          } else if (this.properties.type === 'color') {
           
          }
          this.checkDrawDragBlockPosition(position);
          this.drawDragBlock(position.x, position.y, this.properties.initColor);
        });
    },
    checkDrawDragBlockPosition(position){
      // 由于四个角都是圆角，所以要考虑圆角的问题
      if(position.x > 950 && position.y < 50){
        // 右上角
        position.x = 950;
        position.y = 50;
      }else if(position.x>950 && position.y>950){
        // 右下角
        position.x = 950;
        position.y = 950;
      }else if(position.x<50 && position.y>950){
        // 左下角
        position.x = 50;
        position.y = 950;
      }else if(position.x<50 && position.y<50){
        // 左上角
        position.x = 50;
        position.y = 50;
      }

      if(position.x > 995){
        position.x = 995;
      }
      if(position.x < 5){
        position.x = 5;
      }
      if(position.y > 995){
        position.y = 995;
      }
      if(position.y < 5){
        position.y = 5;
      }
    },
    drawBackgroundCanvas(){
      if (this.properties.type === 'brightness') {
        this.drawBackgroundCanvasForTypeBrightness();
      } else if (this.properties.type === 'color') {
        this.drawBackgroundCanvasForTypeColor();
      }
    },
    drawBackgroundCanvasForTypeBrightness(){
      this.mBgCanvas.width = this.mBgCanvasWidth;
      this.mBgCanvas.height = this.mBgCanvasWidth;

      this.mBgCanvasContext.save();
      this.mBgCanvasContext.beginPath();
      this.mBgCanvasContext.moveTo(this.mBgBorderRadius, 0);
      this.mBgCanvasContext.lineTo(this.mBgCanvasWidth-this.mBgBorderRadius, 0);
      this.mBgCanvasContext.arcTo(this.mBgCanvasWidth, 0, this.mBgCanvasWidth, this.mBgCanvasWidth, this.mBgBorderRadius);
      this.mBgCanvasContext.lineTo(this.mBgCanvasWidth, this.mBgCanvasWidth-this.mBgBorderRadius);
      this.mBgCanvasContext.arcTo(this.mBgCanvasWidth, this.mBgCanvasWidth, this.mBgCanvasWidth-this.mBgBorderRadius, this.mBgCanvasWidth, this.mBgBorderRadius);
      this.mBgCanvasContext.lineTo(this.mBgBorderRadius, this.mBgCanvasWidth);
      this.mBgCanvasContext.arcTo(0, this.mBgCanvasWidth, 0, 0, this.mBgBorderRadius);
      this.mBgCanvasContext.lineTo(0, this.mBgBorderRadius);
      this.mBgCanvasContext.arcTo(0, 0, this.mBgBorderRadius, 0, this.mBgBorderRadius);
      this.mBgCanvasContext.lineTo(this.mBgBorderRadius, 0);
      this.mBgCanvasContext.clip();

      this.mBgCanvasContext.fillStyle = this.properties.initColor;
      this.mBgCanvasContext.fill();
      
      let grdH = this.mBgCanvasContext.createLinearGradient(0,0, this.mBgCanvasWidth, 0);   // 水平上的渐变
      grdH.addColorStop(0, '#FFFFFFFF');
      grdH.addColorStop(1, '#FFFFFF00');
      this.mBgCanvasContext.fillStyle = grdH;
      this.mBgCanvasContext.fill();

      let grdV = this.mBgCanvasContext.createLinearGradient(0,0, 0, this.mBgCanvasWidth);   // 垂直上的渐变
      grdV.addColorStop(0, '#00000000');
      grdV.addColorStop(1, '#000000FF');
      this.mBgCanvasContext.fillStyle = grdV;
      this.mBgCanvasContext.fill();
    },
    drawBackgroundCanvasForTypeColor(){
      
      this.mBgCanvas.width = this.mBgCanvasWidth;
      this.mBgCanvas.height = this.mBgCanvasWidth;

      let colors = [
        '#E6312E', '#E6842E',
        '#E6D72E', '#98E62E',
        '#2EE62F', '#2EE67C',
        '#2ED5E6', '#2E79E6',
        '#302EE6', '#7D2EE6',
        '#E62EE3', '#E62EB5',
        '#E6312E'
      ];
      let positions = [
        0.0, 1 / 12,
        2 / 12, 3 / 12,
        4 / 12, 5 / 12,
        6 / 12, 7 / 12,
        8 / 12, 9 / 12,
        10 / 12, 11 / 12,
        12 / 12
      ];

      let grd = this.mBgCanvasContext.createLinearGradient(0,0, this.mBgCanvasWidth, 0);
      for(let i=0; i<colors.length; i++){
        grd.addColorStop(positions[i], colors[i]);
      }

      this.mBgCanvasContext.save();
      this.mBgCanvasContext.beginPath();
      this.mBgCanvasContext.moveTo(this.mBgBorderRadius, 0);
      this.mBgCanvasContext.lineTo(this.mBgCanvasWidth-this.mBgBorderRadius, 0);
      this.mBgCanvasContext.arcTo(this.mBgCanvasWidth, 0, this.mBgCanvasWidth, this.mBgCanvasWidth, this.mBgBorderRadius);
      this.mBgCanvasContext.lineTo(this.mBgCanvasWidth, this.mBgCanvasWidth-this.mBgBorderRadius);
      this.mBgCanvasContext.arcTo(this.mBgCanvasWidth, this.mBgCanvasWidth, this.mBgCanvasWidth-this.mBgBorderRadius, this.mBgCanvasWidth, this.mBgBorderRadius);
      this.mBgCanvasContext.lineTo(this.mBgBorderRadius, this.mBgCanvasWidth);
      this.mBgCanvasContext.arcTo(0, this.mBgCanvasWidth, 0, 0, this.mBgBorderRadius);
      this.mBgCanvasContext.lineTo(0, this.mBgBorderRadius);
      this.mBgCanvasContext.arcTo(0, 0, this.mBgBorderRadius, 0, this.mBgBorderRadius);
      this.mBgCanvasContext.lineTo(this.mBgBorderRadius, 0);
      this.mBgCanvasContext.clip();

      this.mBgCanvasContext.fillStyle = grd;
      this.mBgCanvasContext.fill();

      let grd1 = this.mBgCanvasContext.createLinearGradient(0,0, 0, this.mBgCanvasWidth);
      grd1.addColorStop(0, '#FFFFFF20');
      grd1.addColorStop(1, '#FFFFFFC0');
      this.mBgCanvasContext.fillStyle = grd1;
      this.mBgCanvasContext.fill();
    },
    drawDragBlock(positionX, positionY, fillColor){
      
      this.mDragBlockCanvas.width = this.mBgCanvasWidth;
      this.mDragBlockCanvas.height = this.mBgCanvasWidth;

      this.mDragBlockCanvasContext.clearRect(0, 0, this.mBgCanvasWidth, this.mBgCanvasWidth);
      
      let r = 50;
      /**
       * 圆心的 x 坐标
       * 圆心的 y 坐标
       * 圆的半径
       * 起始弧度，单位弧度（在3点钟方向）
       * 终止弧度
       */
      this.mDragBlockCanvasContext.arc(positionX, positionY, r, 0, 2 * Math.PI);
      if(fillColor){
        this.mDragBlockCanvasContext.fillStyle = fillColor;  //  'rgba(xx,xx,xx, xx)'
        this.mDragBlockCanvasContext.fill();
      }
      this.mDragBlockCanvasContext.strokeStyle = '#ffffff'; //圆环线条的颜色
      this.mDragBlockCanvasContext.lineWidth = 4;	//圆环的粗细
      this.mDragBlockCanvasContext.stroke();
    },
    onDragBlockMoveStart: function(e){
      
      let {x, y} = e.touches[0];
      let result = this.touchPointToCanvasPoint(x, y);
      console.log('lvjie onDragBlockMoveStart result', result);
      this.checkDrawDragBlockPosition(result);
      this.drawDragBlock(result.x, result.y);
    },
    onDragBlockMoving: function(e){
      let {x, y} = e.touches[0];
      let result = this.touchPointToCanvasPoint(x, y);
      this.checkDrawDragBlockPosition(result);
      this.drawDragBlock(result.x, result.y);
    },
    onDragBlockMoveEnd: function(e){
      let {x, y} = e.changedTouches[0];

      let result = this.touchPointToCanvasPoint(x, y);
      this.checkDrawDragBlockPosition(result);
      let imageData = this.mBgCanvasContext.getImageData(result.x, result.y, 1, 1);

      let rgba = `rgba(${imageData.data[0]},${imageData.data[1]},${imageData.data[2]},${imageData.data[3]})`
      console.log('lvjie rgba', rgba, result);
      this.drawDragBlock(result.x, result.y, rgba);

      this.triggerOnColorChangeEvent(rgba, this.properties.type);
    },
    touchPointToCanvasPoint(touchPointX, touchPointY){

      if(this.mViewWidth <= 0){
        this.mViewWidth = 320;
      }

      touchPointX = touchPointX < 0 ? 0 : touchPointX;
      touchPointX = touchPointX > this.mViewWidth ? this.mViewWidth : touchPointX;
      touchPointY = touchPointY < 0 ? 0 : touchPointY;
      touchPointY = touchPointY > this.mViewWidth ? this.mViewWidth : touchPointY;
      
      let percentX = touchPointX/this.mViewWidth;
      let percentY = touchPointY/this.mViewWidth;

      let result = {
        x:percentX*this.mBgCanvasWidth,
        y:percentY*this.mBgCanvasWidth
      };
      return result;
    },
    triggerOnColorChangeEvent(color, type){

      let result = this.rgb2hsv(color);
      console.log('lvjie result', result);

      this.triggerEvent('onColorChange', {
        color: color,
        type: type
      })
    },
    rgb2hsv: function (color) {
      let rgb = color.split(',');
      let R = parseInt(rgb[0].split('(')[1]);
      let G = parseInt(rgb[1]);
      let B = parseInt(rgb[2].split(')')[0]);

      let hsv_red = R / 255, hsv_green = G / 255, hsv_blue = B / 255;
      let hsv_max = Math.max(hsv_red, hsv_green, hsv_blue),
        hsv_min = Math.min(hsv_red, hsv_green, hsv_blue);
      let hsv_h, hsv_s, hsv_v = hsv_max;

      let hsv_d = hsv_max - hsv_min;
      hsv_s = hsv_max == 0 ? 0 : hsv_d / hsv_max;

      if (hsv_max == hsv_min) hsv_h = 0;
      else {
        switch (hsv_max) {
          case hsv_red:
            hsv_h = (hsv_green - hsv_blue) / hsv_d + (hsv_green < hsv_blue ? 6 : 0);
            break;
          case hsv_green:
            hsv_h = (hsv_blue - hsv_red) / hsv_d + 2;
            break;
          case hsv_blue:
            hsv_h = (hsv_red - hsv_green) / hsv_d + 4;
            break;
        }
        hsv_h /= 6;
      }
      return {
        h: (hsv_h * 360).toFixed(),
        s: (hsv_s * 100).toFixed(),
        v: (hsv_v * 100).toFixed()
      }
    },
  }
})
