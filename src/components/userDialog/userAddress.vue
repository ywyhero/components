<template>
    <el-dialog
        :title="title"
        :visible.sync="isShow"
        :close-on-click-modal="false"
        :show-close="false"
        :close-on-press-escape="false"
        class="user-address-dialog"
        width="40%"
        v-if="isShow"
    >
        <div v-if="disabledEdit">{{fulAddress}}</div>
        <el-form
            ref="dialogInfo"
            :model="updateAddressData"
            :rules="rules"
            label-position="left"
            label-width="120px"
            v-if="!disabledEdit"
        >
            <el-form-item label="收货人姓名" prop="receiver" v-if="title === '更改订单地址'" required>
                <el-input
                    type="text"
                    placeholder="请输入收货人姓名"
                    v-model.trim="updateAddressData.receiver"
                    clearable
                    maxlength="20"
                ></el-input>
            </el-form-item>
            <el-form-item label="收货人联系电话" prop="receiverPhone" v-if="title === '更改订单地址'" required>
                <el-input
                    type="text"
                    placeholder="请输入收货人联系电话"
                    v-model.trim="updateAddressData.receiverPhone"
                    clearable
                    maxlength="20"
                ></el-input>
            </el-form-item>
            <el-form-item label="国家" prop="addrCountryName" required>
                <el-select
                    v-model="updateAddressData.addrCountryName"
                    placeholder="请选择"
                    disabled
                    class="mini-select"
                >
                    <el-option
                        v-for="item in CONSTANTS.countryOption"
                        :key="item.key"
                        :label="item.value"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="省市区" prop="inputReceiverArea" required>
                <el-cascader
                    :options="cascaderCity"
                    ref="cascaderAddr"
                    separator=" "
                    v-model="updateAddressData.inputReceiverArea"
                ></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="addrAddressDesc" required>
                <el-input
                    type="textarea"
                    resize="none"
                    placeholder="请输入详细地址"
                    v-model.trim="updateAddressData.addrAddressDesc"
                    :autosize="{ minRows: 3}"
                    maxlength="100"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="操作备注"
                prop="operateRemark"
                v-if="title === '更改订单地址'"
                class="no-little-star"
            >
                <el-input
                    type="textarea"
                    resize="none"
                    placeholder="请输入操作备注"
                    v-model="updateAddressData.operateRemark"
                    :autosize="{ minRows: 3}"
                    maxlength="100"
                ></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="cancel">取 消</el-button>
            <el-button
                size="small"
                type="primary"
                @click="editAddress"
                v-if="userPermission['mall:student:updateaddress'] && disabledEdit"
                :loading="fullscreenLoading"
            >编辑</el-button>
            <el-button size="small" type="primary" @click="confirmBtn" v-if="!disabledEdit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'userAddress',
    components: {},
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        disabledEdit: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: ''
        },
        dialogInfo: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {

            rules: {
                receiver: [{
                    required: true, message: '请输入收货人姓名'
                }, {
                    validator: this.VALIDATE.noBlank
                }],
                receiverPhone: [{
                    required: true, message: '请输入收货人联系电话'
                }, {
                    validator: this.VALIDATE.noBlank
                }, {
                    validator: this.VALIDATE.validateTwentyNumber
                }],
                inputReceiverArea: [{
                    required: true, message: '请选择省市区'
                }],
                addrAddressDesc: [{
                    required: true, message: '请输入详细地址'
                }, {
                    validator: this.VALIDATE.noBlank
                }, {
                    min: 1, max: 100, message: '长度在1到100个字符'
                }, {
                    validator: this.VALIDATE.noBlank
                }],
            },
            fulAddress: '',
            updateAddressData: {
                inputReceiverArea: [],
                addrCountryName: '中国',
                addrAddressDesc: '',
                operateRemark: '',
                receiver: '',
                receiverPhone: ''
            },
            fullscreenLoading: false
        }
    },
    watch: {
        isShow() {
            if (this.isShow) {
                if (this.title === '更改订单地址') {
                    this.getAddress();
                }
                if (this.dialogInfo.addrProvinceId && this.dialogInfo.addrProvinceId != 0 && this.dialogInfo.addrCityId && this.dialogInfo.addrCityId != 0) {
                    this.fulAddress = `${this.dialogInfo.addrCountryName}${this.dialogInfo.addrProvinceName}${this.dialogInfo.addrCityName}${this.dialogInfo.addrDistrictName}${this.dialogInfo.addrAddressDesc}`;
                    this.updateAddressData.addrCountryName = this.dialogInfo.addrCountryName || '中国';
                    this.updateAddressData.addrAddressDesc = this.dialogInfo.addrAddressDesc;
                } else {
                    this.fulAddress = '当前用户地址为空，可点击编辑按钮进行填写';
                    this.updateAddressData.addrAddressDesc = '';
                }
                this.updateAddressData.receiver = this.dialogInfo.receiver ? this.dialogInfo.receiver : '';
                this.updateAddressData.receiverPhone = this.dialogInfo.receiverPhone ? this.dialogInfo.receiverPhone : '';

            } else {
                if (this.$refs.dialogInfo) {
                    this.$refs.dialogInfo.resetFields();
                }
                // this.disabledEdit = true;
                this.$emit('updateEditButtonStatus', true)
            }
        }
    },
    computed: {
        ...mapGetters({
            userPermission: 'userPermission', //按钮权限控制
            addressList: 'addressList', //获取地址字典
        }),
        cascaderCity() {
            return this.addressList
        }
    },
    methods: {
        editAddress() {
            if (this.$refs.dialogInfo) {
                this.$refs.dialogInfo.resetFields();
            }
            this.getAddress();
        },
        cancel() {
            this.$emit('closeUserAddressDialog', false)
            if (this.$refs.dialogInfo) {
                this.$refs.dialogInfo.resetFields();
            }
        },
        confirmBtn() {
            this.$refs.dialogInfo.validate(valid => {
                if (valid) {
                    let areaCode = this.$refs['cascaderAddr'].currentLabels;
                    let params = {
                        studentId: this.dialogInfo.studentId,
                        studentName: this.dialogInfo.studentName,
                        addrProvinceId: this.updateAddressData.inputReceiverArea[0],
                        addrProvinceName: areaCode[0],
                        addrCityId: this.updateAddressData.inputReceiverArea[1],
                        addrCityName: areaCode[1],
                        addrDistrictId: this.updateAddressData.inputReceiverArea[2] ? this.updateAddressData.inputReceiverArea[2] : 0,
                        addrDistrictName: areaCode[2] ? areaCode[2] : '',
                        addrAddressDesc: this.updateAddressData.addrAddressDesc
                    }
                    if (this.title === '更改订单地址') {
                        params.operateRemark = this.updateAddressData.operateRemark;
                        params.receiver = this.updateAddressData.receiver;
                        params.receiverPhone = this.updateAddressData.receiverPhone;
                        params.orderId = this.dialogInfo.orderId;
                    }
                    this.$emit('editAddress', params);
                }
            })
        },
        async getAddress() {
            // this.inputReceiverArea = [this.dialogInfo.addrProvinceId, this.dialogInfo.addrCityId, this.dialogInfo.addrDistrictId];
            if (this.dialogInfo.addrProvinceId && this.dialogInfo.addrProvinceId != 0 && this.dialogInfo.addrCityId && this.dialogInfo.addrCityId != 0) {
                this.$set(this.updateAddressData.inputReceiverArea, 0, Number(this.dialogInfo.addrProvinceId))
                this.$set(this.updateAddressData.inputReceiverArea, 1, Number(this.dialogInfo.addrCityId))
                this.$set(this.updateAddressData.inputReceiverArea, 2, Number(this.dialogInfo.addrDistrictId))
            } else {
                this.updateAddressData.inputReceiverArea = [];
            }
            // this.disabledEdit = false;
            this.$emit('updateEditButtonStatus', false)

        },
    },
    created() {

    },
    mounted() { }
}
</script>
<style lang="less" >
.user-address-dialog {
    .el-input,
    .el-textarea {
        width: 200px;
    }
    .no-little-star {
        .el-form-item__label:before {
            content: "*";
            color: transparent;
            margin-right: 4px;
        }
    }
}
</style>