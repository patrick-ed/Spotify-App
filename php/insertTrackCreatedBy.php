<?php

header("Content-Type: application/json; charset=UTF-8");
main();

function main(){

  require_once '../admin/php/connectToDB.php';
  require_once "../admin/php/sanitise.php";

  // response codes are:
  // code 0 = failure, 1 = success

  // set default response1


  // capture the input of JSON request from client
  $request = file_get_contents('php://input');

  //decode the JSON so it is useable in php
  $jsonRequest = json_decode($request);
  $connections = $jsonRequest->connections;
  $response = addNewArtist($conn, $connections);


  //send the JSON response
  echo json_encode($response);
  //close the connection
  $conn = null;
}

function addNewArtist($conn, $connections){

  $response = array("code" => 0, "message" => "");

  
  $sql = 

  "INSERT INTO 
    trackcreatedby(trackID, artistID, datePublished, datePrecision) 
  VALUES 
    (:trackID, :artistID, :datePublished, :datePrecision) 
  ON DUPLICATE KEY UPDATE 
    trackID = trackID, 
    artistID = artistID, 
    datePublished = datePublished, 
    datePrecision = datePrecision;
  ";//On a duplicate, update values

  $stmt = $conn->prepare($sql);

  try{
    
    foreach ($connections as $connection) {
      
      // Sanitize data
      $trackID = sanitise($connection->trackID);
      $artistID = sanitise($connection->artistID);
      $datePublished = sanitise($connection->datePublished);
      $datePrecision = sanitise($connection->datePrecision);

      // Bind parameters to the data
      $stmt->bindParam(':trackID', $trackID);
      $stmt->bindParam(':artistID', $artistID);
      $stmt->bindParam(':datePublished', $datePublished);
      $stmt->bindParam(':datePrecision', $datePrecision);

      // Execute the query
      $stmt->execute();

    }

    $response["code"] = 1;
    $response["message"] = "artists connections added/updated";
  }
  catch (PDOException $e){
      $response["code"] = 0;
      $response["message"] = $e->getMessage();
  }

  return $response;

}

    
?>
