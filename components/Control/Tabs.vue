<template lang="pug">
  .control-tabs
    ControlButtons.control-tabs__header(:buttons="tabs", :active="iActive", @button="onButton")
    .control-tabs__content
      .control-tabs__tab(v-for="tab in tabs", :key="tab.key", :style="styles(tab)")
        slot(:name="tab.key")
</template>

<script>
export default {
  props: ['tabs'],
  data() {
    return {
      active: this.tabs[0].key,
      iActive: 0,
    };
  },
  methods: {
    styles(tab) {
      return {
        display: tab.key === this.active ? 'block' : 'none',
      };
    },
    onButton(button, index) {
      this.active = button.key;
      this.iActive = index;
      this.$emit('tab', { button, index });
    },
  },
};
</script>

<style lang="sass">
.control-tabs

  &__header
    text-align: center
    background: var(--control-tabs--header--background, initial)

</style>