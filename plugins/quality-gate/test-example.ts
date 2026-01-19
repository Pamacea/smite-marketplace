/**
 * Test Example - Code with Various Quality Issues
 * This file is intentionally problematic to test the judge hook
 */

// CRITICAL: SQL Injection vulnerability
function getUserById(userId: string) {
  const query = `SELECT * FROM users WHERE id = ${userId}`;  // ❌ SQL Injection
  return database.execute(query);
}

// CRITICAL: XSS vulnerability
function renderUserInput(input: string) {
  document.innerHTML = input;  // ❌ XSS
}

// ERROR: Weak crypto
function hashPassword(password: string) {
  const crypto = require('crypto');
  return crypto.createHash('md5').update(password).digest('hex');  // ❌ Weak crypto
}

// ERROR: High complexity function
function complexValidation(data: any) {  // ❌ 'any' type
  let result = true;

  if (data.type === 'user') {
    if (data.age > 0) {
      if (data.age < 150) {
        if (data.email) {
          for (let i = 0; i < data.email.length; i++) {
            if (data.email[i] === '@') {
              if (i > 0) {
                if (i < data.email.length - 1) {
                  result = true;
                } else {
                  result = false;
                }
              }
            }
          }
        }
      }
    }
  }

  return result;
}

// WARNING: Too many parameters
function createUser(
  name: string,
  email: string,
  age: number,
  address: string,
  phone: string,
  country: string  // ❌ 6 parameters (max: 5)
) {
  // ...
}

// CRITICAL: Hardcoded secret
function connectToDatabase() {
  const password = 'SuperSecret123!';  // ❌ Hardcoded secret
  return db.connect('localhost', 'user', password);
}
