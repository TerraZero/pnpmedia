<template lang="pug">
  .entity-input-image
    EntityViewImage.entity-input-image__view(:value="value", :loading="loading", @click.native="open = true", idd="input")
    el-dialog.entity-input-image__dialog(:visible.sync="open", width="80%", :close-on-click-modal="false")
      EntityBrowserImage(:value="value", @browser="browser")
</template>

<script>
export default {
  props: ['value'],
  data() {
    return {
      open: false,
      loading: false,

      name: '',
      url: '',
      file: '',
      path: '',
    };
  },
  methods: {
    browser({ op, id }) {
      this.open = false;
      if (op === 'remove') {
        this.$emit('input', null);
      } else if (op !== 'close') {
        this.$emit('input', id);
      }
    },
  },
}
</script>

<style lang="sass">
.entity-input-image

  &__view
    cursor: pointer

  &__field
    margin-bottom: 1em

  &__dialog .el-dialog
    background: #778da9

  &__dialog .el-dialog__title,
  &__dialog .el-dialog__close
    color: black

  &__dialog .el-dialog__close:hover
    color: white

</style>