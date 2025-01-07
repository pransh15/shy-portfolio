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
      case 'projects':
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
      window.scrollBy(0, 30);
      updatePosition();
      break;
    case 'k':
      window.scrollBy(0, -30);
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

function updatePosition() {
  const scrollPercentage = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
  window.updateStatusBar(undefined, undefined, undefined, `${scrollPercentage}%`);
}

updatePosition();
window.addEventListener('scroll', updatePosition);

const currentPath = window.location.pathname;
window.updateStatusBar(undefined, undefined, currentPath === '/' ? 'Landing Page' : currentPath.slice(1));

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