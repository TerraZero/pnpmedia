<template lang="pug">
  .custom-mutant-bandit-music(:class="classes", @transitionend="onTransitionend")
    .custom-mutant-bandit-music__frame
      .custom-mutant-bandit-music__title(v-if="video && video.title")
        | {{ video.title }}
      youtube.custom-mutant-bandit-music__video(ref="youtube", :video-id="id", :player-vars="playerVars", :fitParent='true', @cued="onCued")
</template>

<script>
let sync = null;
export default {
  data() {
    return {
      video: null,
      isPlay: false,
      isReady: false,
      state: 0,
    };
  },
  computed: {
    classes() {
      const base = 'custom-mutant-bandit-music';
      const classes = [];

      classes.push(base + '--state-' + this.state);
      if (this.video && this.video.title) classes.push(base + '--title');
      return classes;
    },  
    youtube() {
      return this.$refs.youtube;
    },
    driver() {
      return this.video && this.video.path.split('/')[0] || null;
    },
    id() {
      return this.video && this.video.path.split('/')[1] || null;
    },
    player() {
      if (this.driver === 'youtube') {
        return this.youtube.player;
      }
      return null;
    },
    playerVars() {
      const data = this.video && this.video.vars || {};
      data.showinfo = 0;
      data.rel = 0;
      data.modestbranding = 1;
      data.iv_load_policy = 3;
      data.cc_load_policy = 3;
      data.fs = 0;
      data.disablekb = 1;
      data.controls = 0;
      return data;
    },
  },
  methods: {
    onTransitionend() {
      switch (this.state) {
        case 1:
          setTimeout(() => {
            if (this.video && this.video.title) {
              this.state = 2;
            } else {
              this.state = 0;
            }
          }, 4000);
          break;
        case 2:
          setTimeout(() => {
            this.state = 0;
          }, 2000);
          break;
      }
    },  
    async doVideo(video) {
      if (this.isPlay) await this.doStop();
      this.video = video;
      if (sync !== null) {
        clearTimeout(sync);
        sync = null;
      }
    },
    async doClear() {
      await this.doStop();
      this.video = null;
    },
    async doPlay() {
      this.isPlay = true;
      if (!this.isReady) return;

      if (typeof this.video.volume === 'number') this.player.setVolume(this.video.volume);
      if (typeof this.video.start === 'number') this.player.seekTo(this.video.start);
      if (typeof this.video.end === 'number') sync = setTimeout(() => this.doStop(), (this.video.end - this.video.start) * 1000);

      await this.player.playVideo();
      this.state = 1;
    },
    async doStop() {
      if (this.isPlay) {
        await this.player.stopVideo();
        this.isPlay = false;
      }
    },
    onCued() {
      this.isReady = true;
      if (this.isPlay) {
        this.doPlay();
      }
      this.$emit('ready');
    },
  },
}
</script>

<style lang="sass">
.custom-mutant-bandit-music
  position: absolute
  top: 5vh
  right: 0
  background: #38a3a5
  transition: transform .5s $animations__smooth

  &--state-0
    transform: translateX(100%)

  &--state-1
    transform: translateX(0)

  &__frame
    position: relative
    display: flex

  &__video
    aspect-ratio: 16/9
    height: 10vh
    width: auto
    background: black

  &__title
    position: absolute
    top: 0
    right: 100%
    height: 100%
    padding: 0 2vw
    display: flex
    justify-content: center
    align-items: center
    background: #38a3a5
    transform: translateX(0)
    transition: transform .5s 1s $animations__smooth
    z-index: -1
    white-space: nowrap

  &--state-0 &__title
    transform: translateX(calc(100% + 1px))

  &--state-2 &__title
    transform: translateX(calc(100% + 1px))
    transition: transform .5s $animations__smooth

</style>
