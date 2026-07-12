export class AutoPresenter {
  constructor(terminalController) {
    this.terminalController = terminalController;
    
    this.sequence = [
      'clear',
      'pwd',
      'tree',
      'cat about/profile.txt',
      'cat about/now.txt',  
      'cd research',
      'ls',
      'cat current_focus.txt',
      'cat lab_notes/weak_signal_recovery.md',
      'cat lab_notes/legacy_code.md', 
      'cd ../reading',
      'ls',
      'cat current.txt',
      'cd ../vson',
      'cat why_vson.txt',
      'cd ~',
      'clear'
    ];
    
    this.currentStep = 0;
    this.isActive = false;
    this.isAnimating = false;

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;
    this.currentStep = 0;
    
    this.terminalController.commandProcessor.currentPath = [];
    this.terminalController.updatePromptUI();
    this.terminalController.lockInput();
    
    this.terminalController.printLine('');
    this.terminalController.printLine('--- PRESENTER MODE ---', 'text-magenta');
    this.terminalController.printLine('[SPACE] / [Right Arrow] : Next', 'text-foreground');
    this.terminalController.printLine('[Left Arrow]            : Back', 'text-foreground');
    this.terminalController.printLine('[Q] / [Escape]          : Exit', 'text-foreground');
    this.terminalController.printLine('----------------------', 'text-magenta');
    this.terminalController.scrollToBottom();

    document.addEventListener('keydown', this.handleKeyDown);
  }

  stop() {
    this.isActive = false;
    document.removeEventListener('keydown', this.handleKeyDown);
    this.terminalController.unlockInput();
    this.terminalController.printLine('\n--- PRESENTER MODE ENDED ---', 'text-magenta');
    this.terminalController.scrollToBottom();
  }

  async handleKeyDown(event) {
    if (!this.isActive || this.isAnimating) return;

    if (['ArrowRight', ' ', 'Enter'].includes(event.key)) {
      event.preventDefault();
      await this.advance();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.goBack();
    } else if (['q', 'Q', 'Escape'].includes(event.key)) {
      event.preventDefault();
      this.stop();
    }
  }

  async advance() {
    if (this.currentStep >= this.sequence.length) {
      this.stop();
      return;
    }

    this.isAnimating = true;
    const command = this.sequence[this.currentStep];
    this.terminalController.clearInput();

    await new Promise(resolve => setTimeout(resolve, 200));
    await this.simulateTyping(command);
    await new Promise(resolve => setTimeout(resolve, 200));

    this.terminalController.executeCommand(command);
    this.terminalController.clearInput();
    
    this.currentStep++;
    this.isAnimating = false;
  }

  goBack() {
    if (this.currentStep <= 0) return;
    
    this.currentStep--;
    

    this.terminalController.outputElement.innerHTML = '';
    this.terminalController.commandProcessor.currentPath = [];
    this.terminalController.updatePromptUI();
    
    for (let i = 0; i < this.currentStep; i++) {
      this.terminalController.executeCommand(this.sequence[i]);
    }
  }

  async simulateTyping(text) {
    for (let i = 0; i < text.length; i++) {
      this.terminalController.appendInput(text.charAt(i));
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 60));
    }
  }
}