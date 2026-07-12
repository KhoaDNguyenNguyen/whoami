// js/core/CommandProcessor.js
import { VirtualFileSystem } from '../data/FileSystem.js';

/**
 * CommandProcessor evaluates user input and returns the appropriate string or HTML output.
 */
export class CommandProcessor {
  constructor() {
    this.fileSystem = VirtualFileSystem;
  }

  process(rawCommand) {
    const argumentsArray = rawCommand.trim().split(' ').filter(Boolean);
    if (argumentsArray.length === 0) return '';

    const baseCommand = argumentsArray[0].toLowerCase();
    const parameters = argumentsArray.slice(1);

    switch (baseCommand) {
      case 'help':
        return this.executeHelp();
      case 'whoami':
        return 'Dang-Khoa N. Nguyen\n\nElectronics Engineering student.\nInterested in physics, computation, and embedded systems.';
      case 'neofetch':
        return this.executeNeofetch();
      case 'now':
        return this.executeNow();
      case 'contact':
        return this.executeContact();
      case 'ls':
        return this.executeList(parameters);
      case 'cat':
        return this.executeConcatenate(parameters);
      case 'echo':
        return this.executeEcho(parameters);
      case 'clear':
        return 'CLEAR_SIGNAL';
      case './intro.sh':
      case 'bash intro.sh':
        return 'AUTO_PRESENTATION_SIGNAL';
      default:
        return `<span class="text-red">zsh: command not found: ${baseCommand}</span>`;
    }
  }

  executeEcho(parameters) {
    let text = parameters.join(' ');
    if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
      text = text.slice(1, -1);
    }
    return text;
  }

  executeHelp() {
    return [
      'Available commands:',
      '  whoami     - Print identity',
      '  now        - What am I doing right now?',
      '  neofetch   - Display system information',
      '  ls         - List directory contents',
      '  cat        - Print file content',
      '  contact    - Display contact information',
      '  echo       - Print text',
      '  clear      - Clear the terminal screen',
      '  <span class="text-green">./intro.sh</span> - Enter presentation mode'
    ].join('\n');
  }

  executeNow() {
    return [
      'Currently',
      '',
      '• VSOP 2026 participant',
      '• Undergraduate researcher',
      '• Building a data system for thermoelectric materials'
    ].join('\n');
  }

  executeContact() {
    return [
      'Email:          <a href="mailto:khoadnguyennguyen@gmail.com">khoadnguyennguyen@gmail.com</a>',
      'GitHub:         <a href="https://github.com" target="_blank">github.com/dangkhoa</a>',
      'Google Scholar: <a href="#" target="_blank">scholar.google.com</a>',
      'CV:             <a href="#" target="_blank">dangkhoa.github.io/cv.pdf</a>'
    ].join('\n');
  }

  executeList(parameters) {
    if (parameters.length === 0) {
      return Object.keys(this.fileSystem).map(key => {
        if (typeof this.fileSystem[key] === 'object') return `<span class="text-blue">${key}/</span>`;
        if (key.endsWith('.sh')) return `<span class="text-green">${key}</span>`;
        return key;
      }).join('  ');
    }

    const targetDirectory = parameters[0].replace(/\/$/, '');
    if (this.fileSystem[targetDirectory] && typeof this.fileSystem[targetDirectory] === 'object') {
      return Object.keys(this.fileSystem[targetDirectory]).map(key => key).join('  ');
    }

    return `<span class="text-red">ls: cannot access '${parameters[0]}': No such file or directory</span>`;
  }

  executeConcatenate(parameters) {
    if (parameters.length === 0) {
      return '<span class="text-red">cat: missing operand</span>';
    }

    const targetPath = parameters[0];
    
    if (this.fileSystem[targetPath]) {
      if (typeof this.fileSystem[targetPath] === 'string') {
        return this.fileSystem[targetPath];
      }
      return `<span class="text-red">cat: ${targetPath}: Is a directory</span>`;
    }

    for (const [directoryKey, directoryContent] of Object.entries(this.fileSystem)) {
      if (typeof directoryContent === 'object') {
        if (targetPath.startsWith(directoryKey + '/')) {
          const fileName = targetPath.split('/')[1];
          if (directoryContent[fileName]) {
            return directoryContent[fileName];
          }
        }
      }
    }

    return `<span class="text-red">cat: ${targetPath}: No such file or directory</span>`;
  }

  executeNeofetch() {
    const archLogo = `
       /\\
      /  \\
     /    \\
    /      \\
   /   ,,   \\
  /   |  |   \\
 /_-''    ''-_\\`;

    const colorBlocks = `
      <span style="background-color: var(--color-black); color: var(--color-black);">███</span><span style="background-color: var(--color-red); color: var(--color-red);">███</span><span style="background-color: var(--color-green); color: var(--color-green);">███</span><span style="background-color: var(--color-yellow); color: var(--color-yellow);">███</span><span style="background-color: var(--color-blue); color: var(--color-blue);">███</span><span style="background-color: var(--color-magenta); color: var(--color-magenta);">███</span><span style="background-color: var(--color-cyan); color: var(--color-cyan);">███</span><span style="background-color: var(--color-foreground); color: var(--color-foreground);">███</span>
    `;

    return `
<div class="system-info-container">
  <div class="system-info-logo">${archLogo.replace(/\n/g, '<br>')}</div>
  <div class="system-info-data">
    <div><span class="system-info-header">khoa</span>@<span class="system-info-header">archlinux</span></div>
    <div>-------------------</div>
    <div><span class="system-info-key">OS:</span> Arch Linux x86_64</div>
    <div><span class="system-info-key">WM:</span> Hyprland</div>
    <div><span class="system-info-key">Shell:</span> zsh</div>
    <div><span class="system-info-key">Editor:</span> Neovim</div>
    <div><span class="system-info-key">Languages:</span> English / Vietnamese</div>
    <br>
    <div>${colorBlocks.trim()}</div>
  </div>
</div>`;
  }
}