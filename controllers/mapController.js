const path = require("path");
const { getAllActiveExcesses } = require("../services/excess");

module.exports = {
    getMap(req, res, next) {
        const dirName = __dirname.replace(`\\controllers`, '');
        res.sendFile(path.resolve(dirName, "public", "map.html"));    
    },
    async getExcess(req, res, next) {
        res.json(await getAllActiveExcesses())
    }
}