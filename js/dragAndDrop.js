/**
 * Initializes drag-and-drop functionality for abilities and slots.
 *
 * This function sets up event listeners to enable drag-and-drop interactions for draggable
 * ability elements and their corresponding target slots. It ensures that abilities can be
 * dragged, dropped into valid slots, and provide visual feedback during the interaction.
 *
 * Process:
 * 1. Select all draggable ability elements using the `.ability` class.
 * 2. Select all drop target slots using the `.ability-slot` class.
 * 3. Add event listeners to abilities:
 *    - `dragstart`: Triggers the start of a drag operation.
 *    - `dragend`: Handles the end of a drag operation and removes visual feedback.
 * 4. Add event listeners to slots:
 *    - `dragover`: Allows dragging over the slot by preventing default behavior.
 *    - `dragenter`: Provides optional visual feedback when an ability enters the slot.
 *    - `drop`: Handles the drop event to place an ability into the slot.
 *
 * @function initializeDragAndDrop
 * @returns {void} This function does not return any value.
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
 * Handles the dragstart event for draggable abilities.
 *
 * This function is triggered when a drag operation begins on an ability. It identifies
 * the ability being dragged, stores its unique ID in the `dataTransfer` object for use
 * during the drop event, and adds a visual feedback class (`dragging`) to indicate the
 * drag action.
 *
 * Steps:
 * 1. Identify the closest parent element with the class `.ability` to ensure the drag
 *    operation targets a valid ability element.
 * 2. Check if the identified ability has a valid `id` attribute.
 * 3. Store the ability's ID in the `dataTransfer` object to enable retrieval during the drop event.
 * 4. Add the `dragging` class to the ability for visual feedback.
 * 5. Log the ability ID for debugging purposes.
 * 6. If the ability or its ID is not found, log an error message for debugging.
 *
 * @param {DragEvent} event - The dragstart event triggered by the browser.
 * @returns {void} This function does not return any value.
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
 * Handles the dragend event for draggable abilities.
 *
 * This function is triggered when a drag operation ends, either by dropping the
 * ability into a valid target or cancelling the drag. It removes the `dragging`
 * class from the ability to reset any visual feedback applied during the drag operation.
 *
 * Steps:
 * 1. Remove the `dragging` class from the current target to clear visual feedback.
 *
 * @param {DragEvent} event - The dragend event triggered by the browser.
 * @returns {void} This function does not return any value.
 */
function handleDragEnd(event) {
  event.currentTarget.classList.remove("dragging"); // Remove visual feedback
}

/**
 * Handles the dragover event for ability slots.
 *
 * This function allows a draggable ability to be dropped into a slot by preventing
 * the default behavior of the dragover event. Without this function, the browser
 * may not allow the drop action to occur.
 *
 * Steps:
 * 1. Prevent the default behavior to enable the drop event on the target slot.
 *
 * @param {DragEvent} event - The dragover event triggered by the browser.
 * @returns {void} This function does not return any value.
 */
function handleDragOver(event) {
  event.preventDefault(); // Allow dropping
}

/**
 * Handles the dragenter event for ability slots.
 *
 * This function is triggered when a draggable ability enters a slot area. It provides
 * visual feedback by adding a specific CSS class (`drag-over`) to the slot, indicating
 * that it is a valid drop target.
 *
 * Steps:
 * 1. Prevent the default behavior to allow custom handling of the drag-and-drop action.
 * 2. Add the `drag-over` class to the current target slot to visually indicate the drop area.
 *
 * @param {DragEvent} event - The dragenter event triggered by the browser.
 * @returns {void} This function does not return any value.
 */
function handleDragEnter(event) {
  event.preventDefault(); // Prevent default behavior
  event.currentTarget.classList.add("drag-over"); // Add visual feedback for the slot
}

/**
 * Handles the drop event for ability slots.
 *
 * This function is triggered when a draggable ability is dropped onto a slot. It updates
 * the slot with the dropped ability's image and name, stores the ability name in a
 * `data-ability-name` attribute for validation purposes, and disables dragging for the
 * used ability to prevent further interactions.
 *
 * Process:
 * 1. Prevent the default drop behavior to allow custom handling.
 * 2. Retrieve the ID of the dragged ability from the `dataTransfer` object.
 * 3. Locate the dragged ability element and the target slot's placeholder image.
 * 4. Validate that both the dragged ability and slot image exist.
 * 5. If the slot is empty (contains the placeholder image):
 *    - Update the slot's image source and alt text with the dragged ability's image.
 *    - Store the ability's name in the slot's `data-ability-name` attribute.
 *    - Disable dragging for the used ability and reduce its opacity for feedback.
 * 6. Log the drop event for debugging purposes.
 * 7. If the slot is already filled, log a message indicating the slot is occupied.
 *
 * @param {DragEvent} event - The drop event triggered by the browser.
 * @returns {void} This function does not return any value.
 */
function handleDrop(event) {
  event.preventDefault(); // Prevent default behavior

  const draggedAbilityId = event.dataTransfer.getData("text/plain"); // Retrieve dragged ability ID
  const draggedAbility = document.getElementById(draggedAbilityId); // Find the dragged ability element
  const slotImage = event.currentTarget.querySelector("img.placeholder"); // Get the placeholder image in the slot

  if (!draggedAbility || !slotImage) {
    console.error("Invalid drop: Missing dragged ability or slot image.");
    return;
  }

  if (slotImage.src.includes("missing_ping.jpg")) {
    // Update the slot with the dragged ability's image and name
    slotImage.src = draggedAbility.querySelector("img").src;
    slotImage.alt = draggedAbility.querySelector("img").alt;

    // Store the ability name in a data-attribute for validation
    const abilityName = draggedAbility.querySelector("p").textContent.trim();
    event.currentTarget.setAttribute("data-ability-name", abilityName);

    // Disable dragging for the used ability
    draggedAbility.setAttribute("draggable", false);
    draggedAbility.style.opacity = "0.5"; // Reduce visibility of used ability

    console.log(`Ability "${abilityName}" dropped into slot.`);
  } else {
    console.log("Slot already filled.");
  }
}
