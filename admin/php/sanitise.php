 <?php
    function sanitise($data) {
        
        //clean up the data
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;

    }
?>