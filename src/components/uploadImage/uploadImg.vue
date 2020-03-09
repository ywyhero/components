<template>
    <div class="dashboard-container">
        <!-- 单张图片上传 -->
        <div class="img-preview" v-if="!isMultiSelection">
            <img :src="previewAvatar" v-show="previewAvatar" />
        </div>
        <!-- 多张图片上传 -->
        <div class="flex flex-wrap" v-if="isMultiSelection">
            <draggable
                v-model="dragPreviewAvatarList"
                dragable="true"
                :move="getdata"
                @update="datadragEnd"
                class="flex flex-wrap"
            >
                <div
                    class="img-preview"
                    v-for="(item, index) in dragPreviewAvatarList"
                    :key="index"
                    v-show="dragPreviewAvatarList.length > 0"
                >
                    <img :src="item" />
                    <div class="img-mask">
                        <div class="icon-font-wrapper">
                            <i class="el-icon-zoom-in icon-font" @click="previewImg(item)"></i>
                            <i class="el-icon-delete icon-font" @click="delImg(index)"></i>
                        </div>
                    </div>
                </div>
            </draggable>
            <el-dialog
                title
                :visible.sync="isShowLargeImg"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                width="40%"
            >
                <el-image :src="largeImg" class="preview-dialog-img-wrapper"></el-image>
            </el-dialog>
        </div>

        <el-button
            type="primary"
            size="small"
            :id="domId"
            v-show="!isMultiSelection || (isMultiSelection && dragPreviewAvatarList.length < maxFiles)"
        >{{btnText}}</el-button>
    </div>
</template>
<script>
import { Message } from "element-ui";
import QNUploader from "./../../plugins/uploader/uploader";
import { qiniu } from "./../../service/index";
import realENV from "./../../config/env";
import draggable from 'vuedraggable'

const assetsRoot = realENV.assetsRoot;
export default {
    name: "QNUploader-image",
    props: {
        previewAvatar: {
            type: String,
            defalut: ""
        }, // 单张图片链接地址
        previewAvatarList: {
            type: Array,
            defalut: []
        }, // 多张图片链接地址
        fileType: {
            type: String,
            defalut: "image"
        },
        fileName: {
            type: String,
            defalut: null
        },
        preview: {
            type: Boolean,
            value: false
        },
        fileFormats: {
            type: Object,
            value: {}
        },
        btnText: {
            type: String,
            defalut: "上传图片"
        },
        namePrefix: {
            type: String,
            defalut: ""
        },
        domId: {
            type: String,
            defalut: "imageUploader"
        }, // 上传图片的Dom元素
        index: {
            type: Number,
            defalut: 0
        },
        isMultiSelection: {
            type: Boolean,
            defalut: false
        },
        maxFiles: {
            type: Number,
            defalut: 1
        }
    },
    data() {
        return {
            files: [],
            uploadToken: "",
            newFileName: this.fileName,
            avatar: this.previewAvatar,
            progress: 0,
            uploading: !1, // 上传状态，true表示正在上传
            uploadFilePlacehold: "",
            fileRealName: "", // 原文件名，不带后缀
            fileDownloadName: "", // 上传后的文件名
            extName: "", // 后缀名
            uploader: null, // 上传对象
            uploadProgressText: 0, // 上传进度数据
            uploadErrorText: "", // 上传错误信息
            uploadStatus: -1, // 上传状态，-1：未上传，初始值；0：上传失败；1：上传成功；2：正在上传中
            logHeight: 0,
            multiSelection: this.isMultiSelection, // 是否多选
            uniqueNames: !1, // 是否自动生成文件名
            maxFileSize: "5", // 文件大小限制
            type_reg: {}, // 文件类型校验配置
            infoList: [], // 多张图片上传七牛云返回的信息
            dragPreviewAvatarList: [],
            isShowMask: false,
            isShowLargeImg: false,
            largeImg: ''
        };
    },
    components: {
        draggable
    },
    watch: {
        dragPreviewAvatarList() {
            let list = this.dragPreviewAvatarList.map(item => {
                item = item.replace(item.match(/^http(s)?:\/\/(.*?)\//)[0], '')
                return {
                    hash: '',
                    key: item
                }
            })
            this.infoList = list;
        },
        previewAvatarList() {
            this.dragPreviewAvatarList = this.previewAvatarList;
        }
    },
    computed: {
        // 时时计算可以上传的最大文件数
        maxCanUploadFile() {
            return this.maxFiles - this.infoList.length
        },
        canUpload() {
            return this.maxCanUploadFile > 0
        }
    },
    created() {
    },
    mounted() {
        setTimeout(this.init, 1000)
    },
    methods: {
        getdata() {
            // console.log(evt.draggedContext.filterKey)
            //这里evt.draggedContext后续的内容根据具体的定义变量而定
        },
        datadragEnd() {
            this.$emit("fileUrlList", this.infoList);
        },
        previewImg(item) {
            this.isShowLargeImg = true;
            this.largeImg = item;
        },
        init() {
            let type_reg = (type_reg = {
                image: /(\.(jpg|png|jpeg))$/
            });
            this.uploader = QNUploader({
                browse_button: this.domId, // 上传选择的点选按钮，可以是id或者元素本身，必需
                domain: assetsRoot, // bucket域名，下载资源时用到，必需
                fetch_upload_token: this.fetchUploadToken, // 获取上传token方法
                file_type: "image", // 上传文件类型,默认为图片
                unique_names: !1, // 是否开启自动文件名
                key_func: function () {
                    let stamp = new Date().getTime();
                    return `vip_mall/${stamp}.jpg`;
                }, // 自定义文件名方法
                multi_selection: this.multiSelection, // 是否多选
                max_file_size: "5mb", // 文件上传大小限制
                fileFiltered: this.fileFiltered, // 文件添加前事件
                filesAdded: this.filesAdded, // 文件添加后事件
                beforeUpload: this.beforeUpload, // 上传前事件
                uploadProgress: this.fileUploadProgress, // 上传进行中
                fileUploaded: this.fileUploaded, // 上传完事件
                uploadComplete: this.fileUploadComplete, // 上传结束
                uploadFail: this.fileUploadFail, // 上传失败事件
                max_files: this.maxCanUploadFile, // 最大上传数
                type_reg: type_reg, // 文件类型校验配置
                existImg: this.dragPreviewAvatarList
            });
        },
        delImg(index) {
            this.infoList.splice(index, 1)
            this.$emit("fileUrlList", this.infoList);
            this.uploader.setOption({ max_files: this.maxCanUploadFile })
            this.uploader.disableBrowse(false)
        },
        fetchUploadToken(up, next) {
            qiniu
                .getQiniuToken()
                .then(({ code, data }) => {
                    if (code === 200) {
                        if (data.accessToken.trim()) {
                            // 传入token，并执行后续上传流程
                            next(data.accessToken);
                            localStorage.setItem("upTokenImage", data.accessToken);
                        } else {
                            Message.error("上传获取的token失败");
                        }
                    } else {
                        Message.error("上传获取的token失败");
                    }
                })
                .catch(() => {
                    Message.error("上传获取的token失败");
                });
        },
        /**
         * @desc    文件添加前，一般对自定义文件名及文件类型校验
         * @param  {[type]}     up      七牛上传对象
         * @param  {[type]}     file    上传文件
         * @param   {Object}    error    当前事件错误信息
         */
        fileFiltered(up, file, error) {
            if (error) {
                this.$message({
                    message: `${error.msg}`,
                    type: "error"
                });
                this.uploadStatus = 0;
                return;
            }
        },
        /**
         * @desc 文件添加后
         * @param   {Object}    up      七牛上传对象
         * @param   {Object}    files    上传文件列表
         * @param   {Object}    error    当前事件错误信息
         */
        filesAdded(up, files, error) {
            if (error) {
                Message({
                    message: `${error.type}: ${error.msg}`,
                    type: "warning"
                });
                this.uploadStatus = 0;
                return;
            }
        },
        /**
         * @desc 上传前事件
         * @param   {Object}    up      七牛上传对象
         * @param   {Object}    file    上传文件
         * @param   {Object}   error     当前事件错误信息
         */
        beforeUpload(up, file, error) {
            // 清空数据
            if (error) {
                Message({
                    message: `${error.type}: ${error.msg}`,
                    type: "warning"
                });
                this.uploadStatus = 0;
                return;
            }
        },
        /**
         * @desc 文件上传进行中
         * @param   {Object}    up      七牛上传对象
         * @param   {Object}    file    上传文件
         */
        fileUploadProgress(up, file) {
            this.uploadStatus = 2;
            this.uploadProgressText = file.percent;
        },
        /**
         * @desc 文件上传成功
         * @param {Object} up   七牛上传对象
         * @param {Object} file   上传文件
         * @param {Object} info   上传信息
         */
        fileUploaded(up, file, info) {
            this.uploadStatus = 1;
            // 单张
            if (!this.isMultiSelection) {
                this.$emit("fileUrl", info);
                Message({
                    message: "图片上传成功",
                    type: "success"
                });
            }
            // 多张
            else {
                let len = this.infoList.length;
                // 小于上传的最大数值，则push
                if (len < this.maxFiles) {
                    this.infoList.push(info);
                }
                // 大于上传的最大数值，则禁止上传
                up.disableBrowse(!this.canUpload)

                // 调整上传的最大数
                up.setOption({ max_files: this.maxCanUploadFile })
            }
        },
        /**
         * @desc 文件上传错误回调
         * @param {Object} err   上传错误信息
         * @param {Object}  up  上传对象
         */
        fileUploadFail(err) {
            this.uploadStatus = 0;
            this.uploadProgressText = "0";
            Message({
                message: err.msg,
                type: "warning"
            });
        },
        /**
         * @desc 文件上传完成（不管成功与失败）
         */
        fileUploadComplete() {
            // complete todo
            if (this.isMultiSelection) {
                this.$emit("fileUrlList", this.infoList);
                Message({
                    message: "图片上传成功",
                    type: "success"
                });
            }
        },
        /**
         * @desc    更新上传配置
         * @param {String} option 配置属性
         * @param {String} value  对应的属性值
         */
        setOption(option, value) {
            this.uploader && this.uploader.setOption(option, value);
        }
    }
};
</script>

<style lang="less" scoped>
.dashboard-container {
    .preview-dialog-img-wrapper {
        width: 100%;
    }
    .img-preview {
        width: 148px;
        height: 148px;
        border-radius: 6px;
        border: 1px solid #c0ccda;
        position: relative;
        // overflow: hidden;
        margin-right: 10px;
        z-index: 999;
        margin-bottom: 10px;
    }
    img {
        width: 146px;
        height: 146px;
        display: block;
        border-radius: 6px;
    }
    .img-preview:hover .img-mask {
        display: block;
    }
    .img-mask {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1000;
        border-radius: 6px;
        display: none;
    }
    .file-name {
        line-height: 30px;
        width: 120px;
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: center;
    }
    .realfilebt {
        input {
            display: inline-block;
            visibility: hidden;
            position: absolute;
            top: 0;
            left: 120px;
        }
    }
    .icon-font {
        color: #ffffff;
        cursor: pointer;
        font-size: 20px;
    }
    .el-icon-zoom-in::before {
        margin-right: 10px;
    }
    .icon-font-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
}
</style>
