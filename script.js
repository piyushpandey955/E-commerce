
let bag = document.querySelector(".bag");
let closeCart = document.querySelector(".close");
let body = document.querySelector('body');
let listProduct = document.querySelector(".listProduct");
let listCart = document.querySelector(".listCart");
let products = [];
let cart = [];

//to open and close cart 
bag.addEventListener("click" , () =>{
    body.classList.toggle('showCart');
});

//to close cart when close cart is pressed
closeCart.addEventListener("click" , () =>{
    body.classList.toggle("showCart");
});

//function to open checkout.html on clicking checkout button in cart
const checkOut = () =>{
    window.open(`./checkout.html`, "_self");
}


//function to bring data from products.json to screen
const addDataToHtml = () =>{
    if(products.length > 0){
        products.forEach(product =>{
            let newProduct = document.createElement("div");
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            
            newProduct.innerHTML = `<img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="price">Rs. ${product.price}</div>
            <button class="addCart">ADD TO CART</button>`;

            listProduct.appendChild(newProduct);
        })
    }
}

//eventlistener to add products to cart
listProduct.addEventListener("click" , () =>{
    let positionClick = event.target;
    if(positionClick.classList.contains("addCart")){
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
});

//funtion to add product to cart
const addToCart = (product_id) =>{
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    
    if(cart.length <= 0){
        cart = [
            {
                product_id :  product_id,
                quantity : 1
            }
        ];
    }
    else if(positionThisProductInCart < 0){
        cart.push(
            {
                product_id :  product_id,
                quantity : 1
            }
        );
    }
    else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }

    addCartToMemory();
    viewProductInCart();
}

//function to view the product added to cart in cart list
const viewProductInCart = ()=>{
    listCart.innerHTML = "";
    let totalQuantity = 0;

    if(cart.length > 0){
        cart.forEach(item => {
            totalQuantity = totalQuantity + item.quantity;
            let newItem = document.createElement("div");
            newItem.classList.add("item");
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            console.log(positionProduct);
            let info = products[positionProduct];
            console.log(info);

            listCart.appendChild(newItem);

            newItem.innerHTML = `<div class="image">
            <img src="${info.image}" alt="">
        </div>
        <div class="name">${info.name}</div>
        <div class="totalprice">Rs. ${info.price * item.quantity}</div>
        <div class="quantity">
            <span class="minus"><</span>
            <span>${item.quantity}</span>
            <span class="plus">></span>
        </div>`
        })
    }
}

//function to retain products added to cart in cart even after refreshing the page
const addCartToMemory = ()=>{
    localStorage.setItem("cart" ,JSON.stringify(cart));
}


//event listener on minus and plus to change quantity
listCart.addEventListener('click' , (event)=>{
    let positionClick = event.target;
    if(positionClick.classList.contains("minus") || positionClick.classList.contains( "plus")){
        let product_id = positionClick.parentElement.parentElement.dataset.id ;

        if(positionClick.classList.contains("minus")){
            type = "minus";
        }
        else{
            type = "plus";
        }

        changeQuantityInCart(product_id , type);
    }
});

//function to change quantity of product in cart
const changeQuantityInCart = (product_id , type) =>{
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);

    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch(type){
            case "plus" :
                info.quantity = info.quantity +1;
                break;
            
            default:
                if(info.quantity-1 <= 0){
                    cart.splice(positionItemInCart , 1);
                }
                info.quantity = info.quantity -1;
                break;
        }
    }
    viewProductInCart();
    addCartToMemory();
}

//main function
const initApp = () =>{
    //get data from products.json
    fetch("products.json")
    .then(response => response.json())
    .then(data =>{
        products = data;
        console.log(products);
        addDataToHtml();


        //to get cart products back from memory to cart after you refresh the page
        if(localStorage.getItem("cart")){
            cart = JSON.parse(localStorage.getItem("cart"));
            viewProductInCart();
        }
    })
}
initApp();
