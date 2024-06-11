const html5QrCode = new Html5Qrcode("qr-code-element", { /* opções de configuração */ });

const startCam = document.querySelector(".start-cam");
const stopCam = document.querySelector(".stop-cam");
const inputOfCod = document.querySelector("#idpedido");
const confirmRequest = document.querySelector('#confirm-request');

let currentCameraId = null;
let isCameraStarted = false; // Verifica se a câmera foi iniciada

// Função para iniciar a câmera com zoom
function startCameraWithZoom(zoomLevel) {
    Html5Qrcode.getCameras().then(cameras => {
        if (cameras && cameras.length) {
            // Tenta encontrar a câmera traseira
            const backCamera = cameras.find(camera => 
                camera.label.toLowerCase().includes('traseira') || 
                camera.label.toLowerCase().includes('back')
            );

            // Seleciona a câmera traseira se encontrada, caso contrário a primeira câmera
            currentCameraId = backCamera ? backCamera.id : cameras[0].id;

            // Inicia a câmera com o zoom definido
            html5QrCode.start(
                currentCameraId, 
                { fps: 10, qrbox: 250, zoom: zoomLevel }, // Adiciona a opção de zoom
                (decodedText, decodedResult) => {
                    // Manipular o texto decodificado
                    console.log(`Código QR detectado: ${decodedText}`);
                    inputOfCod.value = decodedText;

                    if (inputOfCod.value && !isCameraStarted) {
                        isCameraStarted = true; // Define a flag para evitar múltiplos cliques
                        stopCam.click();

                        setTimeout(() => {
                            confirmRequest.click(); 
                        }, 1000);
                    }
                }
            ).catch(err => {
                // Manipular erro ao iniciar
                console.error(`Não foi possível iniciar a digitalização: ${err}`);
            });
        }
    }).catch(err => {
        // Manipular erro ao obter câmeras
        console.error(`Erro ao obter câmeras: ${err}`);
    });
}

// Função para parar a câmera
stopCam.addEventListener("click", () => {
    document.documentElement.classList.remove('openCam');
    html5QrCode.stop().then(() => {
        console.log("Digitalização de código QR parada.");
        isCameraStarted = false; // Reseta a flag quando a câmera é parada
    }).catch(err => {
        console.error(`Não foi possível parar a digitalização: ${err}`);
    });
});

// Inicia a câmera com zoom ao clicar no botão "startCam"
startCam.addEventListener("click", () => {
    document.documentElement.classList.add('openCam');
    startCameraWithZoom(3.0); // Defina o zoom inicial aqui (1.5 é apenas um exemplo)
});
