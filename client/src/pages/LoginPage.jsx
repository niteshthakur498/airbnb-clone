import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { userContext } from '../userContext';

const LoginPage = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [redirect,setRedirect] = useState(false);

  const {setUser} = useContext(userContext);

  async function loginSubmit(ev){
    ev.preventDefault();
    try{
      
      const {data} = await axios.post('/login',{
        email,
        password,
      }
      );
      alert('LogIn Successful!!!');
      setUser(data)
      setRedirect(true);
    }
    catch(e){
      alert('LogIn Failed!!!');
    }
  }

  if(redirect){
    return <Navigate to={'/'} />
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
        <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Log In</h1>
      <form className="max-w-lg mx-auto" onSubmit={loginSubmit}>
        <input type="email" 
            placeholder="your@email.com" 
            value={email} 
            onChange={ev=>setEmail(ev.target.value)}
        />
        <input type="password" placeholder="password" 
          value={password} 
          onChange={ev=>setPassword(ev.target.value)}
        />
        <button className="primary">Login</button>
        <div className="text-center py-2 text-gray-500">
            Don't have an account yet? 
            <Link className="underline text px-2" to={'/register'}>
                Register Now
            </Link>
        </div>
      </form>
        </div>
    </div>
  )
}

export default LoginPage
