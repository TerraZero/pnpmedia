<template lang="pug">
  .custom-mutant-bandit-stage
    transition-group(:class="classes", name="group-fade-leave")
      CustomMutantBanditStageFrame.custom-mutant-bandit-stage__frame(ref="stages", v-if="stage.frames", v-for="frame in frames", :key="frame._index", :frame="frame")
    transition(name="fade")
      CustomMutantBanditVideo.custom-mutant-bandit-stage__video(v-if="stage.video", ref="video")
    CustomMutantBanditTexts.custom-mutant-bandit-stage-frame__screen(v-if="stage.texts", :texts="stage.texts")
    CustomMutantBanditMusic(ref="music")

</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
  props: ['stage'],
  mounted() {
    this.doReset();
  },
  watch: {
    stage() {
      this.doReset();
    },
  },
  data() {
    return {
      frame_used: [],
      frame_save: [],
      nextTake: null,
    };
  },
  computed: {
    classes() {
      return {

      };
    },
    frames() {
      if (!this.stage || !this.stage.frames || !this.nextTake) return [];

      if (this.stage.frames.length === 1) {
        this.stage.frames[0]._index = 0;
        return this.stage.frames;
      }
      for (let i = 0; this.frame_save.length < 2; i++) {
        const take = this.nextTake();

        this.frame_used.push(take);
        this.stage.frames[take]._index = take + '--' + uuidv4();
        this.frame_save.push(this.stage.frames[take]);
      }
      return [...this.frame_save].reverse();
    },
    video() {
      return this.$refs.video;
    },
  },
  methods: {
    log(first) {
      console.log(arguments);
      return first;
    },
    getRandom(max) {
      return Math.floor(Math.random() * max);
    },
    getConfig(object, prop) {
      if (object && object[prop] !== undefined) return object[prop];
      if (this.stage.config && this.stage.config[prop] !== undefined) return this.stage.config[prop];
      return {
        time: 5000,
        frameInOrder: false,
      }[prop];
    },
    doReset() {
      this.frame_used = [];
      this.frame_save = [];

      if (this.stage.video) {
        this.video.doVideo(this.stage.video);
      } else {
        if (this.getConfig(null, 'frameInOrder')) {
          this.nextTake = () => {
            if (this.frame_used.length === this.stage.frames.length) this.frame_used = [];
            return this.frame_used.length;
          }
        } else {
          this.nextTake = () => {
            if (this.frame_used.length === this.stage.frames.length) this.frame_used = [this.frame_used.pop()];
            let take = this.getRandom(this.stage.frames.length);
            while (this.frame_used.includes(take)) take = (take + 1) % this.stage.frames.length;
            return take;
          };
        }
        this.nextFrame();
      }
    },
    nextFrame() {
      if (this.frame_save.length) this.frame_save.shift();
      setTimeout(this.nextFrame.bind(this), this.getConfig(this.frames[1], 'time'));
    },
  },
};
</script>

<style lang="sass">
.custom-mutant-bandit-stage
  display: flex
  justify-content: center
  align-items: center
  position: relative
  width: 100%
  height: 100%

  &__video
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0

</style>