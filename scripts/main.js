const app = document.querySelector("#app");
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const closeButton = document.getElementById("close-button");
const minimizeButton = document.getElementById("minimize-button");
const maximizeButton = document.getElementById("maximize-button");

const titleBar = document.querySelector(".menu");
const container = document.querySelector(".container");

let isDragging = false;
let offsetX, offsetY;

titleBar.addEventListener("mousedown", (event) => {
  isDragging = true;
  offsetX = event.clientX - container.getBoundingClientRect().left;
  offsetY = event.clientY - container.getBoundingClientRect().top;
});

document.addEventListener("mousemove", (event) => {
  if (isDragging) {
    container.style.left = event.clientX - offsetX + "px";
    container.style.top = event.clientY - offsetY + "px";
    container.style.position = "absolute";
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

// Close the browser tab
closeButton.addEventListener("click", () => {
  window.close();
});

// Minimize the terminal window
minimizeButton.addEventListener("click", () => {
  const app = document.getElementById("app");
  const container = document.querySelector(".container");
  const titleText = document.querySelector(".title-text");

  if (container.classList.contains("minimized")) {
    container.classList.remove("minimized");
    app.style.display = "flex";
    titleText.style.display = "block";
  } else {
    container.classList.add("minimized");
    app.style.display = "none";
    titleText.style.display = "none";
  }
});

// Maximize/fullscreen the terminal window
maximizeButton.addEventListener("click", () => {
  const container = document.querySelector(".container");
  if (!document.fullscreenElement) {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.mozRequestFullScreen) {
      // Firefox
      container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      container.webkitRequestFullscreen();
    } else if (container.msRequestFullscreen) {
      // IE/Edge
      container.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      // Chrome, Safari and Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      // IE/Edge
      document.msExitFullscreen();
    }
  }
});

app.addEventListener("keypress", async function (event) {
  if (event.key === "Enter") {
    await delay(150);
    getInputValue();

    removeInput();
    await delay(150);
    new_line();
  }
});

app.addEventListener("click", function (event) {
  const input = document.getElementById("commandInput");
  input.focus();
});

async function open_terminal() {
  createText("Starting server...");
  await delay(1400);
  createText("Connected to <span class='text-green'>porto-EU1!</span>");
  await delay(700);
  createText("Checking for updates...");
  createAnimatedCheckingUpdate();
  await delay(2800);
  createText("<span class='text-red'>No updates found.</span>");
  await delay(1000);
  createText("Starting terminal...");
  await delay(1000);
  createText("");
  createText("Welcome to <span class='text-purple'>Jorran's</span> Terminal!");
  createText("");
  await delay(700);
  createText("Type <span class='blue'>help</span> to see all commands.");
  createText("");
  await delay(700);
  new_line();
}

function new_line() {
  const p = document.createElement("p");
  const span1 = document.createElement("span");
  const span2 = document.createElement("span");
  p.setAttribute("class", "path");
  p.textContent = "# user";
  span1.textContent = " in";
  span2.textContent = " ~/Jorran";
  p.appendChild(span1);
  p.appendChild(span2);
  app.appendChild(p);
  const div = document.createElement("div");
  div.setAttribute("class", "type");
  const i = document.createElement("i");
  i.setAttribute("class", "fas fa-angle-right icone");
  const input = document.createElement("input");
  input.id = "commandInput";
  div.appendChild(i);
  div.appendChild(input);
  app.appendChild(div);
  input.focus();
}

function removeInput() {
  const div = document.querySelector(".type");
  app.removeChild(div);
}

function show_image(src, width, height, alt) {
  var img = document.createElement("img");
  img.src = src;
  img.width = width;
  img.height = height;
  img.alt = alt;
  document.body.appendChild(img);
  setTimeout(function () {
    document.body.removeChild(img);
  }, 10000);
}

let animationFrame = null;
let animationActive = false;
let xPos = null;
let yPos = null;
let xSpeed = 2;
let ySpeed = 2;

function startDvdAnimation() {
  const container = document.querySelector(".container");

  if (!isDesktop()) {
    createText("DVD mode is only available on desktop environments.");
    return;
  }

  // Set the initial position to the center of the screen if it hasn't been set yet
  if (xPos === null || yPos === null) {
    xPos = (window.innerWidth - container.offsetWidth) / 2;
    yPos = (window.innerHeight - container.offsetHeight) / 2;
    container.style.position = "absolute";
    container.style.transform = `translate(${xPos}px, ${yPos}px)`;
  }

  // Toggle the animation state and create a message
  animationActive = !animationActive;
  if (animationActive) {
    createText(
      "DVD mode <span class='text-green'>Activated</span>! Run the command again to stop it."
    );

    // Start the animation loop
    function update() {
      const containerRect = container.getBoundingClientRect();

      // Check for container's boundaries
      if (containerRect.right >= window.innerWidth || containerRect.left <= 0) {
        xSpeed = -xSpeed;
      }
      if (
        containerRect.bottom >= window.innerHeight ||
        containerRect.top <= 0
      ) {
        ySpeed = -ySpeed;
      }

      xPos += xSpeed;
      yPos += ySpeed;

      container.style.transform = `translate(${xPos}px, ${yPos}px)`;
      animationFrame = requestAnimationFrame(update);
    }
    update();
  } else {
    createText("DVD mode <span class='text-red'>Deactivated</span>!");

    // Stop the animation and move the container back to the center of the viewport
    cancelAnimationFrame(animationFrame);
    xSpeed = Math.abs(xSpeed); // Reset xSpeed to its original value
    ySpeed = Math.abs(ySpeed); // Reset ySpeed to its original value
    moveToCenter(function () {
      // Reset xPos and yPos after the container has moved back to the center of the viewport
      xPos = (window.innerWidth - container.offsetWidth) / 2;
      yPos = (window.innerHeight - container.offsetHeight) / 2;
    });
  }
}

function isDesktop() {
  const userAgent = navigator.userAgent.toLowerCase();
  return (
    userAgent.includes("windows") ||
    userAgent.includes("macintosh") ||
    userAgent.includes("linux")
  );
}

// Move the container back to the center of the viewport when the animation is stopped
function moveToCenter(callback) {
  const container = document.querySelector(".container");
  const containerRect = container.getBoundingClientRect();
  const currentXPos = containerRect.left + window.pageXOffset;
  const currentYPos = containerRect.top + window.pageYOffset;
  const targetXPos = (window.innerWidth - container.offsetWidth) / 2;
  const targetYPos = (window.innerHeight - container.offsetHeight) / 2;
  const computedTransform = window
    .getComputedStyle(container)
    .getPropertyValue("transform");
  const transformMatrix = new DOMMatrix(computedTransform);
  const currentTranslateX = transformMatrix.m41;
  const currentTranslateY = transformMatrix.m42;
  const xDiff = targetXPos - currentXPos + currentTranslateX;
  const yDiff = targetYPos - currentYPos + currentTranslateY;

  container.style.transition = "transform 2s ease-in-out";
  container.style.transform = `translate(${xDiff}px, ${yDiff}px)`;

  // Reset the xPos and yPos variables to the center of the viewport after the transition is complete
  container.addEventListener(
    "transitionend",
    function () {
      container.style.transition = "none";
      container.style.transform = "translate(0, 0)";
      xPos = targetXPos;
      yPos = targetYPos;
      if (typeof callback === "function") {
        callback();
      }
    },
    { once: true }
  );
}

async function getInputValue() {
  const value = document.getElementById("commandInput").value;
  if (value === "help" || value === "Help") {
    trueValue(value);
    createCode("whoami", "Who I am and what I do.");
    createCode("social -a", "All my social networks.");
    createCode("projects", "See my projects.");
    createCode("clear", "Clean the terminal.");
    createCode("dvd", "Start the dvd animation.");
    createCode("cat", "Show a cat.");
  } else if (value === "dvd" || value === "Dvd") {
    trueValue(value);
    await startDvdAnimation();
  } else if (value === "cat" || value === "Cat") {
    trueValue(value);
    createText("Meow!");
    show_image(
      "https://avatars.githubusercontent.com/u/25855356?v=4",
      200,
      200
    );
  } else if (value === "projects" || value === "Projects") {
    trueValue(value);
    createText(
      "Buisbezorgd - A webshop providing a big assortiment of alcholic bevarages. <span class='red'>Buisbezorgd is EOL and will not be updated</span>. Go To Gall & Gall instead!"
    );
    createText(
      "Scripting - Some small scripts that will make your life a bit easier for IOS written in JavaScript with the AutoTouch API."
    );
    createText(
      "Horizon - A travel agency website made with Next.js, Tailwind, Prisma and Axios. <span class='red'>Horizon is EOL and will not be updated</span>."
    );
  } else if (value === "whoami" || value === "Whoami") {
    trueValue(value);
    createText("Hello, I am <span class='text-purple'>Jorran</span>!");
    createText(
      "I am a self-taught <span class='text-green'>Developer</span> currently focused on <span class='blue'>Next.js</span>, <span class='blue'>Tailwind</span>, and <span class='blue'>C++</span>."
    );
  } else if (value === "social -a" || value === "Social -a") {
    trueValue(value);
    createText(
      "<a href='https://github.com/jorranMLGN' target='_blank'><i class='fab fa-github white'></i> Github</a>"
    );
    createText(
      "<a href='https://www.linkedin.com/in/jorran-houkes-68b9b11a4' target='_blank'><i class='fab fa-linkedin white'></i> linkedin</a>"
    );
    // Discord
    createText(
      "<a href='discordapp.com/users/266652164863033344' target='_blank'><i class='fab fa-discord white'></i> Discord</a>"
    );
  } else if (value === "social" || value === "Social") {
    trueValue(value);
    createText("Did you mean: <span class='blue'>social -a</span>?");
  } else if (value === "clear" || value === "Clear") {
    document.querySelectorAll("p").forEach((e) => e.parentNode.removeChild(e));
    document
      .querySelectorAll("section")
      .forEach((e) => e.parentNode.removeChild(e));
  } else {
    falseValue(value);
    createText(`command not found: ${value}`);
  }
}

function trueValue(value) {
  const div = document.createElement("section");
  div.setAttribute("class", "type2");
  const i = document.createElement("i");
  i.setAttribute("class", "fas fa-angle-right icone");
  const mensagem = document.createElement("h2");
  mensagem.setAttribute("class", "sucess");
  mensagem.textContent = `${value}`;
  div.appendChild(i);
  div.appendChild(mensagem);
  app.appendChild(div);
}

function falseValue(value) {
  const div = document.createElement("section");
  div.setAttribute("class", "type2");
  const i = document.createElement("i");
  i.setAttribute("class", "fas fa-angle-right icone error");
  const mensagem = document.createElement("h2");
  mensagem.setAttribute("class", "error");
  mensagem.textContent = `${value}`;
  div.appendChild(i);
  div.appendChild(mensagem);
  app.appendChild(div);
}

function createText(text, classname) {
  const p = document.createElement("p");
  if (classname) {
    p.setAttribute("class", classname);
  }
  p.innerHTML = text;
  app.appendChild(p);
}

function createAnimatedCheckingUpdate() {
  let dotsCount = 0;
  let maxLoadingDots = 0;
  const checkString = "Checking";
  const dot0 = "[ ]";
  const dot1 = "[ . ]";
  const dot2 = "[ . . ]";
  const dot3 = "[ . . . ]";

  const p = document.createElement("p");
  p.setAttribute("class", "checking");
  p.innerHTML = `${checkString} <span class='dots'>${dot0}</span>`;
  app.appendChild(p);
  const dotsSpan = document.querySelector(".dots");
  const interval = setInterval(() => {
    if (dotsCount === 0) {
      dotsSpan.innerHTML = dot1;
      dotsCount++;
    } else if (dotsCount === 1) {
      dotsSpan.innerHTML = dot2;
      dotsCount++;
    } else if (dotsCount === 2) {
      dotsSpan.innerHTML = dot3;
      dotsCount++;
    } else if (dotsCount === 3) {
      dotsSpan.innerHTML = dot0;
      dotsCount = 0;
      maxLoadingDots++;
    }
    if (maxLoadingDots === 3) {
      clearInterval(interval);
      p.remove();
    }
  }, 200);
  return interval;
}

function createCode(code, text) {
  const p = document.createElement("p");
  p.setAttribute("class", "code");
  p.innerHTML = `${code} <br/><span class='text'> ${text} </span>`;
  app.appendChild(p);
}

open_terminal();
