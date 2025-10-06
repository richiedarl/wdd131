// Product Array
const products = [
  { id: "prod1", name: "Laptop Pro 15" },
  { id: "prod2", name: "Wireless Earbuds" },
  { id: "prod3", name: "Smartphone XL" },
  { id: "prod4", name: "Gaming Mouse" },
  { id: "prod5", name: "4K Monitor" }
];

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("productName");

  // Populate select dynamically
  products.forEach(product => {
    const option = document.createElement("option");
    option.value = product.name;
    option.textContent = product.name;
    select.appendChild(option);
  });
});
