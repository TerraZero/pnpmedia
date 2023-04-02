<template lang="pug">
  svg.filter-edge-fire
    defs
      filter(:id="filterID", width="2500", height="2500")
        feTurbulence(type="fractalNoise", baseFrequency="0.04", numOctaves="3", seed="5555", result="secondNoise")
        feOffset(result="secondNoiseOffset")
          animate(attributeName="dx", :dur="efDur || '800s'", :values="'-2500; 0; -2500'", repeatCount="indefinite")
          animate(attributeName="dy", :dur="efDur || '800s'", :values="'-2500; 0; -2500'", repeatCount="indefinite")
        feTurbulence(type="fractalNoise", baseFrequency="0.04", numOctaves="3")
          //-animate(attributeName="baseFrequency", :dur="efDurBase || '200s'", values="0.038; 0.042; 0.038", repeatCount="indefinite")
        feOffset
          animate(attributeName="dx", :dur="efDur || '800s'", :values="'0; -2500; 0'", repeatCount="indefinite")
          animate(attributeName="dy", :dur="efDur || '800s'", :values="'0; -2500; 0'", repeatCount="indefinite")
        feDisplacementMap(in="SourceGraphic" :scale="efScale || 200")
        feDisplacementMap(in2="secondNoiseOffset", scale="300")
          //-animate(attributeName="scale", :dur="efDurScale || '20s'", :values="scaleValues", repeatCount="indefinite")
        feGaussianBlur(stdDeviation="1.5")
        feComposite(operator="in", in="SourceGraphic", result="target")
        feFlood(flood-color="white", result="plane")
        feGaussianBlur(stdDeviation="10", in="plane", result="planeBlur")
        feComposite(operator="in", in="target", in2="scaled")
</template>

<script>
let count = 0;

export default {
  props: ['efScale', 'efScaleMin', 'efScaleMax', 'efDur', 'efDurBase', 'efDurScale', 'efOffsetValues'],
  data() {
    return {
      id: count++,
    };
  },
  computed: {
    scaleValues() {
      let values = [this.efScaleMin || 200, this.efScaleMax || 300, this.efScaleMin || 200];
      if (this.efScale) {
        values = [this.efScale - 50, this.efScale + 50, this.efScale - 50];
      }
      return values.join('; ');
    },
    filterID() {
      return 'filter-edge-fire-' + this.id;
    },
  },
};
</script>


<style lang="sass">
.filter-edge-fire
  display: none

</style>
