<template>
    <div class="playback">
        <audio class="playback-audio" :src="audioUrl" controls></audio>
    </div>
</template>
<script>
export default {
    data() {
        return {
            audioUrl: ''
        }
    },
    mounted() {
        this.audioUrl = window.sessionStorage.getItem('classAudioUrl')
    },
    destroyed() {
        window.sessionStorage.removeItem('classAudioUrl')
    },
}
</script>
<style lang="less" scoped>
.playback{
    width: 100%;
}
.playback-audio{
    display: block;
    width: 80%;
    margin: 200px auto 0;
}
</style>
