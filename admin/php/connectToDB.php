<?php


    $conn = "";

    $servername = '127.0.0.1'; // localhost

    $username = 'root';

    $password = '';
    
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

