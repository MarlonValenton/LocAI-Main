const path = require("path");
const fs = require("fs");
exports.default = async function () {
    const newInstallSectionNshPath = path.resolve(__dirname, "../custom_templates/installSection.nsh");
    const destInstallSectionNshPath = path.resolve(__dirname, ".././node_modules/app-builder-lib/templates/nsis/installSection.nsh");

    const newInstallerNshPath = path.resolve(__dirname, "../custom_templates/installer.nsi");
    const destInstallerNshPath = path.resolve(__dirname, ".././node_modules/app-builder-lib/templates/nsis/installer.nsi");

    const newUninstallerNshPath = path.resolve(__dirname, "../custom_templates/uninstaller.nsh");
    const destUninstallerNshPath = path.resolve(__dirname, ".././node_modules/app-builder-lib/templates/nsis/uninstaller.nsh");

    fs.copyFile(newInstallSectionNshPath, destInstallSectionNshPath, (err) => {});
    fs.copyFile(newInstallerNshPath, destInstallerNshPath, (err) => {});
    fs.copyFile(newUninstallerNshPath, destUninstallerNshPath, (err) => {});
    // fs.renameSync(newInstallSectionNshPath, destInstallSectionNshPath);
    // fs.renameSync(newInstallerNshPath, destInstallerNshPath);
};
