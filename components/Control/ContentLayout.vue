<template lang="pug">
  .control-content-layout(:class="classes")
    .control-content-layout__top
      .control-content-layout__title
        slot(name="title")
      ControlButtons(v-if="controls", :buttons="controls", @button="onControl")
    .control-content-layout__wrapper
      .control-content-layout__content
        slot
      .control-content-layout__sidebar(v-if="sidebar", :style="sidebarStyles")
        ControlButtons.control-content-layout__sidebar-controls(:buttons="sidebarControls", @button="onSidebarControl", :expand="expand ? 0 : 1")
        slot(name="sidebar")
    el-dialog.control-content-layout__dialog(:visible.sync="show", :close-on-click-modal="false", :fullscreen="true", append-to-body)
      slot(name="dialog")
</template>

<script>
export default {
  props: ['controls', 'sidebar'],
  data() {
    return {
      show: false,
      expand: false,
    };
  },
  computed: {
    classes() {
      return {
        'control-content-layout--sidebar': this.sidebar !== undefined,
        'control-content-layout--sidebar-expandable': typeof this.sidebar === 'string',
        'control-content-layout--sidebar-expanded': this.expand,
      };
    },
    sidebarStyles() {
      const styles = {};

      if (this.expand) {
        styles.width = this.sidebar;
      }
      return styles;
    },
    sidebarControls() {
      const controls = [];

      controls.push({
        icon: {
          icon: 'menu-arrow',
          spin: this.expand,
        },
        key: 'expand',
      });
      return controls;
    },
  },
  methods: {
    doSidebar(op = 'toggle') {
      switch (op) {
        case 'open':
          this.expand = true;
          break;
        case 'close':
          this.expand = false;
          break;
        case 'toggle': 
          this.expand = !this.expand;
          break;
      }
      this.$emit('update:expand', this.expand);
    },
    doDialog(op = 'toggle') {
      switch (op) {
        case 'open': 
          this.show = true;
          break;
        case 'close':
          this.show = false;
          break;
        case 'toggle': 
          this.show = !this.show;
          break;
      }
    },
    onControl(button, index) {
      this.$emit('control', button, index);
    },
    onSidebarControl(button) {
      switch (button.key) {
        case 'expand':
          this.doSidebar();
          break;
      }
    },
  },
};
</script>

<style lang="sass">
.control-content-layout
  display: grid
  grid-template-rows: 38px calc(100% - 38px)
  width: 100%
  height: 100%

  &__top
    display: flex
    justify-content: space-between
    background: #e7d8c9
    box-sizing: border-box
    height: 38px
    flex-grow: 0
    flex-shrink: 0

  &__wrapper
    width: 100%
    height: 100%
    background: #343a40
    position: relative
    flex-grow: 1

  &--sidebar &__wrapper
    display: flex

  &__sidebar
    width: 3em
    position: absolute
    top: 0
    right: 0
    bottom: 0
    background: #d3d3d3
    z-index: 1000
    transition: width .2s $animations__smooth
    overflow-y: auto

  &__sidebar-controls
    border-bottom: .2em solid #8e9aaf

  &__content
    width: 100%
    height: 100%
    background: #343a40
    margin-right: 3em

  &__dialog
    margin: 5vw

  &__title
    padding: .5em
    font-weight: bold

</style>