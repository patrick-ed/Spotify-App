<?php

header("Content-Type: application/json; charset=UTF-8");
main();

function main(){

  require_once 'connectToDB.php';
  require_once "verifyToken.php";
  require_once "secret.php";

  // set default response
  $response = array("code" => 0, "data" => "");

  $request = file_get_contents('php://input');

  //decode the JSON so it is useable in php
  $decodedData = json_decode($request);
 
  // grab the webToken
  $token = $decodedData->dataSent->webToken;


  // Retrieve the condition sent
  $condition = $decodedData-> condition;

  // get secret key
  $secretkey = getKey();

  $validToken = verifyToken($token, $secretkey);
  //print_r($validToken);

  
  //  if the webToken is valid
  if ($validToken){
    
    //print_r($condition);

    if ($condition == "allTracks") { 

      $sql = "SELECT trackID,trackName,artist,duration 
      FROM track
      ORDER BY trackName";
      $stmt = $conn->prepare($sql);
    }    

    $stmt->execute();

    // Fetch the results as an associative array
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    //set the results;
    if ($stmt->rowCount() > 0) {
      $response["code"] = 1;
      $response["data"] = $results;
    }
    //send the results back
    echo json_encode($response);

    //close the connection
    $conn = null;
  }
}


 ?>