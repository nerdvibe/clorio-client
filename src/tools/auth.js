import Datastore from 'nedb';
import crypto from 'crypto'; 

const base_hash = "this is a test"

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

export const storeSession = (address,privateKey) => {
    const hash = crypto.pbkdf2Sync(base_hash, 'salt', 2048, 48, 'sha512');
    const cipher = crypto.createCipher('aes-256-cbc', hash);
    let encrypted = '';
    encrypted += cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const wallet = { name:"Test", address: address,  // metadata
                     enckey: encrypted, pass: hash, // security
                     coins: 0, utxos: [] };         // coins
    db.insert(wallet, ()=> { location.replace('/overview')}); 
}

export const readSession = ( callback) => {
    db.find({},(error,data)=>{
        if(data.length>0){
            try {
                const row = data[0]
                const hash = crypto.pbkdf2Sync(base_hash, 'salt', 2048, 48, 'sha512');
                const cipher = crypto.createDecipher('aes-256-cbc', hash);
                let decrypted = '';
                decrypted += cipher.update(row.enckey, 'hex', 'utf8');
                decrypted += cipher.final('utf8');
                const dataToReturn = { 
                    ...row,
                    enckey:decrypted
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
