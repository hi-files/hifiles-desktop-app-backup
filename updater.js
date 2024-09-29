const { dialog } = require("electron");
const { autoUpdater } = require("electron-updater");

autoUpdater.setFeedURL({
  provider: "github",
  owner: "yishak621",
  repo: "hifiles-desktop-app-backup",
  token: "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",
});

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

autoUpdater.autoDownload = false;

autoUpdater.on("update-available", () => {
  console.log("Update is available.");

  dialog
    .showMessageBox({
      type: "info",
      title: "Update Available",
      message:
        "A new version of Hifile App is available. Do you want to update now?",
      buttons: ["Update", "No"],
    })
    .then((result) => {
      let buttonIndex = result.response;

      if (buttonIndex === 0) {
        autoUpdater.downloadUpdate();
      }
    });
});

autoUpdater.on("download-progress", (progressObj) => {
  let logMessage = `Download speed: ${progressObj.bytesPerSecond} bytes/sec`;
  logMessage = `${logMessage}\nDownloaded ${progressObj.percent.toFixed(2)}%`;
  logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
  console.log(logMessage);
});

autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox({
      type: "info",
      title: "Update Ready",
      message: "Install and restart now?",
      buttons: ["Yes", "No"],
    })
    .then((result) => {
      let buttonIndex = result.response;

      // If the user chooses to install, quit and install the update
      if (buttonIndex === 0) {
        autoUpdater.quitAndInstall(false, true);
      }
    });
});

// Function to check for and apply updates
module.exports = () => {
  autoUpdater.checkForUpdates();
};
