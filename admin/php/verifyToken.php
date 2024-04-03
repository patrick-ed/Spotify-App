<?php

function verifyToken($token, $secretkey){

    $validtoken = false;
    // Split the token into its components
    list($encodedHeader, $encodedPayload, $encodedSignature) = explode('.', $token);

    // Decode the header and payload
    $header = json_decode(base64_decode($encodedHeader), true);
    $payload = json_decode(base64_decode($encodedPayload), true);

    // Recreate the signature using the decoded header and payload
    $calculatedSignature = hash_hmac('sha256', $encodedHeader . '.' . $encodedPayload, $secretkey, true);
    $calculatedSignatureBase64 = base64_encode($calculatedSignature);

    // Compare the calculated signature with the provided signature
    if (hash_equals($calculatedSignatureBase64, $encodedSignature)) {
        // Verification successful
        $validtoken = true;
        //print_r($payload);
    } 

    return $validtoken;
}


?>