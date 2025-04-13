/**
 * Retries a promise if it resolves with null value.
 *
 * @template T - The type of value returned by the promise
 * @param {() => Promise<T>} promiseFactory - A function that returns a promise
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} delayMs - Delay between retries in milliseconds
 * @param {(result: T) => boolean} [shouldRetry] - Optional custom function to determine if retry is needed (default: checks for null)
 * @returns {Promise<T>} A promise that resolves with the first non-null result or the last result after max retries
 */
export function retryPromise<T>(
  promiseFactory: () => Promise<T>,
  maxRetries: number,
  delayMs: number,
  shouldRetry: (result: T) => boolean = (result: T) => result === null
): Promise<T> {
  // Keep track of the current attempt
  let attempts = 0;

  // Function to attempt the promise
  function attempt(): Promise<T> {
    attempts++;

    // Execute the promise factory to get a fresh promise
    return promiseFactory()
      .then((result: T) => {
        // If result requires retry and we haven't exceeded max retries
        if (shouldRetry(result) && attempts < maxRetries) {
          // Wait for the specified delay, then try again
          return new Promise<void>((resolve) =>
            setTimeout(resolve, delayMs)
          ).then(() => attempt());
        }

        // Either we got a non-null result or reached max retries
        return result;
      })
      .catch((error: Error) => {
        // If there's an error and we haven't exceeded max retries
        if (attempts < maxRetries) {
          // Wait for the specified delay, then try again
          return new Promise<void>((resolve) =>
            setTimeout(resolve, delayMs)
          ).then(() => attempt());
        }

        // Reached max retries, propagate the error
        throw error;
      });
  }

  // Start the first attempt
  return attempt();
}
