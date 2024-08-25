//updater module
const { dialog } = require("electron");
const { autoUpdater } = require("electron-updater");

autoUpdater.setFeedURL({
  provider: "github",
  owner: "yishak621",
  repo: "hifiles-desktop-app",
  token: "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",
});

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

//disable autodownload
autoUpdater.autoDownload = false;

// single ecport to check for and apply any avaliable updates
module.exports = () => {
  autoUpdater.checkForUpdates();

  //checking if ther is update
  autoUpdater.on("update-available", () => {
    //prompt a user to download update
    dialog
      .showMessageBox({
        type: "info",
        title: "Update avaliable",
        message:
          "A new version of Hifile App is avaliable.do you want to update now?",
        buttons: ["Update", "No"],
      })
      .then((result) => {
        let buttonIndex = result.response;

        //if button 0[update], start downloading the update
        if (buttonIndex === 0) {
          autoUpdater.downloadUpdate();
        }
      });
    //autoUpdater.downloadUpdate()

    // listen for download
    autoUpdater.on("update-downloaded", () => {
      //prompt the user to install the update
      dialog
        .showMessageBox({
          type: "info",
          title: "Update ready",
          message: "Install and restart now?",
          buttons: ["Yes", "No"],
        })
        .then((result) => {
          let buttonIndex = result.response;
          //Install and restart
          if (buttonIndex === 0) {
            autoUpdater.quitAndInstall(false, true);
          }
        });
    });
  });
  console.log(autoUpdater.checkForUpdates());
};
