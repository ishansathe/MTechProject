const { buildModule } = require ("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("AssertC", (m) => {
    const ac = m.contract("AssertConstructor", []);

    return { ac };
})