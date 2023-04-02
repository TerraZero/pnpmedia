<template lang="pug">
  .layout-tile-wall
    .layout-tile-wall__item(v-for="item, index in items", :key="index")
      .layout-tile-wall__content(@click="$emit('click', { items, item, index })")
        slot(:item="item", :index="index")
</template>

<script>
export default {
  props: ['items']
}
</script>

<style lang="sass">
.layout-tile-wall
  display: flex
  flex-wrap: wrap

  &__item
    width: 50%
    box-sizing: border-box
    min-width: 300px
    max-width: 100%
    width: 25%
    min-height: 200px
    padding: 5px
    perspective: 900px
    user-select: none

  &__content
    box-sizing: border-box
    width: 100%
    height: 100%
    background: #778da9
    cursor: pointer
    box-shadow: 0 0 15px black
    transition: transform .3s ease-in-out
    transform-origin: bottom right

    &:hover
      transform: rotateX(5deg) rotateY(-5deg)
    
    &:active
      transition: transform .1s ease-in-out
      transform: rotateX(8deg) rotateY(-8deg)

</style>
