// js/core/TerminalController.js
import { CommandProcessor } from './CommandProcessor.js';
import { AutoPresenter } from './AutoPresenter.js';

/**
 * Controls the terminal UI, command history, and DOM manipulations.
 */
export class TerminalController {
  constructor() {
    this.terminalElement = document.getElementById('terminal');
    this.outputElement = document.getElementById('output');
    this.inputElement = document.getElementById('command-input');
    this.cursorElement = document.getElementById('terminal-cursor');
    this.promptElement = document.getElementById('prompt');
    
    this.commandProcessor = new CommandProcessor();
    this.autoPresenter = new AutoPresenter(this);
    
    this.commandHistory = [];
    this.historyIndex = -1;
    this.isInputLocked = false;

    this.initializeEventListeners();
    this.printInitialGreeting();
  }

  initializeEventListeners() {
    this.terminalElement.addEventListener('click', () => {
      if (!this.isInputLocked) this.inputElement.focus();
    });

    this.inputElement.addEventListener('input', () => this.updateCursorPosition());
    this.inputElement.addEventListener('keyup', () => this.updateCursorPosition());

    this.inputElement.addEventListener('keydown', (event) => this.handleKeyboardInput(event));
  }

  printInitialGreeting() {
    this.inputElement.value = '';
    this.printLine('System initialized.', 'text-green');
    this.printLine('Type "help" for a list of commands or execute "./intro.sh" to begin presentation sequence.\n', 'text-foreground');
    this.updateCursorPosition();
  }

  handleKeyboardInput(event) {
    if (this.isInputLocked) {
      event.preventDefault();
      return;
    }

    if (event.key === 'Enter') {
      const commandText = this.inputElement.value.trim();
      
      if (commandText) {
        this.commandHistory.push(commandText);
        this.historyIndex = this.commandHistory.length;
      }
      
      this.executeCommand(commandText);
      this.clearInput();
      
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.inputElement.value = this.commandHistory[this.historyIndex];
        this.updateCursorPosition();
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
        this.inputElement.value = this.commandHistory[this.historyIndex];
        this.updateCursorPosition();
      } else {
        this.historyIndex = this.commandHistory.length;
        this.clearInput();
      }
    }
  }

executeCommand(commandText) {
    this.printPromptLine(commandText);

    if (commandText !== '') {
      const output = this.commandProcessor.process(commandText);
      
      if (output === 'CLEAR_SIGNAL') {
        this.outputElement.innerHTML = '';
      } else if (output === 'AUTO_PRESENTATION_SIGNAL') {
        this.autoPresenter.start(); 
      } else if (output) {
        this.printLine(output);
      }
    }
    
    this.scrollToBottom();
  }

  printPromptLine(commandText) {
    const lineElement = document.createElement('div');
    lineElement.className = 'output-line';
    
    const promptHTML = `
      <span class="prompt-string">
        <span class="prompt-user">khoa</span><span class="prompt-at">@</span><span class="prompt-host">portfolio</span><span class="prompt-colon">:</span><span class="prompt-path">~</span><span class="prompt-dollar">$</span>
      </span>
    `;
    
    lineElement.innerHTML = `${promptHTML} <span>${commandText}</span>`;
    this.outputElement.appendChild(lineElement);
  }

  printLine(text, className = '') {
    const lineElement = document.createElement('div');
    lineElement.className = `output-line ${className}`.trim();
    lineElement.innerHTML = text;
    this.outputElement.appendChild(lineElement);
  }

  updateCursorPosition() {
    const hiddenSpan = document.createElement('span');
    hiddenSpan.style.font = window.getComputedStyle(this.inputElement).font;
    hiddenSpan.style.visibility = 'hidden';
    hiddenSpan.style.whiteSpace = 'pre';
    hiddenSpan.textContent = this.inputElement.value.substring(0, this.inputElement.selectionStart);
    document.body.appendChild(hiddenSpan);
    
    const textWidth = hiddenSpan.getBoundingClientRect().width;
    document.body.removeChild(hiddenSpan);
    
    const promptWidth = this.promptElement.getBoundingClientRect().width;
    // 8px represents the margin-right on the prompt
    this.cursorElement.style.left = `${promptWidth + textWidth + 8}px`; 
  }

  clearInput() {
    this.inputElement.value = '';
    this.updateCursorPosition();
  }

  appendInput(character) {
    this.inputElement.value += character;
    this.updateCursorPosition();
  }

  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  lockInput() {
    this.isInputLocked = true;
    this.cursorElement.style.display = 'inline-block';
  }

  unlockInput() {
    this.isInputLocked = false;
    this.inputElement.focus();
  }
}