<template>
  <div class="snake-game" @click.stop>
    <div class="game-header">
      <p><span class="prompt">$</span> snake.sh --classic</p>
      <p class="game-info">
        Score: <strong>{{ score }}</strong> | High: <strong>{{ highScore }}</strong> |
        <span class="hint">Arrow keys / WASD | ESC to exit</span>
      </p>
    </div>
    <canvas
      ref="gameCanvas"
      :width="canvasWidth"
      :height="canvasHeight"
      class="game-canvas"
    ></canvas>
    <div v-if="gameOver" class="game-over">
      <p>GAME OVER</p>
      <p>Final Score: {{ score }}</p>
      <p class="hint">Press SPACE to restart or ESC to exit</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SnakeGame',
  data() {
    return {
      canvasWidth: 520,
      canvasHeight: 280,
      gridSize: 20,
      snake: [],
      food: {},
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      score: 0,
      highScore: 0,
      gameOver: false,
      gameLoop: null,
      speed: 150
    };
  },
  mounted() {
    this.loadHighScore();
    this.initGame();
    this.startGame();
    window.addEventListener('keydown', this.handleKeyPress);

    // Track Snake game start
    this.trackEvent('snake_game_started');
  },
  beforeUnmount() {
    this.stopGame();
    window.removeEventListener('keydown', this.handleKeyPress);
  },
  methods: {
    initGame() {
      const centerX = Math.floor(this.canvasWidth / this.gridSize / 2);
      const centerY = Math.floor(this.canvasHeight / this.gridSize / 2);

      this.snake = [
        { x: centerX, y: centerY },
        { x: centerX - 1, y: centerY },
        { x: centerX - 2, y: centerY }
      ];

      this.direction = 'RIGHT';
      this.nextDirection = 'RIGHT';
      this.score = 0;
      this.gameOver = false;
      this.generateFood();
    },

    generateFood() {
      const maxX = Math.floor(this.canvasWidth / this.gridSize);
      const maxY = Math.floor(this.canvasHeight / this.gridSize);

      let newFood;
      do {
        newFood = {
          x: Math.floor(Math.random() * maxX),
          y: Math.floor(Math.random() * maxY)
        };
      } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

      this.food = newFood;
    },

    startGame() {
      this.gameLoop = setInterval(() => {
        if (!this.gameOver) {
          this.update();
          this.draw();
        }
      }, this.speed);
    },

    stopGame() {
      if (this.gameLoop) {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
      }
    },

    update() {
      this.direction = this.nextDirection;

      const head = { ...this.snake[0] };

      switch (this.direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collision
      const maxX = Math.floor(this.canvasWidth / this.gridSize);
      const maxY = Math.floor(this.canvasHeight / this.gridSize);

      if (head.x < 0 || head.x >= maxX || head.y < 0 || head.y >= maxY) {
        this.endGame();
        return;
      }

      // Check self collision
      if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        this.endGame();
        return;
      }

      this.snake.unshift(head);

      // Check food collision
      if (head.x === this.food.x && head.y === this.food.y) {
        this.score += 10;
        this.generateFood();

        // Increase speed slightly
        if (this.score % 50 === 0 && this.speed > 50) {
          this.stopGame();
          this.speed -= 10;
          this.startGame();
        }
      } else {
        this.snake.pop();
      }
    },

    draw() {
      const canvas = this.$refs.gameCanvas;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');

      // Clear canvas
      ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--bg-color').trim();
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      // Draw grid (subtle)
      ctx.strokeStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--hr-color').trim();
      ctx.lineWidth = 0.5;

      for (let x = 0; x <= this.canvasWidth; x += this.gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.canvasHeight);
        ctx.stroke();
      }

      for (let y = 0; y <= this.canvasHeight; y += this.gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(this.canvasWidth, y);
        ctx.stroke();
      }

      // Draw snake
      const greenColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--link-color').trim();

      this.snake.forEach((segment, index) => {
        ctx.fillStyle = greenColor;
        ctx.globalAlpha = index === 0 ? 1 : 0.7; // Head is brighter
        ctx.fillRect(
          segment.x * this.gridSize + 1,
          segment.y * this.gridSize + 1,
          this.gridSize - 2,
          this.gridSize - 2
        );
      });

      ctx.globalAlpha = 1;

      // Draw food
      ctx.fillStyle = greenColor;
      ctx.beginPath();
      ctx.arc(
        this.food.x * this.gridSize + this.gridSize / 2,
        this.food.y * this.gridSize + this.gridSize / 2,
        this.gridSize / 3,
        0,
        Math.PI * 2
      );
      ctx.fill();
    },

    handleKeyPress(e) {
      // ESC to exit
      if (e.key === 'Escape') {
        this.$emit('close');
        return;
      }

      // SPACE to restart
      if (e.key === ' ' && this.gameOver) {
        e.preventDefault();
        this.initGame();
        return;
      }

      // Direction controls
      const key = e.key.toLowerCase();

      if ((key === 'arrowup' || key === 'w') && this.direction !== 'DOWN') {
        this.nextDirection = 'UP';
        e.preventDefault();
      } else if ((key === 'arrowdown' || key === 's') && this.direction !== 'UP') {
        this.nextDirection = 'DOWN';
        e.preventDefault();
      } else if ((key === 'arrowleft' || key === 'a') && this.direction !== 'RIGHT') {
        this.nextDirection = 'LEFT';
        e.preventDefault();
      } else if ((key === 'arrowright' || key === 'd') && this.direction !== 'LEFT') {
        this.nextDirection = 'RIGHT';
        e.preventDefault();
      }
    },

    endGame() {
      this.gameOver = true;

      if (this.score > this.highScore) {
        this.highScore = this.score;
        this.saveHighScore();
        // Track new high score
        this.trackEvent('snake_new_high_score', { score: this.score });
      }

      // Track game over
      this.trackEvent('snake_game_over', { score: this.score });
    },

    loadHighScore() {
      const saved = localStorage.getItem('snake-high-score');
      this.highScore = saved ? parseInt(saved) : 0;
    },

    saveHighScore() {
      localStorage.setItem('snake-high-score', this.highScore.toString());
    },

    trackEvent(eventName, params = {}) {
      // Track event in GA4 if available and user has consented
      if (window.gtag && localStorage.getItem('cookie-consent') === 'accepted') {
        window.gtag('event', eventName, params);
      }
    }
  }
};
</script>

<style scoped>
.snake-game {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  padding: 1em;
  text-align: left;
}

.game-header {
  margin-bottom: 1em;
}

.game-header p {
  margin: 0.3em 0;
}

.game-info {
  opacity: 0.8;
}

.game-info strong {
  color: var(--link-color);
}

.hint {
  opacity: 0.6;
  font-size: 12px;
}

.game-canvas {
  border: 1px solid var(--hr-color);
  display: block;
  cursor: crosshair;
}

.game-over {
  margin-top: 1em;
  text-align: center;
  padding: 1em;
  border: 1px solid var(--link-color);
  background: var(--bg-color);
}

.game-over p {
  margin: 0.5em 0;
}

.game-over p:first-child {
  font-size: 1.5em;
  font-weight: bold;
  color: var(--link-color);
}
</style>
