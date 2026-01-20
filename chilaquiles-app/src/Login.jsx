import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/firebase';

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: 'auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' },
  input: { padding: '10px', fontSize: '1rem' },
  button: { padding: '15px', fontSize: '1.2rem', cursor: 'pointer' },
  error: { color: 'red' },
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/'); // Redirige al resumen después del login
    } catch (err) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleLogin} style={styles.container}>
      <h2>Iniciar Sesión</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
        required
        style={styles.input}
      />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required style={styles.input} />
      {error && <p style={styles.error}>{error}</p>}
      <button type="submit" style={styles.button}>Entrar</button>
    </form>
  );
}

export default Login;