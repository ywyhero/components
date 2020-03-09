<template>
  <div>
    <section>
        <div class="error-content">
            <dl>
                <dt class="error-img"><img src="./../../assets/images/404.png" /></dt>
                <dd class="error-msg">哎呀，您访问的页面正在搭建～</dd>
                <dd class="error-btn"><button @click="btnClick">返回首页</button></dd>
            </dl>
            <img src="" alt="" />
        </div>
    </section>
    <footer></footer>
  </div>
</template>
<script>
  export default {
    data() {
      return {
      }
    },
    components: {

    },
    methods: {
      btnClick(){
        window.location.href = '/';
      }
    },
    created() {
    },
    mounted() {
    }
  }

</script>
<style lang="less">
    .error-content{
        width: 80%;
        height: 60%;
        position: fixed;
        top: 0px;
        right: 0px;
        left: 0px;
        bottom: 0px;
        margin: auto;
        dl{
            .error-img{
                img{
                    display: block;
                    margin: 0px auto;
                    width: 450px;
                    max-height: 100%;
                }
            }
            .error-msg{
                margin: 20px auto;
                font-size: 20px;
                color: #645C58;
                text-align: center;
            }
            .error-btn{
                button{
                    margin: 20px auto 0;
                    background: #fd5e02;
                    color: #fff;
                    display: block;
                    height: 45px;
                    width: 150px;
                    font-size: 14px;
                    border-radius: 45px;
                    -webkit-border-radius: 45px;
                    -moz-border-radius: 45px;
                    cursor: pointer;
                }
            }
        }
    }
</style>
