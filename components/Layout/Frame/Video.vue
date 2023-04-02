<template lang="pug">
  .layout-frame-video
    .layout-frame-video__wrapper
      .layout-frame-video__item
        slot
</template>

<style lang="sass">
.layout-frame-video  

  &__wrapper
    width: 100%
    padding-bottom: 56.25%
    position: relative

  &__item
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
</style>
