<template lang="pug">
  .control-buttons(:class="classes", :style="styles")
    .control-buttons__button(v-for="button, index in items", :key="index", :class="buttonClasses(button, index)", @click="$emit('button', button, index)")
      ControlIcon(v-if="button.icon", v-bind="button.icon")
      .control-buttons__name(v-if="button.name")
        | {{ button.name }}
</template>

<script>
export default {
  props: ['buttons', 'expand', 'main', 'active', 'grid'],
  computed: {
    items() {
      if (!this.expand) return this.buttons;
      const items = [];
      for (let i = 0; i < this.buttons.length && i < this.expand; i++) {
        items.push(this.buttons[i]);
      }
      return items;
    },
    classes() {
      const classes = [];

      if (this.main) classes.push('control-buttons--main');
      if (this.grid) classes.push('control-buttons--grid');
      if (!this.grid) classes.push('control-buttons--flex');
      return classes;
    },
    styles() {
      const styles = {};

      if (this.grid) styles.gridTemplateColumns = this.grid;
      return styles;
    },
  },
  methods: {
    buttonClasses(button, index) {
      const classes = [];

      if (Array.isArray(this.active)) {
        if (this.active.includes(index)) classes.push('control-buttons__button--active');
      } else {
        if (index === this.active) classes.push('control-buttons__button--active');
      }
      if (button.iconPos) classes.push('control-buttons__button--icon-' + button.iconPos);
      if (button.danger) classes.push('control-buttons__button--danger');
      return classes;
    },
  },
};
</script>

<style lang="sass">
.control-buttons
  gap: 2px

  &--flex
    display: flex
    flex-wrap: wrap

  &--grid
    display: grid

  &__button
    padding: .5em 1em
    background: #cbc0d3
    cursor: pointer
    user-select: none

  &__button--active
    background: #8e9aaf

  &__button--danger
    background: #e76f51
    color: white

  &__button--icon-right,
  &__button--icon-left
    display: flex
    align-items: center
    gap: 2px

  &__button--icon-right
    flex-direction: row-reverse

  &__button:hover
    background: #b1a7a6

  &--main &__button
    width: 100%
    text-align: center

</style>