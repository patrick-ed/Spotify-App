

async function redirectToAuthCodeFlow(clientId,redirectURL) {
    
    const verifier = genCodeVerifier(128);
    const challenge = await genCodeChallenge(verifier);

    localStorage.setItem("verifier",verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId); //Client ID
    params.append("response_type", "code"); //Response Type
    params.append("redirect_uri", redirectURL); //Redirect URL
    params.append("scope", "user-read-private user-read-email user-top-read user-library-read playlist-modify-public playlist-modify-private"); //Scopes
    params.append("code_challenge_method", "S256"); //Chanllenge method
    params.append("code_challenge", challenge); //Challenge

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function genCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function genCodeChallenge(codeVerifier) {
    console.log(codeVerifier)
    const data = new TextEncoder().encode(codeVerifier);
    console.log(data)
    const digest = await crypto.subtle.digest('SHA-256', data);
    console.log(digest)
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}



async function getAccessToken(clientId, code, redirect_uri) {

    const verifier = localStorage.getItem("verifier");
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirect_uri);
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {"Content-Type":"application/x-www-form-urlencoded"},
        body: params
    });

    const serverResponse = await result.json();
    localStorage.setItem("accessToken",serverResponse.access_token);
    return serverResponse.access_token;
}

export { redirectToAuthCodeFlow, getAccessToken};