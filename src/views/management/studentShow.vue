<template>
    <div class="student-show">
        <el-tabs v-model="activeName">
            <el-tab-pane label="APP开屏广告" name="first">
                <div class="student-show-start">
                    <div class="student-show-start-left">
                        <img src="./../../assets/images/mockup.png" alt="">
                        <div class="student-show-start-mock">
                            <img v-show="imgUrl" :src="imgUrl" alt="">
                            <div class="student-show-start-mock-val">
                                <span class="student-show-start-mock-name">{{organName}}</span>
                                <span class="student-show-start-mock-des">{{solgan}}</span>
                            </div>
                            <div class="student-show-start-mock-tip">- 由音乐云课堂提供技术支持 -</div>
                        </div>
                    </div>
                    <div class="student-show-start-right">
                        <div v-show="!isCustom" class="student-show-start-custom">
                            <div class="student-show-start-custom-main">
                                <div class="student-show-start-custom-title">
                                    <i class="student-show-start-custom-icon el-icon-warning-outline"></i>
                                    <span class="student-show-start-custom-val">个性化定制</span>
                                </div>
                                <span class="student-show-start-custom-des">开启个性化服务，学生可以看到机构配置的个性化页面，会带来更好的用户体验</span>
                                <div class="student-show-start-custom-btn" v-show="!isCustomStart">
                                    <el-button type="text" @click="customClick">立即开启</el-button>
                                </div>
                                <div class="student-show-start-custom-btn" v-show="isCustomStart">
                                    <el-button type="text" class="student-show-start-custom-color">已开启</el-button>
                                    <el-button type="text" @click="customClick">修改</el-button>
                                </div>
                                
                            </div>
                        </div>
                        <div class="student-show-start-custom" v-show="isCustom">
                            <div class="student-show-start-radios">
                                <el-radio v-model="radio" v-for="(item, index) in radioLists" :key="index" @change="radioChange" :label="item.id">{{item.value}}</el-radio>
                            </div>
                            <div class="student-show-start-infos">
                                <div class="student-show-start-info">
                                    <span class="student-show-start-info-val">机构LOGO:</span>
                                    <div class="student-show-start-upload">
                                        <span class="student-show-start-upload-val" @click="uploadEvent">
                                            +上传图片
                                            <!-- <input type="file" ref="file1" :value="imgVal" id="upload" style="display: none" accept="image/png, image/jpeg, image/jpg" @change="imgChange"> -->
                                        </span>
                                        <span class="student-show-start-upload-des">建议尺寸240*160</span>
                                        
                                    </div>
                                </div>
                                <div class="student-show-start-info">
                                    <span class="student-show-start-info-val">机构名称:</span>
                                    <el-input class="student-show-start-input" maxlength="12" v-model="organName" placeholder="请输入机构名称"></el-input>
                                </div>
                                <div class="student-show-start-info">
                                    <span class="student-show-start-info-val">宣传口号:</span>
                                    <el-input class="student-show-start-input" maxlength="20" v-model="solgan" placeholder="请输入宣传口号"></el-input>
                                </div>
                                <div class="student-show-start-info">
                                    <span class="student-show-start-info-val">机构简介:</span>
                                    <el-input class="student-show-start-textarea" resize="none" type="textarea" maxlength="100" v-model="description" show-word-limit placeholder="请输入机构简介"></el-input>
                                </div>
                            </div>
                            <div class="student-show-start-btns">
                                <el-button size="small" @click="cancelEvent">放弃</el-button>
                                <el-button type="primary" size="small" @click="saveEvent">保存</el-button>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="学生首页" name="second">
                <div class="student-show-studeng-page">
                    <el-input class="student-show-input" placeholder="请输入" v-model="studentVal" :disabled="!isEdit"></el-input>
                    <div class="student-show-btns" v-show="!isEdit">
                        <el-button class="student-show-btn" type="primary" size="small" @click="editClick">修改</el-button>
                    </div>
                    <div class="student-show-btns" v-show="isEdit">
                        <el-button class="student-show-btn" size="small" @click="cancelClick">取消</el-button>
                        <el-button class="student-show-btn" type="primary" size="small" @click="sureClick">确定</el-button>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!-- <input type="file" :value="imgVal" id="upload" accept="image/png, image/jpeg, image/jpg" @change="imgChange"> -->
        <!-- <div class="img-clip-mask" v-show="isShow">
            <div class="img-clip">
                <div class="img-clip-title">上传图片</div>
                <div class="img-clip-main">
                    <div class="img-clip-canvas">
                        <canvas id="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
                        <canvas :class="{'active': radio === 1}" id="maskCanvas" :width="clipWidth" :height="clipHeight"></canvas>
                    </div>
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
            
        </div> -->
        <clip-uploader-image ref="uploaderImage" :isShow="isShow" :radio="radio" :clipHeight="clipHeight" :clipWidth="clipWidth" @uploaderImageUrl="clipUploaderImage"></clip-uploader-image>
    </div>
</template>
<script>
import {Tabs, TabPane} from 'element-ui'
import {home, studentShow} from './../../service/index'
import { MkQnUpload } from 'mk-libs';
import clipUploaderImage from './../../components/clipUploaderImage'
export default {
    data() {
        return {
            activeName: 'first', // 当前tab选中
            isEdit: false, // 是否修改
            studentVal: '', // 学生首页默认值
            isShow: false, // 是否显示上传图片的弹框
            radioLists: [  // 单选的列表
                {
                    value: '展示A',
                    id: 1
                }, {
                    value: '展示B',
                    id: 2
                }, {
                    value: '展示C',
                    id: 3
                }
            ],
            isCustom: false, // 是否展示个性化定制修改页面
            isCustomStart: false, // 是否开启个性化定制
            organName: '', // 机构名称
            solgan: '', // 机构宣传口号
            description: '', // 机构描述
            imgVal: '', // file的值
            imgUrl: '', // 裁剪生成的图片base64链接
            imgWidth: 0, // 上传图片的宽度
            imgHeight: 0, // 上传图片的高度
            canvasWidth: 300, // canvas的宽度
            canvasHeight: 300, // canvas的高度
            ratio: 0.2, // 放大缩小的比例
            count: 0, // 放大缩小的点击次数（不能大于五次）
            radio: 1, // 单选默认选中
            clipWidth: 164, // 裁剪图片的宽度
            clipHeight: 59, // 裁剪图片的高度
            qiniuToken: '',
            filePrefix: '',
            domain: '',
            tempUrls: [] //临时上传图片地址
        }
    },
    components: {
        'el-tab': Tabs,
        'el-tab-pane': TabPane,
        'clip-uploader-image': clipUploaderImage
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.routeList =
                to.meta.routeList.length > 1
                    ? to.meta.routeList.splice(0, to.meta.routeList.length - 1)
                    : to.meta.routeList
        })
    },
    created() {
        if(this.radio === 1 || this.radio === 2) {
            this.clipWidth = 95;
            this.clipHeight = 95;
        } else if(this.radio === 3) {
            this.clipWidth = 164;
            this.clipHeight = 59;
        }
        this.getOrganInfo()
    },
    async mounted() {
        await this.getDomain()
        this.uploader = MkQnUpload({
            browse_button:          'uploadSure',           // 上传选择的点选按钮，可以是id或者元素本身，必需
            domain:                 this.domain,            // bucket域名，下载资源时用到，必需
            get_new_uptoken:        true,                  // 设置是否每次都重新获取新的uptoken
            fetch_upload_token:     this.getQiniuToken,           // 获取上传token方法
            file_type:              'base64',                // 上传文件类型
            save_key:               false,
            key_func:               function (file) { return `${this.filePrefix}` },
            unique_names:           false,                   // 是否开启自动文件名
            multi_selection:        false,                   // 是否多选
            max_file_size:          '0.5mb',                  // 文件上传大小限制
            type_reg:               {},                     // 文件类型校验配置e
            fileFiltered:           this.fileFiltered,                  // 文件添加前事件
            filesAdded:             this.filesAdded,                    // 文件添加后事件
            beforeUpload:           this.beforeUpload,                  // 上传前事件
            uploadProgress:         this.fileUploadProgress,            // 上传进行中
            fileUploaded:           this.fileUploaded,                  // 上传完事件
            uploadFail:             this.fileUploadFail,                // 上传失败事件
            uploadComplete:         this.fileUploadComplete,            // 上传结束事件
            
        });
    },
    methods: {
        // 获取开屏广告信息
        async getOrganInfo() {
            let {data} = await studentShow.getOrganInfo({
                organId: this.$store.state.userInfo.deptId
            })
            if(data.organInfoId > 0) {
                this.isCustomStart = true
            } else {
                this.isCustomStart = false
            }
            this.imgUrl = data.organLogo;
            this.organName = data.organName;
            this.solgan = data.organInstruction;
            this.description = data.organDesc
            this.radio = data.logoType;
            this.studentVal = data.appTitle
            this.tempUrls.push({
                imgUrl: data.organLogo,
                radio: data.logoType
            })
            window.sessionStorage.setItem('studentShow', JSON.stringify(data))
        },
        // 修改学生首页事件
        editClick(){
            this.isEdit = true;
        },
        // 取消修改学生首页事件
        cancelClick() {
            this.isEdit = false;
            let data = JSON.parse(window.sessionStorage.getItem('studentShow'))
            this.imgUrl = data.organLogo;
            this.organName = data.organName;
            this.solgan = data.organInstruction;
            this.description = data.organDesc
            this.radio = data.logoType;
            this.studentVal = data.appTitle
        },
        // 确定修改学生首页事件
        async sureClick() {
            if(this.studentVal === '') {
                this.$message({
                    type: 'error',
                    message: '学生首页广告不能为空'
                })
                return
            }
            await studentShow.setOrganInfo({
                organId: this.$store.state.userInfo.deptId,
                type: 1,
                appTitle: this.studentVal
            })
            this.$message({
                type: 'success',
                message: '首页标题修改成功'
            })
            this.isEdit = false;
        },
        // 立即开启自定义
        customClick() {
            this.isCustom = true;
        },
        // 放弃事件
        cancelEvent() {
            let data = JSON.parse(window.sessionStorage.getItem('studentShow'))
            this.imgUrl = data.organLogo;
            this.organName = data.organName;
            this.solgan = data.organInstruction;
            this.description = data.organDesc
            this.radio = data.logoType;
            this.studentVal = data.appTitle
            this.isCustom = false;
        },
        // 保存事件
        async saveEvent() {
            if(this.imgUrl === '') {
                this.$message({
                    type: 'error',
                    message: '机构LOGO不能为空'
                })
                return
            }
            if(this.organName === '') {
                this.$message({
                    type: 'error',
                    message: '机构名称不能为空'
                })
                return
            }
            if(this.solgan === '') {
                this.$message({
                    type: 'error',
                    message: '宣传口号不能为空'
                })
                return
            }
            await studentShow.setOrganInfo({
                organId: this.$store.state.userInfo.deptId,
                type: 0,
                organLogo: this.imgUrl.split(this.domain)[1],
                organName: this.organName,
                organInstruction: this.solgan,
                organDesc: this.description,
                logoType: this.radio,
            })
            this.$message({
                type: 'success',
                message: '个性化自定义成功'
            })
            this.isCustom = false;
            this.tempUrls = []
            this.getOrganInfo()
        },
        clipUploaderImage(imgUrl) {
            this.uploader.uploadBase64(imgUrl)
        },
        // 单选change事件
        radioChange(e) {
            this.radio = e;
            if(e === 1 || e === 2) {
                this.clipWidth = 95;
                this.clipHeight = 95;
            } else if(e === 3) {
                this.clipWidth = 164;
                this.clipHeight = 59;
            }
            let index = this.tempUrls.findIndex(v => v.radio === e);
            this.imgUrl = this.tempUrls[index] ? this.tempUrls[index].imgUrl : '';
        },
        // 上传图片事件（模拟input file点击）
        uploadEvent() {
            this.$refs.uploaderImage.$refs.file.dispatchEvent(new MouseEvent('click')) 
        },
        // 重新选择事件
        resetUpload() {
            this.$refs.file.dispatchEvent(new MouseEvent('click')) 
        },
        async getDomain() {
            let { data } = await home.getQiNiuToken({})
            this.domain = data.qiniuUrl
            this.qiniuToken = data.token
            this.filePrefix = data.filePrefix
        },
        //获取七牛云token
        async getQiniuToken(up, next) {
            await this.getDomain()
            next(this.qiniuToken, `${this.filePrefix}${up.files[0].name}`)
        },
        fileFiltered(up, file, error) {
            if(error) {
                this.$message({
                    type: 'error',
                    message: error.msg
                })
                return 
            }
        },
        filesAdded(up, file, error) {
            if(error) {
                this.$message({
                    type: 'error',
                    message: error.msg
                })
                return
            }
        },
        beforeUpload(up, file, error) {
            if(error) {
                this.$message({
                    type: 'error',
                    message: error.msg
                })
                return
            }
        },
        fileUploadProgress(){
        },
        // 图片上传成功事件
        fileUploaded(up, file, info ) {
            this.imgUrl = `${this.domain}${info.key}`
            let index = this.tempUrls.findIndex(v => v.radio === this.radio);
            if(index > -1) {
                this.tempUrls.splice(index, 1);
            }
            this.tempUrls.push({
                imgUrl: this.imgUrl,
                radio: this.radio
            })
            
        },
        // 图片上传失败事件
        fileUploadFail(up, error) {
            this.$message({
                type: 'error',
                message: error.msg
            })
        },
        fileUploadComplete() {
        },
    },
    destroyed() {
        window.sessionStorage.removeItem('studentShow')
    },
}
</script>
<style lang="less">
    .student-show{
        .el-textarea__inner{
            height: 100%;
        }
    }
</style>
<style lang="less" scoped>
    .student-show{
        position: relative;
    }
    .student-show-start{
        display: flex;
    }
    .student-show-start-left{
        display: flex;
        justify-content: center;
        padding: 40px 80px 0;
        position: relative;
    }
    .student-show-start-mock{
        position: absolute;
        top: 40px;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 210px;
    }
    .student-show-start-mock-val{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 12px;
    }
    .student-show-start-mock-name{
        font-size: 24px;
        color: #4a4a4a;
        font-weight: 700;
        line-height: 33.5px;
    }
    .student-show-start-mock-des{
        color: #9B9B9B;
        font-size: 14px;
        line-height: 20px;
    }
    .student-show-start-custom-color{
        color: #909399;
        cursor: initial;
    }
    .student-show-start-mock-tip{
        position: absolute;
        bottom: 80px;
        color: #CBCBCB;
        font-size: 12px;
        line-height: 20px;
    }
    .student-show-start-right{
        
    }
    .student-show-start-custom{
        padding: 40px;
    }
    .student-show-start-custom-main{
        padding: 20px 40px;
        background: rgb(198, 226, 255);
        border-radius: 4px;
    }
    .student-show-start-custom-title{
        display: flex;
        align-items: center;
    }
    .student-show-start-custom-icon{
        color: #409EFF;
        font-size: 16px;
        margin-right: 5px;
    }
    .student-show-start-custom-val{
        font-size: 16px;
        color: #4a4a4a;
        font-weight: 700;
    }
    .student-show-start-custom-btn{
        text-align: right;
        margin-top: 20px;
    }
    .student-show-start-custom-des{
        display: inline-block;
        padding-left: 20px;
        margin-top: 10px;
    }
    .student-show-start-infos{
        margin-top: 40px;
    }
    .student-show-start-info{
        display: flex;
        margin-bottom: 40px;
        align-items: center;
    }
    .student-show-start-input{
        width: 300px;
    }
    .student-show-start-textarea{
        height: 150px;
        width: 300px;
    }
    .student-show-start-upload{
        border: 1px solid #DCDFE6;
        display: flex;
        flex-direction: column;
        padding: 20px;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .student-show-start-upload-val{
        color: #409EFF;
        cursor: pointer;
    }
    .student-show-start-upload-des{
        color: #909399;
    }
    .student-show-start-info-val{
        width: 100px;
    }
    .student-show-start-btns{
        text-align: right;
    }
    .student-show-studeng-page{
        display: flex;
        flex-direction: column;
    }
    .student-show-input{
        margin-bottom: 20px;
        width: 400px;
    }
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
    // #cover{
    //     position: absolute;
    //     top: 20px;
    //     left: 0;
    //     border: 1px solid #333;
    //     z-index: 999;
    //     background: red;
    // }
</style>