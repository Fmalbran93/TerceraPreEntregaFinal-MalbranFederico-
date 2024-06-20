const products = document.getElementsByClassName("product");
const pagar = document.getElementById("pagar");
const vaciar = document.getElementById("vaciar");
const modalBody = document.getElementById("modalBody");

const arrayProducts = Array.from(products);
console.log(arrayProducts);

const productsInCart = () => {
  try {
    fetch("http://localhost:4000/products/inCart")
      .then((response) => response.json())
      .then((data) => {
        if (data.cartLength > 0) {
          let products = "";
          data.productsInCart.forEach((product) => {
            products += `
            <div class="d-grid">
              <div class="d-flex bg-secondary-subtle p-2 mt-2  rounded align-items-center justify-content-around">
              <div class="d-grid">
                <h6 class="text-dark text-uppercase fw-bold text-center"> ${
                  product.title
                } <h6>
                <h6 class="text-center"><span class="text-dark fw-bold">cantidad:</span> ${
                  product.quantity
                }</h6>
                <h6 class="text-center"><span class="text-dark fw-bold">Precio unitario:</span> $${
                  product.price
                }</h6>
                <h6 class="text-secondary fw-bold text-center"><span class="text-dark fw-bold">Total:</span> ${
                  product.price * product.quantity
                }</h6>
                </div>
                <img src=${product.thumbnail} width="150">
                <button class="btn btn-danger">Eliminar</button>
                </div>
            </div> `;
          });
          modalBody.innerHTML = products;
        } else {
          modalBody.innerHTML = `<h3> Carrito vacio </h3>`;
        }
      });
  } catch (error) {
    console.error(error);
  }
};

arrayProducts.forEach((product) => {
  try {
    product.addEventListener("click", () => {
      const stock = Number(product.getAttribute("data-value"));
      Swal.fire({
        title: "Cuantas unidades desea comprar?",
        input: "number",
        inputAttributes: { autocapitalize: "off" },
        showCancelButton: true,
        confirmButtonText: "Confirmar",
      }).then((response) => {
        if (stock > Number(response.value) && Number(response.value) > 0) {
          Swal.fire({
            title: "Producto agregado al carrito",
            text: `Cantidad: ${response.value}`,
            icon: "success",
          });
          fetch("http://localhost:4000/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product: { _id: product.id, quantity: Number(response.value) },
            }),
          }).then(() => {
            productsInCart();
          });
        } else if (Number(response.value) < 0) {
          Swal.fire({
            title: "La cantidad tiene que ser mayor que 0",
            icon: "warning",
          });
        } else {
          Swal.fire({
            title: "Disculpa no tenemos todas esas existencias",
            icon: "error",
          });
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
});

pagar.addEventListener("click", () => {
  try {
    Swal.fire({
      title: "Gracias por tu compra!",
      text: "Se ha generado la orden de compra!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#73be73",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
    }).then((response) => {
      if (response.isConfirmed) {
        fetch("http://localhost:4000/products/inCart")
          .then((response) => response.json())
          .then((data) => {
            if (data.cartLength > 0) {
              fetch("http://localhost:4000/products", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ finishBuy: true }),
              }).then(() => {
                Swal.fire({
                  title: "Gracias Por tu compra!",
                  icon: "success",
                });
                modalBody.innerHTML = `<h3> Carrito vacio</h3>`;
              });
            } else {
              Swal.fire({
                title: "Carrito vacio",
                icon: "info",
              });
            }
          });
      } else {
        Swal.fire({
          icon: "info",
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
});

vaciar.addEventListener("click", () => {
  try {
    Swal.fire({
      title: "Desea Vaciar el carrito",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#73be73",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
    }).then((response) => {
      if (response.isConfirmed) {
        fetch("http://localhost:4000/products/inCart")
          .then((response) => response.json())
          .then((data) => {
            if (data.cartLength > 0) {
              fetch("http://localhost:4000/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ finishBuy: true }),
              }).then(() => {
                Swal.fire({ title: "Carrito vacio!", icon: "success" });
                modalBody.innerHTML = `<h3> Carrito vacio</h3>`;
              });
            } else {
              Swal.fire({ title: "Carrito vacio", icon: "info" });
            }
          });
      } else {
        Swal.fire({ icon: "info" });
      }
    });
  } catch (error) {
    console.error(error);
  }
});