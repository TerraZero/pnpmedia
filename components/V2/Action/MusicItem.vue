<template lang="pug">
  .v2-action-music-item(:class="classes")
    .v2-action-music-item__main
      i.v2-action-music-item__icon.el-icon-video-play
      V2MediaVideoImage.v2-action-music-item__image(:src="item.path")
      .v2-action-music-item__content {{ title }}
      .v2-action-music-item__actions
        V2ActionButton.v2-action-music-item__action(icon="el-icon-arrow-down", toggle="el-icon-arrow-up", theme="hint", @click.native="onClick")
        V2ActionButton.v2-action-music-item__action(icon="el-icon-arrow-right", @click.native="onAction")
    .v2-action-music-item__detail
      label.v2-action-music-item__label Volume: {{ volume }}%
        el-slider.v2-action-music-item__slider(v-model="volume")
      label.v2-action-music-item__range 
        | Range: 
        span.v2-action-music-item__mark {{ formatTime(range[0]) }} / {{ formatTime(range[1]) }}
        |  = 
        span.v2-action-music-item__mark {{ formatTime(range[1] - range[0]) }}
        el-slider.v2-action-music-item__slider(v-model="range", :max="duration", :format-tooltip="formatTime", range)
      .v2-action-music-item__checkboxes
        el-checkbox.v2-action-music-item__checkbox(v-model="loop") Loop 
        el-checkbox.v2-action-music-item__checkbox(v-model="random") Random
</template>

<script>
export default {
  props: ['item'],
  data() {
    const start = this.item.info && this.item.info.processed && this.item.info.processed.start || 0;
    const end = this.item.info && this.item.info.processed && this.item.info.processed.end || this.item.info.youtube.processed.duration;

    return {
      open: false,
      volume: this.item.volume || 100,
      range: [start, end],
      duration: this.item.info.youtube.processed.duration,
      loop: this.item.loop || false,
      random: this.item.random || false,
    };
  },
  computed: {
    classes() {
      const classes = [];

      if (this.open) classes.push('v2-action-music-item--open');
      return classes;
    },
    title() {
      return this.item.channel.toUpperCase() + ': ' + this.item.name;
    },
  },
  methods: {
    onClick() {
      this.open = !this.open;
    },
    onAction() {
      this.$emit('action', { item: this.item, config: { 
        volume: this.volume / 100, 
        start: this.range[0],
        end: this.range[1],
        seek: (this.random ? Math.floor(Math.random() * (this.range[1] - this.range[0])) + this.range[0] : null),
        loop: this.loop || this.random,
      } });
    },
    formatTime(seconds) {
      seconds = parseInt(seconds);
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds - h * 3600) / 60);
      const s = seconds - h * 3600 - m * 60;
      const string = (h ? h + 'h' : '') + (m ? m + 'm' : '') + (s ? s + 's' : '');
      
      return string.length === 0 ? '0s' : string;
    },
  },
}
</script>

<style lang="sass">
.v2-action-music-item
  width: 100%

  &__main
    display: flex
    width: 100%

  &__image
    max-width: 10vw

  &__content
    display: flex
    width: 100%
    align-items: center
    padding: 1em

  &__actions
    white-space: nowrap

  &__action
    height: 100%
    box-sizing: border-box

  &__detail
    display: none
    background: #edf6f9
    padding: 1em
    box-shadow: inset 0px 3px 10px 1px rgba(0, 0, 0, .5)

  &--open &__detail
    display: block

  &__detail > label
    width: 100%
    display: inline-block

  &__detail > label + label
    padding-top: .5em
    border-top: 1px solid silver

  &__icon
    display: flex
    font-size: 3vw
    justify-content: center
    align-items: center
    padding: 1vw
    color: #d6ccc2
    filter: drop-shadow(0 0 5px #FFF)

  &__mark
    background: rgba(0, 0, 0, .2)
    padding: 0 .2em
    border-radius: 2px

</style>
