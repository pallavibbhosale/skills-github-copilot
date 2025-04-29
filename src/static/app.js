document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");


  async function fetchParticipants(activity) {
    alert("Pallavi");
    return activity.participants.length
          ? `<ul>${details.participants.map(email => `<li>${email} ::
            <button id="ur" data-email="${email}" data-activity="${name}">unregister</button></li>`).join("")}</ul>`
          : "<p>No participants yet</p>";
  }
  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;
        const participantsList = fetchParticipants(details);
        
        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <p>pallavi ${details.participants}</p>
          <div>
            <strong>Participants:</strong>
            ${participantsList}
          </div>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        alert("fetchActivities");
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
        } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  activitiesList.addEventListener("click", async (event) => {
    if (event.target.tagName === "BUTTON" && event.target.id === "ur") {
      const email = event.target.dataset.email;
      const activity = event.target.dataset.activity;
      alert(email + " " + activity);
      try {
        const response = await fetch(
          `/activities/${encodeURIComponent(activity)}/unregister?email=${encodeURIComponent(email)}`,
          {
            method: "DELETE",
          }
        );

        const result = await response.json();
        if (response.ok) {
          messageDiv.textContent = result.message;
          messageDiv.className = "success";
          event.target.closest("li").remove(); // Remove the participant from the list
        } else {
          messageDiv.textContent = result.detail || "An error occurred";
          messageDiv.className = "error";
        }
        messageDiv.classList.remove("hidden");
          alert(response.ok ? result.message : result.detail || "An error occurred");
      } catch (error) {
        console.error("Error unregistering:", error);
        alert("Failed to unregister. Please try again.");
      }
    }
  });

  // Initialize app
  fetchActivities();
});
