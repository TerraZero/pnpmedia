<template lang="pug">
  .control-page
    .control-page__sidebar
      ControlButtons(:buttons="items", :main="true", :active="iActive", @button="onButton")
    .control-page__content
      keep-alive
        component(v-if="iActive !== null", :is="active.component", :screen="screen")
</template>

<script>
import Socket from '~/plugins/socket';

export default Socket.create({
  socket: {
    point: '/control',
  },
  mounted() {
  },
  data() {
    return {
      screen: null,
      iActive: null,
      items: [
        {
          icon: {
            icon: 'map',
          },
          name: 'Maps',
          component: 'ControlMaps',
        },
        {
          icon: {
            icon: 'music',
          },
          name: 'Music',
          component: 'ControlMusic',
        },
        {
          icon: {
            icon: 'battle',
          },
          name: 'Battle',
          component: 'ControlBattle',
        },
        {
          icon: {
            icon: 'date',
          },
          name: 'DB',
          component: 'ControlDatabase',
        },
      ],
    };
  },
  computed: {
    active() {
      return this.items[this.iActive];
    },
  },
  methods: {
    onButton(button, index) {
      this.iActive = index;
    },
    sidebarItemClasses(item, index) {
      const classes = [];

      if (this.active !== null && this.active.component === item.component) {
        classes.push('control-page__item--active');
      }
      return classes;
    },
  },
});
</script>

<style lang="sass">
body 
  font-family: 'Open Sans', sans-serif
  
.control-page
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  display: flex
  font-family: 'Open Sans', sans-serif

  &__sidebar
    display: flex
    flex-direction: column
    height: 100%
    min-width: 100px
    max-width: 100px
    background: #d3d3d3

  &__item
    height: 5em
    background: #cbc0d3
    display: flex
    justify-content: center
    align-items: center
    cursor: pointer

  &__item--active
    background: #8e9aaf

  &__item:hover
    background: #b1a7a6

  &__content
    width: 100%

</style>