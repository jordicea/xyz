<template>
    <section>
        <header>
            <div class="home">
                <div class="terminal-header">
                    <span class="prompt">$</span> whoami
                </div>
                <h1 class="typing-effect">{{ displayedName }}<span v-if="showCursor" class="cursor">_</span></h1>
                <div class="terminal-output">
                    <p v-if="showLine1"><span class="prompt">$</span> cat about.txt</p>
                    <p v-if="showLine2" class="output-text">
                        <strong>senior software engineer</strong> @ urban sports club<br/>
                        location: barcelona → amsterdam
                    </p>
                    <p v-if="showLine3"><span class="prompt">$</span> git log --graph --oneline</p>
                    <div v-if="!playingSnake">
                        <div v-if="showGrid" class="activity-grid" @click="startSnake" title="Click to play Snake!">
                            <div v-for="(cell, index) in activityCells" :key="index"
                                 class="activity-cell"
                                 :style="{ opacity: cell }"></div>
                        </div>
                        <p v-if="showLegend" class="activity-legend terminal-line" @click="openTerminal" title="Click to open interactive terminal">
                            <span class="cursor-blink">█</span> {{ contributionCount }} contributions in the last year
                            <span class="play-hint">← click for CLI</span>
                        </p>
                    </div>
                    <SnakeGame v-else @close="closeSnake" />
                </div>
            </div>
            <menuNav></menuNav>
            <hr/>
        </header>
        <CookieConsent></CookieConsent>
        <InteractiveTerminal v-if="showInteractiveTerminal" @close="closeTerminal" />
    </section>
</template>

<script>
// @ is an alias to /src
import MenuNav from '@/components/MenuNav.vue';
import CookieConsent from '@/components/CookieConsent.vue';
import SnakeGame from '@/components/SnakeGame.vue';
import InteractiveTerminal from '@/components/InteractiveTerminal.vue';

export default {
    name: 'Home',
    title: 'Jordi Cea, software engineer',
    components: {
        MenuNav,
        CookieConsent,
        SnakeGame,
        InteractiveTerminal
    },
    data() {
        return {
            activityCells: [],
            fullName: 'jordi-cea',
            displayedName: '',
            showCursor: true,
            showLine1: false,
            showLine2: false,
            showLine3: false,
            showGrid: false,
            showLegend: false,
            contributionCount: '0',
            playingSnake: false,
            showInteractiveTerminal: false
        };
    },
    mounted() {
        this.typeWriterEffect();
    },
    methods: {
        typeWriterEffect() {
            let charIndex = 0;
            const typingSpeed = 100;

            const typeChar = () => {
                if (charIndex < this.fullName.length) {
                    this.displayedName += this.fullName.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeChar, typingSpeed);
                } else {
                    this.showCursor = false;
                    setTimeout(() => {
                        this.showLine1 = true;
                        setTimeout(() => {
                            this.showLine2 = true;
                            setTimeout(() => {
                                this.showLine3 = true;
                                this.generateActivityGrid();
                                setTimeout(() => {
                                    this.showGrid = true;
                                    this.animateContributions();
                                    setTimeout(() => {
                                        this.showLegend = true;
                                    }, 300);
                                }, 300);
                            }, 400);
                        }, 300);
                    }, 500);
                }
            };

            typeChar();
        },
        generateActivityGrid() {
            const totalCells = 364;
            const cells = [];

            // Generate activity levels: 0.3 (light), 0.5, 0.7, 1.0 (darkest)
            for (let i = 0; i < totalCells; i++) {
                const rand = Math.random();
                let opacity;

                // Distribute across 4 levels of green
                if (rand < 0.25) {
                    opacity = 0.3; // Lightest green (few commits)
                } else if (rand < 0.50) {
                    opacity = 0.5; // Light-medium green
                } else if (rand < 0.75) {
                    opacity = 0.7; // Medium-dark green
                } else {
                    opacity = 1.0; // Darkest green (most commits)
                }

                cells.push(opacity);
            }

            this.activityCells = cells;
        },
        animateContributions() {
            // Generate a realistic-looking large number (1.2M - 1.5M range)
            const target = Math.floor(Math.random() * 300000) + 1200000; // 1.2M - 1.5M
            const duration = 1500;
            const steps = 40;
            const increment = target / steps;
            let current = 0;
            let step = 0;

            const animate = () => {
                if (step < steps) {
                    current += increment;
                    this.contributionCount = this.formatNumber(Math.floor(current));
                    step++;
                    setTimeout(animate, duration / steps);
                } else {
                    this.contributionCount = this.formatNumber(target);
                }
            };

            animate();
        },
        formatNumber(num) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            } else if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
            }
            return num.toString();
        },
        startSnake() {
            this.playingSnake = true;
        },
        closeSnake() {
            this.playingSnake = false;
        },
        openTerminal() {
            this.showInteractiveTerminal = true;
        },
        closeTerminal() {
            this.showInteractiveTerminal = false;
        }
    }
};
</script>

<style>
header {
    padding: 5em 0;
}

hr {
    background-color: var(--hr-color);
    height: 1px;
    border: 0;
}

.terminal-header {
    font-family: 'Courier New', monospace;
    font-size: 14px;
    margin-bottom: 0.5em;
    opacity: 0.7;
}

.prompt {
    color: var(--link-color);
    margin-right: 0.5em;
}

h1 {
    font-family: 'Courier New', monospace;
    font-size: 2.5em;
    font-weight: bold;
    margin: 0.2em 0 1em 0;
    letter-spacing: -1px;
    min-height: 1.2em;
}

.cursor {
    animation: blink 1s step-end infinite;
    margin-left: 2px;
}

.terminal-output {
    font-family: 'Courier New', monospace;
    font-size: 14px;
    text-align: left;
    max-width: 500px;
    margin: 0 auto;
}

.terminal-output p {
    margin: 0.5em 0;
}

.output-text {
    margin-left: 1.5em;
    line-height: 1.8;
    opacity: 0.9;
}

.activity-grid {
    display: grid;
    grid-template-columns: repeat(52, 8px);
    grid-template-rows: repeat(7, 8px);
    gap: 3px;
    margin: 1em 0 1em 1.5em;
    width: fit-content;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.activity-grid:hover {
    transform: scale(1.02);
}

.activity-cell {
    width: 8px;
    height: 8px;
    background-color: var(--link-color);
    border-radius: 2px;
}

.activity-legend {
    margin-left: 1.5em;
    font-size: 12px;
    opacity: 0.7;
}

.terminal-line {
    cursor: pointer;
    transition: opacity 0.2s ease;
    user-select: none;
}

.terminal-line:hover {
    opacity: 1 !important;
}

.terminal-line:hover .play-hint {
    opacity: 0.8 !important;
}

.play-hint {
    margin-left: 1em;
    opacity: 0.5;
    font-size: 11px;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.7; }
}

.cursor-blink {
    animation: blink 1s step-end infinite;
}

@keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
}

a {
    color: var(--link-color);
    transition: all 0.2s ease;
    text-decoration: none;
    border-bottom: 1px solid transparent;
}

a:hover {
    border-bottom: 1px solid var(--link-color);
}

</style>
