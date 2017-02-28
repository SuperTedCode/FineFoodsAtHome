<?php # login.php
// This is a login page
//Remove and username cookie to refresh login
setcookie("username", "", time() - 3600); //delete cookie username so if page 

$page_title = 'Login';
include ('includes/header.html');
include ('includes/login.html');

// Check for form submission:
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

	//connect to the database - hint: require
	require('mysqli_connect.php');		
	//perform validation ensuring all form fields contain values	
	if(empty($_POST['username']) || empty($_POST['pass'])) {
		echo '<p class="error"> You need to enter a username and Password</p>';
	}
	else{ 

	//Build a select string with a WHERE clause on username/password and run the query on the database
	//for Example:
	$user=$_POST['username'];
	$passw=$_POST['pass'];
	$q = "SELECT user_id FROM users WHERE (uname='$user' AND pw=SHA1('$passw') )";
	
	//Note the password is wrapped in a SHA1 function. This encrypts the password value which will checked against the encrypted password in the database table.
	
	//run the query:
	$r = @mysqli_query($dbc, $q); //note: $dbc is set in the mysqli_connect.php script.
	
	//check if any rows returned:
	$num = @mysqli_num_rows($r);
		if ($num == 1) { // Match was made.
			//set username in session storage
			$cookie_name = "username";
			setcookie($cookie_name, $user, time() + 3600);
			#$_SESSION["username"] = $user;

			// Close the database connection.
			mysqli_close($dbc);
			//Navigate to shop.php:
			
			header('Location: index.html');
			//exit script:
			exit();
				
		} else { // Invalid username/password combination.
			echo '<h1>Error!</h1>
			<p class="error">The username and password do not match those on file. Please try again.</p>';

			mysqli_close($dbc);
		}
		

	// Close the database connection.
}		
} // End of the main Submit conditional.

include ('includes/footer.html'); 

?>

