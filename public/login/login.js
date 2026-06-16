async function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const { data } = await apiFetch('/auth/me');
    if (data && data.id) {
      window.location.href = '/dashboard';
    }
  } catch {
    localStorage.removeItem('token');
  }
}

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('error');
  const btn = document.getElementById('login-btn');

  errorEl.textContent = '';
  btn.disabled = true;
  btn.innerHTML = '<span>Masuk...</span>';

  try {
    const { data } = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem('token', data.token);
    window.location.href = '/dashboard';
  } catch {
    errorEl.textContent = 'Email atau password salah';
  } finally {
    btn.disabled = false;
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m10 17 5-5-5-5"/>
        <path d="M15 12H3"/>
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
      </svg>
      <span>Masuk</span>
    `;
  }
}

checkAuth();
document.getElementById('login-form').addEventListener('submit', handleLogin);
