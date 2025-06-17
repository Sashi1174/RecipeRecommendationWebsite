import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import authService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authService.signup(username, email, password);
      toast.success('✅ Registration successful!');
      navigate('/login');
    } catch (error) {
      alert("Signup failed: " + (error.response?.data?.message || error.message));
    }
  };
  return (
    <div className="Signup">
      <section className="vh-100" style={{ backgroundColor: "#eee" }}>
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black" style={{ borderRadius: "25px" }}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>
                      <form className="mx-1 mx-md-4" onSubmit={handleRegister}>
                        <div className="form-outline mb-4">
                          <input type="text" id="username" className="form-control"
                            value={username} onChange={(e) => setUsername(e.target.value)} required />
                          <label className="form-label" htmlFor="username">Username</label>
                        </div>
                        <div className="form-outline mb-4">
                          <input type="email" id="email" className="form-control"
                            value={email} onChange={(e) => setEmail(e.target.value)} required />
                          <label className="form-label" htmlFor="email">Email</label>
                        </div>
                        <div className="form-outline mb-4">
                          <input type="password" id="password" className="form-control"
                            value={password} onChange={(e) => setPassword(e.target.value)} required />
                          <label className="form-label" htmlFor="password">Password</label>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg w-100">Register</button>
                      </form>
                    </div>
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                      <img src="https://nycdsa-blog-files.s3.us-east-2.amazonaws.com/2022/08/monika-singh/image13-755128-M3y9v9i9-1200x800.png"
                        className="img-fluid" alt="signup" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Signup;
