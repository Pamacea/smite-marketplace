/**
 * Mixed Project Sample
 * Tests all validators working together
 */

import * as crypto from 'crypto';

// ============================================================================
// Security Vulnerabilities
// ============================================================================

const API_KEY = 'sk-1234567890abcdef'; // Hardcoded secret

function ProcessUserInput(input: any): void {
  // SQL injection
  const query = `SELECT * FROM users WHERE name = '${input.name}'`;
  db.execute(query);

  // XSS vulnerability
  const element = document.getElementById('output');
  element.innerHTML = input.content;

  // Weak crypto
  const hash = crypto.createHash('md5').update(input.password).digest('hex');
  console.log('Hashed password:', hash);

  // Weak cipher
  const cipher = crypto.createCipher('aes-128-ecb', 'secret-key');
  let encrypted = cipher.update(input.data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
}

// ============================================================================
// Semantic Issues
// ============================================================================

function Calculate_Area(width: number, height: number): number {
  return width * height;
}

const GetUserById = async (id: number) => {
  const result = await db.query(`SELECT * FROM users WHERE id = ${id}`) as any;
  return result;
};

const DEFAULT_VALUE = 100; // Should be UPPER_CASE

// ============================================================================
// Complexity Issues
// ============================================================================

function VeryComplexFunction(x: number, y: number, z: number, a: number, b: number, c: number): boolean {
  if (x > 0) {
    if (x > 10) {
      if (x > 20) {
        if (x > 30) {
          if (x > 40) {
            if (x > 50) {
              if (y > 0) {
                if (y > 10) {
                  if (z > 0) {
                    if (a > 0) {
                      if (b > 0) {
                        if (c > 0) {
                          for (let i = 0; i < 100; i++) {
                            for (let j = 0; j < 100; j++) {
                              switch (i) {
                                case 1:
                                  if (j > 50) {
                                    return true;
                                  }
                                  break;
                                case 2:
                                  if (j < 50) {
                                    return true;
                                  }
                                  break;
                                default:
                                  if (j === 50) {
                                    return true;
                                  }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return false;
}

// ============================================================================
// Combined Issues
// ============================================================================

async function HandleUserData(request: any): Promise<void {
  // Security + Semantic + Complexity
  const userId = request.params.id;

  if (userId) {
    if (typeof userId === 'string') {
      if (userId.length > 0) {
        if (!isNaN(Number(userId))) {
          const userData = await db.query(
            `SELECT * FROM user_data WHERE user_id = ${userId}`
          ) as any;

          if (userData) {
            if (userData.active) {
              const result = userData.value;
              document.getElementById('result').innerHTML = result;
            }
          }
        }
      }
    }
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

const db = {
  query: async (sql: string) => {
    console.log('Executing:', sql);
    return { id: 1, active: true, value: 'Data' };
  },
  execute: async (sql: string) => {
    console.log('Executing:', sql);
    return true;
  },
};

const document = {
  getElementById: (id: string) => ({
    innerHTML: '',
  }),
};
