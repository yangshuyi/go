<script setup>

import {computed, inject, Text, ref, reactive, useSlots, watch, onMounted, provide} from 'vue';

import IndexAxiosUtils from "@/pages/index/index-axios-utils.js";

import GameUtils from "@/pages/index/game-utils.js";



</script>

<template>
  <div class="app with-min-height-full-screen">
    <div class="flex-1" style="display: flex;">
      <router-view class="main-ui-view flex-1"/>
    </div>
  </div>
</template>

<style src="./index.scss" lang="scss"></style>

