const API_URL = 'http://localhost:5000/api/admin/login';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorElement = document.getElementById('loginError');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) throw new Error('Login failed');
    
    const { token } = await response.json();
    localStorage.setItem('adminToken', token);
    window.location.href = 'admin.html';
  } catch (err) {
    errorElement.textContent = 'Invalid credentials. Please try again.';
  }
});