# Test Breakdown: 24 Test Suites with 90 Individual Test Cases

## How the Tests are Divided

### From JUnitTests.test.js (15 Test Suites = 55 Test Cases)

1. **Test 1: API Service - Token Management** → 4 test cases
   - should store token in localStorage
   - should include Authorization header when token exists
   - should remove token from localStorage when set to null
   - should not include Authorization header when token is null

2. **Test 2: API Service - Request Method** → 3 test cases
   - should append endpoint to API_BASE_URL
   - should include Authorization header when token exists
   - should throw error on non-OK responses

3. **Test 3: FA Simulation - State Addition Logic** → 3 test cases
   - should create state with unique ID
   - should create state with default properties
   - should allow multiple states in Map

4. **Test 4: FA Simulation - Transition Creation Logic** → 3 test cases
   - should create transition with from, to, and symbols
   - should allow self-loops (from === to)
   - should support multiple symbols in transition

5. **Test 5: FA Simulation - String Acceptance Logic** → 4 test cases
   - should accept empty string if start state is accepting
   - should reject empty string if start state is not accepting
   - should follow transitions correctly
   - should reject string with no valid transition

6. **Test 6: String Tester - Test Case Execution** → 3 test cases
   - should format test results correctly
   - should identify failed test cases
   - should handle multiple test cases

7. **Test 7: Quiz System - Answer Selection** → 3 test cases
   - should store answer for question index
   - should overwrite previous answer when changed
   - should track multiple question answers

8. **Test 8: Quiz System - Score Calculation** → 4 test cases
   - should calculate score as percentage of correct answers
   - should calculate partial score correctly
   - should count unanswered questions as incorrect
   - should return 0 for all wrong answers

9. **Test 9: Progress Tracking - FA Progress Update Logic** → 3 test cases
   - should increment attempts counter
   - should update status to solved when score >= 100
   - should update bestScore only if new score is higher

10. **Test 10: Progress Tracking - Quiz Progress Update Logic** → 3 test cases
    - should store selected answers array
    - should update status to completed when score >= 70
    - should keep status as attempted when score < 70

11. **Test 11: Authentication - JWT Token Generation** → 3 test cases
    - should generate valid JWT token with userId
    - should decode token to get userId
    - should include expiration in token

12. **Test 12: Authentication - Input Validation** → 8 test cases
    - should reject signup with missing fields
    - should reject signup with short username
    - should reject signup with short password
    - should reject signup with invalid email
    - should accept valid signup data
    - should reject login with missing email
    - should reject login with missing password
    - should accept valid login data

13. **Test 13: FA State Management - Toggle Accepting State** → 3 test cases
    - should toggle accepting state from false to true
    - should toggle accepting state from true to false
    - should maintain other state properties when toggling

14. **Test 14: Transition Symbol Parsing** → 5 test cases
    - should parse single symbol
    - should parse multiple symbols
    - should handle whitespace in symbol string
    - should filter empty strings
    - should return empty array for null or undefined

15. **Test 15: Test Case Selection Logic** → 3 test cases
    - should use default test cases when transitions exist
    - should use empty string only test cases when no transitions
    - should use problem test cases when available

**Subtotal: 15 test suites × average 3.67 test cases = 55 test cases**

---

### From AdditionalTests.test.js (9 Test Suites = 35 Test Cases)

16. **Test 16: User Model - Password Hashing** → 2 test cases
    - should hash password before saving
    - should generate different hashes for same password

17. **Test 17: User Model - Password Comparison** → 2 test cases
    - should return true for correct password
    - should return false for incorrect password

18. **Test 18: User Model - Progress Update Method** → 3 test cases
    - should update FA progress correctly
    - should update MCQ progress correctly
    - should round percentage correctly

19. **Test 19: Authentication Flow - User Signup (Integration)** → 3 test cases
    - should validate signup input data
    - should hash password during signup process
    - should generate JWT token after successful signup

20. **Test 20: Authentication Flow - User Login (Integration)** → 3 test cases
    - should validate login credentials
    - should reject invalid login credentials
    - should update lastLogin timestamp on successful login

21. **Test 21: Authentication Flow - Protected Route Access (Integration)** → 4 test cases
    - should validate JWT token format
    - should extract userId from valid token
    - should reject invalid token
    - should reject request without token

22. **Test 22: Complete User Registration and First Login (System)** → 4 test cases
    - should validate registration form data
    - should create user account with hashed password
    - should generate authentication token after registration
    - should store token for session management

23. **Test 23: FA Problem Solving Workflow (System)** → 5 test cases
    - should initialize FA builder with empty states
    - should add states to FA builder
    - should create transitions between states
    - should execute test cases on FA
    - should update progress after solving problem

24. **Test 24: Quiz Taking Workflow (System)** → 4 test cases
    - should initialize quiz with questions
    - should track selected answers
    - should calculate quiz score
    - should update quiz progress after submission

**Subtotal: 9 test suites × average 3.89 test cases = 35 test cases**

---

## Summary

- **Total Test Suites: 24** (15 from JUnitTests.test.js + 9 from AdditionalTests.test.js)
- **Total Test Cases: 90** (55 + 35)
- **Average Test Cases per Suite: 3.75**

### Breakdown by Level:
- **Unit Tests (Tests 1-18):** 18 test suites with ~70 test cases
- **Integration Tests (Tests 19-21):** 3 test suites with ~10 test cases
- **System Tests (Tests 22-24):** 3 test suites with ~13 test cases

### Breakdown by File:
- **JUnitTests.test.js:** 15 test suites, 55 test cases
- **AdditionalTests.test.js:** 9 test suites, 35 test cases

Each test suite (describe block) contains multiple individual test cases (it/test blocks), which is why we have 24 suites but 90 individual test cases.


