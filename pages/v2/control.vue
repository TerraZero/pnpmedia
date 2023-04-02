<template lang="pug">
  .v2-control-page
    .v2-control-page__items
      .v2-control-page__header
        .v2-control-page__filters
          V2ActionButton.v2-control-page__filter(icon="el-icon-close", theme="danger", @click.native="onFilterClick('action', 'clear')")
          .v2-control-page__sep
          V2ActionButton.v2-control-page__filter(text="Music", :active="filter.type === 'video'", @click.native="onFilterClick('type', 'video')")
          V2ActionButton.v2-control-page__filter(text="Image", :active="filter.type === 'image'", @click.native="onFilterClick('type', 'image')")
          .v2-control-page__sep
          V2ActionButton.v2-control-page__filter(text="Ambiant", :active="filter.channel === 'ambiant'", @click.native="onFilterClick('channel', 'ambiant')")
          V2ActionButton.v2-control-page__filter(text="Music", :active="filter.channel === 'music'", @click.native="onFilterClick('channel', 'music')")
          V2ActionButton.v2-control-page__filter(text="Sound", :active="filter.channel === 'sound'", @click.native="onFilterClick('channel', 'sound')")
          .v2-control-page__sep
          el-input.v2-control-page__filter-text(type="text", v-model="filter.title")
        .v2-control-page__item
          .v2-control-page__content
            .v2-control-page__label Master Volume: {{ master }}%
            el-slider.v2-control-page__slider(v-model="master")
          .v2-control-page__actions
            V2ActionButton.v2-control-page__action(icon="el-icon-arrow-right", @click.native="onMaster")
            V2ActionButton.v2-control-page__action(icon="el-icon-refresh", @click.native="onRefresh")
            V2ActionButton.v2-control-page__action(icon="el-icon-arrow-down", toggle="el-icon-arrow-up", theme="hint", @click.native="open = !open")
            V2ActionButton.v2-control-page__action(icon="el-icon-switch-button", theme="danger", @click.native="onClear")
        .v2-control-page__item(v-if="open")
          img.v2-control-page__playimage(v-if="playing.image", :src="playing.image.path")
          .v2-control-page__playmusic(v-for="music in playingmusic", :key="music.path")
            .v2-control-page__playmusic-left
              .v2-control-page__playmusic-channel {{ music.channel.toUpperCase() }}: {{ music.name }}
            V2MediaVideoImage.v2-control-page__playmusic-image(:src="music.path")
            V2ActionButton.v2-control-page__playmusic-action(icon="el-icon-switch-button", theme="danger", @click.native="onClear(music.channel)")
      .v2-control-page__item(v-for="item in filtered", :key="item.path")
        keep-alive
          V2ActionMusicItem(v-if="item.type === 'video'", :item="item", :key="item.path", @action="onAction")
          V2ActionImageItem(v-if="item.type === 'image'", :item="item", :key="item.path", @action="onAction")
</template>

<script>
import Socket from '~/plugins/socket';

export default Socket.create({
  socket: {
    point: '/v2/control',
  },
  async mounted() {
    this.screen = this.socket.proxy('/v2/screen');
    this.onRefresh();
    this.items = (await this.$request('v2.database.data').get(null, 'data')).map((item) => {
      item.type = item.media_type;

      if (item.type === 'image') item.path = '\\uploads\\' + item.path;

      return item;
    });
  },
  data() {
    return {
      master: 100,
      open: false,
      filter: {
        type: 'all',
        channel: 'all',
        title: '',
      },
      playing: {},
      items: [],
    };
  },
  computed: {
    filtered() {
      return this.items.filter((item) => {
        if (this.filter.type !== 'all' && this.filter.type !== item.type) {
          return false;
        }
        if (this.filter.channel !== 'all' && this.filter.channel !== item.channel) {
          return false;
        }
        return item.name.toLowerCase().indexOf(this.filter.title.toLowerCase()) !== -1;
      });
    },
    playingmusic() {
      const musics = [];
      
      if (this.playing && this.playing.music) {
        for (const channel in this.playing.music) {
          if (this.playing.music[channel] !== null) musics.push(this.playing.music[channel]);
        }
      }
      return musics;
    },
  },
  methods: {
    async onAction(action) {
      await this.screen.sendUpdateAction(action);
      this.onRefresh();
    },
    onMaster() {
      this.screen.sendMaster({
        volume: this.master / 100,
      });
    },
    onClear(channel = null) {
      this.screen.sendClear(channel);
      this.onRefresh();
    },
    async onRefresh() {
      this.playing = await this.screen.sendGetInfo();
    },
    onFilterClick(type, value) {
      if (type === 'action') {
        switch (value) {
          case 'clear':
            this.filter.type = 'all';
            this.filter.channel = 'all';
            break;
        }
      } else if (this.filter[type] === value) {
        this.filter[type] = 'all';
      } else {
        this.filter[type] = value;
        if (type === 'type' && value === 'image') {
          this.filter.channel = 'all';
        } else if (this.filter.type === 'image') {
          this.filter.type = 'all';
        }
      }
    },
  },
});
</script>

<style lang="sass">
body 
  font-family: 'Open Sans', sans-serif
  
.v2-control-page
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  font-family: 'Open Sans', sans-serif
  overflow: auto

  &__item
    width: 100%
    box-sizing: border-box
    background: #edede9
    display: flex

  &__item + &__item
    border-top: 1px solid silver

  &__content
    padding: 1em 2em
    width: 100%

  &__actions
    display: flex

  &__header
    position: sticky
    border-bottom: 1px solid silver
    top: 0
    z-index: 1000

  &__filters
    display: flex
    background: #d6ccc2

  &__filter
    font-size: 1vw
    user-select: none
    padding: .5em 1em

  &__filter-text
    font-size: 1vw
    border: 0
    outline: 0

  &__sep
    display: inline-block
    width: 1em
    height: 100%

  &__playimage
    max-width: 8vw
    aspect-ratio: 4/3

  &__playmusic
    display: flex
    padding-right: 1em

  &__playmusic-left
    display: flex
    justify-content: center
    flex-direction: column
    padding: .3em

  &__playmusic-image
    max-width: 8vw
    aspect-ratio: 4/3

</style>