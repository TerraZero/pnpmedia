<template lang="pug">
  .page(@click='click')
    MediaStage(ref="stage")
</template>

<script>
export default {
  data() {
    return {
      index: 0,
      medias: [
        {
          url: 'https://youtu.be/cej2O-mem64',
        },
        {
          url: 'https://www.youtube.com/watch?v=KaXXVzGy7Y8',
        },
      ],
    };
  },
  computed: {
    stage() {
      return this.$refs.stage;
    },
  },
  methods: {
    async click() {
      this.stage.setImage({
        src: 'https://www.nature.com/immersive/d41586-021-00095-y/assets/3TP4N718ac/2021-01-xx_jan-iom_tree-of-life_sh-1080x1440.jpeg',
      });
      setTimeout(() => {
        this.stage.setImage({
          src: 'https://www.10wallpaper.com/wallpaper/1366x768/1304/Green_fields_Trail-Scenery_HD_desktop_wallpaper_1366x768.jpg',
        });
        this.stage.setMusic({
          url: 'https://youtu.be/cej2O-mem64',
        });
        setTimeout(() => {
          this.stage.setVideo({
            url: 'https://www.youtube.com/watch?v=KaXXVzGy7Y8',
          });
          setTimeout(() => {
            this.stage.setImage({
              src: 'https://www.10wallpaper.com/wallpaper/1366x768/1304/Green_fields_Trail-Scenery_HD_desktop_wallpaper_1366x768.jpg',
            }); 
            this.stage.setMusic({
              url: 'https://www.youtube.com/watch?v=KaXXVzGy7Y8',
            });
            setTimeout(() => {
              this.stage.setBlende(true);
              this.stage.stop();
            }, 3000);
          }, 5000);
        }, 3000);
      }, 1500);
    },
  },
}
</script>

<style lang="sass">
.page
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh

</style>