/**
 * Initializes drag-and-drop functionality by adding event listeners to abilities and slots.
 *
 * This function selects all abilities and slots in the DOM, then attaches the required
 * drag-and-drop event listeners for interactivity.
 */
function initializeDragAndDrop() {
  const abilities = document.querySelectorAll(".ability"); // Select all draggable abilities
  const slots = document.querySelectorAll(".ability-slot"); // Select all ability slots

  // Add drag events to abilities
  abilities.forEach((ability) => {
    ability.addEventListener("dragstart", handleDragStart); // Triggered when dragging starts
    ability.addEventListener("dragend", handleDragEnd); // Triggered when dragging ends
  });

  // Add drag events to slots
  slots.forEach((slot) => {
    slot.addEventListener("dragover", handleDragOver); // Allows dragging over the slot
    slot.addEventListener("dragenter", handleDragEnter); // Optional visual feedback
    slot.addEventListener("drop", handleDrop); // Triggered when an ability is dropped
  });
}

/**
 * Handles the drag start event for abilities.
 *
 * This function identifies the ability being dragged and stores its ID in the
 * dataTransfer object for retrieval during the drop event.
 *
 * @param {DragEvent} event - The dragstart event triggered by the browser.
 */
function handleDragStart(event) {
  const ability = event.target.closest(".ability"); // Ensure the .ability div is targeted
  if (ability && ability.id) {
    event.dataTransfer.setData("text/plain", ability.id); // Store the ability ID
    console.log("Dragging Ability ID:", ability.id); // Debug log for confirmation
    ability.classList.add("dragging"); // Add visual feedback for dragging
  } else {
    console.error("Dragstart failed: Ability ID not found.");
  }
}

/**
 * Handles the drag end event for abilities.
 *
 * This function removes the dragging class from the element to reset any visual feedback.
 *
 * @param {DragEvent} event - The dragend event triggered by the browser.
 */
function handleDragEnd(event) {
  event.currentTarget.classList.remove("dragging"); // Remove visual feedback
}

/**
 * Handles the dragover event for slots.
 *
 * This function prevents the default behavior, allowing the dragged element to be dropped.
 *
 * @param {DragEvent} event - The dragover event triggered by the browser.
 */
function handleDragOver(event) {
  event.preventDefault(); // Allow dropping
}

/**
 * Handles the dragenter event for slots.
 *
 * This function provides optional visual feedback when a draggable element enters a slot.
 *
 * @param {DragEvent} event - The dragenter event triggered by the browser.
 */
function handleDragEnter(event) {
  event.preventDefault(); // Prevent default behavior
  event.currentTarget.classList.add("drag-over"); // Add visual feedback for the slot
}

/**
 * Handles the drop event for slots.
 *
 * This function retrieves the dragged ability's ID, verifies the drop target (slot), and updates
 * the slot with the dragged ability's image if the slot is empty.
 *
 * @param {DragEvent} event - The drop event triggered by the browser.
 */
function handleDrop(event) {
  event.preventDefault(); // Prevent default behavior

  // Log the drop target for debugging
  console.log("Drop target:", event.currentTarget);

  const draggedAbilityId = event.dataTransfer.getData("text/plain"); // Retrieve dragged ability ID
  console.log("Dragged Ability ID:", draggedAbilityId);

  const slotImage = event.currentTarget.querySelector("img.placeholder"); // Get the placeholder image in the slot
  console.log("Slot Image:", slotImage);

  // Ensure the slot contains a valid placeholder image
  if (!slotImage) {
    console.error("Drop target does not contain a placeholder image.");
    return;
  }

  const draggedAbility = document.getElementById(draggedAbilityId); // Find the dragged ability element
  if (!draggedAbility) {
    console.error("Dragged ability not found.");
    return;
  }

  // Check if the slot is empty before replacing the placeholder image
  if (slotImage.src.includes("missing_ping.jpg")) {
    slotImage.src = draggedAbility.querySelector("img").src; // Update the slot image
    slotImage.alt = draggedAbility.querySelector("img").alt; // Update the alt text

    // Disable dragging for the used ability
    draggedAbility.setAttribute("draggable", false);
    draggedAbility.style.opacity = "0.5"; // Reduce visibility of used ability

    console.log(`Ability ${draggedAbilityId} dropped into slot.`); // Log success
  } else {
    console.log("Slot already filled.");
  }
}
