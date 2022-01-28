<template lang="pug">
  .background-star
    .background-star__one
    .background-star__two
    .background-star__three
</template>

<script>
export default {
}
</script>

<style lang="sass">
// n is number of stars required
@function background-star__multiple-box-shadow($n) 
  $value: '#{random(2000)}px #{random(2000)}px #FFF'
  @for $i from 2 through $n
    $value: '#{$value} , #{random(2000)}px #{random(2000)}px #FFF'

  @return unquote($value)

$shadows-small: background-star__multiple-box-shadow(700)
$shadows-medium: background-star__multiple-box-shadow(200)
$shadows-big: background-star__multiple-box-shadow(100)

.background-star
  height: 100%
  background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)
  overflow: hidden
    
  &__one
    width: 1px
    height: 1px
    background: transparent
    box-shadow: $shadows-small
    animation: background-star__animation 50s linear infinite
    
    &:after
      content: " "
      position: absolute
      top: 2000px
      width: 1px
      height: 1px
      background: transparent
      box-shadow: $shadows-small
    
  &__two
    width: 2px
    height: 2px
    background: transparent
    box-shadow: $shadows-medium
    animation: background-star__animation 100s linear infinite
      
    &:after
      content: " "
      position: absolute
      top: 2000px
      width: 2px
      height: 2px
      background: transparent
      box-shadow: $shadows-medium
    
  &__three
    width: 3px
    height: 3px
    background: transparent
    box-shadow: $shadows-big
    animation: background-star__animation 150s linear infinite
      
    &:after
      content: " "
      position: absolute
      top: 2000px
      width: 3px
      height: 3px
      background: transparent
      box-shadow: $shadows-big
    
@keyframes background-star__animation
  from	
    transform: translateY(0px)
  to		
    transform: translateY(-2000px)
    
</style>
