<template lang="pug">
  .custom-form-label
    label.custom-form-label__label 
      | {{ label }}
    .custom-form-label__input 
      slot
</template>

<script>
export default {
  props: ['label'],
};
</script>

<style lang="sass">
.custom-form-label
  
  &__label
    padding: .2em 1em
    background: #e7d8c9
    display: inline-block
    font-weight: bold

</style>