const BASE_URL =
  "https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Asynchronously loads JSON data from a specified path.
 *
 * @param {string} [path=""] - The relative path to the JSON file (excluding the ".json" extension).
 * @returns {Promise<any>} A promise that resolves to the parsed JSON data.
 * @throws {Error} If the fetch request fails or the response cannot be parsed as JSON.
 */
async function loadData(path = "") {
    const response = await fetch(BASE_URL + path + ".json");
    return await response.json();
  }
  
  
  /**
   * Sends a POST request to the specified path with the provided data.
   *
   * @async
   * @function postData
   * @param {string} path - The endpoint path to which the data will be sent (relative to the base URL).
   * @param {Object} data - The data to be sent in the request body.
   * @returns {Promise<Object>} A promise that resolves to the JSON response from the server.
   */
  async function postData(path = "", data = {}) {
    const response = await fetch(BASE_URL + path + ".json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  }
  
  /**
   * Sends a PATCH request to update data at the specified path on the server.
   *
   * @async
   * @function
   * @param {string} [path=""] - The relative path to the resource to be updated.
   * @param {Object} [data={}] - The data to be sent in the request body.
   * @returns {Promise<Object>} A promise that resolves to the JSON response from the server.
   */
  async function updateData(path = "", data = {}) {
    const response = await fetch(BASE_URL + path + ".json", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  }
  
  
  /**
   * Deletes data from the specified path on the server.
   *
   * @async
   * @function deleteData
   * @param {string} [path=""] - The relative path to the resource to be deleted.
   * @returns {Promise<Object>} A promise that resolves to an object indicating the success of the operation.
   *                             If the response contains JSON, it will return the parsed JSON object.
   *                             If an error occurs or no JSON is returned, it defaults to `{ success: true }`.
   */
  async function deleteData(path = "") {
    const response = await fetch(BASE_URL + path + ".json", { method: "DELETE" });
    try {
      return (await response.json()) || { success: true };
    } catch (e) {
      return { success: true };
    }
  }