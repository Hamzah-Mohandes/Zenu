import React, { useCallback, useEffect, useRef, useState } from 'react';

import anime from 'animejs';

const App = () => {
  const [bootPhase, setBootPhase] = useState(0);
  const [terminalReady, setTerminalReady] = useState(false);
  const [output, setOutput] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [showBoot, setShowBoot] = useState(true);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [darkMode, setDarkMode] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [stars, setStars] = useState({});
  const [matrixMode, setMatrixMode] = useState(false);
  const [asciiArt, setAsciiArt] = useState('');
  const [weather, setWeather] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const outputRef = useRef(null);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const welcomeRef = useRef(null);

  // سیستم فایل کامل
  const fileSystem = {
    '~/about.txt': {
      type: 'file',
      content: `═══════════════════════════════════════════════════
                    👨‍💻 ABOUT LUCIEN
═══════════════════════════════════════════════════

Name: Hamzah Mohandeszadeh
Alias: Lucien
Role: Mobile App Developer & MERN-Stack
Location: Hamburg, Germany 🇩🇪
Email: hamzahmohandesz@gmail.com


🎯 Career Goal:
  "As a freshly graduated app developer, I bring 
   extensive experience in developing Android 
   and iOS apps. My expertise includes Kotlin 
   and Swift. I'm looking to delve deeper into 
   working with Android and iOS and leverage 
   my MERN stack knowledge."

💼 Current Focus:
  • Kotlin & Swift Development
  • Android & iOS Native Apps
  • MERN-Stack Integration

═══════════════════════════════════════════════════
📩 Type "hire" or "contact" to get in touch!
═══════════════════════════════════════════════════`
    },
    '~/experience.txt': {
      type: 'file',
      content: `═══════════════════════════════════════════════════
                    💼 WORK EXPERIENCE
═══════════════════════════════════════════════════

📱 App Developer
  Syntax Institut, Ilmenau
  Feb 2023 - Feb 2025
  ──────────────────────────────────────────────
  • UX/UI Design: Development of appealing and 
    user-friendly designs
  • Native App Development: Development of 
    native apps for Android and iOS
  • Technologies: Kotlin, Swift, Android Studio, 
    Xcode, Figma, Jetpack Compose, SwiftUI, GitHub

🌐 Full Stack Web Development
  DCI Digital Career Institute gGmbH, Berlin
  2021 - 2022
  ──────────────────────────────────────────────
  • One-year full-time training with a focus on 
    MERN-Stack technologies
  • Creation of several small and one large 
    final project

═══════════════════════════════════════════════════`
    },
    '~/education.txt': {
      type: 'file',
      content: `═══════════════════════════════════════════════════
                    🎓 EDUCATION
═══════════════════════════════════════════════════

📱 IT Specialist for App Development
  Syntax Institut
  Jan 2023 - Jan 2025
  ──────────────────────────────────────────────
  • Mobile UX/UI Design: Development of Figma 
    prototypes and final presentations
  • Basics of Programming: Creating interactive 
    console programs
  • Android App Development: Complete Android 
    app in Kotlin
  • iOS App Development: Complete iOS app in Swift

📚 Secondary School Certificate
  2012 - 2013

═══════════════════════════════════════════════════`
    },
    '~/skills.txt': {
      type: 'file',
      content: `═══════════════════════════════════════════════════
                    ⚡ SKILLS & TECHNOLOGIES
═══════════════════════════════════════════════════

📱 Mobile Development:
  • Swift ═══════════════════ 90%
  • Kotlin ═══════════════════ 88%
  • SwiftUI ══════════════════ 85%
  • Jetpack Compose ══════════ 83%
  • Android Studio ═══════════ 90%
  • Xcode ════════════════════ 85%

🌐 Web Development:
  • JavaScript (ES6) ═════════ 85%
  • React.js ═════════════════ 82%
  • Node.js ══════════════════ 80%
  • HTML5 & CSS3 ═════════════ 85%
  • Sass ═════════════════════ 75%

🗄️ Database:
  • MongoDB ══════════════════ 75%
  • SQLite ═══════════════════ 70%
  • Firebase ═════════════════ 75%

🛠️ Tools:
  • Git & GitHub ═════════════ 85%
  • Figma ════════════════════ 80%

═══════════════════════════════════════════════════
💡 "Learning and testing new things in the 
    world of programming and technology"
═══════════════════════════════════════════════════`
    },
    '~/languages.txt': {
      type: 'file',
      content: `═══════════════════════════════════════════════════
                    🌍 LANGUAGES
═══════════════════════════════════════════════════

🇮🇷 Farsi-Dari   ═══════════ Mother Tongue
🇩🇪 Deutsch      ═══════════ B1
🇬🇧 English      ═══════════ B1

═══════════════════════════════════════════════════
💬 Always learning and improving!
═══════════════════════════════════════════════════`
    },
    '~/hobbies.txt': {
      type: 'file',
      content: `═══════════════════════════════════════════════════
                    🎯 HOBBIES & INTERESTS
═══════════════════════════════════════════════════

💻 Learning & Testing new things in the world 
   of programming and technology

🌱 Hobby Gardener

📚 Reading

🎵 Listening to Classical Music

🏊 Swimming

═══════════════════════════════════════════════════
⚡ "Stay curious, keep learning!"
═══════════════════════════════════════════════════`
    },
    '~/github': {
      type: 'file',
      content: '🐙 GitHub: https://github.com/Hamzah-Mohandes'
    },
    '~/email': {
      type: 'file',
      content: '📧 Email: hamzahmohandesz@gmail.com'
    },
    '~/phone': {
      type: 'file',
      content: ''
    },
    '~/cv.pdf': {
      type: 'file',
      content: '📄 Download CV: Click here or type "download"'
    }
  };

  // دنباله بوت
  const bootSequence = [
    { text: '⚡ Initializing LucienOS v2.0', delay: 200 },
    { text: '🔹 CPU: Mobile Dev Engine @ 3.8GHz', delay: 250 },
    { text: '🔹 Memory: 32GB DDR4 @ 3200MHz', delay: 250 },
    { text: '🔹 Loading Kotlin & Swift modules...', delay: 300 },
    { text: '✅ Mounting Android SDK', delay: 200 },
    { text: '✅ Starting iOS Simulator', delay: 200 },
    { text: '✅ Initializing MERN-Stack', delay: 200 },
    { text: '✅ Loading user profile: lucien', delay: 200 },
    { text: '✨ System ready! Welcome to Lucien Terminal v2.0', delay: 400 }
  ];

  // اجرای دنباله بوت با انیمیشن
  useEffect(() => {
    let timeout;
    const runBoot = () => {
      if (bootPhase < bootSequence.length) {
        const newOutput = { type: 'boot', text: bootSequence[bootPhase].text };
        setOutput(prev => [...prev, newOutput]);
        
        setTimeout(() => {
          const lines = document.querySelectorAll('.output-line.boot');
          if (lines.length > 0) {
            const lastLine = lines[lines.length - 1];
            anime({
              targets: lastLine,
              opacity: [0, 1],
              translateX: [-20, 0],
              duration: 400,
              easing: 'easeOutCubic'
            });
          }
        }, 50);

        timeout = setTimeout(() => {
          setBootPhase(prev => prev + 1);
        }, bootSequence[bootPhase].delay);
      } else {
        setTerminalReady(true);
        setShowBoot(false);
        
        setTimeout(() => {
          if (welcomeRef.current) {
            anime({
              targets: welcomeRef.current,
              opacity: [0, 1],
              translateY: [20, 0],
              duration: 800,
              easing: 'easeOutCubic'
            });
          }
        }, 300);
      }
    };
    runBoot();
    return () => clearTimeout(timeout);
  }, [bootPhase]);

  // Matrix Rain Effect
  useEffect(() => {
    if (!matrixMode) {
      const existingCanvas = document.getElementById('matrix-canvas');
      if (existingCanvas) {
        existingCanvas.remove();
      }
      return;
    }
    
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.opacity = '0.12';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
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
      ctx.fillStyle = '#33ff33';
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
      const canvasEl = document.getElementById('matrix-canvas');
      if (canvasEl) {
        canvasEl.remove();
      }
    };
  }, [matrixMode]);

  // افکت ذرات پس‌زمینه
  useEffect(() => {
    if (matrixMode) {
      const container = document.querySelector('.particles-container');
      if (container) {
        container.innerHTML = '';
      }
      return;
    }
    
    const container = document.querySelector('.particles-container');
    if (!container) return;

    const colors = ['#33ff33', '#33ff33', '#33ff33', '#33ff33', '#33ff33'];
    
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 3 + 1;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.background = '#33ff33';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.opacity = Math.random() * 0.3 + 0.1;
      container.appendChild(particle);

      const duration = Math.random() * 20000 + 15000;
      const delay = Math.random() * 5000;
      
      anime({
        targets: particle,
        translateX: anime.random(-300, 300),
        translateY: anime.random(-300, 300),
        scale: [0, 1, 0],
        opacity: [0, 0.3, 0],
        duration: duration,
        delay: delay,
        easing: 'easeInOutQuad',
        complete: () => {
          particle.remove();
          createParticle();
        }
      });
    };

    for (let i = 0; i < 20; i++) {
      setTimeout(createParticle, i * 200);
    }

    return () => {
      container.innerHTML = '';
    };
  }, [matrixMode]);

  // اسکرول خودکار
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
      
      anime({
        targets: outputRef.current,
        scrollTop: outputRef.current.scrollHeight,
        duration: 300,
        easing: 'easeOutCubic'
      });
    }
  }, [output]);

  // فوکوس خودکار
  useEffect(() => {
    if (terminalReady && inputRef.current) {
      inputRef.current.focus();
    }
  }, [terminalReady]);

  const animateNewOutput = () => {
    setTimeout(() => {
      const lines = document.querySelectorAll('.output-line:not(.boot)');
      if (lines.length > 0) {
        const lastLine = lines[lines.length - 1];
        anime({
          targets: lastLine,
          opacity: [0, 1],
          translateX: [-10, 0],
          duration: 300,
          easing: 'easeOutCubic'
        });
      }
    }, 50);
  };

  // Auto-completion
  const getAutoComplete = (input) => {
    const commands = ['help', 'ls', 'cat', 'whoami', 'neofetch', 'hire', 'contact', 'clear', 'date', 'uname', 'echo', 'skills', 'experience', 'education', 'languages', 'hobbies', 'download', 'matrix', 'theme', 'game', 'chat', 'music', 'star', 'ascii', 'weather'];
    const files = Object.keys(fileSystem).map(f => f.replace('~/', ''));
    const all = [...commands, ...files];
    
    const matches = all.filter(cmd => cmd.startsWith(input));
    return matches.length === 1 ? matches[0] : null;
  };

  // Game: Word Guess
  const startGame = () => {
    const words = ['kotlin', 'swift', 'react', 'android', 'ios', 'javascript', 'mongodb', 'firebase'];
    const word = words[Math.floor(Math.random() * words.length)];
    setGameState({
      word: word,
      guesses: [],
      attempts: 6,
      maxAttempts: 6,
      status: 'playing'
    });
    return `🎮 Word Guess Game Started!\n🔤 The word has ${word.length} letters.\n💡 You have 6 attempts. Type "guess <letter>" to play!`;
  };

  const guessLetter = (letter) => {
    if (!gameState || gameState.status !== 'playing') return 'Game not active. Type "game" to start!';
    
    const { word, guesses, attempts } = gameState;
    if (guesses.includes(letter)) return `⚠️ You already guessed "${letter}"!`;
    
    const newGuesses = [...guesses, letter];
    let newAttempts = attempts;
    if (!word.includes(letter)) newAttempts--;
    
    const display = word.split('').map(l => newGuesses.includes(l) ? l : '_').join(' ');
    
    if (display.replace(/ /g, '') === word) {
      setGameState({ ...gameState, guesses: newGuesses, status: 'won' });
      return `🎉 Congratulations! You guessed "${word}"!\n⭐ You won the game!`;
    }
    
    if (newAttempts <= 0) {
      setGameState({ ...gameState, guesses: newGuesses, attempts: 0, status: 'lost' });
      return `💀 Game Over! The word was "${word}".\n🔄 Type "game" to try again!`;
    }
    
    setGameState({ ...gameState, guesses: newGuesses, attempts: newAttempts });
    return `🔤 Word: ${display}\n❤️ Attempts left: ${newAttempts}`;
  };

  // Chat Bot
  const chatBot = (message) => {
    const responses = {
      'hello': '👋 Hello! How can I help you today?',
      'hi': '👋 Hi there! Nice to meet you!',
      'how are you': '🤖 I\'m great! Thanks for asking!',
      'who are you': '🤖 I\'m Lucien\'s AI assistant. I\'m here to help!',
      'what can you do': '💡 I can help with commands, play games, chat, and more!',
      'help': '💡 I can chat, play games, or help with terminal commands!',
      'bye': '👋 Goodbye! Take care!',
      'thanks': '🙂 You\'re welcome!',
      'thank you': '🙂 Anytime!',
      'default': '🤔 I\'m not sure I understand. Type "help" to see what I can do!'
    };
    
    const lower = message.toLowerCase();
    let response = responses.default;
    
    for (const [key, value] of Object.entries(responses)) {
      if (lower.includes(key)) {
        response = value;
        break;
      }
    }
    
    setChatHistory(prev => [...prev, { user: message, bot: response }]);
    return response;
  };

  // ASCII Art Generator
  const generateAscii = (text) => {
    const art = `
    ╔═══════════════════════════════════════╗
    ║          ${text.toUpperCase()}          ║
    ╚═══════════════════════════════════════╝
    `;
    setAsciiArt(art);
    return art;
  };

  // Weather (Mock)
  const getWeather = () => {
    const conditions = ['☀️ Sunny', '⛅ Partly Cloudy', '🌧️ Rainy', '❄️ Snowy', '🌤️ Clear'];
    const temps = [15, 18, 22, 12, 25];
    const random = Math.floor(Math.random() * conditions.length);
    setWeather({
      condition: conditions[random],
      temp: temps[random],
      location: 'Hamburg, Germany 🇩🇪'
    });
    return `🌤️ Weather in Hamburg, Germany 🇩🇪\n${conditions[random]} | ${temps[random]}°C`;
  };

  // Star System
  const toggleStar = (project) => {
    setStars(prev => ({
      ...prev,
      [project]: !prev[project]
    }));
    return !stars[project] ? '⭐ Star added!' : '🌟 Star removed!';
  };

  // Download CV
  const downloadCV = () => {
    return '📄 Downloading CV...\n💡 In production, this would download your actual CV PDF.';
  };

  // Music Player
  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
    return isPlaying ? '⏸️ Music paused' : '▶️ Playing classical music 🎵\n🎻 Beethoven - Moonlight Sonata';
  };

  // Theme Toggle
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.style.background = darkMode ? '#f0f0f0' : '#0c0c0c';
    return darkMode ? '🌞 Switched to Light Mode' : '🌙 Switched to Dark Mode';
  };

  // اجرای دستورات
  const executeCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    let command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Add to history
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    // بررسی فایل‌ها
    if (fileSystem[`~/${command}`] && !['help', 'ls', 'cat', 'whoami', 'clear', 'date', 'uname', 'neofetch', 'hire', 'echo', 'contact', 'skills', 'experience', 'education', 'languages', 'hobbies', 'download', 'matrix', 'theme', 'game', 'chat', 'music', 'star', 'ascii', 'weather'].includes(command)) {
      setOutput(prev => [...prev, { type: 'input', text: `lucien@dev:~$ ${trimmed}` }]);
      setOutput(prev => [...prev, { type: 'output', text: fileSystem[`~/${command}`].content }]);
      setCurrentInput('');
      animateNewOutput();
      return;
    }

    setOutput(prev => [...prev, { type: 'input', text: `lucien@dev:~$ ${trimmed}` }]);

    // Auto-completion
    if (command.length > 1 && args.length === 0) {
      const completion = getAutoComplete(command);
      if (completion && completion !== command) {
        setCurrentInput(completion);
        return;
      }
    }

    switch (command) {
      case 'help':
        setOutput(prev => [...prev, {
          type: 'output',
          text: `═══════════════════════════════════════════════════
                    📚 LUCIEN COMMAND CENTER v2.0
═══════════════════════════════════════════════════

📁 FILE COMMANDS:
  ls               List available files
  cat <file>       Read file content

📄 AVAILABLE FILES:
  about.txt        About Lucien
  experience.txt   Work experience
  education.txt    Education background
  skills.txt       Skills & technologies
  languages.txt    Language skills
  hobbies.txt      Hobbies & interests
  github           GitHub profile
  email            Contact email
  cv.pdf           Download CV

ℹ️ INFO COMMANDS:
  whoami           About Lucien
  neofetch         System information
  date             Current date/time
  uname            System info

🎮 FUN COMMANDS:
  game             Start Word Guess Game
  guess <letter>   Make a guess in the game
  chat <message>   Chat with AI assistant
  ascii <text>     Generate ASCII art
  weather          Show weather (Hamburg)
  star <project>   Toggle star for projects

🛠️ UTILITIES:
  matrix           Toggle Matrix Rain Effect
  theme            Toggle Dark/Light Mode
  music            Toggle music player
  download         Download CV
  clear            Clear screen
  echo <text>      Print text

💼 CONTACT:
  hire             Contact for opportunities
  contact          Contact information

═══════════════════════════════════════════════════
💡 Pro Tip: Use TAB for auto-completion!
   Use ↑/↓ for command history!
═══════════════════════════════════════════════════`
        }]);
        animateNewOutput();
        break;

      case 'ls':
        setOutput(prev => [...prev, {
          type: 'output',
          text: `📁 Available Files & Directories:\n\n${Object.keys(fileSystem).map((f) => {
            const name = f.replace('~/', '');
            const icon = fileSystem[f].type === 'dir' ? '📂' : '📄';
            return `  ${icon} ${name.padEnd(20)}`;
          }).join('\n')}\n\n💡 Type: cat <filename> to read content`
        }]);
        animateNewOutput();
        break;

      case 'cat':
        if (args.length === 0) {
          setOutput(prev => [...prev, { type: 'error', text: '❌ cat: missing filename\n💡 Usage: cat <filename>' }]);
        } else {
          const filePath = `~/${args[0]}`;
          if (fileSystem[filePath]) {
            setOutput(prev => [...prev, { type: 'output', text: fileSystem[filePath].content }]);
          } else {
            setOutput(prev => [...prev, { type: 'error', text: `❌ cat: ${args[0]}: No such file or directory` }]);
          }
        }
        animateNewOutput();
        break;

      case 'whoami':
        setOutput(prev => [...prev, {
          type: 'output',
          text: `👤 Hamzah Mohandeszadeh (Lucien)\n📍 Mobile App Developer & MERN-Stack\n📍 Hamburg, Germany 🇩🇪\n📱 iOS & Android Specialist\n💼 Available for opportunities\n\n💡 Type "hire" or "contact" to get in touch!`
        }]);
        animateNewOutput();
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

        ═══════════════════════════════════════════════
        Hamzah Mohandeszadeh (Lucien)
        ──────────────────────────────────────────────
        OS: LucienOS 2.0.0 ✨
        Host: Mobile Dev Terminal Pro
        Kernel: 6.8.0-lucien
        Uptime: ${Math.floor(Math.random() * 30 + 1)} days
        Shell: zsh 6.0
        Resolution: 1100x750
        Theme: ${darkMode ? '🌙 Dark' : '☀️ Light'}
        CPU: Mobile Dev Engine @ 3.8GHz
        Memory: 32GB / 64GB
        Location: Hamburg, Germany 🇩🇪
        Status: 🟢 Available for opportunities
        Focus: Kotlin • Swift • MERN-Stack
        Matrix: ${matrixMode ? '🌧️ Active' : '⛔ Off'}
        Music: ${isPlaying ? '🎵 Playing' : '⏸️ Paused'}
        ──────────────────────────────────────────────
        ⚡ "Learning and testing new things in the 
            world of programming and technology"
        ═══════════════════════════════════════════════
        `
        }]);
        animateNewOutput();
        break;

      case 'matrix':
        setMatrixMode(!matrixMode);
        setOutput(prev => [...prev, {
          type: 'output',
          text: matrixMode ? '🌧️ Matrix Rain Effect Disabled' : '🌧️ Matrix Rain Effect Enabled!'
        }]);
        animateNewOutput();
        break;

      case 'theme':
        const themeMsg = toggleTheme();
        setOutput(prev => [...prev, {
          type: 'output',
          text: themeMsg
        }]);
        animateNewOutput();
        break;

      case 'music':
        const musicMsg = toggleMusic();
        setOutput(prev => [...prev, {
          type: 'output',
          text: musicMsg
        }]);
        animateNewOutput();
        break;

      case 'download':
        const downloadMsg = downloadCV();
        setOutput(prev => [...prev, {
          type: 'output',
          text: downloadMsg
        }]);
        animateNewOutput();
        break;

      case 'game':
        const gameMsg = startGame();
        setOutput(prev => [...prev, {
          type: 'output',
          text: gameMsg
        }]);
        animateNewOutput();
        break;

      case 'guess':
        if (args.length === 0) {
          setOutput(prev => [...prev, { type: 'error', text: '❌ Guess a letter! Example: guess a' }]);
        } else {
          const result = guessLetter(args[0].toLowerCase());
          setOutput(prev => [...prev, { type: 'output', text: result }]);
        }
        animateNewOutput();
        break;

      case 'chat':
        if (args.length === 0) {
          setOutput(prev => [...prev, { type: 'error', text: '❌ Type a message! Example: chat hello' }]);
        } else {
          const message = args.join(' ');
          const response = chatBot(message);
          setOutput(prev => [...prev, { type: 'output', text: `🗣️ You: ${message}\n🤖 Bot: ${response}` }]);
        }
        animateNewOutput();
        break;

      case 'ascii':
        if (args.length === 0) {
          setOutput(prev => [...prev, { type: 'error', text: '❌ Enter text for ASCII art! Example: ascii hello' }]);
        } else {
          const text = args.join(' ');
          const art = generateAscii(text);
          setOutput(prev => [...prev, { type: 'output', text: art }]);
        }
        animateNewOutput();
        break;

      case 'weather':
        const weatherMsg = getWeather();
        setOutput(prev => [...prev, {
          type: 'output',
          text: weatherMsg
        }]);
        animateNewOutput();
        break;

      case 'star':
        if (args.length === 0) {
          setOutput(prev => [...prev, { type: 'error', text: '❌ Specify a project! Example: star project1' }]);
        } else {
          const project = args.join(' ');
          const starMsg = toggleStar(project);
          setOutput(prev => [...prev, { type: 'output', text: `🌟 ${project}: ${starMsg}` }]);
        }
        animateNewOutput();
        break;

      case 'hire':
      case 'contact':
        try {
          setOutput(prev => [...prev, {
            type: 'output',
            text: `💼 Opening email client...\n📧 Sending to: hamzahmohandesz@gmail.com\n\n✨ Let's connect and build something amazing!`
          }]);
          animateNewOutput();
          
          setTimeout(() => {
            const email = 'hamzahmohandesz@gmail.com';
            const subject = encodeURIComponent('Job Opportunity / Project Inquiry - Lucien');
            const body = encodeURIComponent(
              'Hi Lucien,\n\n' +
              'I came across your terminal portfolio and I\'m impressed with your work! ' +
              'I would like to discuss a potential opportunity/project with you.\n\n' +
              'Looking forward to hearing from you.\n\n' +
              'Best regards,\n' +
              '[Your Name]'
            );
            
            window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
          }, 800);
        } catch (error) {
          setOutput(prev => [...prev, {
            type: 'error',
            text: '❌ Error opening email client. Please try again or use:\n📧 hamzahmohandesz@gmail.com\n📱 0155 66 40 65 98'
          }]);
          animateNewOutput();
        }
        break;

      case 'clear':
        setOutput([]);
        break;

      case 'date':
        setOutput(prev => [...prev, {
          type: 'output',
          text: `📅 ${new Date().toLocaleString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
          })}`
        }]);
        animateNewOutput();
        break;

      case 'uname':
        setOutput(prev => [...prev, {
          type: 'output',
          text: `💻 LucienOS 2.0.0 x86_64\n⚡ Mobile Dev Kernel 6.8.0\n📱 Android & iOS Ready`
        }]);
        animateNewOutput();
        break;

      case 'echo':
        setOutput(prev => [...prev, {
          type: 'output',
          text: args.join(' ') || '...'
        }]);
        animateNewOutput();
        break;

      default:
        setOutput(prev => [...prev, {
          type: 'error',
          text: `❌ Command not found: ${command}\n💡 Type 'help' for available commands\n\n✨ Did you mean one of these?\n  • ls - List files\n  • cat - Read files\n  • whoami - About Lucien\n  • game - Play a game\n  • chat - Chat with AI`
        }]);
        animateNewOutput();
    }

    setCurrentInput('');
  };

  // Key handlers
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (currentInput.length > 0) {
        const completion = getAutoComplete(currentInput);
        if (completion) {
          setCurrentInput(completion);
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  const handleFileClick = (filename) => {
    executeCommand(`cat ${filename}`);
  };

  const handleCommandClick = (cmd) => {
    executeCommand(cmd);
  };

  return (
    <div className={`terminal-container ${!darkMode ? 'light-mode' : ''}`} ref={terminalRef}>
      <div className="animated-bg"></div>
      <div className="particles-container"></div>
      
      <div className="crt-overlay"></div>
      <div className="scanlines"></div>

      <button 
        className="hire-button"
        onClick={() => handleCommandClick('hire')}
        onMouseEnter={(e) => {
          anime({
            targets: e.currentTarget,
            scale: 1.05,
            duration: 200,
            easing: 'easeOutCubic'
          });
        }}
        onMouseLeave={(e) => {
          anime({
            targets: e.currentTarget,
            scale: 1,
            duration: 200,
            easing: 'easeOutCubic'
          });
        }}
      >
        💼 Hire Lucien
      </button>

      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-buttons">
            {['close', 'minimize', 'maximize'].map((btn) => (
              <div 
                key={btn}
                className={`terminal-button ${btn}`}
              ></div>
            ))}
          </div>
          <div className="terminal-title">
            <span className="status-dot"></span>
            lucien@dev:~ — Lucien Terminal v2.0
          </div>
        </div>

        <div className="terminal-body">
          {terminalReady && (
            <div className="welcome-section" ref={welcomeRef}>
              <div className="welcome-header">
                <span className="welcome-icon">📱</span>
                <span className="welcome-title">LUCIEN TERMINAL v2.0</span>
                <span className="welcome-version">Pro</span>
              </div>
              <div className="welcome-subtitle">
                Mobile App Developer | iOS & Android | MERN-Stack | Hamburg 🇩🇪
              </div>
              
              <div className="divider"></div>
              
              <div className="section-label">🚀 Quick Commands</div>
              <div className="quick-commands">
                {[
                  { key: 'help', desc: 'Show commands' },
                  { key: 'ls', desc: 'List files' },
                  { key: 'whoami', desc: 'About Lucien' },
                  { key: 'neofetch', desc: 'System info' },
                  { key: 'game', desc: 'Play game' },
                  { key: 'chat hello', desc: 'Chat AI' },
                  { key: 'weather', desc: 'Weather' },
                  { key: 'matrix', desc: 'Matrix effect' },
                  { key: 'hire', desc: 'Contact me' }
                ].map((cmd) => (
                  <div 
                    key={cmd.key}
                    className="quick-command"
                    onClick={() => handleCommandClick(cmd.key)}
                  >
                    <span className="cmd-key">{cmd.key}</span>
                    <span className="cmd-desc">{cmd.desc}</span>
                  </div>
                ))}
              </div>

              <div className="divider"></div>
              
              <div className="section-label">📁 Available Files</div>
              {Object.keys(fileSystem).map(filename => {
                const name = filename.replace('~/', '');
                const icons = {
                  'about.txt': '👨‍💻',
                  'experience.txt': '💼',
                  'education.txt': '🎓',
                  'skills.txt': '⚡',
                  'languages.txt': '🌍',
                  'hobbies.txt': '🎯',
                  'github': '🐙',
                  'email': '📧',
                  'phone': '📱',
                  'cv.pdf': '📄'
                };
                return (
                  <div 
                    key={filename}
                    className="file-item"
                    onClick={() => handleFileClick(name)}
                  >
                    <span className="file-icon">{icons[name] || '📄'}</span>
                    <span className="file-name">{name}</span>
                    <span className="file-desc">Click to read</span>
                  </div>
                );
              })}
            </div>
          )}

          {showBoot && (
            <div className="terminal-output" ref={outputRef}>
              {output.map((line, index) => (
                <div key={index} className={`output-line ${line.type}`}>
                  {line.type === 'boot' && <span>{line.text}</span>}
                </div>
              ))}
            </div>
          )}

          {terminalReady && (
            <div className="terminal-output" ref={outputRef}>
              {output.map((line, index) => (
                <div key={index} className={`output-line ${line.type}`}>
                  {line.type === 'input' && <span>{line.text}</span>}
                  {line.type === 'output' && <pre>{line.text}</pre>}
                  {line.type === 'error' && <span>{line.text}</span>}
                  {line.type === 'neofetch' && <pre>{line.text}</pre>}
                </div>
              ))}
            </div>
          )}

          {terminalReady && (
            <div className="input-line">
              <span className="prompt">lucien@dev:~$</span>
              <input
                ref={inputRef}
                type="text"
                className="command-input"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command..."
                autoFocus
                autoComplete="off"
              />
              <span className="cursor-blink"></span>
            </div>
          )}
        </div>

        {/* STATUS BAR */}
        {terminalReady && (
          <div className="terminal-footer">
            <div className="footer-left">
              <span className="status-item">
                <span className="status-dot-small green"></span>
                <span>ONLINE</span>
              </span>
              <span className="status-item">
                <span>📁 {Object.keys(fileSystem).length} files</span>
              </span>
              <span className="status-item">
                <span>💻 {darkMode ? '🌙 Dark' : '☀️ Light'}</span>
              </span>
            </div>
            <div className="footer-right">
              <span className="status-item">
                <span>📟 {matrixMode ? '🌧️ Matrix' : '⬛ Normal'}</span>
              </span>
              <span className="status-item">
                <span>{isPlaying ? '🎵 Playing' : '⏸️ Paused'}</span>
              </span>
              <span className="key-hint">
                <kbd>Tab</kbd> auto-complete
              </span>
              <span className="key-hint">
                <kbd>↑↓</kbd> history
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;