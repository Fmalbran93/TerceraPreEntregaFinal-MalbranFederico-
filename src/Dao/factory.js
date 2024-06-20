import configObject from "../config/envConfig.js";

let cartDao, messageDao, orderDao, productDao;
let persistence = configObject.persistence;

switch (persistence) {
    case "MONGO":
        const { cartMongo } = await import("./controllers/Mongo/cartManagerMongo.js");
        const { ordersMongo } = await import("./controllers/Mongo/orderManagerMongo.js");
        const { messageMongo } = await import("./controllers/Mongo/messageManagerMongo.js");
        const { productMongo } = await import("./controllers/Mongo/productManagerMongo.js");
         
        await import("../configServer.js");

        cartDao = cartMongo;
        messageDao = messageMongo;
        orderDao =  ordersMongo;
        productDao = productMongo;
        break;

    case "PERSISTENCE_MONGO":
        const { cartPersistence } = await import("./controllers/mongoPersistence/cartManagerMongoPER.js");
        const { ordersPersistence } = await import("./controllers/mongoPersistence/orderManagerMongoPER.js");
        const { messagePersistence } = await import("./controllers/mongoPersistence/messageManagerMongoPER.js");
        const { productPersistence } = await import("./controllers/mongoPersistence/productManagerMongoPER.js");
 
        await import("../configServer.js");
         
        cartDao = new cartPersistence();
        messageDao = new messagePersistence();
        orderDao = new ordersPersistence();
        productDao = new productPersistence();
        break;

    default:
        break;
};

export {
    cartDao, 
    messageDao,
    orderDao,
    productDao,
    userDao,
};