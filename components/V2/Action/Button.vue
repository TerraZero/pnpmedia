<template lang="pug">
  .v2-action-button(:class="classes", @click="onClick")
    .v2-action-button__text(v-if="text") {{ text }}
    i.v2-action-button__icon(v-if="icon", :class="getIcon")
</template>

<script>
export default {
  props: ['text', 'icon', 'theme', 'toggle', 'active'],
  data() {
    return {
      open: false,
    };
  },
  computed: {
    classes() {
      const classes = [];

      if (this.theme) classes.push('v2-action-button--' + this.theme);
      if (this.open && this.toggle) classes.push('v2-action-button--open');
      if (this.active) classes.push('v2-action-button--active');
      return classes;
    },
    getIcon() {
      return this.open && this.toggle ? this.toggle : this.icon;
    },
  },
  methods: {
    onClick() {
      this.open = !this.open;
    },
  },
}
</script>

<style lang="sass">
.v2-action-button
  display: inline-flex
  align-items: center
  padding: 1em
  background: #e3d5ca
  transition: background .15s ease-in-out
  cursor: pointer
  color: white
  font-size: 25px

  & + &
    border-left: 1px solid silver

  &:hover 
    background: #d6ccc2

  &--active,
  &--open
    box-shadow: inset 0px 0px 10px 2px #000

  &__icon
    filter: drop-shadow(0 0 2px black)

  &--danger
    background: #e5383b

  &--danger:hover
    background: #ba181b

  &--hint
    background: #219ebc

  &--hint:hover
    background: #8ecae6


</style>
