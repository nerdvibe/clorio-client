import Datastore from 'nedb';
const options = { filename:'./db/wallets.db', autoload:true };
const db = new Datastore(options);

export const isAuthenticated = () => {
    const address = localStorage.getItem('address');
    const privateKey = localStorage.getItem('privateKey');
    if(address && address.trim!=="" && privateKey && privateKey.trim!=="" ){
        return true;
    }
    return false;
}

export const storeSession = (address,callback) => {
    const wallet = { 
        name:"Wallet", 
        address: address,
        id:3, // TODO : TO BE DEFINED
        coins: 0 
    };
    db.insert(wallet,(err,data)=>{
        callback()
    }); 
}

export const readSession = ( callback , goToHome) => {
    db.find({},(error,data)=>{
        if(data.length>0){
            try {
                const row = data[0]
                const dataToReturn = { 
                    ...row
                }
                return callback(dataToReturn)
            } catch (error) {
                clearSession()
                callback({})
                return goToHome()
            }
        }
        callback({})
    })
}

export const clearSession = () => {
    db.remove({}, { multi: true }, function (err, numRemoved) {
    });
}

export const getAddress = (callback) => {
    return db.find({}, function (err, data) {
        return callback(data[0].address)
    });
}
