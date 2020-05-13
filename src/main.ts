import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import titleMixin from './mixins/titleMixin';
import VueAnalytics from 'vue-analytics';

Vue.config.productionTip = false;
Vue.mixin(titleMixin);

Vue.use(VueAnalytics, {
    id: 'UA-166540826-1',
    router
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
