<?php


    $conn = "";

    $servername = '127.0.0.1'; // server IP address
    //10.0.0.217
    //127.0.0.1

    $username = 'root'; // username
    //S2200859_P_Dumdum
    //root

    $password = ''; //  password
    //NeaNdcoll-59
    //
    
    $database = 'p_dumdum_db'; // database name
    
    try
    {
        //Print "Connecting ...";
        $conn = new PDO("mysql:host=$servername; dbname=$database", $username, $password); 
        // set the PDO error mode to exception
        $conn -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        //echo "<script>console.log('Connected' );</script>";
        //echo "<br> Connected successfully";
    } 
    catch(PDOException $e){
        echo "connection failed: ".$e->getMessage();
    }
    

?>
