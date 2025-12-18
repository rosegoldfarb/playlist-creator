import SecureStore from 'expo-secure-store'
import InAppBrowser from 'react-native-inappbrowser-reborn'
// can just be a js file
const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  // TODO: use react native solution
  return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const requestUserAuthorization = async () => {
    const codeVerifier  = generateRandomString(64);
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed);

    const clientId = "abc" //TODO
    const redirectUri = "uri" //TODO - get from config

    const scope = 'user-read-private user-read-email'; //TODO: read up on scopes, choose correct ones
    const authUrl = new URL("https://accounts.spotify.com/authorize")

    // TODO: make this work with react native
    await SecureStore.setItemAsync('code_verifier', codeVerifier);

    const params =  {
      response_type: 'code',
      client_id: clientId,
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
    }

    authUrl.search = new URLSearchParams(params).toString();
    
    await InAppBrowser.open(authUrl.toString());
    // Need to handle code retrieval separately 
    // const urlParams = new URLSearchParams(window.location.search);
    // return urlParams.get('code');

}

const getToken = async (code: string) => {

  const codeVerifier = await SecureStore.getItemAsync('code_verifier');
  const clientId = "abc" //TODO
  const redirectUri = 'uri' //TODO

  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier!, // TODO, handle null code verifier first
    }),
  }

  const body = await fetch(url, payload);
  const response = await body.json();

  await SecureStore.setItemAsync('access_token', response.access_token);
}
