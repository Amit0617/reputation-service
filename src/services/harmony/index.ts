// import { constants, generateKeyPairSync, privateDecrypt } from "crypto"
// import { hostname } from "os"

// const url = "https://talk.harmony.one/u/"

// export async function getHarmonyUserByUsername(username: string, userApiKey: string) {
//     await fetch(`${url}/${username}/`, {
//         headers: {
//             "User-Api-Key": `${userApiKey}`,
//             "Accept": "application/json"
//         }
//     }).then(response => response.json()).then(data => console.log(data))
//     // return userSummarydetails
// }

// const { publicKey, privateKey } = generateKeyPairSync('rsa', {
//     modulusLength: 4096,
//     publicKeyEncoding: {
//         type: 'pkcs1',
//         format: 'pem',
//     },
//     privateKeyEncoding: {
//         type: 'pkcs1',
//         format: 'pem',
//     },
// })


// export async function signInHarmony() {

//     const url = new URL(`https://talk.harmony.one/user-api-key/new?application_name=interep-harmony`)

//     // url.searchParams.append('auth_redirect', 'http://localhost:3000/') // needs to ask permission from website admin
//     // url.searchParams.append('application_name', applicationName)
//     url.searchParams.append('client_id', hostname())
//     url.searchParams.append('scopes', 'write')
//     url.searchParams.append('public_key', publicKey.toString())
//     url.searchParams.append('nonce', '1')

//     window.open(url, "_blank")
// }

// // decrypt the given key into API key and send requests to forum
// export async function checkUsernameValidity(encodedKey: string) {
//     const trim = encodedKey.trim().replace(/\s/g, '')
//     const decreptedKey = () => privateDecrypt(
//         {
//             key: privateKey,
//             padding: constants.RSA_PKCS1_PADDING,
//         },
//         Buffer.from(trim, 'base64')
//     )

//     const json = decreptedKey.toString()
//     const API = JSON.parse(json).key
//     console.info(`Done. The API key is ${API}`)
// }