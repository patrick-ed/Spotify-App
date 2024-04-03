<?php

header("Content-Type: application/json; charset=UTF-8");
main();

function main(){

  require_once '../admin/php/connectToDB.php';
  require_once "../admin/php/sanitise.php";

  // response codes are:
  // code 0 = failure, 1 = success

  $response = array("code" => 0, "message" => ""); 
  // capture the input of JSON request from client
  $request = file_get_contents('php://input');

  //decode the JSON so it is useable in php
  $jsonRequest = json_decode($request);

   //var_dump($jsonRequest);
   
  // sanitise is a function located in ../cleanup/sanitise.php
  $userID = sanitise($jsonRequest->id);
  $username = sanitise($jsonRequest->username);


  $sql = "INSERT INTO users VALUES(:userID,:username)";

  $stmt = $conn->prepare($sql);
  //bind parameters to the data

  $stmt->bindParam(':userID', $userID);
  $stmt->bindParam(':username', $username);

  try{
    $stmt->execute();
    $response["code"] = 1;
    $response["message"] = "user added";
  }
  catch (PDOException $e){
      $response["code"] = 0;
      $response["message"] = $e->getMessage();
  }


  //send the JSON response
  echo json_encode($response);
  //close the connection
  $conn = null;
}


    
?>
