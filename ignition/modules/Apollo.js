const { buildModule } = require ("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Apollo", (m) => {
    const apollo = m.contract("Rocket", ["Saturn V"]);

    m.call(apollo, "launch", []);

    return { apollo };
});

/* m is an instance of ModuleBuilder
(From the 'C:\Users\ishan\Documents\MTechProject\node_modules\@nomicfoundation\hardhat-ignition\dist\src\modules.js' file)
It is an object with methods to define and configure your smart contract instances.


When the ModuleBuilder objects are called, they create 'future' objects
Future objects represents the result of:
    execution step that Hardhat ignition needs to run to deploy a contract instance or interact with an existing one
So basically, it gives us the expected result of what is supposed to happen once we deploy it.

Now, it is an internal representation and doesn't go against any network.
After a 'Future' is created, it is registered within the module and the method returns it.

Here, 2 future objects 'call' and 'contract' have been created.
    1)'contract' deploys the 'Rocket contract and sets "Saturn V" as the value/parameter to its constructor
    2)'call' indicates that we intend to execute the 'launch' function, with no arguments provided (hence the empty brackets).

Finally, the Future object 'contract' is returned. 
This represents the 'Rocket' contract instance.
This makes the rocket contract accessible to other modules (possibly other contracts)
and tests as well.
*/