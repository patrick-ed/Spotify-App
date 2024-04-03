<?php

header("Content-Type: application/json; charset=UTF-8");
main();

function main(){
    require_once '../admin/php/connectToDB.php';
    require_once "../admin/php/sanitise.php";
    
  // set default response
  // 0 = user not in db  
  // 1 = user in db
  $response = array("code" => 0, "data" => ""); 

  $request = file_get_contents('php://input');

  //decode the JSON so it is useable in php
  $jsonRequest = json_decode($request);
  $userID = sanitise($jsonRequest->id);
  



    $sql = "SELECT genreartist.genreID, track.trackName, artist.artistName
    FROM track,users,usersavedtracks,trackcreatedby,artist,genreartist
    WHERE track.trackID = usersavedtracks.trackID
    AND users.userID = usersavedtracks.userID
    AND trackcreatedby.trackID = track.trackID
    AND trackcreatedby.artistID = artist.artistID
    AND genreartist.artistID = artist.artistID
    AND users.userID = :userID
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':userID', $userID);
    $stmt->execute();

    // Fetch the results as an associative array
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //set the results;
    if ($stmt->rowCount() > 0) {
        $response["code"] = 1;
        $response["data"] = $results;
    }
    else{

        $response["code"] = 1;
        $response["data"] = $results;

    }

    //send the results back
    echo json_encode($response);

    //close the connection
    $conn = null;
    
}


 ?>