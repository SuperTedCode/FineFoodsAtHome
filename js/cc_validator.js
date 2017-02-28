
//*******Event listener to welcome user in Credit Card Validation page************************
//*****************************************************************88************************
var creditCardtEvent = document.getElementById("cookieUsernameCreditCard");
if(creditCardtEvent) { //only availabe on validation page.
	creditCardtEvent.addEventListener('load',printCardNum(),false);
}
//define the function in the Event listener
function printCardNum () {
	var user = JSON.parse(localStorage.getItem('user'));
	if(user) {//if user is logged out we will redirect to login
		creditCardContent = ("Welcome user "+user);
		creditCardtEvent.innerHTML = creditCardContent;
	} else {
		alert("Your session has timed out. For security reasons you will need to login again, Sorry for any inconvenience caused. Redirecting to login page!!");
		window.location = "login.php";
	}

};

//*******CC validation function call to jquery.creditCardValidator.js plugin ************************
//*****************************************************************88************************

$(function() {
	$isValid=false; //global variable for validator result

	//credit car validator
	$('#cc_number').validateCreditCard(function(result) {
		result.valid ? $isValid=true : $isValid=false;
		//console.log($isValid);
	});

	//Confirm button
	$('.Confirm').on('click', function() {
		//console.log("button "+$isValid);
		var total = JSON.parse(localStorage.getItem("total"));
		document.cookie="total="+total+"; time()+600";//set total in localstorage to cookie called total for confirm.php to use
		$isValid ? $(window).attr("location", "confirm.php") : alert("Not valid CC");
	});
});