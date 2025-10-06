document.addEventListener("DOMContentLoaded", () => {
  let count = localStorage.getItem("reviewCount") || 0;
  count++;
  localStorage.setItem("reviewCount", count);

  const counter = document.getElementById("reviewCount");
  counter.textContent = count;

  // Trigger animation
  counter.classList.add("show");
});
