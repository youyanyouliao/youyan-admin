<template>
  <div id="app">
    <Layout />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Layout from "./view/Layout/Layout";
export default {
  name: "app",
  components: {
    Layout
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
