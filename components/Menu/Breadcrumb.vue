<template lang="pug">
  .menu-breadcrumb
    .menu-breadcrumb__item(v-for="item, key in items", :key="key", @click="click({ item, key })")
      | {{ item.name }}
</template>

<script>
export default {
  props: ['items'],
  methods: {
    click({ item }) {
      this.$emit('admin', {method: 'goto', params: { component: item.component }});
    },
  },
}
</script>


<style lang="sass">
.menu-breadcrumb
  width: 100%
  background: #3f9ba3
  box-shadow: 0 0 20px black

  &__item
    display: inline-block
    padding: .5em .5em .5em 1em
    background: #84c8cf
    position: relative
    user-select: none
    cursor: pointer
    transition: background .3s ease-in-out

  &__item + &__item
    padding-left: 2em

  &__item:after
    content: ''
    width: 0
    height: 0
    border-style: solid
    border-width: 19px 0 19px 1em
    border-color: transparent transparent transparent #84c8cf
    position: absolute
    top: 0
    left: 100%
    filter: drop-shadow(2px 0 0 black)
    transition: border-color .3s ease-in-out
    z-index: 10

  &__item:hover
    background: #d6edef

  &__item:hover:after
    border-color: transparent transparent transparent #d6edef

</style>