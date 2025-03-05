class Calculator {
  // Constructor to initialize the Calculator object, setting the initial result to 0
  constructor() {
    // Initialize the result property to 0
    this.result = 0;
  }

  add(number) {
    // Add the given number to the current result
    this.result += number;
    // Return the Calculator object to allow method chaining
    return this;
  }

  subtract(number) {
    // Subtract the given number from the current result
    this.result -= number;
    // Return the Calculator object to allow method chaining
    return this;
  }

  // Method to multiply the current result by a number
  multiply(number) {
    // Multiply the current result by the given number
    this.result *= number;
    // Return the Calculator object to allow method chaining
    return this;
  }

  // Method to divide the current result by a number
  divide(number) {
    // Check if the divisor is zero to prevent division by zero error
    if (number === 0) {
      // Throw an error if the divisor is zero
      throw new Error("Cannot divide by zero");
    }
    // Divide the current result by the given number
    this.result /= number;
    // Return the Calculator object to allow method chaining
    return this;
  }

  // Method to get the current result
  getResult() {
    // Return the current result
    return this.result;
  }

  // Method to reset the result to 0
  reset() {
    // Reset the result to 0
    this.result = 0;
    // Return the Calculator object to allow method chaining
    return this;
  }
}