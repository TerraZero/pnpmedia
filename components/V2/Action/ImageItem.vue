<template lang="pug">
  .v2-action-image-item
    i.v2-action-image-item__icon.el-icon-picture
    img.v2-action-image-item__image(:src="item.path")
    .v2-action-image-item__content {{ item.name }}
    .v2-action-image-item__props
      .v2-action-image-item__checkboxes
        el-checkbox.v2-action-image-item__checkbox(v-model="contain") Contain 
        el-checkbox.v2-action-image-item__checkbox(v-model="rotate") Rotate
    .v2-action-image-item__actions
      V2ActionButton.v2-action-image-item__action(icon="el-icon-arrow-right", @click.native="onAction")
</template>

<script>
export default {
  props: ['item'],
  data() {
    return {
      contain: false,
      rotate: false,
    };
  },
  methods: {
    onAction() {
      this.item.contain = this.contain;
      this.item.rotate = this.rotate;
      this.$emit('action', { item: this.item });
    },
  },
};
</script>

<style lang="sass">
.v2-action-image-item
  display: flex
  width: 100%

  &__image
    max-width: 10vw
    aspect-ratio: 4/3

  &__actions
    white-space: nowrap
    width: 100%
    text-align: right

  &__action
    height: 100%
    box-sizing: border-box

  &__icon
    display: flex
    font-size: 3vw
    justify-content: center
    align-items: center
    padding: 1vw
    color: #d6ccc2
    filter: drop-shadow(0 0 5px #FFF)

  &__content
    display: flex
    width: 100%
    align-items: center
    padding: 1em

</style>
