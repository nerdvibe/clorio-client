import Datastore from 'nedb';
// import crypto from 'crypto'; 

// const base_hash = "this is a test"

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

export const storeSession = (address) => {
    // const hash = crypto.pbkdf2Sync(base_hash, 'salt', 2048, 48, 'sha512');
    // const cipher = crypto.createCipher('aes-256-cbc', hash);
    // let encrypted = '';
    // encrypted += cipher.update(privateKey, 'utf8', 'hex');
    // encrypted += cipher.final('hex');
    const wallet = { name:"Wallet", address: address,  // metadata
                    //  enckey: encrypted, pass: hash, // security
                     coins: 0 };         // coins
    db.insert(wallet,(err,data)=>{
        location.replace('/overview')
    }); 
}

export const readSession = ( callback) => {
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
                return location.replace('/')
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
