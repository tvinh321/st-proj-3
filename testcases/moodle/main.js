const moodle1 = require('./moodle1');
const moodle2 = require('./moodle2');

module.exports = async function main(driver) {
    await moodle1(driver);
    await moodle2(driver);
}