import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static values = { size: String, product: Object };

  addToCart() {
    console.log("Product: ", this.productValue);
    const cart = localStorage.getItem("cart");
    if (cart) {
      const cartArray = JSON.parse(cart);
      const foundIndex = cartArray.findIndex(
        (item) =>
          item.id === this.productValue.id && item.size === this.sizeValue
      );
      if (foundIndex >= 0) {
        cartArray[foundIndex].quantity =
          parseInt(cartArray[foundIndex].quantity) + 1;
      } else {
        cartArray.push({
          id: this.productValue.id,
          name: this.productValue.name,
          price: this.productValue.price,
          size: this.sizeValue,
          quantity: 1,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cartArray));
    } else {
      const cartArray = [];
      cartArray.push({
        id: this.productValue.id,
        name: this.productValue.name,
        price: this.productValue.price,
        size: this.sizeValue,
        quantity: 1,
      });
      localStorage.setItem("cart", JSON.stringify(cartArray));

    }

    this.showNotification(
      `✅ ${this.productValue.name} was added to cart!`
    );
  }

  selectSize(e) {
    this.sizeValue = e.target.value;
    const selectedSizeEl = document.getElementById("selected-size");
    selectedSizeEl.innerText = `Selected Size: ${this.sizeValue}`;
  }

  showNotification(message) {
    let notification = document.getElementById("cart-notification");

    if (!notification) {
      notification = document.createElement("div");
      notification.id = "cart-notification";
      notification.classList.add(
        "fixed",
        "bottom-4",
        "right-4",
        "bg-laranja-escuro",
        "text-white",
        "px-8",
        "py-6",
        "rounded-md",
        "shadow-lg",
        "transform",
        "opacity-0",
        "translate-y-4",
        "transition-all",
        "duration-500",
        "ease-in-out",
        "z-50"
      );
      document.body.appendChild(notification);
    }

    notification.textContent = message;

    notification.classList.remove("opacity-0", "translate-y-4");
    notification.classList.add("opacity-100", "translate-y-0");

    setTimeout(() => {
      notification.classList.remove("opacity-100", "translate-y-0");
      notification.classList.add("opacity-0", "translate-y-4");
    }, 3000);
  }
}
