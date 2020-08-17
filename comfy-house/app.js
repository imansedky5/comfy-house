//set variables
const productsCenter = document.querySelector(".products-center");
const cartContent = document.querySelector(".content");
const cartItemsNum = document.querySelector(".cart-items");
const cart = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const closeCart = document.querySelector(".close-cart");
const clearCartbtn = document.querySelector(".clear-cart");
const cartTotal = document.querySelector(".total");

let cartItemsum = 0;
let myCart = [];
let amount = 1;
let total = 0;

class Display_products {
      async getData() {
            try {
                  let response = await fetch("products.json");
                  let data = await response.json();
                  let products = data.items;
                  let mapped = products.map((el) => {
                        const { title, price } = el.fields;
                        const image = el.fields.image.fields.file.url;
                        const id = el.sys.id;
                        return { title, price, image, id };
                  });
                  return mapped;
            } catch (err) {
                  console.log(err);
            }
      }
}
class UI {
      displayProducts(products) {
            products.forEach((product) => {
                  let result = `<article class="product">
                                          <div class="img-container">
                                                <img
                                                      src="${product.image}"
                                                      alt="product"
                                                      class="product-img"

                                                />
                                                <button class="bag-btn" id="${product.id}">
                                                      <i class="fas fa-shopping-cart"></i>
                                                       add to bag
                                                </button>
                                          </div>
                                          <h3>${product.title}</h3>
                                          <h4>${product.price}$</h4>
                                    </article>`;
                  productsCenter.innerHTML += result;
            });
      }
}

class Cart {
      static getBtnId(products) {
            const bagBtns = [...document.querySelectorAll(".bag-btn")];

            bagBtns.forEach((btn) => {
                  btn.addEventListener("click", (e) => {
                        // get clicked product
                        let selectedBtnId = e.target.id;
                        e.target.innerText = "in-cart";
                        e.target.disabled = true;

                        let clickedProduct = products.filter(
                              (item) => item.id == selectedBtnId
                        );
                        clickedProduct.forEach((el) => (el.amount = 1));
                        // add selected product to the cart
                        this.addCartItem(clickedProduct);

                        //save selected product in cart array

                        //change cart total
                        // this.setCartTotal();

                        //increase cart-items
                        cartItemsum += 1;
                        cartItemsNum.textContent = `${cartItemsum}`;
                        // show cart by adding hidden classes
                        this.showCart();
                        // this.cartEventListeners();
                        closeCart.addEventListener("click", this.hideCart); ////////or difference with () in invoke
                  });
            });
            this.cartFunctionality();
      }
      static addCartItem(clickedProduct) {
            let DOMitem = `<div class="cart-item" id="${clickedProduct[0].id}">
                                          <img src="${clickedProduct[0].image}" alt="product" />
                                          <div>
                                                <h4>${clickedProduct[0].title}</h4>
                                                <h5>${clickedProduct[0].price}$</h5>
                                                <span class="remove-item" data-id=${clickedProduct[0].id}>remove</span >
                                          </div>
                                          <div>
                                                <i class="fas fa-chevron-up" data-id=${clickedProduct[0].id}></i>
                                                <p class="item-amount">${clickedProduct[0].amount}</p>
                                                <i class="fas fa-chevron-down" data-id=${clickedProduct[0].id}></i>
                                          </div>
                                    </div>`;
            cartContent.innerHTML += DOMitem;
            myCart.push(...clickedProduct);
      }

      static showCart() {
            cart.classList.add("showCart");
            cartOverlay.classList.add("transparentBcg");
            this.setCartTotal();
      }
      static hideCart() {
            cart.classList.remove("showCart");
            cartOverlay.classList.remove("transparentBcg");
      }
      static removeItem(targetedItem) {
            let removedItem = targetedItem.parentElement.parentElement;
            cartContent.removeChild(targetedItem.parentElement.parentElement);
            let removedItemId = removedItem.id;
            let domMatchElement = document.getElementById(`${removedItemId}`);
            domMatchElement.innerHTML = `<i class="fas fa-shopping-cart"></i>
                              ADD TO BAG`;
            domMatchElement.disabled = false;

            let parent = myCart.find((el) => el.id == removedItemId);

            cartItemsNum.innerHTML = `${(cartItemsum -= parent.amount)}`;
            myCart = myCart.filter((item) => item.id != removedItemId);

            this.setCartTotal();
      }
      static increaseItemAmount(targetedId, up) {
            let parent = myCart.find((el) => el.id == targetedId);
            parent.amount = parent.amount + 1;
            up.nextElementSibling.innerText = parent.amount;
            cartItemsum = 0;
            myCart.forEach((el) => (cartItemsum += el.amount));
            cartItemsNum.innerHTML = `${cartItemsum}`;
            this.setCartTotal();
      }
      static decreaseItemAmount(targetedId, down) {
            let parent = myCart.find((el) => el.id == targetedId);
            parent.amount = parent.amount - 1;
            down.parentElement.children[1].innerText = parent.amount;
            cartItemsum = 0;
            myCart.forEach((el) => (cartItemsum += el.amount));
            cartItemsNum.innerHTML = `${cartItemsum}`;
            this.setCartTotal();
      }
      static setCartTotal() {
            total = 0;
            myCart.forEach((el) => (total += el.amount * el.price));
            total = total.toFixed(2);
            cartTotal.innerText = `${total}$`;
      }
      static cartFunctionality() {
            //select cart variables
            const cartItem = document.querySelector(".cart-item");
            const removeItem = document.querySelectorAll(".remove-item");
            const chevronUp = document.querySelectorAll(".fa-chevron-up");
            const chevronDown = document.querySelector(".fa-chevron-down");
            const itemAmount = document.querySelector(".item-amount");

            //cart event listeners
            cartContent.addEventListener("click", (e) => {
                  if (e.target.classList.contains("remove-item")) {
                        let remove = e.target;
                        this.removeItem(remove);
                  } else if (e.target.classList.contains("fa-chevron-up")) {
                        let up = e.target;
                        let targetedId = e.target.dataset.id;
                        this.increaseItemAmount(targetedId, up);
                  } else {
                        let down = e.target;
                        let targetedId = down.dataset.id;
                        this.decreaseItemAmount(targetedId, down);
                  }
            });
            clearCartbtn.addEventListener("click", (e) => {
                  let cartElements = [
                        ...cartContent.querySelectorAll(".remove-item"),
                  ];
                  cartElements.forEach((el) => this.removeItem(el));
            });

            //12event listener clear cartn
            //make total immediatly = 0
            // change cart item num into 0

            //13add constructor to class cart and with out parameters and static and invoke with (new ui())
      }
}

window.onload = () => {
      const product = new Display_products();
      const ui = new UI();
      product.getData().then((products) => {
            ui.displayProducts(products);
            Cart.getBtnId(products);
      });
};
