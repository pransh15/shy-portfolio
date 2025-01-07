interface StatusBar {
  mode: HTMLElement;
  commandLine: HTMLElement;
  fileInfo: HTMLElement;
  position: HTMLElement;
}

let currentMode = 'NORMAL';
let commandBuffer = '';

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (currentMode === 'INSERT' && e.key !== 'Escape') {
    return;
  }

  switch (e.key) {
    case ':':
      e.preventDefault();
      currentMode = 'COMMAND';
      commandBuffer = ':';
      window.updateStatusBar(currentMode, commandBuffer);
      break;
    case '/':
      e.preventDefault();
      currentMode = 'SEARCH';
      commandBuffer = '/';
      window.updateStatusBar(currentMode, commandBuffer);
      break;
    case 'Escape':
      handleEscape();
      window.clearSearch()
      break;
    case 'Enter':
      if (currentMode === 'COMMAND' || currentMode === 'SEARCH') {
        handleCommand(commandBuffer);
        handleEscape();
      }
      break;
    case 'Backspace':
      if (currentMode === 'COMMAND' || currentMode === 'SEARCH') {
        e.preventDefault();
        commandBuffer = commandBuffer.slice(0, -1);
        if (commandBuffer.length === 0) {
          handleEscape();
        } else {
          window.updateStatusBar(undefined, commandBuffer);
        }
      }
      break;
    default:
      if (currentMode === 'COMMAND' || currentMode === 'SEARCH') {
        e.preventDefault();
        commandBuffer += e.key;
        window.updateStatusBar(undefined, commandBuffer);
      } else {
        handleNormalModeKey(e.key);
      }
  }
});

function handleEscape() {
  currentMode = 'NORMAL';
  commandBuffer = '';
  window.updateStatusBar(currentMode, '');
}

function handleCommand(command: string) {
  if (command.startsWith(':')) {
    const cmd = command.slice(1).toLowerCase();
    switch (cmd) {
      case 'proj':
        window.location.href = 'neovim/projects';
        break;
      case 'about':
        window.location.href = '/neovim/about';
        break;
      case 'contact':
        window.location.href = '/neovim/contact';
        break;
      case 'q':
        window.location.href = '/';
        break;
      case 'h':
        window.location.href = '/neovim/help';
        break;
      case 'b':
        const keyBindings = document.getElementById('key-bindings');
        if (keyBindings) {
          keyBindings.classList.toggle('hidden');
        }
      default:
        console.log('Unknown command:', cmd);
    }
  } else if (command.startsWith('/')) {
    const searchTerm = command.slice(1);
    window.performSearch(searchTerm);
  }
}

function handleNormalModeKey(key: string) {
  switch (key) {
    case 'u':
      navigateUp();
      break;
    case 'j':
    case 'k':
    case 'h':
    case 'l':
      moveCursor(key)
      updatePosition();
      break;
    case 'g':
      window.scrollTo(0, 0);
      updatePosition();
      break;
    case 'G':
      window.scrollTo(0, document.body.scrollHeight);
      updatePosition();
      break;
    case 'i':
      currentMode = 'INSERT';
      window.updateStatusBar(currentMode);
      break;
    case 'v':
      currentMode = 'VISUAL';
      window.updateStatusBar(currentMode);
      break;
  }
}

let cursor = document.getElementById('cursor');
function updatePosition() {
  window.updateStatusBar(undefined, undefined, undefined, `${Math.floor(cursorPosition.y) || 1}:${Math.floor(cursorPosition.x) || 1}`);
  
  if (cursor) {
    cursor.style.top = `${cursorPosition.y}vh`;
    cursor.style.left = `${cursorPosition.x}vw`;
  } else {
    cursor = document.getElementById('cursor');
  }
}

let cursorPosition = {
  'x': 1,
  'y': 0.5,
}
const cursorStep = 1.8;

function moveCursor(direction: 'j' | 'k' | 'h' | 'l') {
  switch (direction) {
    case 'k':
      if (cursorPosition.y > 0.5 && (cursorPosition.y - Math.round(cursorStep) > 0.5)) {
        cursorPosition.y -= cursorStep;
      } else {
        cursorPosition.y = 0.5;
      }
      break;
    case 'j':
      if (cursorPosition.y < 100) {
        cursorPosition.y += cursorStep;
      }
      break;
    case 'h':
      if (cursorPosition.x > 1) {
        cursorPosition.x -= cursorStep/2;
      }
      break;
    case 'l':
      if (cursorPosition.x < 100) {
        cursorPosition.x += cursorStep/2;
      }
      break;
    default:
      console.log('Invalid direction');
  }
}

function navigateUp() {
  const currentPath = window.location.pathname;
  if (currentPath === '/') return; // Already at root

  const pathParts = currentPath.split('/').filter(Boolean);
  if (pathParts.length === 1) {
    // If only one level deep, go to root
    window.location.href = '/';
  } else {
    // Remove the last part of the path
    const newPath = '/' + pathParts.slice(0, -1).join('/');
    window.location.href = newPath;
  }
}