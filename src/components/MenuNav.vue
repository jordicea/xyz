<template>
  <div id="nav">
      <!-- <router-link to="/about">About</router-link> |-->
      <a href="https://github.com/jordicea" target="_blank">github</a> |
      <a href="https://twitter.com/jordicea" target="_blank">twitter</a>
  </div>
</template>

<script style="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class MenuNav extends Vue {}
</script>
