<template lang="pug">
  .page-mapeditor
    .mapedit(:class="classes")
      .mapedit__wrapper
        .mapedit__grid(:style="gridStyles")
          .mapedit__item(v-for="index in (x * y)", :key="getPoint(index).join('-')", :class="itemClasses(index - 1)", @click="onItemClick(index - 1)")
      .mapedit__sidebar
        .mapedit__sidebar-toggle(@click="onSidebarToggleClick")
          i.el-icon-back.mapedit__sidebar-icon
        .mapedit__sidebar-content
          .mapedit__field-set(:class="{'mapedit__field-set--open': groups.props}")
            label.mapedit__field-set-label(@click="groups.props = !groups.props") 
              | Props
              i.el-icon-caret-bottom.mapedit__field-set-label-icon
            .mapedit__field-set-content
              .mapedit__field
                label.mapedit__field-label Titel
                .mapedit__field-content
                  el-input.mapedit__field-input(v-model="props.title")
          .mapedit__field-set
            label.mapedit__field-set-label Modes
            .mapedit__buttons
              .mapedit__button(v-for="button in modes", :class="{'mapedit__button--active': mode === button.key}", @click="onModeChange(button)")
                i(:class="button.icon")
          .mapedit__field-set(:class="{'mapedit__field-set--open': groups.grid}")
            label.mapedit__field-set-label(@click="groups.grid = !groups.grid") 
              | Grid
              i.el-icon-caret-bottom.mapedit__field-set-label-icon
            .mapedit__field-set-content
              .mapedit__field.mapedit__shifter-wrapper
                .mapedit__shifter
                .mapedit__shifter.mapedit__shifter--button(@click="onShift('y', -2)")
                  i.el-icon-top
                .mapedit__shifter
                .mapedit__shifter.mapedit__shifter--button(@click="onShift('x', -2)")
                  i.el-icon-back
                .mapedit__shifter.mapedit__shifter--button(@click="onShift('y', 2)")
                  i.el-icon-bottom
                .mapedit__shifter.mapedit__shifter--button(@click="onShift('x', 2)")
                  i.el-icon-right
              .mapedit__field
                label
                  el-switch.mapedit__field-checkbox(v-model="show") 
                  | Show
              .mapedit__field
                label.mapedit__field-label Width
                .mapedit__field-content
                  .mapedit__field-control(@click="onGridChange('x', -1)")
                    i.el-icon-minus
                  el-input.mapedit__field-input(v-model="x", disabled)
                  .mapedit__field-control(@click="onGridChange('x', 1)")
                    i.el-icon-plus
              .mapedit__field
                label.mapedit__field-label Height
                .mapedit__field-content
                  .mapedit__field-control(@click="onGridChange('y', -1)")
                    i.el-icon-minus
                  el-input.mapedit__field-input(v-model="y", disabled)
                  .mapedit__field-control(@click="onGridChange('y', 1)")
                    i.el-icon-plus
              .mapedit__field
                label.mapedit__field-label Size
                .mapedit__field-content
                  .mapedit__field-control(@click="size = size - 10")
                    i.el-icon-minus
                  el-input.mapedit__field-input(v-model="size")
                  .mapedit__field-control(@click="size = size + 10")
                    i.el-icon-plus
              .mapedit__field
                label.mapedit__field-label Pos X
                .mapedit__field-content
                  .mapedit__field-control(@click="posx = posx - 10")
                    i.el-icon-minus
                  el-input.mapedit__field-input(v-model="posx")
                  .mapedit__field-control(@click="posx = posx + 10")
                    i.el-icon-plus
              .mapedit__field
                label.mapedit__field-label Pos Y
                .mapedit__field-content
                  .mapedit__field-control(@click="posy = posy - 10")
                    i.el-icon-minus
                  el-input.mapedit__field-input(v-model="posy")
                  .mapedit__field-control(@click="posy = posy + 10")
                    i.el-icon-plus  
          .mapedit__field-set(v-if="active", :class="{'mapedit__field-set--open': groups.item}")
            label.mapedit__field-set-label(@click="groups.item = !groups.item") 
              | Item
              i.el-icon-caret-bottom.mapedit__field-set-label-icon
            .mapedit__field-set-content
              .mapedit__field
                label
                  el-switch.mapedit__field-checkbox(v-model="active.floor") 
                  | Floor
              .mapedit__field
                label
                  el-switch.mapedit__field-checkbox(v-model="active.hide") 
                  | Hide
</template>

<script>
export default {
  data() {
    return {
      props: {
        title: '',
      },
      sidebar: {
        open: true,
      },
      mode: 'add',
      modes: [
        {
          key: 'add',
          icon: 'el-icon-circle-plus',
        },
        {
          key: 'remove',
          icon: 'el-icon-remove',
        },
        {
          key: 'edit',
          icon: 'el-icon-edit',
        },
        {
          key: 'floor',
          icon: 'el-icon-full-screen',
        },
      ],
      show: true,
      size: 30,
      x: 9,
      y: 9,
      posx: 30,
      posy: 30,
      active: null,
      items: [],
      groups: {
        props: false,
        grid: true,
        item: true,
      },
    };
  },
  computed: {
    classes() {
      const classes = [];

      if (this.sidebar.open) classes.push('mapedit--open');
      if (this.show) classes.push('mapedit--show');
      return classes;
    },  
    gridStyles() {
      const styles = {};
      const size3 = this.size * 3;

      const cols = [];
      for (let x = 0; x < this.x; x++) {
        if (x % 2 === 0) {
          cols.push(size3 + 'px');
        } else {
          cols.push(this.size + 'px');
        }
      }

      const rows = [];
      for (let y = 0; y < this.y; y++) {
        if (y % 2 === 0) {
          rows.push(size3 + 'px');
        } else {
          rows.push(this.size + 'px');
        }
      }

      styles['grid-template-columns'] = cols.join(' ');
      styles['grid-template-rows'] = rows.join(' ');

      styles.left = this.posx + 'px';
      styles.top = this.posy + 'px';

      return styles;
    },
  },
  methods: {
    save() {
      console.log(JSON.stringify({
        x: this.x,
        y: this.y,
        items: this.items,
        props: this.props,
      }));
      
    },
    getPoint(index) {
      const y = Math.floor(index / this.x);
      const x = index - y * this.x;

      return [x, y];
    },
    getItem(indexX, y = null) {
      if (y === null) {
        [ indexX, y ] = this.getPoint(indexX);
      }
      return this.items.find(v => v.y === y && v.x === indexX);
    },
    getItemIndex(index) {
      return this.items.findIndex(v => v.y * this.x + v.x === index);
    },
    getAround(x, y, center = false) {
      return this.getAroundIndex(x, y, center)
        .map(v => this.getItem(v[0], v[1]))
        .filter();
    },
    getAroundIndex(pointX, pointY, center = false) {
      const indexes = [];
      for (let y = -1; y < 2; y++) {
        for (let x = -1; x < 2; x++) {
          if (!center && y === pointY && x === pointX) continue;
          indexes.push([pointX + x, pointY + y]);
        }
      }
      return indexes;
    },
    itemClasses(index) {
      const classes = [];
      const item = this.getItem(index);
      const [ x, y ] = this.getPoint(index);
      
      if (x % 2 === 1) classes.push('mapedit__item--item-x');
      if (y % 2 === 1) classes.push('mapedit__item--item-y');
      
      if (item) {
        classes.push('mapedit__item--item');
        if (item.floor) {
          classes.push('mapedit__item--floor');
        }
      }
      if (this.active && index === this.active.y * this.x + this.active.x) {
        classes.push('mapedit__item--active');
      }
      return classes;
    },
    onModeChange(button) {
      this.mode = button.key;
      this.active = null;
    },
    addItem(x, y, props = {}) {
      if (x < 0 || y < 0 || x >= this.x || y >= this.y) return null;
      props.x = x;
      props.y = y;
      props.floor = props.floor === undefined ? (x % 2 === 1) !== (y % 2 === 1) : props.floor;
      props.hide = props.hide === undefined ? false : props.hide;
      this.items.push(props);
      return props;
    },
    onItemClick(index) {
      const [ x, y ] = this.getPoint(index);

      switch (this.mode) {
        case 'add':
          this.addItem(x, y);
          this.save();
          break;
        case 'remove':
          const itemIndex = this.getItemIndex(index);

          if (itemIndex !== -1) {
            this.items.splice(itemIndex, 1);
          }
          break;
        case 'edit':
          this.active = this.getItem(index);
          break;
        case 'floor':
          if (true === (x % 2 === 1) === (y % 2 === 1)) {
            const arounds = this.getAroundIndex(x, y);
            
            for (const [dx, dy] of arounds) {
              const item = this.getItem(dx, dy);

              if (!item) {
                this.addItem(dx, dy, {
                  floor: false,
                });
              } else if ((dx % 2 === 1) !== (dy % 2 === 1)) {
                item.floor = false;
              }
            }
          } else {
            const item = this.getItem(index);

            if (item) {
              item.floor = !item.floor;
            }
          }
          break;
      }
    },
    onGridChange(prop, change) {
      this[prop] = this[prop] + change;

      this.items = this.items.filter(v => {
        return v.x < this.x && v.y < this.y;
      });
    },
    onSidebarToggleClick() {
      this.sidebar.open = !this.sidebar.open;
    },
    onShift(prop, change) {
      this.items.forEach(v => {
        v[prop] = v[prop] + change;
      });
      this.items = this.items.filter(v => {
        return v[prop] >= 0 && v[prop] < this[prop];
      });
    },
  },
};
</script>

<style lang="sass">
body
  margin: 0
  background: #27293d
  font-family: 'Open Sans', sans-serif

.mapedit
  display: flex
  width: 100vw
  height: 100vh
  overflow: hidden

  &__wrapper
    width: 100%
    transition: width .3s ease-in-out
    z-index: 10

  &--open &__wrapper
    width: 80%

  &__sidebar
    display: flex
    flex-direction: column
    width: 60px
    background: #3f9ba3
    box-shadow: -5px 0 5px black
    font-size: 1.5em
    transition: width .3s ease-in-out
    z-index: 10000

  &--open &__sidebar
    width: 20%

  &__sidebar-toggle
    padding: .75em
    background: #84c8cf
    cursor: pointer
    display: flex
    justify-content: center

  &__sidebar-content
    display: none
  
  &--open &__sidebar-content
    display: block

  &__sidebar-icon
    color: white
    transform: rotate(0deg)
    transition: transform .3s ease-in-out

  &--open &__sidebar-icon
    transform: rotate(180deg)

  &__grid
    display: grid
    position: relative
  
  &__item
    width: 100%
    height: 100%
    position: relative
    cursor: pointer

  &__item:before
    content: ''
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: white
    opacity: 0
    border: 1px solid black
    box-sizing: border-box
    z-index: -1

  &--show &__item:before
    opacity: .15

  &__item:after
    content: ''
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    opacity: 0
    background: white

  &__item:hover
    background: white
    z-index: 1000

  &__item--item:after
    opacity: 1 !important

  &__item--floor.mapedit__item--item-x:after
    height: 33%
    top: 50%
    transform: translateY(-50%)

  &__item--floor.mapedit__item--item-y:after
    width: 33%
    left: 50%
    transform: translateX(-50%)

  &__item--active
    outline: 3px solid blue
    z-index: 1000

  &__buttons
    display: flex

  &__button
    text-align: center
    width: 100%
    background: #778da9
    padding: .3em
    cursor: pointer

  &__button--active
    background: #84c8cf

  &__shifter-wrapper
    display: grid
    grid-template-columns: 50px 50px 50px
    grid-template-rows: 50px 50px
    gap: 2px

  &__shifter
    display: flex
    justify-content: center
    align-items: center

  &__shifter--button
    background: #84c8cf
    cursor: pointer

.mapedit__field

  &-set
    margin: .2em
    border: 1px solid white
    padding: .5em
    color: white

  &-set-label
    font-weight: bold
    font-size: 1.25em
    cursor: pointer

  &-set-content
    height: 0
    overflow: hidden

  &-set--open &-set-content
    height: auto

  &-set-label-icon
    transform: rotate(180deg)

  &-set--open &-set-label-icon
    transform: rotate(0deg)

  &-label
    font-size: .8em

  &-content
    display: flex
    padding: .25em 0

  &-checkbox
    color: white
    margin-right: .5em

  &-input
    height: auto

  &-input > input
    border: 0
    border-radius: 0
    height: 100%

  &-control
    padding: 5px 15px
    background: #84c8cf
    cursor: pointer



</style>