<template lang="pug">
  .form-base
    .form-base__title
      slot(name="title")
    .form-base__fields
      slot(name="fields")
    .form-base__actions
      slot(name="actions")
</template>

<style lang="sass">

</style>