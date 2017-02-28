<!DOCTYPE html>
<html>
<head>
  <title>Order confirmation</title> 
  <link rel="stylesheet" href="includes/style.css" type="text/css" media="screen" />
  <meta http-equiv="content-type" content="text/html; charset=utf-8" />
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
  <script> // function which is called below to clear orders storage after order has been processed to stop duplicate when user goes back to shoppinglist page
function clearOrdersFun()  { 
  localStorage.removeItem("orders");
};
</script>
  

</head>
<body>
<div class="container-fluid">
  <div id="header"></div>
  <div id="navigation">
    <ul>
      <li><a href="index.html">Home</a></li>
      <li><a href="shoplist.html">Review orders</a></li>
      <li><a href="login.php">logout</a></li>
    </ul>
  </div>
  <div id="content"><!-- Start of the page-specific content. -->

<?php #conform.php

//include page header
//$page_title = 'Order confirmation';
//include('includes/header.html');
//check form submission


  //call the DB connection php
 
if(isset($_COOKIE["total"])) { //Cookie is cleared when order is processed to stop duplicate order.
  require ('mysqli_connect.php'); // Connect to the db.
  
  $u =  $_COOKIE["username"];
  $o =  $_COOKIE["total"];
  
  $q = "INSERT INTO orders (username, order_total) VALUES ('".$u."','".$o."');";
  //$q2 = "SELECT order_id FROM orders WHERE (username='$u');";
  $r = @mysqli_query ($dbc, $q); // Run the query. Note: $dbc is set in the mysqli_connect.php script.
  $orderId = mysqli_insert_id($dbc);
  //check the query ran ok
  if ($r) {
    
    echo '<h1>Thank you!</h1><p>Your order has been processed. The orderID is '.$orderId.'</p>';
    setcookie("total", "", time() - 3600); //delete cookie total so if page refreshed it won't duplicate order.
    echo '<br></br><script type="text/javascript">',
    'clearOrdersFun()</script>';
    
  } else { // If it did not run OK.
    echo '<h1>System Error</h1>
    <p class="error">You order could not be processed due to a system error. We apologize for any inconvenience.</p>'; 
      
    // Debugging message:
    echo '<p>' . mysqli_error($dbc) . '<br /><br />Query: ' . $q . '</p>';
            
  } 

  //close database connection
  mysqli_close($dbc);
  include('includes/footer.html');
  exit();
}
else {//Message if no total cookie due to order been processed already.
   echo '<p class="error">You Order has already been processed. Please do not refresh this page. Use the links above to navigate to a new page or logout. Thank you.</p>';
}
include('includes/footer.html');
exit();
?>
