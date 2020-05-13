<template>
    <section>
        <header>
            <div class="home">
                <h1>Jordi Cea</h1>
                <h2>
                    Software engineer. <br/>Born in
                    <a href="https://ca.wikipedia.org/wiki/Granollers" rel="nofollow" target="_blank">Granollers</a> (Barcelona), currently based in
                    <a href="https://ca.wikipedia.org/wiki/Amsterdam" rel="nofollow" target="_blank">Amsterdam</a>.
                </h2>
            </div>
            <menuNav></menuNav>
            <hr/>
        </header>
        <GDPR></GDPR>
    </section>
</template>

<script>
// @ is an alias to /src
import MenuNav from '@/components/MenuNav.vue';
import GDPR from '@/components/GDPR.vue';

export default {
    name: 'Home',
    title: 'Jordi Cea, software engineer',
    components: {
        MenuNav,
        GDPR
    },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;800&display=swap');

header {
    padding: 5em 0;
}

hr {
    background-color: #e5e5e5;
    height: 1px;
    border: 0;
}

h1, h2, h3 {
    font-family:'Montserrat', sans-serif;
}

h1 {
    font-size: 3em;
}

h2 {
    font-size: 1.5em;
    line-height: 1.5em;
    font-weight: 300;
}

a {
    color:#1abc9c;
    transition: text-decoration 1s ease;
    text-decoration: underline solid transparent;
}

a:hover {
    text-decoration: underline solid currentColor;
}

</style>
