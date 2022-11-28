async function test1p1(driver) {

}

async function test1p2(driver) {

}

module.exports = async function test1(driver) {
    await test1p1(driver);
    await test1p2(driver);
}