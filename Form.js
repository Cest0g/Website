const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {'accept': 'application/json' }
    });
    if (response.ok) {
        status.innerHTML = "✅ Bedankt! Je bericht is verzonden.";
        form.reset();
     } else {
        status.innerHTML = "❌ Er ging iets mis. Probeer opnieuw.";
     }
});