class Contenedor{
    constructor(fs, fileName){
        this.fs = fs;
        this.fileName = fileName;
    }
    checkFs(){
        return (typeof this.fs === 'object' && this.fs.writeFile != undefined && this.fs.writeFile.constructor.name == 'AsyncFunction')?true:false;
    }
    async hasFile(){
        try {
            await this.fs.readFile(this.fileName);
            return true;
        } catch (error) {
            return false;
        }
    }
    async createFile() {
        try {
            await this.fs.writeFile(this.fileName, JSON.stringify([]));
            return true;
        } catch (error) {
            console.error(`Lo sentimos, no podemos crear el archivo: ${error.message}`);
            return false;
        }
    }
    async getAll(){
        try {
            const content = await this.fs.readFile(this.fileName);
            const data = await JSON.parse(content);
            return data;
        } catch (error) {
            return false;
        }
    }
    async getRandom(){
        let selected;
        const content = await this.getAll();
        selected = Math.floor(Math.random() * content.length);
        return content[selected];
    }
    async writeFile(content){
        try {
            await this.fs.writeFile(this.fileName, JSON.stringify(content));
            return true;
        } catch (error) {
            console.error(`Error al escribir el archivo: ${error.message}`);
        }
    }
    async save(obj){
        let id;
        const content = await this.getAll();
        if(content.length > 0){
            let ids = content.map(function(item) {
                return item.id;
            });
            id = Math.max(...ids) + 1;
        }else{
            id = 1;
        }
        obj['id'] = id;
        content.push(obj);
        const insertion = await this.writeFile(content);
        return (insertion === true)?id:null;
    }
    async getById(id){
        const content = await this.getAll();
        const element = content.filter((item) => (item.id == id));
        return (element.length < 1)?null:element;        
    }
    async deleteById(id){
        const content = await this.getAll();
        const itemIndex = content.findIndex((item) => (item.id == id));
        if(itemIndex != -1){
            content.splice(itemIndex, 1);
            this.writeFile(content);
        }      
    }
    async deleteAll(){
        this.createFile();
        // reutilizo la funciona para vaciar el archivo.
    }
}

module.exports = {
    Contenedor,
};