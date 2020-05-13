<template>
    <footer>
        <p>
            Click <a href="#" @click.prevent="disableTracking">here</a>,
            to disable the tracking through Google Analytics.
        </p>
    </footer>
</template>

<script style="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class GDPR extends Vue {
    disableTracking() {
        this.$ga.disable();
        console.log('Google analytics tracking disabled');
    }
}
</script>
