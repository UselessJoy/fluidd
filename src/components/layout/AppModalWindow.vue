<template>
  <div class="disable-all">
    <v-card class="modal v-dialog">
      <v-card-text class="text-center">
        <span class="text-h5">Смена режима Wifi </span>
        <br>
        <span class="text-h5">Система будет перезагружена...</span>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
@Component({})
export default class AppModalWindow extends Vue{
}
</script>

<style scoped lang="scss">

    .modal {
      border-radius: 8px;
      min-height: 100px;
      max-height: 200px;
      min-width: 450px;
      max-width: 500px;
    }
    .disable-all {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      z-index: 100;
      background-color: #00000080;
    }
</style>
