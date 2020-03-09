<template>
    <div class="el-upload-custom-wrapper">
        <el-upload
            list-type="picture-card"
            :file-list="fileList"
            :limit="limit"
            :accept="acceptType"
            :multiple="multiple"
            :before-upload="beforeUploadGetKey"
            :on-preview="handlePictureCardPreview"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :action="action"
            :data="postData"
            :class="{'upload-16-9' : classStyle ==='upload-16-9','disabled':fileList.length === limit}"
        >
            <i class="el-icon-plus"></i>
        </el-upload>
        <!-- <el-dialog :visible.sync="bigImgDialog">
            <img width="100%" :src="url" alt />
        </el-dialog>-->
        <video-or-pic-detail-dialog
            title="查看图片"
            :isShow="bigImgDialog"
            dialogType="img"
            :dialogContent="url"
            @closeDilog="closeVideo0rPicDetailDialog"
        ></video-or-pic-detail-dialog>
    </div>
</template>

<script>
import videoOrPicDetailDialog from '../../views/sysSetting/components/videoOrPicDetailDialog'
import { mapGetters } from 'vuex'
export default {
    name: "",
    components: {
        videoOrPicDetailDialog
    },
    props: {
        acceptType: {
            type: String,
            default: '.jpg, .jpeg, .png, .JPG, .JPEG, .PNG'
        },
        multiple: {
            type: Boolean,
            default: false
        },
        limit: {
            type: Number,
            default: 1
        },
        classStyle: {
            type: String,
            default: ''
        },
        uploadImageList: {
            type: Array,
            default: function () {
                return []
            }
        },
        uploadImgList: {
            type: Array,
            default: function () {
                return []
            }
        },
        dataKey: {
            type: Number,
            default: 0
        },
        itemKey: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            fileList: [],
            postData: {
                token: '',
                key: ''
            },
            action: 'https://upload.qiniup.com',
            bigImgDialog: false,
            url: '',
            key: '',

        };
    },
    watch: {
        // uploadImgList(newVal) {
        //     this.fileList = newVal;
        //     // console.log(newVal, 111)
        // }
        uploadImgList: {
            immediate: true,
            handler(newVal) {
                this.fileList = newVal ? newVal : [];
                // console.log(newVal, 111)
            }
        },
    },
    computed: {
        ...mapGetters({
            qiniuData: 'qiniuData',//七牛数据
        }),
    },
    methods: {
        // async getToken() {
        //     try {
        //         let { data } = await qiniu.getQiniuToken({});
        //         this.postData.token = data.accessToken;
        //         this.key = data.validBucket;

        //     } catch (e) { }
        // },
        beforeUploadGetKey(file) {   //每个文件上传之前 给它一个 名字
            // this.getToken();   //获取token
            const isLt1M = file.size / 1024 / 1024 <= 2
            if (!isLt1M) {
                this.$message({
                    message: '上传图片大小不能超过 2MB!',
                    type: 'error'
                });
                return false;
            }
            this.postData.token = this.qiniuData.accessToken;
            this.key = this.qiniuData.validBucket;
            let stamp = new Date().getTime();
            // this.qiniuData.name = file.name;
            this.postData.key = `${this.key}/${stamp}.jpg`;
            // this.file.name = `${assetsRoot}/${this.key}/${stamp}.jpg`

        },

        handleRemove(file, fileList) {
            this.fileList = fileList;
            // console.log('handleRemove', fileList)
            this.$emit('getImageList', fileList, this.dataKey, this.itemKey)
        },
        handleSuccess(response, file, fileList) {
            this.fileList = fileList;
            // console.log('handleSuccess', fileList);
            this.$emit('getImageList', fileList, this.dataKey, this.itemKey)
        },
        handlePictureCardPreview(file) {
            this.bigImg(file.url)
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        bigImg(url) {
            this.url = url;
            this.bigImgDialog = true;
        },
        closeVideo0rPicDetailDialog() {
            this.bigImgDialog = false;
        }
    },
    created() {
        // this.getToken();   //获取token
    },
    mounted() { }
};
</script>
<style lang="less">
.el-upload-custom-wrapper {
    .upload-16-9 .el-upload--picture-card {
        width: 160px;
        height: 90px;
        line-height: 90px;
    }
    // .upload-16-9 .el-upload-list--picture-card .el-upload-list__item {
    //     width: 160px;
    //     height: 90px;
    // }
    .upload-16-9 .el-upload-list--picture-card .el-upload-list__item {
        width: 160px;
        height: 90px;
        margin-top: 0;
        margin: 0;
    }
    .disabled .el-upload--picture-card {
        display: none;
    }
    .el-table .cell {
        line-height: none;
    }
}
</style>