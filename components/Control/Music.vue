<template lang="pug">
  ControlContentLayout.control-music(:class="classes", ref="layout", :controls="controls", @control="onControl")
    template(#title)
      | Music
    template
      .control-music__wrapper
        .control-music__frame
          .control-music__item(v-for="scene, index in scenes", :key="index", @click="active = scene")
            .control-music__content
              | {{ scene.name }}
            i.el-icon-caret-right
        .control-music__frame
          .control-music__frame-wrapper(v-if="active")
            .control-music__frame-title
              | Controls
            .control-music__frame-control
              ControlButtons(:buttons="buttons")
          .control-music__frame-wrapper(v-if="active && active.musics")
            .control-music__frame-title
              | Musics
            .control-music__frame-item(v-for="music, musicIndex in active.musics", :key="musicIndex")
              ControlIcon.control-music__attr(:icon="'type:' + music.type")
              .control-music__preview(v-if="music.type === 'video' && music.id")
                img.control-music__preview-image(:src="'https://img.youtube.com/vi/' + music.id + '/default.jpg'")
              ControlButtons.control-music__op(:buttons="itemButtons", @button="onItemButton($event, music, 'music')")
          .control-music__frame-wrapper(v-if="active && active.images")
            .control-music__frame-title
              | Images
            .control-music__frame-item(v-for="image, imageIndex in active.images", :key="imageIndex")
              ControlIcon.control-music__attr(:icon="'type:' + image.type")
              .control-music__preview(v-if="image.type === 'file' && image.src")  
                img.control-music__preview-image(:src="image.src")
              .control-music__form
                .control-music__formitem
                  label Time in ms
                  el-input-number(v-model="image.time", :step="100")
              ControlButtons.control-music__op(:buttons="itemButtons", @button="onItemButton($event, image, 'image')")
        .control-music__frame.control-music__frame-ready
          .control-music__ready
            .control-music__ready-scroll
              .control-music__frame-title
                span Musics
                ControlButtons.control-music__frame-states(:buttons="loopButtons", :active="loopButtonsActiveMusic", @button="onLoopButtonMusic")
              .control-music__frame-item(v-for="music, mIndex in ready.music", :key="music.uuid")
                .control-music__pos
                  | {{ mIndex + 1 }}
                ControlIcon.control-music__attr(:icon="'type:' + music.type")
                .control-music__preview(v-if="music.type === 'video' && music.id")
                  img.control-music__preview-image(:src="'https://img.youtube.com/vi/' + music.id + '/default.jpg'")
                ControlButtons.control-music__frame-control(:buttons="readyButtons", @button="onReadyButton($event, music, 'music')", grid="1fr 1fr")
          .control-music__ready
            .control-music__ready-scroll
              .control-music__frame-title
                span Images
                ControlButtons.control-music__frame-states(:buttons="loopButtons", :active="loopButtonsActiveImage", @button="onLoopButtonImage")
              .control-music__frame-item(v-for="image, iIndex in ready.image", :key="image.uuid")
                .control-music__pos
                  | {{ iIndex + 1 }}
                ControlIcon.control-music__attr(:icon="'type:' + image.type")
                .control-music__preview(v-if="image.type === 'file' && image.src")
                  img.control-music__preview-image(:src="image.src")
                .control-music__props
                  | Time: {{ image.time }}
                  | UUID: {{ image.uuid }}
                ControlButtons.control-music__frame-control(:buttons="readyButtons", @button="onReadyButton($event, image, 'image')", grid="1fr 1fr")
    template(#dialog)
      .control-music__form
        el-input.control-music__form-summary(type="textarea", :value="pretty(dialog)", rows="15", @input="onDialogData")
        label.control-music__form-item
          .control-music__form-title Name
          el-input.control-music__form-input(v-model="dialog.name")
        .control-music__form-item
          .control-music__form-title Musics
          .control-music__form-collection(v-for="music in dialog.musics")
            label.control-music__form-item
              .control-music__form-title Type
              el-select.control-music__form-input(v-model="music.type")
                el-option(label="Video", value="video")
                el-option(label="File", value="file")
            label.control-music__form-item
              .control-music__form-title SRC
              el-input.control-music__form-input(v-model="music.src")
          ControlButtons.control-music__form-control(:buttons="formButtons", @button="onFormButton($event, 'musics')")
        label.control-music__form-item
          .control-music__form-title Images
          .control-music__form-collection(v-for="image in dialog.images")
            label.control-music__form-item
              .control-music__form-title Type
              el-select.control-music__form-input(v-model="image.type")
                el-option(label="File", value="file")
            label.control-music__form-item
              .control-music__form-title SRC
              el-input.control-music__form-input(v-model="image.src")
            label.control-music__form-item
              .control-music__form-title Time
              el-input.control-music__form-input(v-model="image.time")
          ControlButtons.control-music__form-control(:buttons="formButtons", @button="onFormButton($event, 'images')")
          
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
const scenes = require('~/static/ani/info/medias.json');

export default {
  data() {
    return {
      dialog: {
        name: '',
        musics: [],
        images: [],
      },
      controls: [
        { name: 'Stop', key: 'stop' },
        { name: 'Add', key: 'add' },
      ],
      buttons: [
        { name: 'Add', key: 'add', icon: { icon: 'add', size: '30px' }, iconPos: 'right' },
        { name: 'Play', key: 'play', icon: { icon: 'play', size: '30px' }, iconPos: 'right' },
        { name: 'Stop', key: 'stop', icon: { icon: 'stop', size: '30px' }, iconPos: 'right' },
      ],
      itemButtons: [
        { key: 'play', icon: { icon: 'play', size: '30px' } },
        { key: 'add', icon: { icon: 'add', size: '30px' } },
      ],
      readyButtons: [
        { key: 'play', icon: { icon: 'play' } },
        { key: 'down', icon: { icon: 'remove' } },
        { key: 'stop', icon: { icon: 'stop' } },
        { key: 'up', icon: { icon: 'add' } },
      ],
      loopButtons: [
        { key: 'loop', icon: { icon: 'loop' } },
        { key: 'mix', icon: { icon: 'mix' } },
      ],
      formButtons: [
        { key: 'add', icon: { icon: 'add' } },
      ],
      loopButtonsActiveMusic: [],
      loopButtonsActiveImage: [],
      active: null,
      ready: {
        music: [],
        image: [],
      },
      scenes: scenes,
    };
  },
  computed: {
    classes() {
      const classes = [];

      return classes;
    },
    orderMusics() {
      return this.ready.music.sort((a, b) => {
        a.order = a.order ?? 0;
        b.order = b.order ?? 0;
        return a.order - b.order;
      });
    },
  },
  methods: {
    onDialogData(value) {
      try {
        this.dialog = JSON.parse(value);
      } catch (e) {}
    },
    pretty(object) {
      const value = JSON.parse(JSON.stringify(object));
      const pretty = {
        name: value.name,
      };
      const musics = [];
      const images = [];

      for (const index in value.musics) {
        if (value.musics[index].type && value.musics[index].src) {
          musics.push(value.musics[index]);
        }
      }
      for (const index in value.images) {
        if (value.images[index].type && value.images[index].src) {
          images.push(value.images[index]);
        }
      }
      if (musics.length) pretty.musics = musics;
      if (images.length) pretty.images = images;
      return JSON.stringify(pretty, null, 2);
    },
    onControl(control) {
      if (control.key === 'add') {
        this.$refs.layout.doDialog('open');
      }
    },
    onItemButton(button, item, type) {
      switch (button.key) {
        case 'add':
          const clone = JSON.parse(JSON.stringify(item));

          clone.uuid = uuidv4();
          this.ready[type].push(clone);
          break;
      }
    },
    onReadyButton(button, item, type) {
      const index = this.ready[type].findIndex(v => v.uuid === item.uuid);

      switch (button.key) {
        case 'up': 
          if (index === 0) break;
          if (index !== this.ready[type].length - 1) {
            [this.ready[type][index + 1], this.ready[type][index]] = [this.ready[type][index], this.ready[type][index + 1]];
          }
          break;
        case 'down':
          if (index === 0) break;
          if (index !== 1) {
            [this.ready[type][index - 1], this.ready[type][index]] = [this.ready[type][index], this.ready[type][index - 1]];
          }
          break;
        case 'stop':
          this.ready[type].splice(index, 1);
          break;
      }
      this.$forceUpdate();
    },
    onLoopButtonMusic(button, index) {
      const i = this.loopButtonsActiveMusic.indexOf(index);

      if (i === -1) {
        this.loopButtonsActiveMusic.push(index);
      } else {
        this.loopButtonsActiveMusic.splice(i, 1);
      }
    },
    onLoopButtonImage(button, index) {
      const i = this.loopButtonsActiveImage.indexOf(index);

      if (i === -1) {
        this.loopButtonsActiveImage.push(index);
      } else {
        this.loopButtonsActiveImage.splice(i, 1);
      }
    },
    onFormButton(button, attr) {
      if (!Array.isArray(this.dialog[attr])) {
        this.dialog[attr] = [];
      }
      if (attr === 'musics') {
        this.dialog[attr].push({
          type: '',
          src: '',
        });
      } else {
        this.dialog[attr].push({
          type: 'file',
          src: '',
          time: 1000,
        });
      }
    },
  },
};
</script>

<style lang="sass">
.control-music

  &__wrapper
    display: grid
    grid-template-columns: 1fr 3fr 3fr
    height: 100%
    gap: 4px

  &__frame
    display: grid
    grid-auto-rows: min-content
    height: 100%
    background: white
    gap: 2px

  &__frame-wrapper
    display: grid
    grid-auto-rows: min-content
    gap: 2px

  &__item
    display: flex
    justify-content: space-between
    box-sizing: border-box
    padding: 1em
    background: #cbc0d3
    cursor: pointer

  &__frame-control
    font-weight: bold
    margin-left: auto

  &__frame-item
    display: flex
    justify-content: flex-start
    align-items: center
    box-sizing: border-box
    padding: 1em
    background: #cbc0d3
    gap: 1em

  &__item:hover
    background: #b1a7a6

  &__frame-title
    display: grid
    grid-template-columns: 1fr min-content
    padding: 1em 2em
    font-weight: bold 
    background: #d3d3d3
    justify-content: center
    text-align: center
    align-items: center

  &__frame-states
    flex-wrap: nowrap

  &__preview
    display: flex
    max-width: calc(400px / 3)
    max-height: 100px

  &__preview-image
    object-fit: contain
    width: 100%
    height: 100%

  &__attr
    font-size: 2em

  &__formitem
    display: flex
    flex-direction: column

  &__formitem label
    background: #8e9aaf

  &__op
    width: 100%
    justify-content: flex-end

  &__frame-ready
    display: grid
    grid-template-rows: 1fr 1fr
    gap: 2px

  &__ready
    position: relative

  &__ready-scroll
    display: grid
    grid-auto-rows: min-content
    gap: 2px
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    overflow: auto

  &__form-item
    display: block
    margin-bottom: 1em

  &__form-title
    margin-bottom: .5em
    font-weight: bold

  &__form-collection
    margin-left: 1em

  &__form-summary
    background: rgba(0, 0, 0, .2)
    padding: 1em

</style>