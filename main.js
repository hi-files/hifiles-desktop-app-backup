// main.js

const {
  app,
  BrowserWindow,
  screen,
  shell,
  Tray,
  Menu,
  powerMonitor,
} = require("electron");

// TRAY
let tray;
let mainWindow;
let trayMenu = Menu.buildFromTemplate([{ role: "quit" }]);

function createTray() {
  tray = new Tray("trayTemplate@2x.png");
  tray.setToolTip("hifiles.com");

  tray.on("click", (e) => {
    if (e.shiftKey) {
      app.quit();
    } else {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }
  });

  tray.setContextMenu(trayMenu);
}

function createWindow() {
  //OPEN WITH DEVICE FULL SCREEN AND WIDTH
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    icon: "trayTemplate@2x.png",
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  //LOAD URL
  mainWindow.loadURL("https://final-desktop-app.vercel.app/");

  //OPEN LINKS IN TO THE USER DEFAULT BROWSER

  mainWindow.webContents.on("new-window", function (event, url) {
    event.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url !== mainWindow.webContents.getURL()) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  createTray();
}
// Handle PC going to sleep
powerMonitor.on("suspend", () => {
  console.log("System is going to sleep");
  // Save state or prepare for sleep mode
});

// Handle PC being powered off
powerMonitor.on("on-ac", () => {
  console.log("PC is plugged into power");
});

// Handle PC running on battery
powerMonitor.on("on-battery", () => {
  console.log("PC is running on battery");
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
