<template lang="pug">
  .page-admin
    FormRef(:schema="schema", v-model="model")
    pre {{ model }}
</template>

<script>
export default {
  data() {
    return {
      model: {},
    };
  },
  computed: {
    schema() {
      return {
        type: "object",
        properties: {
          field: { type: 'string',  title: 'Field', default: 'Hallo' },
          reference: { $ref: '#/$defs/reference' },
        },
        $defs: {
          reference: { 
            type: 'object',
            properties: {
              reffield: { type: 'string' },
            },
            if: {
              properties: {
                reffield: {const: 'ok'},
              }
            },
            then: {
              properties: {
                deepref: { $ref: '#/$defs/reference' }
              }
            }
          },
        },
      };
    }
  },
};
</script>

<style lang="sass">
body
  margin: 0
  background: #27293d
  font-family: 'Open Sans', sans-serif

.page-admin
  width: 100vw
  height: 100vh
  overflow: auto
  
</style>