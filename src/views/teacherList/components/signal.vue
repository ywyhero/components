<template>
    <div class="signal">
        <span class="signal-span signal-1" :class="value >= 1 ? 'active' : ''"></span>
        <span class="signal-span signal-2" :class="value >= 2 ? 'active' : ''"></span>
        <span class="signal-span signal-3" :class="value >= 3 ? 'active' : ''"></span>
        <span class="signal-span signal-4" :class="value >= 4 ? 'active' : ''"></span>
        <span class="signal-span signal-5" :class="value >= 5 ? 'active' : ''"></span>
        <span class="signal-span signal-6" :class="value >= 6 ? 'active' : ''"></span>
    </div>
</template>
<script>
export default {
    props: {
        value: {
            type: Number,
            default: 1
        }
    }
}
</script>
<style lang="less" scoped>
    .signal{
        display: flex;
        align-items: flex-end;
    }
    .signal-span {
        width: 3px;
        border: 1px solid #333;
        margin-right: 1px;
        
    }
    .signal-span.active{
        background: #333;
    }
    .signal-1{
        height: 18px;
    }
    .signal-2{
        height: 16px;
    }
    .signal-3{
        height: 14px;
    }
    .signal-4{
        height: 12px;
    }
    .signal-5{
        height: 10px;
    }
    .signal-6{
        height: 8px;
    }
</style>