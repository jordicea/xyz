<template>
  <div class="interactive-terminal" @click.stop>
    <div class="terminal-window">
      <div class="terminal-header-bar">
        <span class="terminal-title">jordi@cea:~$</span>
        <button @click="closeTerminal" class="close-btn">[ x ]</button>
      </div>
      <div class="terminal-content" ref="terminalContent">
        <div class="terminal-welcome">
          <p>Welcome to Jordi's Interactive Terminal</p>
          <p>Type 'help' for available commands</p>
          <p class="divider">─────────────────────────────────────────</p>
        </div>
        <div v-for="(line, index) in history" :key="index" class="history-line">
          <div v-if="line.type === 'command'" class="command-line">
            <span class="prompt">$</span> {{ line.text }}
          </div>
          <div v-else-if="line.type === 'output'" class="output-line" v-html="line.text"></div>
          <div v-else-if="line.type === 'error'" class="error-line">{{ line.text }}</div>
        </div>
        <div class="input-line">
          <span class="prompt">$</span>
          <input
            ref="terminalInput"
            v-model="currentInput"
            @keydown.enter="executeCommand"
            @keydown.up="navigateHistory('up')"
            @keydown.down="navigateHistory('down')"
            @keydown.tab.prevent="autocomplete"
            type="text"
            class="terminal-input"
            autofocus
            spellcheck="false"
          />
          <span class="input-cursor">_</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InteractiveTerminal',
  data() {
    return {
      currentInput: '',
      history: [],
      commandHistory: [],
      historyIndex: -1,
      commands: {
        help: {
          desc: 'Show available commands',
          execute: () => {
            return `Available commands:
  <span class="cmd">help</span>      - Show this help message
  <span class="cmd">about</span>     - Learn more about me
  <span class="cmd">skills</span>    - View my technical skills
  <span class="cmd">contact</span>   - Get in touch
  <span class="cmd">joke</span>      - Random developer joke
  <span class="cmd">coffee</span>    - Brew some coffee ☕
  <span class="cmd">clear</span>     - Clear terminal
  <span class="cmd">exit</span>      - Close terminal

Type any command to get started!`;
          }
        },
        about: {
          desc: 'Learn more about me',
          execute: () => {
            return `<strong>Jordi Cea</strong> - Senior Software Engineer

Currently building awesome things at <span class="highlight">Urban Sports Club</span>
Based in Amsterdam, originally from Barcelona

I love working with:
  • Backend systems and APIs
  • Cloud infrastructure (GCP)
  • Building scalable solutions
  • Terminal applications (obviously 😄)

When I'm not coding, you can find me exploring Amsterdam
or pretending I'm good at Snake.`;
          }
        },
        skills: {
          desc: 'View my technical skills',
          execute: () => {
            return `<strong>Technical Stack</strong>

<span class="category">Languages:</span>
  • Golang
  • Python
  • PHP
  • JavaScript/Node.js

<span class="category">Databases:</span>
  • PostgreSQL
  • MySQL
  • MongoDB
  • Redis

<span class="category">Cloud & Infrastructure:</span>
  • Google Cloud Platform (GCP)
  • Amazon Web Services (AWS)
  • Docker
  • Kubernetes

<span class="category">Message Queues & Streaming:</span>
  • RabbitMQ
  • Kafka
  • Google Cloud Pub/Sub

<span class="category">APIs & Communication:</span>
  • REST
  • gRPC
  • GraphQL`;
          }
        },
        contact: {
          desc: 'Get in touch',
          execute: () => {
            return `<strong>Let's Connect!</strong>

<span class="category">Email:</span>    hello at jordicea dot xyz
<span class="category">GitHub:</span>   <a href="https://github.com/jordicea" target="_blank">github.com/jordicea</a>
<span class="category">LinkedIn:</span> <a href="https://www.linkedin.com/in/jordicea" target="_blank">linkedin.com/in/jordicea</a>

Feel free to reach out for:
  • Collaboration opportunities
  • Tech discussions
  • Coffee chats (virtual or in Amsterdam)
  • Snake game tips 🐍`;
          }
        },
        joke: {
          desc: 'Random developer joke',
          execute: () => {
            const jokes = [
              "Why do programmers prefer dark mode?\nBecause light attracts bugs. 🐛",
              "A SQL query walks into a bar, walks up to two tables and asks...\n'Can I JOIN you?'",
              "Why do Java developers wear glasses?\nBecause they can't C#",
              "How many programmers does it take to change a light bulb?\nNone. It's a hardware problem.",
              "!false\n(It's funny because it's true)",
              "Programmer: A machine that turns coffee into code.\nDebugging: The art of removing the bugs you didn't know you created.",
              "There are 10 types of people in this world:\nThose who understand binary, and those who don't.",
              "99 bugs in the code, 99 bugs in the code.\nTake one down, patch it around...\n127 bugs in the code.",
              "Why do programmers always mix up Halloween and Christmas?\nBecause Oct 31 == Dec 25",
              "A programmer's wife tells him: 'Go to the store and buy a loaf of bread.\nIf they have eggs, buy a dozen.'\nHe comes back with 12 loaves of bread.",
              "What's the object-oriented way to become wealthy?\nInheritance.",
              "Why did the developer go broke?\nBecause he used up all his cache.",
              "A programmer is told to 'go to hell'.\nHe finds the worst part is that everything is written in Java.",
              "How do you comfort a JavaScript bug?\nYou console it.",
              "Why do Python programmers prefer snakes?\nBecause they're easy to indent-ify.",
              "I would tell you a UDP joke, but you might not get it.",
              "A SEO expert walks into a bar, bars, pub, tavern, public house, Irish pub, drinks, beer, alcohol...",
              "Why did the database administrator leave his wife?\nShe had one-to-many relationships.",
              "What's a programmer's favorite hangout place?\nFoo Bar.",
              "Why are Assembly programmers always soaking wet?\nThey work below C-level.",
              "Debugging: Being a detective in a crime movie where you are also the murderer.",
              "I've got a really good UDP joke to tell you but I don't know if you'll get it.",
              "To understand what recursion is, you must first understand recursion.",
              "There are two hard things in computer science:\nCache invalidation, naming things, and off-by-one errors."
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
          }
        },
        coffee: {
          desc: 'Brew some coffee',
          execute: () => {
            return `☕ Brewing coffee...
░░░░░░░░░░░ 0%
████░░░░░░░ 30%
████████░░░ 70%
███████████ 100%

Your coffee is ready! ☕
<em>You look like you needed that.</em>`;
          }
        },
        clear: {
          desc: 'Clear terminal',
          execute: () => {
            this.history = [];
            return null;
          }
        },
        exit: {
          desc: 'Close terminal',
          execute: () => {
            this.$emit('close');
            return null;
          }
        }
      }
    };
  },
  mounted() {
    this.$refs.terminalInput.focus();

    // Track terminal opened
    this.trackEvent('terminal_opened');
  },
  methods: {
    executeCommand() {
      const input = this.currentInput.trim();

      if (!input) return;

      // Add to command history
      this.commandHistory.push(input);
      this.historyIndex = this.commandHistory.length;

      // Add command to display history
      this.history.push({
        type: 'command',
        text: input
      });

      // Parse and execute command
      const [cmd, ...args] = input.toLowerCase().split(' ');

      if (this.commands[cmd]) {
        const output = this.commands[cmd].execute(args);
        if (output !== null) {
          this.history.push({
            type: 'output',
            text: output
          });
        }

        // Track command usage
        this.trackEvent('terminal_command', { command: cmd });
      } else {
        this.history.push({
          type: 'error',
          text: `Command not found: ${cmd}. Type 'help' for available commands.`
        });
      }

      // Clear input
      this.currentInput = '';

      // Scroll to bottom
      this.$nextTick(() => {
        const content = this.$refs.terminalContent;
        content.scrollTop = content.scrollHeight;
      });
    },

    navigateHistory(direction) {
      if (direction === 'up') {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.currentInput = this.commandHistory[this.historyIndex];
        }
      } else if (direction === 'down') {
        if (this.historyIndex < this.commandHistory.length - 1) {
          this.historyIndex++;
          this.currentInput = this.commandHistory[this.historyIndex];
        } else {
          this.historyIndex = this.commandHistory.length;
          this.currentInput = '';
        }
      }
    },

    autocomplete() {
      const input = this.currentInput.toLowerCase();
      if (!input) return;

      const matches = Object.keys(this.commands).filter(cmd =>
        cmd.startsWith(input)
      );

      if (matches.length === 1) {
        this.currentInput = matches[0];
      } else if (matches.length > 1) {
        this.history.push({
          type: 'output',
          text: matches.map(cmd => `  ${cmd}`).join('\n')
        });
        this.$nextTick(() => {
          const content = this.$refs.terminalContent;
          content.scrollTop = content.scrollHeight;
        });
      }
    },

    closeTerminal() {
      this.$emit('close');
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
.interactive-terminal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 2em;
}

.terminal-window {
  background: var(--bg-color);
  border: 2px solid var(--link-color);
  border-radius: 4px;
  width: 100%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 50px rgba(26, 188, 156, 0.3);
}

.terminal-header-bar {
  background: var(--link-color);
  color: var(--bg-color);
  padding: 0.5em 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.close-btn {
  background: transparent;
  border: 1px solid var(--bg-color);
  color: var(--bg-color);
  font-family: 'Courier New', monospace;
  padding: 0.2em 0.5em;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--bg-color);
  color: var(--link-color);
}

.terminal-content {
  padding: 1.5em;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  overflow-y: auto;
  flex: 1;
  line-height: 1.6;
  text-align: left;
}

.terminal-welcome {
  margin-bottom: 1.5em;
  color: var(--link-color);
}

.terminal-welcome .divider {
  opacity: 0.3;
  margin: 0.5em 0;
}

.history-line {
  margin-bottom: 0.5em;
}

.command-line {
  color: var(--text-color);
  margin-bottom: 0.3em;
}

.output-line {
  color: var(--text-color);
  margin-left: 1.5em;
  white-space: pre-wrap;
  opacity: 0.9;
  margin-bottom: 1em;
}

.error-line {
  color: #e74c3c;
  margin-left: 1.5em;
  margin-bottom: 1em;
}

.input-line {
  display: flex;
  align-items: center;
  margin-top: 1em;
}

.prompt {
  color: var(--link-color);
  margin-right: 0.5em;
  font-weight: bold;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-color);
  font-family: 'Courier New', monospace;
  font-size: 14px;
  outline: none;
}

.input-cursor {
  animation: blink 1s step-end infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Styled output elements */
.output-line :deep(.cmd) {
  color: var(--link-color);
  font-weight: bold;
}

.output-line :deep(.highlight) {
  color: var(--link-color);
}

.output-line :deep(.category) {
  color: var(--link-color);
  font-weight: bold;
}

.output-line :deep(strong) {
  color: var(--link-color);
  font-size: 1.1em;
}

.output-line :deep(em) {
  opacity: 0.7;
  font-style: italic;
}

.output-line :deep(a) {
  color: var(--link-color);
  text-decoration: underline;
}

.output-line :deep(a:hover) {
  opacity: 0.8;
}

/* Scrollbar styling */
.terminal-content::-webkit-scrollbar {
  width: 8px;
}

.terminal-content::-webkit-scrollbar-track {
  background: var(--bg-color);
}

.terminal-content::-webkit-scrollbar-thumb {
  background: var(--link-color);
  border-radius: 4px;
}

.terminal-content::-webkit-scrollbar-thumb:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .interactive-terminal {
    padding: 0;
  }

  .terminal-window {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
}
</style>
