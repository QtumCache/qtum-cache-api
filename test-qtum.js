const QtumService = require('./services/qtum-services');

// QtumService.writeData("mint", ["0x8a600dc74b89b1dcd3e5d56f330ce926a26b7c5b", Math.floor(Math.random() * 10000), "0x8a600dc74b89b1dcd3e5d56f330ce926a26b7c5b"])
// .then(supply => console.log(supply))
// .catch(console.log);

QtumService.readInfo('tokenOfOwnerByIndex', ["0x8a600dc74b89b1dcd3e5d56f330ce926a26b7c5b", 3])
.then(res => console.log(res))
.catch(err => console.log(err))
