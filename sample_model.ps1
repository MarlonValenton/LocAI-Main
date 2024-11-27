$url = "https://huggingface.co/velyan/Llama-3.2-1B-Instruct-IQ3_M-GGUF/resolve/main/llama-3.2-1b-instruct-iq3_m-imat.gguf"
$filename = "llama-3.2-1b-instruct-iq3_m-imat.gguf"
Write-Output "Downloading sample .gguf file: $url"
Write-Output "saving in: models/$filename"
New-Item -ItemType Directory -Force -Path "models"
(New-Object net.webclient).Downloadfile($url, "models/$filename")
Write-Output "Download finished. Program will close in 5 secodns"
Start-Sleep 5