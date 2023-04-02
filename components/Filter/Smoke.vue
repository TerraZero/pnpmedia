<template lang="pug">
  .filter-smoke(:class="classes", :style="styles")
    svg.filter-smoke__filter
      filter(:id="filterID", width="600%", height="600%")
        feTurbulence(type="fractalNoise" baseFrequency="0.02" numOctaves="20" result="base")
          animate(attributeName="numOctaves", dur="25s", values="20; 70")
          animate(attributeName="baseFrequency", dur="25s", values="0.02; 0.03")
        feOffset(input="base" dx="0" dy="0")
          animate(attributeName="dx", dur="25s", values="-2000; 0", repeatCount="indefinite")
          animate(attributeName="dy", dur="25s", values="0; -2000", repeatCount="indefinite")
        feDisplacementMap(in="SourceGraphic" scale="25")
          animate(v-if="!animate && state === 'in'", ref="ani", attributeName="scale", :dur="aStartTime", values="25; 20; 15; 0", fill="freeze")
          animate(v-if="!animate && state === 'in-out'", ref="ani", attributeName="scale", :dur="aEndTime", values="0; 20; 25", fill="freeze")
    .filter-smoke__frame(:style="frameStyles")
      slot
</template>

<script>
let count = 0;
const fallbackTime = '3s';

export default {
  props: ['animate', 'start-state', 'start-time', 'end-time'],
  data() {
    return {
      id: count++,
      state: this.startState || 'in',
      aStartTime: this.startTime || this.time || fallbackTime,
      aEndTime: this.endTime || this.time || fallbackTime,
    };
  },
  computed: {
    classes() {
      const classes = {
        'filter-smoke--animate': this.animate,
      };

      classes['filter-smoke--state-' + this.state] = true;
      return classes;
    },
    styles() {
      const styles = {};

      styles['filter'] = 'url(#' + this.filterID + ')';
      return styles;
    },
    frameStyles() {
      const styles = {};

      if (this.state === 'out' || this.state === 'in') {
        styles['transition-duration'] = this.aStartTime;
      } else {
        styles['transition-duration'] = this.aEndTime;
      }
      return styles;
    },
    filterID() {
      return 'filter-smoke-' + this.id;
    },
  },
  methods: {
    toggle() {
      if (this.state === 'out') {
        this.state = 'in';
      } else if (this.state === 'in') {
        this.state = 'in-out';
      }
    },
  },
};
</script>


<style lang="sass">
.filter-smoke

  &__filter
    display: none

  &__frame
    transition-property: all
    transition-timing-function: $animations__smooth

  &--animate &__frame
    filter: blur(15px)

  &--state-out &__frame
    opacity: 0
    transform: translate(-10%, 10%)
    filter: blur(20px)

  &--state-in &__frame
    opacity: 1
    transform: translate(0)
    filter: blur(0)

  &--state-in-out &__frame
    opacity: 0
    transform: translate(10%, -10%)
    filter: blur(20px)

</style>
