// js/main.js
import { TerminalController } from './core/TerminalController.js';

document.addEventListener('DOMContentLoaded', () => {
  // Instantiate the main controller, which wires up the DOM and logical processors.
  new TerminalController();
});