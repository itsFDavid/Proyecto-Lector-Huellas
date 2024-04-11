class dataTMP {
    constructor() {
        if (!dataTMP.sharedData) {
            // Si no existe, inicializa 'sharedData' como un array vacío
            dataTMP.sharedData = [];
        }
    }

    addData(data) {
        // Agrega datos a la propiedad compartida 'sharedData'
        dataTMP.sharedData.push(data);
    }

    getData() {
        // Retorna los datos de la propiedad compartida 'sharedData'
        return dataTMP.sharedData;
    }

    deleteData() {
        // Elimina todos los datos de la propiedad compartida 'sharedData'
        dataTMP.sharedData = [];
    }
}

module.exports = {
    dataTMP
};
