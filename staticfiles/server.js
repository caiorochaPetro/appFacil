const express = require('express');
const fileUpload = require('express-fileupload');

const cors = require('cors');
const path = require('path');

const introspective= true;

const app = express();

// Configurar o middleware do express-fileupload
app.use(cors());
app.use(fileUpload());
app.use(express.static('images'));

// Rota para receber o arquivo
app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('Any Files was sended.');
  }

  // O arquivo será acessível através de req.files.nomeDoCampo
  const arquivo = req.files.file;

  // Mover o arquivo para uma pasta de destino
  arquivo.mv('files/' + String(Date.now() + arquivo.name), (err) => {
    if (err) {
      if(introspective){ 
        return (res.status(500).send(err));
      } 
      else{ 
        return "Internal Error"
      };
    }

    res.send('Arquivo enviado com sucesso!');
  });
});

app.get('/images/:filename', (req, res)=>{
  console.log("Rodando")
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, 'images', filename);
  console.log(imagePath);
  res.sendFile(imagePath);
});

// Iniciar o servidor
app.listen(8001, () => {
  console.log('Servidor iniciado na porta 8001');
});