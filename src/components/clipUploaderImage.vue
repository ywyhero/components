<template>
    <div>
        <input type="file" ref="file" :value="imgVal" id="upload" accept="image/png, image/jpeg, image/jpg" @change="imgChange">
        <div class="img-clip-mask" v-show="isClipShow">
            <div class="img-clip">
                <div class="img-clip-title">上传图片</div>
                <div class="img-clip-main">
                    <div class="img-clip-canvas">
                        <canvas id="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
                        <canvas :class="{'active': radio === 1}" id="maskCanvas" :width="clipWidth" :height="clipHeight"></canvas>
                    </div>
                    <!-- <div class="img-clip-cover"></div> -->
                    <div class="img-clip-changes">
                        <span class="img-clip-change" @click="resetUpload">
                            <i class="el-icon-upload"></i>
                            重新上传</span>
                        <div class="img-clip-changes-right">
                            <span class="img-clip-change img-clip-big" @click="toBig">
                                <i class="el-icon-zoom-in"></i>
                                放大</span>
                            <span class="img-clip-change" @click="toSmall">
                                <i class="el-icon-zoom-out"></i>
                                缩小</span>
                        </div>
                        
                    </div>
                </div>
                <div class="img-clip-btns">
                    <el-button @click="cancel" size="small">取消</el-button>
                    <el-button type="primary"  id="uploadSure" size="small" @click="sure">确定上传</el-button>
                </div>
            </div>
            
        </div>
    </div>
    
</template>

<script>
let moveFlag=false; // 是否可以拖动
let canvas = null
let maskCanvas = null;
let maskCtx = null;
let ctx = null
let img = '' // 上传的图片
let x = 0; // x轴的距离
let y = 0; // y轴的距离
export default {
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        clipWidth: { // 裁剪图片的宽度
            type: Number,
            default: 95
        },
        clipHeight: {// 裁剪图片的高度
            type: Number,
            default: 95
        },
        radio: {// 单选默认选中
            type: Number,
            default: 1
        },
    },
    data() {
        return {
            isClipShow: false,
            imgVal: '', // file的值
            imgUrl: '', // 裁剪生成的图片base64链接
            imgWidth: 0, // 上传图片的宽度
            imgHeight: 0, // 上传图片的高度
            canvasWidth: 300, // canvas的宽度
            canvasHeight: 300, // canvas的高度
            ratio: 0.2, // 放大缩小的比例
            count: 0, // 放大缩小的点击次数（不能大于五次）
        }
    },
    watch: {
        isShow(newVal) {
            this.isClipShow = newVal
        }
    },
    methods: {
        // 重新选择事件
        resetUpload() {
            this.$refs.file.dispatchEvent(new MouseEvent('click')) 
        },
        // 图片变大事件
        toBig() {
            this.count += 1;
            if(this.count > 5) {
                return
            }
            this.imgWidth = this.imgWidth * ( 1 + this.ratio);
            this.imgHeight = this.imgHeight * ( 1 + this.ratio);
            img.width = this.imgWidth
            img.height = this.imgHeight
            x = x * ( 1 + this.ratio);
            y = y * ( 1 + this.ratio);
            // 清除canvas
            this.clearCanvas()
            ctx.drawImage(img, x, y, this.imgWidth, this.imgHeight);
            this.drawCanvasMask()
            // 模版切换
            this.moduleChange()
            // 裁剪部分的canvas
            this.drawCanvasCrop()
            
        },
        // 图片变小事件
        toSmall() {
            this.count -= 1;
            if(this.count < -5) {
                return
            }
            this.imgWidth = this.imgWidth * ( 1 - this.ratio);
            this.imgHeight = this.imgHeight * ( 1 - this.ratio);
            img.width = this.imgWidth
            img.height = this.imgHeight
            x = x * ( 1 - this.ratio);
            y = y * ( 1 - this.ratio);
            // 清除canvas
            this.clearCanvas()
            ctx.drawImage(img, x, y, this.imgWidth, this.imgHeight);
            this.drawCanvasMask()
            // 模版切换
            this.moduleChange()
            // 裁剪部分的canvas
            this.drawCanvasCrop()
        },
        // 取消上传
        cancel() {
            this.imgVal = ''
            this.isClipShow = false;
            this.count = 0;
            this.clearCanvas()
        },
        // 确认上传
        async sure() {
            let cropX = -((this.canvasWidth - this.clipWidth)/2 - x);
            let cropY = -((this.canvasHeight - this.clipHeight)/2 - y);
            this.cropImage(img, cropX, cropY,  this.imgWidth,  this.imgHeight, this.clipWidth , this.clipHeight)
            this.imgVal = ''
            this.count = 0;
            this.isClipShow = false;
            this.clearCanvas()
        },
        // 裁剪图片
        cropImage(img, cropPosX, cropPosY, width, height, clipWidth, clipHeight) {
            let newCanvas = document.createElement('canvas');
            newCanvas.width = clipWidth;
            newCanvas.height = clipHeight;
            let newCtx = newCanvas.getContext('2d');
            if(this.radio === 1) {
                newCtx.beginPath();
                newCtx.arc(clipWidth / 2, clipHeight / 2, clipWidth / 2, 0, 2 * Math.PI); 
            } else {
                newCtx.beginPath();
                newCtx.rect(0, 0, clipWidth, clipHeight);
            }
            newCtx.clip();
            newCtx.drawImage(img, cropPosX, cropPosY, width, height);
            // canvas转化为图片
            let imgUrl = newCanvas.toDataURL("image/png");
            this.$emit('uploaderImageUrl', imgUrl)
        },
        // 裁剪框的图片
        drawCanvasCrop() {
            let cropX = -((this.canvasWidth - this.clipWidth) / 2 - x);
            let cropY = -((this.canvasHeight - this.clipHeight) / 2 - y);
            maskCtx.drawImage(img, cropX, cropY, this.imgWidth, this.imgHeight);
        },
        // 上传图片事件
        imgChange() {
            let canvasBox = document.querySelector('.img-clip-canvas');
            this.isClipShow = true;
            this.imgVal = ''
            canvas = null;
            ctx = null
            canvas = document.getElementById('canvas')
            ctx = canvas.getContext('2d');
            maskCanvas = document.getElementById('maskCanvas')
            maskCtx = maskCanvas.getContext('2d');
            let upload = document.getElementById('upload')
            // 获取上传图片的base64链接
            let reader = new FileReader();
            reader.readAsDataURL(upload.files[0]);
            reader.onloadend =  (e) => {
                img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    this.imgWidth = img.width;
                    this.imgHeight = img.height;
                    x =  (this.canvasWidth - img.width) / 2 ;
                    y = (this.canvasHeight - img.height) / 2;
                    if(img.width > this.canvasWidth) {
                        x = -(img.width - this.canvasWidth) / 2;
                    } 
                    if(img.height > this.canvasHeight) {
                        y = -(img.height - this.canvasHeight ) / 2;
                    } 
                    let isMove= false
                    // canvas拖拽事件
                    canvasBox.onmousedown = (ev) => {
                        isMove = true
                        let startPositionX = ev.pageX;
                        let startPositionY = ev.pageY;
                        canvasBox.onmousemove =  (e) => {
                            if(isMove) {
                                let cX= e.pageX - startPositionX;
                                let cY= e.pageY - startPositionY;
                                startPositionX = e.pageX;
                                startPositionY = e.pageY;
                                x += cX;
                                y += cY
                                // 清除canvas
                                this.clearCanvas()
                                ctx.drawImage(img, x, y, this.imgWidth, this.imgHeight);
                                this.drawCanvasMask()
                                // 模版切换
                                this.moduleChange()
                                // 裁剪部分的canvas
                                this.drawCanvasCrop()
                                canvasBox.onmouseup = () => {
                                    isMove= false
                                }
                                canvasBox.onmouseleave = () => {
                                    isMove= false
                                }
                            }
                        };
                    }
                    // 清除canvas
                    this.clearCanvas()
                    ctx.drawImage(img, x, y, this.imgWidth, this.imgHeight);
                    this.drawCanvasMask()
                    // 模版切换
                    this.moduleChange()
                    // 裁剪部分的canvas
                    this.drawCanvasCrop()
                    
                }
            };
        },
        // canvas 画阴影
        drawCanvasMask() {
            ctx.beginPath();
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        },
        //模版切换
        moduleChange() {
            if(this.radio === 1) {
                maskCtx.beginPath();
                maskCtx.fillStyle = "rgba(255,255,255,1)";
                maskCtx.arc(this.clipWidth / 2, this.clipHeight / 2, this.clipWidth / 2, 0, 2 * Math.PI);
                maskCtx.fill()
            } else {
                maskCtx.beginPath();
                maskCtx.fillStyle="rgba(255,255,255,1)";
                maskCtx.fillRect(0, 0, this.clipWidth, this.clipHeight);
            }
        },
        // 清除canvas
        clearCanvas() {
            ctx.clearRect(0, 0, this.canvasWidth,  this.canvasHeight);
            maskCtx.clearRect(0, 0, this.clipWidth,  this.clipHeight);
        }
    }
}
</script>
<style lang="less" scoped>
    .img-clip-mask{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0,0,0,.4);
        z-index: 999;
    }
    .img-clip{
        position: absolute;
        border-radius: 4px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
    }
    .img-clip-title{
        padding-left: 10px; 
        line-height: 40px;
        border-bottom: 1px solid #E4E7ED;
        font-weight: 700;
    }
    .img-clip-main{
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        width: 462px;
        height: 391px;
    }
    .img-clip-canvas{
        width: 302px;
        height: 302px;
        margin: 30px 80px 10px;
        position: relative;
    }
    #canvas{
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        top: 50%;
        border: 1px solid #EBEEF5;
        border-radius: 4px;
    }
    #maskCanvas{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    #maskCanvas.active{
        border-radius: 50%;
    }
    .img-clip-cover{
        position: absolute;
        width: 300px;
        height: 300px;
        top: 30px;
        left: 80px;
        overflow: hidden;
    }
    .img-clip-cover:after{
        position:absolute;
        content:'';
        width: 100px;
        height:100px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        border: 300px solid #EBEEF5;
    }
    .img-clip-changes{
        display: flex;
        padding: 10px 10px;
        width: 100%;
        justify-content: space-around;
    }
    .img-clip-changes-right{
        display: flex;
    }
    .img-clip-big{
        margin-right: 10px;
    }
    .img-clip-change{
        width: max-content;
        padding: 5px 10px;
        text-align: center;
        border: 1px solid #EBEEF5;
        cursor: pointer;
        font-size: 12px;
    }
    
    .img-clip-btns{
        border-top: 1px solid #EBEEF5;
        padding: 10px;
        text-align: right;
    }
    #upload{
        position: absolute;
        left: -999999999px;
    }
</style>
