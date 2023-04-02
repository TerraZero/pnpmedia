<template lang="pug">
  .custom-form-fieldset
    label.custom-form-fieldset__label 
      | {{ label }}
    .custom-form-fieldset__set
      slot
</template>

<script>
export default {
  props: ['label'],
};
</script>

<style lang="sass">
.custom-form-fieldset
  
  &__label
    padding: .2em 1em
    background: #e7d8c9
    display: inline-block
    font-weight: bold
    width: 100%
    box-sizing: border-box

  &__set
    padding: .5em
    border: 1px solid #e7d8c9

</style>