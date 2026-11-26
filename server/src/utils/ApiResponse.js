/**
 * Standardized success response structure for InterviewAce API.
 * Adheres to Section 11 format: { success, message, data }.
 */
export class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {any} data - Response payload
   * @param {string} [message='Request completed successfully'] - Human-readable summary
   */
  constructor(statusCode, data, message = 'Request completed successfully') {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}
