<template lang="pug">
  .control-icon(:class="classes")
    i.control-icon__icon(:class="iconClasses", :style="iconStyles")
</template>

<script>
export default {
  props: ['icon', 'spin', 'button', 'size'],
  computed: {
    iconClasses() {
      const mapping = {
        'menu-arrow': 'd-arrow-left',
        'map': 'position',
        'music': 'microphone',
        'battle': 'trophy',
        'play': 'video-play',
        'stop': 'video-pause',
        'type:video': 'video-camera-solid',
        'type:file': 'document',
        'add': 'circle-plus-outline',
        'remove': 'remove-outline',
        'loop': 'refresh',
        'mix': 'sort',
      };
      
      if (mapping[this.icon]) {
        return ['el-icon-' + mapping[this.icon]];
      } else {
        return ['el-icon-' + this.icon];
      }
    },
    iconStyles() {
      return {
        'font-size': this.size || '',
      };
    },
    classes() {
      const classes = [];

      if (this.spin) classes.push('control-icon--spin');
      if (this.button) classes.push('control-icon--button');
      return classes;
    },
  },
};
</script>

<style lang="sass">
.control-icon
  display: inline-block
  transition: all .3s $animations__smooth

  &--spin &__icon
    transform: rotate(180deg)

  &--button
    cursor: pointer
    padding: .5em
    background: var(--control-icon--background, #cbc0d3)

  &--button:hover
    background: var(--control-icon--background-hover, #b1a7a6)
</style>