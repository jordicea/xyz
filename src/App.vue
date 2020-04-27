<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
body {
    margin:0
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items:center;
  color: #2c3e50;
  margin: 0 auto;
}

.home {
    width:380px;
}

.home h1 {
    margin-top: 1em;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
