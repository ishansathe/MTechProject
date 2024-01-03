//I really gotta start naming these well
//It is easier to keep note of the stuff as well like this

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Sometasd", (m) => {
    const gd = m.contract("GoodDay", ["Ishan"]);

    const greeting1 = m.staticCall(gd, "wishMe", []);
    
    m.call(gd, "changeName", ["The Demon Lord"]);
/*
    const newGreeting = m.staticCall(gd, "wishMe", [], {
        id : "secondGreeting",
    }); 
*/
    return { greeting1};
})