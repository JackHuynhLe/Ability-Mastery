/**
 * Plays an audio file from the specified file path.
 *
 * This function dynamically creates an audio object, loads the audio file from the given path,
 * and plays it. It is commonly used for sound effects in the application, such as victory or defeat sounds.
 *
 * @param {string} filePath - The relative or absolute path to the audio file.
 *
 * Example usage:
 * playSound('assets/audio/victory.mp3');
 * playSound('assets/audio/defeat.mp3');
 */
export function playSound(filePath) {
    const audio = new Audio(filePath);
    audio.play();
  }
  