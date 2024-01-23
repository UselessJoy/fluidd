<template>
    <v-dialog @click:outside="closeDialog" v-model="open" eager :max-width="width" :persistent="persistent" @keydown.esc="sendStopShutdown">
      <v-card tile>
        <v-toolbar v-if="Boolean(title)" dark :color="color" dense flat>
          <v-icon v-if="Boolean(icon)" left>{{ icon }}</v-icon>
          <v-toolbar-title class="white--text" v-text="title"/>
        </v-toolbar>
        <v-card-text class="body-1 text-body-1 py-3" v-html="message"/>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            v-if="Boolean(buttonFalseText)"
            :color="buttonFalseColor"
            :text="buttonFalseFlat"
            @click="sendStopShutdown"
          >
            {{ buttonFalseText }}
          </v-btn>
          <v-btn
            v-if="Boolean(buttonTrueText)"
            :color="buttonTrueColor"
            :text="buttonTrueFlat"
            @click="sendShutdown"
          >
            {{ buttonTrueText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts">
  import { Component, VModel, Prop } from 'vue-property-decorator'
  import Vue from 'vue'
  import { VCard, VCardActions, VCardText, VDialog, VIcon, VToolbar, VToolbarTitle, VSpacer, VBtn } from 'vuetify/lib'
  import { SocketActions } from '@/api/socketActions'
  @Component({})
    export default class AutoCloseConfirm extends Vue {
      @VModel({ type: Boolean })
        open!: Boolean

      @Prop({ type: String, default: 'Yes' })
      readonly buttonTrueText!: String

      @Prop({ type: String, default: 'No' })
      readonly buttonFalseText!: String

      @Prop({ type: String, default: 'primary' })
      readonly buttonTrueColor!: String

      @Prop({ type: String, default: 'grey' })
      readonly buttonFalseColor!: String

      @Prop({ type: Boolean, default: true })
      readonly buttonFalseFlat!: Boolean

      @Prop({ type: Boolean, default: true })
      readonly buttonTrueFlat!: Boolean

      @Prop({ type: String, default: 'warning' })
      readonly color!: String

      @Prop({ type: String, default: '$error' })
      readonly icon!: String

      @Prop({ type: Number, default: 450 })
      readonly width!: Number

      @Prop({ type: String, default: 'warning' })
      readonly title!: String

      @Prop({type: Boolean, default: false})
      readonly persistent!: Boolean

      @Prop({ type: String, required: true })
      readonly message!: String

      sendStopShutdown() {
        SocketActions.offAutoOff()
      }

      sendShutdown() {
        SocketActions.machineShutdown()
      }

      closeDialog() {
        if (!this.persistent)
        {
          this.sendStopShutdown()
        }
        return;
      }


  }
  </script>

  <!-- <script>
  import { VCard, VCardActions, VCardText, VDialog, VIcon, VToolbar, VToolbarTitle, VSpacer, VBtn } from 'vuetify/lib'
  
  export default {
    data () {
      return {
        value: false
      }
    },
    mounted () {
      document.addEventListener('keyup', this.onEnterPressed)
      document.addEventListener('click', this.onAutoClose)
    },
    destroyed () {
      document.removeEventListener('keyup', this.onEnterPressed)
      document.removeEventListener('click', this.onEnterPressed)
    },
    methods: {
      onEnterPressed (e) {
        if (e.keyCode === 13) {
          e.stopPropagation()
          this.choose(true)
        }
      },
      choose (value) {
        this.$emit('result', value)
        this.value = value
        this.$destroy()
      },
      change (res) {
        this.$destroy()
      },
  
      onAutoClose (e) {
        e.stopPropagation()
        this.$destroy()
      }
    }
  }
  </script> -->