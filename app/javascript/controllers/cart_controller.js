import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="cart"
export default class extends Controller {
  initialize() {
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (!cart) {
      return;
    }

    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      total += item.price * item.quantity;
      const div = document.createElement("div");
      div.classList.add("mt-2");
      div.innerText = `Item: ${item.name} - ${item.price} - ${item.size} - Quantity: ${item.quantity}`;
      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Remove";
      deleteButton.value = item.id;
      deleteButton.classList.add(
        "bg-gray-500",
        "rounded",
        "text-white",
        "px-2",
        "py-1",
        "ml-2"
      );
      deleteButton.addEventListener("click", this.removeFromCart);
      div.appendChild(deleteButton);
      this.element.prepend(div);
    }

    const totalEl = document.createElement("div");
    totalEl.innerText = `Total R$: ${total}`;
    let totalContainer = document.getElementById("total");
    totalContainer.appendChild(totalEl);
  }

  clear() {
    localStorage.removeItem("cart");
    window.location.reload();
  }

  removeFromCart(event) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const id = event.target.value;
    const index = cart.findIndex((item) => item.id === id);
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.reload();
  }

  checkout() {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const payload = {
      authenticity_token: "",
      cart: cart,
    };

    const csrfToken = document.querySelector("[name='csrf-token']").content;
    fetch("/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((body) => {
            window.location.href = body.url;
          });
        } else {
          // Tente pegar o JSON do erro
          response
            .json()
            .then((body) => {
              const errorEl = document.createElement("div");
              errorEl.classList.add("text-red-500", "mt-4");
              errorEl.innerText = `Erro ao processar seu pedido: ${
                body.error || "Desconhecido"
              }`;

              const errorContainer = document.getElementById("errorContainer");
              if (errorContainer) {
                errorContainer.innerHTML = ""; // Limpa erros anteriores
                errorContainer.appendChild(errorEl);
              }
            })
            .catch((e) => {
              console.error("Falha ao ler resposta de erro:", e);

              const errorEl = document.createElement("div");
              errorEl.classList.add("text-red-500", "mt-4");
              errorEl.innerText = "Erro desconhecido ao processar o checkout";

              const errorContainer = document.getElementById("errorContainer");
              if (errorContainer) {
                errorContainer.innerHTML = "";
                errorContainer.appendChild(errorEl);
              }
            });
        }
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);

        const errorEl = document.createElement("div");
        errorEl.classList.add("text-red-500", "mt-4");
        errorEl.innerText = "Erro de conexão ao tentar finalizar compra.";

        const errorContainer = document.getElementById("errorContainer");
        if (errorContainer) {
          errorContainer.innerHTML = "";
          errorContainer.appendChild(errorEl);
        }
      });
  }
}
