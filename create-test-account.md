# Creating Test Accounts for Milestone 6

## Test Accounts Required

1. **Email:** instructor@test.com  
   **Password:** Test123456!

2. **Email:** testuser@test.com  
   **Password:** Test123456!

## Method 1: Using the Application (Recommended)

1. Navigate to the deployed application
2. Click "Get Started" or "Sign Up"
3. Fill in the registration form:
   - Email: `instructor@test.com`
   - Username: `instructor` (or any username)
   - Password: `Test123456!`
4. Complete the signup process
5. Repeat for the second test account with `testuser@test.com`

## Method 2: Using MongoDB Atlas

If you have direct access to MongoDB Atlas:

1. Connect to your MongoDB cluster
2. Navigate to the `users` collection in your database
3. Insert a document with the following structure:

```javascript
{
  "username": "instructor",
  "email": "instructor@test.com",
  "password": "$2a$10$...", // bcrypt hash of "Test123456!"
  "progress": {},
  "createdAt": new Date()
}
```

To generate the bcrypt hash, you can use Node.js:

```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('Test123456!', 10);
console.log(hash);
```

## Method 3: Using Backend API (If Available)

If you have a test account creation endpoint, you can use it via curl or Postman:

```bash
curl -X POST https://csi-final.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "instructor",
    "email": "instructor@test.com",
    "password": "Test123456!"
  }'
```

## Verification

After creating the accounts, verify they work by:
1. Logging in with the credentials
2. Testing basic features (dashboard, problems, etc.)
3. Ensuring the accounts have proper access

## Important Notes

- Make sure passwords meet the application's requirements
- Verify email validation if it's enabled (may need to disable for test accounts)
- Test accounts should have the same permissions as regular users
- Consider creating these accounts before the submission deadline

