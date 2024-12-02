!macro customHeader
  ; RequestExecutionLevel admin
  ShowInstDetails show
  ShowUninstDetails show
!macroend

!macro customWelcomePage
  # Welcome Page is not added by default for installer.
  !define MUI_WELCOMEPAGE_TEXT "Welcome to the installation setup of LocAi.$\r$\n$\r$\nLocAi is an AI chat desktop application capable of interacting with various AI models both offline and online."
  !insertMacro MUI_PAGE_WELCOME
!macroend

!macro customUnWelcomePage
  !define MUI_WELCOMEPAGE_TEXT "You are about to uninstall LocAi from your computer.$\r$\n$\r$\nAll installed files will be permanently deleted from your computer while user-generated files will remain.$\r$\n$\r$\nPlease Check your local and roaming app data folder for any remaining files."
  !insertmacro MUI_UNPAGE_WELCOME
!macroend

!macro customRemoveFiles
  RMDir /r /REBOOTOK "$LOCALAPPDATA\locai-app3-updater"
  
  Delete "$INSTDIR\chrome_100_percent.pak"
  Delete "$INSTDIR\chrome_200_percent.pak"
  Delete "$INSTDIR\d3dcompiler_47.dll"
  Delete "$INSTDIR\ffmpeg.dll"
  Delete "$INSTDIR\icudtl.dat"
  Delete "$INSTDIR\libEGL.dll"
  Delete "$INSTDIR\libGLESv2.dll"
  Delete "$INSTDIR\LICENSE.electron.txt"
  Delete "$INSTDIR\LICENSES.chromium.html"
  Delete "$INSTDIR\LocAi.exe"
  Delete "$INSTDIR\locaiconfig.json"
  Delete "$INSTDIR\resources.pak"
  Delete "$INSTDIR\snapshot_blob.bin"
  Delete "$INSTDIR\Uninstall LocAi.exe"
  Delete "$INSTDIR\v8_context_snapshot.bin"
  Delete "$INSTDIR\vk_swiftshader.dll"
  Delete "$INSTDIR\vk_swiftshader_icd.json"
  Delete "$INSTDIR\vulkan-1.dll"

  RMDir /r /REBOOTOK "$INSTDIR\locales"
  RMDir /r /REBOOTOK "$INSTDIR\resources"
!macroend

!macro customUnInstall
  DetailPrint "** User generated files will remain on your computer"
  DetailPrint "** Check your local and roaming app data folder for any remaining files"
!macroend