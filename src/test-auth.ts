import { signIn } from 'next-auth/react';

async function testAuth() {
  try {
    // Test registration
    const registerResponse = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    console.log('Registration response:', await registerResponse.json());

    // Test login
    const loginResult = await signIn('credentials', {
      email: 'test@example.com',
      password: 'password123',
      redirect: false,
    });

    console.log('Login result:', loginResult);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAuth(); 