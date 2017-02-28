//**************************************************************************
//Global varibales
if(total == undefined) {
	var total = 0;
}

if(localStorage.getItem("cart") == undefined) {
	var cart = 0
	$("h3[id='cart']").html(cart);

} else {
	var cart = JSON.parse(localStorage.getItem("cart"));
	$("h3[id='cart']").html(cart);
}



//**********************EVENTLISTENER HOME/Lunch/Dinner/Desert pages*********************************************
//**********************Add username to Nav bar with link to cart************

//add a load event listener to an HTML element with the id below.
var build = document.getElementById("cookieUsername");
if(build) { //not available in chart page.
	build.addEventListener('load',printUser(),false);
}
//define the function in the Event listener to check for and get the username cookie.
function printUser () {
	var cookieArray = document.cookie.split(';'); // seperate the cookie string to an array of cookies
	var cookieUser = cookieArray.find(getUser); // find the username cookie
	if(cookieUser) { //if username cookie found do this
	cookieUser = cookieUser.slice(9); //remove the start of the string "username="
	localStorage.setItem("user", JSON.stringify(cookieUser)); //sets username in localStorage for reference.
	content = '<a href="shoplist.html">Welcome ' + cookieUser + '</a>'; //Adds a link to shoppingcart webpage
	//content += '<button'
	build.innerHTML = (content); //Place text to html where listener was placed.
	} else { // if username cookie not found do this
		//content = '<a class="error" href="login.php">Sorry You are not logged in</a>';
		//build.innerHTML = (content);
		alert("You must first be logged in, Redirecting to login page!!");//alerts the user if they are not logged in
		window.location = "login.php"; //redirects the user to the login page
	}
};


function getUser(string) {
    return string.startsWith("username"); //in login.php a cookiename "username" is defined and set to the username value from the login form.
};

//**************Event listener to welcome user in cart page************************
//*****************************************************************88************************
var cartEvent = document.getElementById("cookieUsernameOrderList");
if(cartEvent) { //only availabe on chart page.
	cartEvent.addEventListener('load',printWelcome(),false);
}
//define the function in the Event listener
function printWelcome () {
	var cookieArray = document.cookie.split(';'); // seperate the cookie string to an array of cookies
	var welUser = cookieArray.find(getUser); // find the username cookie
	//var welUser = JSON.parse(localStorage.getItem('user'));
	if(welUser) {//if user is logged out we will redirect to login
		welUser = welUser.slice(9);//remove the start of the string "username="
		welcomeContent = ("Welcome user "+welUser);
		cartEvent.innerHTML = welcomeContent;
	} else {
		alert("You must first be logged in, Redirecting to login page!!");
		window.location = "login.php";
	}

};

//*****************Print orderd items from storage to cart page*************

//Add event listener to shopping cart webpage to print itmes from storage
var orders = document.getElementById("ordersDiv");
if (orders) { //If list id is found do this
	orders.addEventListener('load',printOrders(),false);
};

function printOrders () {
	var rowList = "";
	total = 0; //reset total when chart page refreshed
	var ol = document.getElementById("list"); //target ol tag
	//code to retreive and add order items from local storage to webpage
	var list = JSON.parse(localStorage.getItem("orders"));
	if(list) {//check if any orders
	//cart = list.length; //count of items
	//$("h3[id='cart']").html(cart);
	if(list!=null) { //if no items are added it would be null
		for(i=0;i<list.length;i++) { //loop the array of objects
			var name = list[i].name; //item name
			var price = list[i].price //item price
			var row = ("<li>"+name+"  Cost €"+price.toFixed(2)+"</li>");//add li item
			rowList += row;
			total += list[i].price; // add to Total price
			total.toFixed(2); // set total as x.xx
			localStorage.setItem("total",JSON.stringify(total));
		}
	}
	rowList += ("<b><h3 id='totalCost'>Total cost: €"+total.toFixed(2)+"</h3></b>");
	ol.innerHTML = rowList; // insert rows of li items
	}
	$('#totalCost').hide().delay(500).fadeIn(1500)//Add some style to Total on shopping list/cart page
};

//*****************************************************************************
//*****************eventlistener to remove itmes when clicked*******************

var table = document.getElementById("list");
if(table) {
	table.addEventListener('click', removeItem, false);
};

function removeItem() {
	//add code to remove items that are clicked on
	var liE = event.target; //targer the li node
	var olE = liE.parentNode; //target the ol node
	if(liE.nodeName =="LI") { //If user clicks on Total which is in a P tag it is ignored.
		olE.removeChild(liE); // remove the targeted list item
		//remove from local storage
		var string = liE.innerHTML; //string of order removed
		var words = string.split(" ");//seperate the name from cost in string
		var itemName=words[0]; //set variable to string name
		var listOrders = JSON.parse(localStorage.getItem("orders")); //Get list of array objs of orders
			for(i=0;i<listOrders.length;i++) {//loop through orders array
				if(listOrders[i].name == itemName) {//if item name matches array element dp something
				listOrders.splice(i,1); //remove matched obj in array identified by name property
				localStorage.setItem("orders", JSON.stringify(listOrders));//reset locat storage
				i = listOrders.length; //incase the same item is entered twice we only want one to be removed.
				}
			}
		//update Total price
		var prices = string.split("€");//seperate the cost in the HTML string
		var itemPrice = parseFloat(prices[1]).toFixed(2); //cost will be 2nd string in the new array, fix to 2decimal pts
		total -= itemPrice;//subtract the item price from total
		total.toFixed(2);//reset total as two decimal places.
		if(total<0) {total == 0} //Reset total to 0 if above line of code goes below 0 i.e. rounding to -0.01
		localStorage.setItem("total",JSON.stringify(total));//reset total in localStorage
		$("#totalCost").html("Total cost: €"+total.toFixed(2));//reset the total in HTML
		//update cart count
		if(cart > 0) {
			cart--
			localStorage.setItem("cart",JSON.stringify(cart));
			$("h3[id='cart']").html(cart);
		}
	}
}; 

//***********************add items when clicked ******************************
//*****************************************************************************
//function to add items when clicked to ordersList object

if(localStorage.getItem("orders") == undefined) {
	var ordersList = [];//No ordeers so creates variable array
}
else {// orders already in localStorage so populates array
	var ordersList = JSON.parse(localStorage.getItem("orders"));
}

function newItem(name, price) { // function to create order obj
	this.name = name;
	this.price = price;
};

function add(item) {

	var e = window.event.target;
    //console.log(e);
	$(e).hide().delay(100).fadeIn(1500); // add a fade style to let user aware item was added.

	switch (item) {
		case 'butter':
			var item = new newItem('butter',1.99)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders",JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'bread':
			var item = new newItem('bread',1.20)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'cheese':
			var item = new newItem('cheese',1.00)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'chives':
			var item = new newItem('chives',0.50)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'sliceHam':
			var item = new newItem('sliceHam',2.99)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'onion':
			var item = new newItem('onion',0.99)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'celery':
			var item = new newItem('celery',3.99)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'carrot':
			var item = new newItem('carrot',0.99)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'potatoes':
			var item = new newItem('potatoes',5.99)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'butternutSquash':
			var item = new newItem('butternutSquash',2.99)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'chicken':
			var item = new newItem('chicken',5.99)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'pepper':
			var item = new newItem('pepper',0.59)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'lentils':
			var item = new newItem('lentils',0.79)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'garlic':
			var item = new newItem('garlic',2.59)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'tomatoes':
			var item = new newItem('tomatoes',3.69)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'blackOlives':
			var item = new newItem('blackOlives',3.45)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'cilantro':
			var item = new newItem('cilantro',0.59)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'eggs':
			var item = new newItem('eggs',2.49)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'ginger':
			var item = new newItem('ginger',1.49)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'curry':
			var item = new newItem('curry',1.22)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'coconut':
			var item = new newItem('coconut',3.15)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'vegetableOil':
			var item = new newItem('vegetableOil',4.00)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'sirloin':
			var item = new newItem('sirloin',10.00)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'groundnutOil':
			var item = new newItem('groundnutOil',3.00)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'asparagus':
			var item = new newItem('asparagus',4.99)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'salmon':
			var item = new newItem('salmon',7.00)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'lemons':
			var item = new newItem('lemons',4.00)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'sunflowerOil':
			var item = new newItem('sunflowerOil',7.00)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'vinegar':
			var item = new newItem('vinegar',4.00)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'biscuit':
			var item = new newItem('biscuit',2.50)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'softCheese':
			var item = new newItem('softCheese',4.99)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'sugar':
			var item = new newItem('sugar',2.57)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'yogurt':
			var item = new newItem('yogurt',1.65)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'flour':
			var item = new newItem('flour',4.57)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'raspberry':
			var item = new newItem('raspberry',1.99)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'icingSugar':
			var item = new newItem('icingSugar',3.40)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'casterSugar':
			var item = new newItem('casterSugar',2.11)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'self-raising-flour':
			var item = new newItem('self-raising-flour',3.26)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'raspberryJam':
			var item = new newItem('raspberryJam',2.24)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'doubleCream':
			var item = new newItem('doubleCream',1.96)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'vanillaPudding':
			var item = new newItem('vanillaPudding',2.20)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'milk':
			var item = new newItem('milk',1.20)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'chocolate-cake-mix':
			var item = new newItem('chocolate-cake-mix',5.20)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'cinnamon':
			var item = new newItem('cinnamon',1.10)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'coffee-flavored-liqueur':
			var item = new newItem('coffee-flavored-liqueur',3.20)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'instant-espresso-coffee':
			var item = new newItem('instant-espresso-coffee',4.20)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;
		case 'chocolate-chips':
			var item = new newItem('chocolate-chips',3.60)
			ordersList.push(item);//add item to array
			localStorage.setItem("orders", JSON.stringify(ordersList));//reset localStorage value
			cart++ //increase the cart count
			localStorage.setItem("cart",JSON.stringify(cart));//reset cart value in localStorage
			$("h3[id='cart']").html(cart); //update the cart value into the HTML cart
			break;

	}
};

//********************Function to direct user to payment*****************
//*****************************************************************************

function validate () {
	if(localStorage.getItem("orders") == null || total <= 0) {//only process if orders are there
		alert("You have not selected any items");

	}
	else {location.href = "validate.html";}
};

//**********************Function invoked to clear cart*******************

function clearList () {
	localStorage.removeItem("orders");
	localStorage.removeItem("cart");
	location.reload();
};