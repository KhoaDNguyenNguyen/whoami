// js/main.js
import { TerminalController } from './core/TerminalController.js';

document.addEventListener('DOMContentLoaded', () => {
  // create the main controller, which wires up the DOM and logical processors.
  new TerminalController();
});