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
  $trackArr = $jsonRequest->tracksFeatures;
  $response = addNewTracks($conn, $trackArr);


  //send the JSON response
  echo json_encode($response);
  //close the connection
  $conn = null;
}


function addNewTracks($conn, $trackArr){

  $response = array("code" => 0, "message" => "");

  
  $sql = 

  "INSERT INTO 
    trackfeature(trackID, acousticness, danceability, energy, instrumentalness, trackKey, liveness, loudness, mode, speechiness, tempo, time_signature, valence) 
  VALUES 
    (:trackID, :acousticness , :danceability, :energy, :instrumentalness, :trackKey, :liveness, :loudness, :mode, :speechiness, :tempo, :time_signature, :valence)
  ON DUPLICATE KEY UPDATE 
    trackID = trackID, 
    acousticness = acousticness, 
    danceability = energy, 
    instrumentalness = instrumentalness,
    trackKey = trackKey,
    liveness = liveness,
    loudness = loudness,
    mode = mode,
    speechiness = speechiness,
    tempo = tempo,
    time_signature = time_signature,
    valence = valence
  ";//On a duplicate, update values

  $stmt = $conn->prepare($sql);



  try{
    
    foreach ($trackArr as $track) {
      
      // Sanitize data
      $trackID = sanitise($track->trackID);
      $acousticness = sanitise($track->acousticness);
      $danceability = sanitise($track->danceability);
      $energy = sanitise($track->energy);
      $instrumentalness = sanitise($track->instrumentalness);
      $trackKey = sanitise($track->trackKey);
      $liveness = sanitise($track->liveness);
      $loudness = sanitise($track->loudness);
      $mode = sanitise($track->mode);
      $speechiness = sanitise($track->speechiness);
      $tempo = sanitise($track->tempo);
      $time_signature = sanitise($track->time_signature);
      $valence = sanitise($track->valence);

      // Bind parameters to the data
      $stmt->bindParam(':trackID', $trackID);
      $stmt->bindParam(':acousticness', $acousticness);
      $stmt->bindParam(':danceability', $danceability);
      $stmt->bindParam(':energy', $energy);
      $stmt->bindParam(':instrumentalness', $instrumentalness);
      $stmt->bindParam(':trackKey', $trackKey);
      $stmt->bindParam(':liveness', $liveness);
      $stmt->bindParam(':loudness', $loudness);
      $stmt->bindParam(':mode', $mode);
      $stmt->bindParam(':speechiness', $speechiness);
      $stmt->bindParam(':tempo', $tempo);
      $stmt->bindParam(':time_signature', $time_signature);
      $stmt->bindParam(':valence', $valence);

      // Execute the query
      $stmt->execute();

    }

    $response["code"] = 1;
    $response["message"] = "tracks features added/updated";
  }
  catch (PDOException $e){
      $response["code"] = 0;
      //$response["message"] = $e->getMessage();
      $response["message"] = $trackArr;
  }

  return $response;

}



    
?>
