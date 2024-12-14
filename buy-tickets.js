document.addEventListener("DOMContentLoaded", function () {
  const buyTicketButton = document.getElementById("buyTicketButton");
  const buyStandardTicketButton = document.getElementById(
    "buyStandardTicketButton"
  );
  let currentEventUrl = ""; // Variabilă pentru a stoca URL-ul evenimentului curent
  let currentStandardEventUrl = ""; // Variabilă pentru a stoca URL-ul standard al evenimentului curent

  // Redirecționează către URL-ul de achiziție de bilete într-un tab nou
  buyTicketButton.onclick = function () {
    console.log("Opening URL:", currentEventUrl); // Log pentru verificare
    if (currentEventUrl) {
      window.open(currentEventUrl, "_blank");
    } else {
      console.error("No URL set for the current event");
    }
  };

  // Redirecționează către URL-ul standard de achiziție de bilete într-un tab nou
  buyStandardTicketButton.onclick = function () {
    console.log("Opening Standard URL:", currentStandardEventUrl); // Log pentru verificare
    if (currentStandardEventUrl) {
      window.open(currentStandardEventUrl, "_blank");
    } else {
      console.error("No Standard URL set for the current event");
    }
  };

  // Ascultă evenimentul de click pe cardurile de evenimente pentru a seta URL-urile curente
  window.addEventListener("click", function (event) {
    const target = event.target.closest(".event-card");
    if (target) {
      currentEventUrl = target.dataset.url;
      currentStandardEventUrl = target.dataset.url;
      console.log("**URL set for current event:", currentEventUrl); 
      console.log(
        "**Standard URL set for current event:",
        currentStandardEventUrl
        ); 
    }
  });
});
