<template lang="pug">
  ControlContentLayout.control-maps(:class="classes", ref="layout", :controls="controls", @control="onControl", :sidebar="'20%'", :expand.sync="expand")
    template(#title)
      | Maps 
      span(v-if="active") - {{ active.name }}
    template
      .control-maps__map(v-if="active")
        .control-maps__map-image-ratio
          img.control-maps__map-image(ref="map", :src="'/ani/maps/' + active.src", @click="onClick")
          .control-maps__pointer(v-if="point", :style="pointerStyles(point)")
          .control-maps__pointer-2(v-if="pointShow", :style="pointerStyles(pointShow)")
    template(#sidebar)
      .control-maps__points(v-if="active")
        .control-maps__point(v-for="item, index in active.points", :key="index", @mouseenter="onPoint('enter', item, index)", @mouseleave="onPoint('leave', item, index)", @click="onPoint('click', item, index)")
          | {{ index + 1 }}
          ControlButtons(v-if="expand", :buttons="pointButtons", @button="onPointControl($event, item, index)")
    template(#dialog)
      .control-maps__items
        .control-maps__item(v-for="item, index in items", :key="index", @click="onSelect(item)")
          img.control-maps__image(:src="'/ani/maps/' + item.src")
          .control-maps__name {{ item.name }}
</template>

<script>
const maps = require('~/static/ani/info/maps.json');
let dbClick = null;
export default {
  mounted() {
    this.$refs.layout.doDialog('open');
  },
  data() {
    return {
      expand: false,
      controls: [
        { name: 'Select', key: 'select' },
        { name: 'Activate', key: 'activate' },
      ],
      active: null,
      testPoint: [],
      point: null,
      pointShow: null,
      items: maps,
      pointButtons: [
        {
          key: 'topoint',
          icon: {
            icon: 'map',
          },
        },
        {
          key: 'delete',
          icon: {
            icon: 'delete',
          },
        },
      ],
    };
  },
  computed: {
    classes() {
      const classes = [];

      if (this.expand) classes.push('control-maps--expand');
      return classes;
    },
  },
  methods: {
    onPointControl(button, item, index) {
      switch (button.key) {
        case 'topoint':
          this.point = item;
          break;
        case 'delete':
          this.active.points.splice(index, 1);
          this.pointShow = null;
          break;
      }
    },
    onPoint(action, item, index) {
      switch (action) {
        case 'enter':
          this.pointShow = item;
          break;
        case 'leave':
          this.pointShow = null;
          break;
        case 'click':
          if (!this.expand) {
            this.point = item;
          }
          break;
      }
    },
    onSelect(item) {
      this.active = item;
      this.$refs.layout.doDialog('close');
    },
    onControl(control) {
      switch (control.key) {
        case 'select':
          this.$refs.layout.doDialog('open');
          break;
        case 'activate':
          this.active.points.push(this.point);
          break;
      }
    },
    onClick(e) {
      this.point = [100 * e.offsetX / e.target.offsetWidth, 100 * e.offsetY / e.target.offsetHeight];

      if (dbClick === null) {
        dbClick = setTimeout(() => {
          dbClick = null;
        }, 200);
      } else {
        clearTimeout(dbClick);
        dbClick = null;
        this.active.points.push(this.point);
        this.$refs.layout.doSidebar('open');
      }
    },
    pointerStyles(point) {
      return {
        top: point[1] + '%',
        left: point[0] + '%',
      };
    },
  },
};
</script>

<style lang="sass">
.control-maps

  &__items
    display: flex
    flex-wrap: wrap
    gap: .5%

  &__item
    display: flex
    flex-direction: column
    width: 33%
    cursor: pointer

  &__image
    width: 100%
    height: auto
  
  &__name
    background: #e7d8c9
    padding: .5em

  &__item:hover &__name
    background: #adb5bd

  &__map
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    height: 100%
    padding: 1em
    box-sizing: border-box
    user-select: none
    
  &__map-image
    width: 100%
    height: 100%

  &__map-image-ratio
    aspect-ratio: 4 / 3
    height: 100%
    position: relative
    cursor: pointer

  &__pointer-2,
  &__pointer
    position: absolute
    width: 6px
    height: 6px
    background-color: red
    border-radius: 50%
    filter: drop-shadow(0 0 3px black)
    pointer-events: none
  
  &__pointer-2:before,
  &__pointer:before
    content: ''
    width: 12px
    height: 12px
    border-radius: 50%
    border: 2px solid rgba(255, 0, 0, .6)
    position: absolute
    top: -5px
    left: -5px
    filter: drop-shadow(0 0 3px black)

  &__pointer-2:after,
  &__pointer:after
    content: ''
    width: 20px
    height: 20px
    border-radius: 50%
    border: 2px solid rgba(255, 0, 0, .4)
    position: absolute
    top: -9px
    left: -9px
    filter: drop-shadow(0 0 3px black)

  &__pointer-2
    background: green

  &__pointer-2:before
    border-color: rgba(0, 255, 0, .6)

  &__pointer-2:after
    border-color: rgba(0, 255, 0, .4)

  &__points
    display: flex
    flex-direction: column
    gap: 2px

  &__point
    display: flex
    justify-content: center
    align-items: center
    padding: .5em
    cursor: pointer
    background: #cbc0d3

  &__point:hover
    background: #b1a7a6
  
  &--expand &__point 
    justify-content: space-between
    cursor: initial

  &--expand &__point:hover
    background: #cbc0d3

</style>