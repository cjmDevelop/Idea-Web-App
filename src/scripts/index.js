let count = 0;
    let countEl = document.getElementById("count-el");
    let ideaInput = document.getElementById("idea");
    let incrementBtn = document.getElementById("increment-btn");
    let savedIdeas = []; // Array to store all saved ideas

    // Function to check if button should be enabled
    function checkButtonState() {
      const hasText = ideaInput.value.trim().length > 0;
      incrementBtn.disabled = !hasText;
    }

    // Add event listeners to textarea
    ideaInput.addEventListener('input', checkButtonState);
    ideaInput.addEventListener('keyup', checkButtonState);
    ideaInput.addEventListener('paste', function() {
      // Small delay to ensure pasted content is processed
      setTimeout(checkButtonState, 10);
    });

    // Initialize button state on page load
    checkButtonState();

    function increment() {
      // Only proceed if there's text in the textarea
      const ideaText = ideaInput.value.trim();
      if (ideaText.length === 0) {
        return;
      }
      
      count++;
      countEl.textContent = count;
      
      // Store the idea with metadata
      const ideaData = {
        id: count,
        text: ideaText,
        timestamp: new Date().toLocaleString()
      };
      
      savedIdeas.push(ideaData);
      
      console.log("Idea saved:", ideaData);

      // Create light bulb icon with click functionality
      let lightBulb = document.createElement("div");
      lightBulb.className = "light-bulb tooltip";
      lightBulb.dataset.ideaId = count;
      
      // Create tooltip
      let tooltip = document.createElement("span");
      tooltip.className = "tooltiptext";
      tooltip.innerHTML = `<strong>Idea #${count}</strong><br>${ideaText.substring(0, 80)}${ideaText.length > 80 ? '...' : ''}`;
      lightBulb.appendChild(tooltip);
      
      // Add click event to restore idea
      lightBulb.addEventListener('click', function() {
        restoreIdea(count);
      });

      let brightIdea = document.getElementById("bright-ideas");
      brightIdea.appendChild(lightBulb);

      // Clear the textarea after saving the idea
      ideaInput.value = "";
      
      // Update button state after clearing
      checkButtonState();
      
      // Show notification
      showNotification("Idea saved! Click the lightbulb to restore it.");
    }

    function restoreIdea(ideaId) {
      const idea = savedIdeas.find(idea => idea.id === ideaId);
      if (idea) {
        ideaInput.value = idea.text;
        checkButtonState(); // Update button state
        showNotification(`Idea #${ideaId} restored to text box!`);
        
        // Focus the textarea for immediate editing
        ideaInput.focus();
        
        // Place cursor at the end
        ideaInput.setSelectionRange(ideaInput.value.length, ideaInput.value.length);
      }
    }

    function clearAll() {
      if (savedIdeas.length === 0) {
        showNotification("No ideas to clear!");
        return;
      }
      
      if (confirm(`Are you sure you want to clear all ${savedIdeas.length} saved ideas? This cannot be undone.`)) {
        count = 0;
        savedIdeas = [];
        countEl.textContent = count;
        document.getElementById("bright-ideas").innerHTML = "";
        ideaInput.value = "";
        checkButtonState();
        showNotification("All ideas cleared!");
      }
    }

    function showNotification(message) {
      const notification = document.getElementById("notification");
      notification.textContent = message;
      notification.classList.add("show");
      
      setTimeout(() => {
        notification.classList.remove("show");
      }, 3000);
    }

    // Optional: Allow Enter key to submit when button is enabled
    ideaInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' && event.ctrlKey && !incrementBtn.disabled) {
        increment();
      }
    });

    // Optional: Allow Escape key to clear current text
    ideaInput.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        ideaInput.value = "";
        checkButtonState();
        showNotification("Text cleared!");
      }
    });