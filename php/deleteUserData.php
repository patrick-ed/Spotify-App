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
  $userID = sanitise($jsonRequest->id);

  $response1 = deleteSavedTracks($conn, $userID);
  $response2 = deleteUser($conn,$userID);


  //send the JSON response
  echo json_encode($response1);
  //close the connection
  $conn = null;
}

function deleteSavedTracks($conn,$userID){

  $response = array("code" => 0, "message" => "");

  $sql = 

  "DELETE
  FROM usersavedtracks
  WHERE userID = :userID
  ";

  $stmt = $conn->prepare($sql);
  $stmt->bindParam(':userID', $userID);

  

  try{
    $stmt->execute();
    $response["code"] = 1;
    $response["message"] = "user data deleted";
  }
  catch (PDOException $e){
      $response["code"] = 0;
      $response["message"] = $e->getMessage();
  }

  return $response;

}

function deleteUser($conn, $userID){

  $response = array("code" => 0, "message" => "");
  
  $sql = 

  "DELETE
  FROM users
  WHERE userID = :userID
  ";

  $stmt = $conn->prepare($sql);
  $stmt->bindParam(':userID', $userID);

  try{
    $stmt->execute();
    $response["code"] = 1;
    $response["message"] = "user deleted";
  }
  catch (PDOException $e){
      $response["code"] = 0;
      $response["message"] = $e->getMessage();
  }

  return $response;

}



/*


INSERT INTO track(trackID, trackName, artist,duration)
SELECT :trackID, :trackName, :trackName,:duration
WHERE NOT EXISTS (
	SELECT trackID 
    FROM track 
    WHERE trackID = :trackID
);



INSERT INTO track (trackID, trackName, artist,duration)
  VALUES 
      :allTracks
  ON DUPLICATE KEY UPDATE
      trackID = VALUES(trackID), 
      trackName = VALUES(trackName), 
      artist = VALUES(artist), 
      duration = VALUES(duration)"
      ;

*/
    
?>
