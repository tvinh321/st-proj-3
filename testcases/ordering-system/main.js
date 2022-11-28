const os1 = require('./os1');
const os2 = require('./os2');

module.exports = async function main(driver) {
    await os1(driver);
    await os2(driver);
}