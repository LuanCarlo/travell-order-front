<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <notifications 
      position="top right"  
      classes="my-notification-style" 
      group="app-alerts"
      :duration="4000"
    />
    <router-view/>
  </div>
</template>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
.vue-notification {
  padding: 15px;
  margin: 0 5px 5px;
  font-size: 14px;
  color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.vue-notification.success {
  background: #4CAF50; /* Verde */
  border-left: 5px solid #388E3C;
}

.vue-notification.error {
  background: #F44336; /* Vermelho */
  border-left: 5px solid #D32F2F;
}

.vue-notification.info {
  background: #2196F3; /* Azul */
  border-left: 5px solid #1976D2;
}


.notifications {
    z-index: 9999;
}
</style>
