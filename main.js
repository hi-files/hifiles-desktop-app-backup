const {
  app,
  BrowserWindow,
  screen,
  shell,
  Tray,
  Menu,
  powerMonitor,
  dialog,
} = require("electron");

const updater = require("./updater.js");
const path = require("path");

// TRAY
let tray;
let mainWindow;
let trayMenu = Menu.buildFromTemplate([{ role: "quit" }]);

function createTray() {
  const iconPath = path.join(__dirname, "trayTemplate@2x.png");
  const tray = new Tray(iconPath);

  tray.setToolTip("hifiles");

  tray.on("click", (e) => {
    if (e.shiftKey) {
      app.quit();
    } else {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }
  });

  tray.setContextMenu(trayMenu);
}

const createMenu = () => {
  const menuTemplate = [
    {
      label: "File",
      submenu: [{ role: "quit" }],
    },

    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
      ],
    },
    {
      label: "Window",
      submenu: [{ role: "minimize" }, { role: "zoom" }, { role: "close" }],
    },
    {
      label: "About",
      click: () => {
        showAboutDialog();
      },
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};

function createWindow() {
  //UPDATER FUNCTION AFTER 3 SECONDS
  //setTimeout(updater, 3000);
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
  mainWindow.loadURL("https://hifiles.vercel.app");

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
  // Wait for window to finish loading before checking for updates
  mainWindow.once("ready-to-show", () => {
    setTimeout(updater, 3000); // Delay for checking updates after window is ready
  });

  createTray();
  setTimeout(createMenu, 3000);
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

const showAboutDialog = () => {
  const version = app.getVersion();
  dialog.showMessageBox({
    type: "info",
    title: "About hifiles",
    message: `App Version: ${version}\n\nThis is a hifiles desktop app`,
    buttons: ["OK"],
    icon: path.join(__dirname, "/build/icon.png"), // Specify the path to your icon
  });
};
