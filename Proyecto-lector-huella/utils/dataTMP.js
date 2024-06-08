class dataTMP {
    constructor() {
        if (!dataTMP.sharedData) {
            dataTMP.sharedData = [];
        }
    }

    addData(data) {
        dataTMP.sharedData.push(data);
    }

    getData() {
        return dataTMP.sharedData;
    }

    deleteData() {
        dataTMP.sharedData = [];
    }
}

module.exports = {
    dataTMP
};
