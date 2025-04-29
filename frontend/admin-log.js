document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
  
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
  
    try {
      const res = await fetch('/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      const data = await res.json();
      
      if (data.success) {
        window.location.href = '/admin/dashboard';
      } else {
        document.getElementById('error').innerText = data.message;
      }
    } catch (error) {
      document.getElementById('error').innerText = "Something went wrong!";
    }
  });
  