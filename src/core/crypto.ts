import { constants, generateKeyPairSync, privateDecrypt } from "crypto"

export const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
    },
    privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
    },
})


export const decreptedKey = (trim:string) => privateDecrypt(
    {
        key: privateKey,
        padding: constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(trim, 'base64')
)
