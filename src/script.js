document.addEventListener("DOMContentLoaded", function () {
  const serverUrl = "http://localhost:3000/events"; // URL-ul serverului local
  const searchButton = document.getElementById("searchButton");
  const searchInput = document.getElementById("searchInput");
  const eventContainer = document.getElementById("eventContainer");
  const modalEventName = document.getElementById("modalEventName");
  const paginationContainer = document.getElementById("paginationContainer");
  const span = document.getElementsByClassName("close")[0];
  const modal = document.getElementById("myModal");
  const eventsPerPage = 20;
  let currentPage = 1;

  // Set background color for main page
  document.body.style.backgroundColor = "black";

  // Fetch initial events when the page loads
  fetchEvents(serverUrl, eventsPerPage, currentPage);

  // Event listener for the search button
  searchButton.addEventListener("click", function () {
    const searchTerm = searchInput.value;
    console.log("Search Term:", searchTerm); 
    if (searchTerm) {
      currentPage = 1; // Reset to first page on search
      fetchEvents(serverUrl, eventsPerPage, currentPage, searchTerm);
    } else {
      alert("Please enter an event name to search");
    }
  });

  // Deschide modalul
  eventContainer.addEventListener("click", function (event) {
    const target = event.target.closest(".event-card");
    target.style.zIndex = "2";
    console.log("Modal: ", target.name);
    if (target) {
      modal.style.display = "block";
      modal.style.zIndex = "3";
      modalEventName.textContent = target.dataset.name;
    }
  });

  // Închide modalul
  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // ? ultima care parea buna
  function fetchEvents(url, size, page, searchTerm = "") {
    const paginatedUrl = `${url}?size=${size}&page=${page - 1}${
      searchTerm ? `&keyword=${searchTerm}` : ""
    }`;
    console.log("Fetching events from URL:", paginatedUrl); 
    fetch(paginatedUrl)
      .then((response) => {
        console.log("Raw response:", response); // Log pentru răspuns brut
        if (!response.ok) {
          console.error(
            `HTTP error! Status: ${response.status} - ${response.statusText}`
          ); // Log pentru codul de eroare
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        console.log("Events fetched:", data); // Log pentru verificare a răspunsului
        if (data._embedded && data._embedded.events) {
          eventContainer.innerHTML = ""; // Golește conținutul anterior
          paginationContainer.innerHTML = ""; // Golește navigarea între pagini
          const events = data._embedded.events.filter(isValidEvent);
          console.log("Valid events to be processed:", events);
          populateEvents(events);
          const totalPages = Math.min(
            30,
            Math.ceil(data.page.totalElements / size)
          ); // Limitează numărul total de pagini la 30

          createPagination(totalPages, page, searchTerm);
        } else {
          console.error("No events found in the response");
          eventContainer.innerHTML = "<p>No events found.</p>";
                  eventContainer.style.color = "white";
                  eventContainer.style.fontSize = "30px";
                  eventContainer.style.display = "flex";
                  eventContainer.style.flexDirection = "row";
                  eventContainer.style.justifyContent = "center";
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        eventContainer.innerHTML = `<p>Error fetching events. Please try again later. ${error.message}</p>`;
      });
  }

  // Funcție pentru a verifica dacă un eveniment este valid pe baza proprietăților care există întotdeauna
  function isValidEvent(event) {
    return event && event.name && event.url;
  }

  // Collect all events from all pages for search
  function collectAllEvents(url, size, totalPages, searchTerm) {
    let allEvents = [];
    let requests = [];

    for (let i = 0; i < totalPages; i++) {
      const paginatedUrl = `${url}?size=${size}&page=${i}${
        searchTerm ? `&keyword=${searchTerm}` : ""
      }`;
      console.log("Fetching events from URL (all pages):", paginatedUrl); 
      requests.push(
        fetch(paginatedUrl)
          .then((response) => response.json())
          .then((data) => {
            if (data._embedded && data._embedded.events) {
              const validEvents = data._embedded.events.filter(isValidEvent);
              allEvents = allEvents.concat(validEvents);
            }
          })
          .catch((error) => {
            console.error(`Error fetching events from page ${i}:`, error);
          })
      );
    }

    Promise.all(requests)
      .then(() => {
        eventContainer.innerHTML = ""; // Clear previous content
        if (allEvents.length > 0) {
          console.log("All valid events to be processed:", allEvents);
          populateEvents(allEvents);
        } else {
          eventContainer.innerHTML = "<p>No events found.</p>";
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        eventContainer.innerHTML =
          "<p>Error fetching events. Please try again later.</p>";
      });
  }

  function populateEvents(events) {
    eventContainer.innerHTML = ""; // Clear previous content

    events.forEach((event) => {
      // Log pentru verificarea fiecărui eveniment
      console.log("Processing event:", event);

      // Verifică dacă datele există înainte de a le accesa
      const eventName = event?.name || "Unknown Event";
      const eventUrl = event?.url || "#";
      // const eventStandardUrl = event?.priceRanges || "#"; // Asigură-te că standardUrl există

      // Date și locație
      const eventDate = event?.dates?.start?.dateTime
        ? new Date(event.dates.start.dateTime).toLocaleDateString()
        : "Unknown Date";
      const eventLocation = event?._embedded?.venues?.[0]
        ? `${event._embedded.venues[0].name}, ${event._embedded.venues[0].city.name}`
        : "Unknown Location";

      // Imaginea evenimentului
      const eventImage =
        event.images && event.images[0]?.url ? event.images[0].url : "";

      const eventCard = document.createElement("div");
      eventCard.classList.add("event-card");
      eventCard.dataset.name = eventName;
      eventCard.dataset.url = eventUrl; // Store URL in data attribute
      eventCard.style.backgroundColor = "black"; // Schimbă fundalul cardului în negru
      eventCard.style.border = "1px solid black";
      eventCard.style.position = "relative";

      const square = document.createElement("div");
      square.classList.add("square");
      square.style.borderRadius = "50px 0px 50px 0px";
      square.style.border = "1px solid rgba(238, 30, 203, 0.3)";
      square.style.backgroundColor = "transparent";
      square.style.position = "absolute";
      square.style.top = "0";
      square.style.right = "0";
      square.style.width = "80%";
      square.style.height = "40%";
      square.style.zIndex = "1";
      eventCard.appendChild(square);

      const eventImageElem = document.createElement("img");
      eventImageElem.classList.add("event-image");
      eventImageElem.src = eventImage;
      eventImageElem.alt = `${eventName} Image`;
      eventImageElem.style.width = "100%"; 
      eventImageElem.style.borderRadius = "50px 0px 50px 0px"; 
      eventImageElem.style.position = "relative";
      eventImageElem.style.zIndex = "0";
      eventCard.appendChild(eventImageElem);

      const eventNameElem = document.createElement("h3");
      eventNameElem.textContent = eventName;
      eventNameElem.style.color = "#DC56C5"; 
      eventCard.appendChild(eventNameElem);

      const eventDateElem = document.createElement("p");
      eventDateElem.textContent = `${eventDate}`;
      eventCard.appendChild(eventDateElem);

      const eventLocationElem = document.createElement("p");

      // Creăm un container pentru imaginea vectorului și locație
      const locationContainer = document.createElement("span");
      locationContainer.style.display = "flex";
      locationContainer.style.alignItems = "center";

      // Adăugăm imaginea vectorului pe aceeași linie cu locația
      const vectorImg = document.createElement("img");
      if (window.location.hostname === "localhost") {
        vectorImg.src = "../images/Vector.png"; // Cale pentru localhost 
      } else { 
        vectorImg.src = "https://aura80.github.io/search-events-on-cards/images/Vector.png"; // Cale pentru GitHub Pages 
      } 
      vectorImg.alt = "Vector Image";
      vectorImg.style.width = "20px"; 
      vectorImg.style.height = "20px"; 
      vectorImg.style.marginRight = "7px"; 

      document.body.appendChild(vectorImg);

      // Adaugare la span
      locationContainer.appendChild(vectorImg);
      locationContainer.appendChild(document.createTextNode(eventLocation));
      eventLocationElem.appendChild(locationContainer);
      eventCard.appendChild(eventLocationElem);

      // const eventUrlElem = document.createElement("a");
      // eventUrlElem.href = eventUrl;
      // eventUrlElem.textContent = "View Event";
      // eventUrlElem.target = "_blank";
      // eventCard.appendChild(eventUrlElem);

      eventContainer.appendChild(eventCard);
      console.log("Event card created for event:", eventName); 
    });
  }

function createPagination(totalPages, currentPage, searchTerm = "") {
  // Limitează numărul total de pagini la 30
  totalPages = Math.min(totalPages, 30);

  if (totalPages <= 1) return;

  // Create the previous page button
  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.addEventListener("click", function () {
      fetchEvents(serverUrl, eventsPerPage, currentPage - 1, searchTerm);
    });
    paginationContainer.appendChild(prevButton);
  }

  // Create page buttons with ellipses
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 2 && i <= currentPage + 2)
    ) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      if (i === currentPage) {
        pageButton.style.fontWeight = "bold";
      }
      pageButton.addEventListener("click", function () {
        fetchEvents(serverUrl, eventsPerPage, i, searchTerm);
      });
      paginationContainer.appendChild(pageButton);
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      paginationContainer.appendChild(dots);
    }
  }

  // Create the next page button
  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.addEventListener("click", function () {
      fetchEvents(serverUrl, eventsPerPage, currentPage + 1, searchTerm);
    });
    paginationContainer.appendChild(nextButton);
  }
}

});
