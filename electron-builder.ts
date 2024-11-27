import path from "node:path";
import {$} from "zx";
import type {Configuration} from "electron-builder";

// const appId = "node-llama-cpp.electron.example";
// const productName = "node-llama-cpp Electron example";
// const executableName = "node-llama-cpp-electron-example";
// const appxIdentityName = "node.llama.cpp.electron.example";

const appId = "locai";
const productName = "LocAi";
const executableName = "LocAi";
const appxIdentityName = "locai";

/**
 * @see - https://www.electron.build/configuration/configuration
 */
export default {
    appId: appId,
    asar: true,
    productName: productName,
    executableName: executableName,
    directories: {
        output: "release"
    },
    extraMetadata: {
        postinstall: 'npx node-llama-cpp pull --dir ./models "hf:bartowski/codegemma-2b-GGUF/codegemma-2b-Q8_0.gguf"'
    },

    downloadAlternateFFmpeg: false,
    portable: {requestExecutionLevel: "user", unpackDirName: false, splashImage: null},
    compression: "maximum",
    electronLanguages: "en-US",
    icon: "public/vite.ico",

    // remove this once you set up your own code signing for macOS
    async afterPack(context) {
        if (context.electronPlatformName === "darwin") {
            // check whether the app was already signed
            const appPath = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`);

            // this is needed for the app to not appear as "damaged" on Apple Silicon Macs
            // https://github.com/electron-userland/electron-builder/issues/5850#issuecomment-1821648559
            await $`codesign --force --deep --sign - ${appPath}`;
        }
    },
    // files: [
    //     "dist",
    //     "dist-electron",
    //     "!node_modules/node-llama-cpp/bins/**/*",
    //     "node_modules/node-llama-cpp/bins/${os}-${arch}*/**/*",
    //     "!node_modules/@node-llama-cpp/*/bins/**/*",
    //     "node_modules/@node-llama-cpp/${os}-${arch}*/bins/**/*",
    //     "!node_modules/node-llama-cpp/llama/localBuilds/**/*",
    //     "node_modules/node-llama-cpp/llama/localBuilds/${os}-${arch}*/**/*"
    // ],
    files: [
        "dist",
        "dist-electron",
        "!src",
        "**/*",
        "!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}",
        "!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}",
        "!**/node_modules/*.d.ts",
        "!**/node_modules/.bin",
        "!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}",
        "!.editorconfig",
        "!**/._*",
        "!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}",
        "!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}",
        "!**/{appveyor.yml,.travis.yml,circle.yml}",
        "!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}",
        "!node_modules/node-llama-cpp/bins/**/*",
        "node_modules/node-llama-cpp/bins/${os}-${arch}*/**/*",
        "!node_modules/@node-llama-cpp/*/bins/**/*",
        "node_modules/@node-llama-cpp/${os}-${arch}*/bins/**/*",
        "!node_modules/node-llama-cpp/llama/localBuilds/**/*",
        "node_modules/node-llama-cpp/llama/localBuilds/${os}-${arch}*/**/*",
        "!models",
        "!chat_sessions",
        "!prompts",
        "!.vscode"
    ],

    asarUnpack: ["node_modules/node-llama-cpp/bins", "node_modules/node-llama-cpp/llama/localBuilds", "node_modules/@node-llama-cpp/*"],
    mac: {
        target: [
            {
                target: "dmg",
                arch: ["arm64", "x64"]
            },
            {
                target: "zip",
                arch: ["arm64", "x64"]
            }
        ],

        artifactName: "${name}.macOS.${version}.${arch}.${ext}"
    },
    win: {
        target: [
            {
                target: "nsis",
                arch: ["x64", "arm64"]
            }
        ],

        artifactName: "${name}.Windows.${version}.${arch}.${ext}"
    },
    appx: {
        identityName: appxIdentityName,
        artifactName: "${name}.Windows.${version}.${arch}.${ext}"
    },
    nsis: {
        oneClick: false,
        perMachine: false,
        allowToChangeInstallationDirectory: true,
        deleteAppDataOnUninstall: true,
        createDesktopShortcut: "always",
        createStartMenuShortcut: true,

        include: "installer.nsh"
    },
    linux: {
        target: [
            {
                target: "AppImage",
                arch: ["x64", "arm64"]
            },
            {
                target: "snap",
                arch: ["x64"]
            },
            {
                target: "deb",
                arch: ["x64", "arm64"]
            },
            {
                target: "tar.gz",
                arch: ["x64", "arm64"]
            }
        ],
        category: "Utility",

        artifactName: "${name}.Linux.${version}.${arch}.${ext}"
    },
    extraFiles: {
        filter: ["locaiconfig.json", "installer.nsh", "sample_model.ps1"]
    }
} as Configuration;
