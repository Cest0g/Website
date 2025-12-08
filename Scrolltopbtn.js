const scrollTopLink = document.getElementById("scrollTopLink");

scrollTopLink.addEventListener("click", function(event) {
  event.preventDefault(); // Prevent navigating to index.html
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
