async function test2p1(driver) {

}

async function test2p2(driver) {

}

module.exports = async function test2(driver) {
    await test2p1(driver);
    await test2p2(driver);
}