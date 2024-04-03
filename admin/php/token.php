<?php

function getToken($user){

    require_once "./secret.php";
    // get secret key
    $secretKey = getKey();


    // the payload data is encoded as a JSON object 
    $payload = array(
        "username" => $user["username"],
        "loginTime" => time() // could instead set token expiration in an hour e.g."exp" => time() + 3600
    );


    // Generate JWT token
    $token = createJWT($payload, $secretKey);

    // return the JWT token
    return $token;

}

function createJWT($payload, $secretKey) {
    // Create the header
    $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
    $headerBase64 = base64_encode($header);

    // Create the payload
    $payloadBase64 = base64_encode(json_encode($payload));

    // Concatenate the header, payload, and calculate the signature
    $signature = hash_hmac('sha256', $headerBase64 . '.' . $payloadBase64, $secretKey, true);
    $signatureBase64 = base64_encode($signature);

    // Concatenate all parts to form the final JWT
    $jwt = $headerBase64 . '.' . $payloadBase64 . '.' . $signatureBase64;

    return $jwt;
}


?>

