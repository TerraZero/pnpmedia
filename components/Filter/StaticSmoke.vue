<template lang="pug">
  svg.filter-static-smoke
    filter(:id="filterID")
      feTurbulence(type="fractalNoise" baseFrequency="0.02" numOctaves="20" result="base")
        animate(attributeName="numOctaves", :dur="aTime", values="20; 70", repeatCount="indefinite")
        animate(attributeName="baseFrequency", :dur="aTime", values="0.04; 0.06; 0.04", repeatCount="indefinite")
      feDisplacementMap(in="SourceGraphic" scale="30")
</template>

<script>
let count = 0;

export default {
  props: ['time'],
  data() {
    return {
      aTime: this.time || '3s',
      id: count++,
    };
  },
  computed: {
    filterID() {
      return 'filter-static-smoke-' + this.id;
    },
  },
};
</script>


<style lang="sass">
.filter-static-smoke
  display: none
</style>
