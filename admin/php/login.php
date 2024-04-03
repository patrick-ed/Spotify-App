<?php
    header("Content-Type: application/json; charset=UTF-8");
    main();

    function main(){

        require_once "connectToDB.php";
        require_once "token.php";
        require_once "sanitise.php";


         // response codes are code 0 = failure, 1 = success
        // set default code in new dictionary
        //$response = array("code" => 0, "adminID" => "");
        $response = array("code" => 0, "jwt" => "", "adminID" => "");

    
        // capture the input of JSON request from client
        $request = file_get_contents('php://input');

        //decode the JSON so it is useable in php
        $jsonRequest = json_decode($request);


        // prepare the data
        $username = sanitise($jsonRequest->username);
        $enteredPassword = sanitise($jsonRequest->password);

        //set up the parameterised SELECT statement
        $sql = "SELECT adminID, username, password FROM admin WHERE username = :username";

        $stmt = $conn->prepare($sql);

        // bind parameter
        $stmt -> bindParam(':username', $username);
 
        //execute the query
        $stmt->execute();


        //set the fetch mode to associative and get keys and values (dictionary)
        $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
        
        // determine if there is a match
        if ($stmt->rowCount()>0){
            // email exists, so check password

            // put user details in a dictionary
            $user = $stmt->fetch(PDO::FETCH_ASSOC, PDO:: FETCH_ORI_NEXT);

            if (verifyPassword($enteredPassword, $user["password"])) {
                $response["jwt"] = getToken($user);
                $response["code"] = 1;
                $response["adminID"] = $user["adminID"];
            } 
        }

        //send the JSON response
        echo json_encode($response);
        
        //close the connection
        $conn = null;
    
    }
    // Function to hash a password using SHA-256
    function hashPassword($password) {
        return hash('sha256', $password);
    }

    // Function to check if entered password matches the hashed password in the database
    function verifyPassword($enteredPassword, $hashedPasswordFromDatabase) {
        $hashedEnteredPassword = hashPassword($enteredPassword);
        if ($hashedEnteredPassword === $hashedPasswordFromDatabase){
            return true;
        }
        else{
            return false;
        }

    }



    
?>
