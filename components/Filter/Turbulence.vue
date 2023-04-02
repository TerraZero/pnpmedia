<template lang="pug">
  .filter-turbulence(:class="classes", :style="styles")
    svg.filter-turbulence__filter
      filter(:id="'filter-turbulence-' + id", width="600%", height="600%")
        feTurbulence(baseFrequency="0.03", numOctaves="5" result="turb" seed="5")
        feOffset(input="turb" dx="0" dy="0")
          animate(attributeName="dx" dur="60s" values="-2000; 0" repeatCount="indefinite")
          animate(attributeName="dy" dur="60s" values="-2000; 0" repeatCount="indefinite")
        feDisplacementMap(in="SourceGraphic" scale="30")
    slot
</template>

<script>
let count = 0;

export default {
  props: ['animate'],
  data() {
    return {
      id: count++,
    };
  },
  computed: {
    classes() {
      return {
        'filter-turbulence--animate': this.animate,
      };
    },
    styles() {
      const styles = {};

      if (this.animate) {
        styles['filter'] = 'url(#filter-turbulence-' + this.id + ')';
      }
      return styles;
    },
  },
};
</script>


<style lang="sass">
.filter-turbulence

  &__filter
    display: none

</style>
