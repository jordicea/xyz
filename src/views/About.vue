<template>
<div>
  <div class="about">
    <h1>This is Jordi Cea</h1>
    <h2>Backend software engineer</h2>
    <ul>
      <li>PHP</li>
      <li>NodeJS: express, nestjs, fastify</li>
      <li>Databases: MySQL, PostgreSQL, MongoDB, Redis</li>
      <li>Event sourcing and queues: RabbitMQ, Kafka</li>
      <li>Docker and Kubernetes</li>
    </ul>
  </div>
  <MenuNav></MenuNav>
</div>
</template>

<script>
// @ is an alias to /src
import MenuNav from '@/components/MenuNav.vue';

export default {
  name: 'Home',
  title: 'Jordi Cea, software engineer',
  components: {
    MenuNav,
  },
};
</script>

<style>
ul li {
  text-align: left;
}

</style>
