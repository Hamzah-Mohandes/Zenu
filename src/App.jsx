import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [bootPhase, setBootPhase] = useState(0);
  const [terminalReady, setTerminalReady] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [output, setOutput] = useState([]);
  const [showBoot, setShowBoot] = useState(true);
  const terminalRef = useRef(null);

  const fileSystem = {
    '~': {
      type: 'dir',
      contents: ['tech-stack.txt', 'experience.log', 'projects', 'contact', 'about.txt', 'services.txt']
    },
    '~/projects': {
      type: 'dir',
      contents: ['ecommerce-platform', 'ios-fitness app', 'android-banking']
    },
    '~/contact': {
      type: 'dir',
      contents: ['github', 'linkedin', 'email']
    },
    '~/github': {
      type: 'file',
      content: 'https://github.com/Hamzah-Mohandes'
    },
    '~/linkedin': {
      type: 'file',
      content: 'https://www.linkedin.com/in/hamzah-mohandeszadeh-5542a0160/?skipRedirect=true'
    },
    '~/email': {
      type: 'file',
      content: 'mailto:hamzah@example.com'
    },
    '~/tech-stack.txt': {
      type: 'file',
      content: `Rust ████████████████████ 92%
JavaScript ████████████████████ 95%
Swift ███████████████████ 90%
Kotlin ██████████████████ 88%
Node.js ████████████████████ 92%
React ████████████████████ 94%
Jetpack Compose █████████████ 85%
SwiftUI ████████████████ 87%
MongoDB ██████████████ 82%
Firebase ███████████████ 84%`
    },
    '~/experience.log': {
      type: 'file',
      content: `2022 - Present: Full Stack Developer @ Tech Company
Building scalable web and mobile applications`
    },
    '~/about.txt': {
      type: 'file',
      content: `Hamzah Mohandeszadeh (Zenu)
Full Stack Developer | iOS & Android Specialist
📍 Hamburg, Germany
✓ Available for freelance projects`
    },
    '~/services.txt': {
      type: 'file',
      content: `═══════════════════════════════════════════════════════════════
                        MY SERVICES
═══════════════════════════════════════════════════════════════

🚀 WEB DEVELOPMENT
   • Full-stack web applications
   • E-commerce platforms
   • Progressive Web Apps (PWA)
   Starting from: €2,500

📱 MOBILE DEVELOPMENT  
   • iOS apps (Swift/SwiftUI)
   • Android apps (Kotlin/Jetpack Compose)
   • Cross-platform solutions
   Starting from: €3,000

⚡ BACKEND & API
   • RESTful APIs & GraphQL
   • Database design & optimization
   • Cloud infrastructure (AWS, Firebase)
   Starting from: €1,500

🎨 UI/UX DESIGN
   • Modern interface design
   • User experience optimization
   • Design systems & components
   Starting from: €1,000

═══════════════════════════════════════════════════════════════
💼 READY TO START YOUR PROJECT?
   Type "hire" or email: hamzah@example.com
═══════════════════════════════════════════════════════════════`
    }
  };

  const bootSequence = [
    { text: 'BIOS Version 2.15.1', delay: 100 },
    { text: 'CPU: Quantum Core i9 @ 5.2GHz', delay: 150 },
    { text: 'Memory: 64GB DDR5-6400MHz', delay: 150 },
    { text: 'Loading kernel...', delay: 300 },
    { text: '[ OK ] Mounting root filesystem', delay: 200 },
    { text: '[ OK ] Starting network', delay: 200 },
    { text: '[ OK ] Initializing display subsystem', delay: 200 },
    { text: '[ OK ] Loading user profile', delay: 200 },
    { text: 'System ready.', delay: 300 }
  ];

  useEffect(() => {
    let timeout;
    const runBootSequence = () => {
      if (bootPhase < bootSequence.length) {
        setOutput(prev => [...prev, { type: 'boot', text: bootSequence[bootPhase].text }]);
        timeout = setTimeout(() => {
          setBootPhase(prev => prev + 1);
        }, bootSequence[bootPhase].delay);
      } else {
        setTerminalReady(true);
        setShowBoot(false);
      }
    };
    runBootSequence();
    return () => clearTimeout(timeout);
  }, [bootPhase]);

  // Matrix rain effect
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.id = 'matrix-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    canvas.style.opacity = '0.15';
    document.body.appendChild(canvas);

    const matrix = document.getElementById('matrix');
    if (matrix) {
      matrix.appendChild(canvas);
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const matrixInterval = setInterval(drawMatrix, 50);

    return () => {
      clearInterval(matrixInterval);
      window.removeEventListener('resize', resizeCanvas);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const executeCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const parts = cmd.trim().split(' ');
    let command = parts[0].toLowerCase();
    let args = parts.slice(1);

    // Auto-correct: if they type just a filename, treat it as "cat filename"
    if (fileSystem[`~/${command}`] && !['help', 'ls', 'cat', 'whoami', 'clear', 'date', 'uname', 'neofetch', 'hire'].includes(command)) {
      args = [command];
      command = 'cat';
    }

    setCommandHistory(prev => [...prev, cmd]);
    setOutput(prev => [...prev, { type: 'input', text: `zenu@dev:~$ ${cmd}` }]);

    switch (command) {
      case 'help':
        setOutput(prev => [...prev, { 
          type: 'output', 
          text: `═══════════════════════════════════════════════════════════════
                        AVAILABLE COMMANDS
═══════════════════════════════════════════════════════════════

FILE OPERATIONS:
  ls              List all files in current directory
  cat <filename>  Read file contents
                   Examples: cat tech-stack.txt, cat about.txt

INFORMATION:
  whoami          Display developer information
  neofetch        Show detailed system information
  date            Show current date and time
  uname           Show system information

HIRING:
  hire            Contact me for projects ⭐

TERMINAL:
  help            Show this help message
  clear           Clear the terminal screen

═══════════════════════════════════════════════════════════════
AVAILABLE FILES TO READ:
  tech-stack.txt  - Skills and technologies
  experience.log  - Work experience
  about.txt       - About the developer
  services.txt    - Services & pricing ⭐
  github          - GitHub profile link
  linkedin        - LinkedIn profile link
  email           - Contact email
═══════════════════════════════════════════════════════════════` 
        }]);
        break;
      case 'ls':
        setOutput(prev => [...prev, { 
          type: 'output', 
          text: `AVAILABLE FILES:
  tech-stack.txt    → Type: cat tech-stack.txt
  experience.log    → Type: cat experience.log
  about.txt         → Type: cat about.txt
  services.txt      → Type: cat services.txt ⭐
  github            → Type: cat github
  linkedin          → Type: cat linkedin
  email             → Type: cat email
  projects/         → Directory
  contact/          → Directory` 
        }]);
        break;
      case 'hire':
        setOutput(prev => [...prev, { type: 'output', text: 'Opening email client...' }]);
        window.location.href = 'mailto:hamzah@example.com?subject=Project Inquiry&body=Hi Zenu, I would like to discuss a project.';
        break;
      case 'cat':
        if (args.length === 0) {
          setOutput(prev => [...prev, { type: 'error', text: 'cat: missing file operand' }]);
        } else {
          const filePath = args[0];
          if (fileSystem[`~/${filePath}`]) {
            setOutput(prev => [...prev, { type: 'output', text: fileSystem[`~/${filePath}`].content }]);
          } else {
            setOutput(prev => [...prev, { type: 'error', text: `cat: ${filePath}: No such file or directory` }]);
          }
        }
        break;
      case 'whoami':
        setOutput(prev => [...prev, { type: 'output', text: 'Hamzah Mohandeszadeh (Zenu)' }]);
        break;
      case 'clear':
        setOutput([]);
        break;
      case 'date':
        setOutput(prev => [...prev, { type: 'output', text: new Date().toString() }]);
        break;
      case 'uname':
        setOutput(prev => [...prev, { type: 'output', text: 'ZenuOS 2.0.0 x86_64' }]);
        break;
      case 'neofetch':
        setOutput(prev => [...prev, { 
          type: 'neofetch',
          text: `
        ██╗    ██╗███████╗██████╗  ██████╗ ███████╗
        ██║    ██║██╔════╝██╔══██╗██╔═══██╗██╔════╝
        ██║ █╗ ██║█████╗  ██████╔╝██║   ██║███████╗
        ██║███╗██║██╔══╝  ██╔══██╗██║   ██║╚════██║
        ╚███╔███╔╝███████╗██████╔╝╚██████╔╝███████║
         ╚══╝╚══╝ ╚══════╝╚═════╝  ╚═════╝ ╚══════╝
        
        Hamzah Mohandeszadeh (Zenu)
        ---------------------------
        OS: ZenuOS 2.0.0
        Host: Quantum Terminal
        Kernel: 5.15.0-zenu
        Uptime: ${Math.floor(Math.random() * 100)} days
        Shell: zsh 5.9
        Resolution: 900x600
        Theme: Dark Matte
        CPU: Quantum Core i9 @ 5.2GHz
        Memory: 64GB / 128GB
        `
        }]);
        break;
      default:
        setOutput(prev => [...prev, { type: 'error', text: `Command not found: ${command}. Type 'help' for available commands.` }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      executeCommand(currentInput);
      setCurrentInput('');
    }
  };

  const handleItemClick = (command) => {
    executeCommand(command);
  };

  return (
    <div className="terminal-container">
      <div className="matrix-background" id="matrix"></div>
      <div className="crt-overlay"></div>
      <div className="scanlines"></div>
      <button 
        className="hire-button"
        onClick={() => window.location.href = 'mailto:hamzah@example.com?subject=Project Inquiry&body=Hi Zenu, I would like to discuss a project.'}
      >
        💼 Hire Me
      </button>
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <div className="terminal-button close"></div>
            <div className="terminal-button minimize"></div>
            <div className="terminal-button maximize"></div>
          </div>
          <div className="terminal-title">zenu@dev:~ - Zenu Terminal</div>
        </div>
        <div className="terminal-body">
          {showBoot && (
            <div className="boot-output">
              {output.map((line, index) => (
                <div key={index} className={`terminal-line ${line.type}`}>
                  {line.type === 'boot' && <span className="boot-text">{line.text}</span>}
                </div>
              ))}
            </div>
          )}
          {terminalReady && (
            <>
              <div className="terminal-header-static">
                <div className="header-text">═══════════════════════════════════════════════════════════════</div>
                <div className="header-text">  WELCOME TO ZENU TERMINAL v2.0</div>
                <div className="header-text">═══════════════════════════════════════════════════════════════</div>
                <div className="header-text"></div>
                <div className="clickable-text" onClick={() => handleItemClick('hire')}>💼 LOOKING TO HIRE? Click here or type "hire"</div>
                <div className="header-text"></div>
                <div className="header-text">  QUICK START GUIDE:</div>
                <div className="clickable-text" onClick={() => handleItemClick('help')}>  • help - See all available commands</div>
                <div className="clickable-text" onClick={() => handleItemClick('ls')}>  • ls - List all available files</div>
                <div className="clickable-text" onClick={() => handleItemClick('whoami')}>  • whoami - Learn about the developer</div>
                <div className="clickable-text" onClick={() => handleItemClick('neofetch')}>  • neofetch - See system information</div>
                <div className="header-text"></div>
                <div className="header-text">  AVAILABLE FILES (click to open):</div>
                <div className="clickable-text" onClick={() => handleItemClick('cat services.txt')}>  • services.txt ⭐ - Services & pricing</div>
                <div className="clickable-text" onClick={() => handleItemClick('cat tech-stack.txt')}>  • tech-stack.txt - Skills and technologies</div>
                <div className="clickable-text" onClick={() => handleItemClick('cat experience.log')}>  • experience.log - Work experience</div>
                <div className="clickable-text" onClick={() => handleItemClick('cat about.txt')}>  • about.txt - About the developer</div>
                <div className="clickable-text" onClick={() => handleItemClick('cat github')}>  • github - GitHub profile</div>
                <div className="clickable-text" onClick={() => handleItemClick('cat linkedin')}>  • linkedin - LinkedIn profile</div>
                <div className="clickable-text" onClick={() => handleItemClick('cat email')}>  • email - Contact email</div>
                <div className="header-text"></div>
                <div className="header-text">═══════════════════════════════════════════════════════════════</div>
              </div>
              <div className="terminal-output-scroll" ref={terminalRef}>
                {output.map((line, index) => (
                  <div key={index} className={`terminal-line ${line.type}`}>
                    {line.type === 'system' && <span className="system-text">{line.text}</span>}
                    {line.type === 'input' && <span className="input-text">{line.text}</span>}
                    {line.type === 'output' && <pre className="output-text">{line.text}</pre>}
                    {line.type === 'error' && <span className="error-text">{line.text}</span>}
                    {line.type === 'neofetch' && <pre className="neofetch-text">{line.text}</pre>}
                  </div>
                ))}
              </div>
              <div className="input-line">
                <span className="prompt">zenu@dev:~$</span>
                <input
                  type="text"
                  className="command-input"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  autoComplete="off"
                />
                <span className="cursor">█</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
