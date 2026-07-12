import { VirtualFileSystem } from '../data/FileSystem.js';

export class CommandProcessor {
  constructor() {
    this.fileSystem = VirtualFileSystem;
    this.currentPath = [];
  }

  process(rawCommand) {
    const argumentsArray = rawCommand.trim().split(' ').filter(Boolean);
    if (argumentsArray.length === 0) return '';

    const baseCommand = argumentsArray[0].toLowerCase();
    const parameters = argumentsArray.slice(1);

    switch (baseCommand) {
      case 'help':
        return this.executeHelp();
      case 'pwd':
        return this.executePwd();
      case 'cd':
        return this.executeCd(parameters);
      case 'tree':
        return this.executeTree();
      case 'ls':
        return this.executeList(parameters);
      case 'cat':
        return this.executeConcatenate(parameters);
      case 'clear':
        return 'CLEAR_SIGNAL';
      case './intro.sh':
      case 'bash':
        return 'AUTO_PRESENTATION_SIGNAL';
      default:
        return `<span class="text-red">zsh: command not found: ${baseCommand}</span>`;
    }
  }

  getCurrentNode() {
    let node = this.fileSystem;
    for (const folder of this.currentPath) {
      node = node[folder];
    }
    return node;
  }

  resolveNode(pathString) {
    if (!pathString || pathString === '~') return this.fileSystem;
    let pathParts = [...this.currentPath];
    
    if (pathString.startsWith('/')) {
      pathParts = [];
      pathString = pathString.substring(1);
    }

    const segments = pathString.split('/').filter(Boolean);
    for (const segment of segments) {
      if (segment === '..') {
        pathParts.pop();
      } else if (segment !== '.') {
        pathParts.push(segment);
      }
    }

    let node = this.fileSystem;
    for (const folder of pathParts) {
      if (node[folder] === undefined || typeof node[folder] !== 'object') {
        return null;
      }
      node = node[folder];
    }
    return node;
  }

  executePwd() {
    return '/home/khoa' + (this.currentPath.length > 0 ? '/' + this.currentPath.join('/') : '');
  }

  executeCd(parameters) {
    if (parameters.length === 0 || parameters[0] === '~') {
      this.currentPath = [];
      return '';
    }

    const target = parameters[0];
    
    if (target === '..') {
      this.currentPath.pop();
      return '';
    }

    const node = this.resolveNode(target);
    if (node && typeof node === 'object') {
      if (target.startsWith('/')) {
        this.currentPath = target.split('/').filter(Boolean);
      } else {
        const segments = target.split('/').filter(Boolean);
        for (const segment of segments) {
          if (segment === '..') this.currentPath.pop();
          else if (segment !== '.') this.currentPath.push(segment);
        }
      }
      return '';
    }

    return `<span class="text-red">cd: no such file or directory: ${target}</span>`;
  }

  executeTree() {
    const buildTree = (obj, prefix = '') => {
      let result = '';
      const keys = Object.keys(obj);
      keys.forEach((key, index) => {
        const isLast = index === keys.length - 1;
        const pointer = isLast ? '└── ' : '├── ';
        if (typeof obj[key] === 'object') {
          result += `${prefix}${pointer}<span class="text-blue">${key}/</span>\n`;
          result += buildTree(obj[key], prefix + (isLast ? '    ' : '│   '));
        } else {
          result += `${prefix}${pointer}${key}\n`;
        }
      });
      return result;
    };
    return '.\n' + buildTree(this.getCurrentNode());
  }

  executeList(parameters) {
    const targetNode = parameters.length > 0 ? this.resolveNode(parameters[0]) : this.getCurrentNode();
    
    if (targetNode && typeof targetNode === 'object') {
      return Object.keys(targetNode).map(key => {
        if (typeof targetNode[key] === 'object') return `<span class="text-blue">${key}/</span>`;
        if (key.endsWith('.sh')) return `<span class="text-green">${key}</span>`;
        return key;
      }).join('  ');
    }

    return `<span class="text-red">ls: cannot access '${parameters[0]}': No such file or directory</span>`;
  }

  executeConcatenate(parameters) {
    if (parameters.length === 0) return '<span class="text-red">cat: missing operand</span>';

    const targetPath = parameters[0];
    const pathParts = targetPath.split('/');
    const fileName = pathParts.pop();
    const dirString = pathParts.length > 0 ? pathParts.join('/') : '.';
    
    const dirNode = this.resolveNode(dirString);

    if (dirNode && dirNode[fileName] !== undefined) {
      if (typeof dirNode[fileName] === 'string') {
        return dirNode[fileName];
      }
      return `<span class="text-red">cat: ${targetPath}: Is a directory</span>`;
    }

    return `<span class="text-red">cat: ${targetPath}: No such file or directory</span>`;
  }

  executeHelp() {
    return [
      'Available commands:',
      '  pwd        - Print name of current/working directory',
      '  cd         - Change the shell working directory',
      '  ls         - List directory contents',
      '  tree       - List contents of directories in a tree-like format',
      '  cat        - Print file content',
      '  clear      - Clear the terminal screen',
      '  <span class="text-green">./intro.sh</span> - Enter presentation mode'
    ].join('\n');
  }
}