const express = require('express');
const path = require('path');
const app = express();
const { Contenedor } = require('./src/clases/Contenedor.js');
const fs = require('fs').promises;
let fsModule;
const PORT = 8080;

async function iniciarProceso(){
    try {
        const hasFile = await fsModule.hasFile();
        if(!hasFile){
            const create = await fsModule.createFile();
            if(create !== true){
                throw "Error al crear el archivo";
            }else{
                return true;
            }
        }else{
            return true;
        }       
    } catch (error) {
        console.error(`Error: ${error}`);
        return false;
    }
}

fsModule = new Contenedor(fs, __dirname + '/src/file/productos.txt');
if(!fsModule.checkFs()){
    throw "No se iniciara el servidor por falta de contenido.";
}else{
    const server = app.listen(PORT, () => {
        iniciarProceso().then((res)=>{
            if(res === true){
                iniciarRuteos();
                console.log('Servidor iniciado.');
            }
        })
        .catch((error)=>{error.message});
    })
    server.on("error", error => console.log(`Error en servidor ${error}`));
}

function iniciarRuteos(){ 
    
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    app.use(express.static(path.join(__dirname ,'public')))

    app.get('/',(req,res)=>{
        res.sendFile(__dirname + '/src/html/index.html')
        //res.send('hola')
    })
    app.get('/productos',(req,response)=>{
        fsModule.getAll()
        .then((all)=>{
            response.send(all);
        })
        .catch((error)=>{error.message});
    })
    app.get('/productoRandom',(req,response)=>{
        fsModule.getRandom()
        .then((res)=>{
            response.send(res);
        })
        .catch((error)=>{error.message});
    })
}
