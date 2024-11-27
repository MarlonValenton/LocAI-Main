!macro customHeader
  !system "echo '' > ${BUILD_RESOURCES_DIR}/customHeader"
  RequestExecutionLevel admin
!macroend

!macro preInit
  ; This macro is inserted at the beginning of the NSIS .OnInit callback
  !system "echo '' > ${BUILD_RESOURCES_DIR}/preInit"
!macroend

!macro customInstall
  !system "echo '' > ${BUILD_RESOURCES_DIR}/customInstall"
  ExecWait 'powershell .\sample_model.ps1'
!macroend

!macro customUnInstall
  Delete "${PROJECT_DIR}/locales"
  Delete "${PROJECT_DIR}/resources"
!macroend