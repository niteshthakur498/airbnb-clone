import React, { useContext, useState } from 'react'
import { userContext } from '../userContext.jsx';
import { Link, Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import PlacesPage from './PlacesPage.jsx';
import AccountNav from '../components/AccountNav.jsx';


const AccountsPage = () => {
  const [redirect,setRedirect] = useState(null);
  const {user,ready,setUser} = useContext(userContext);
   

  let {subpage} = useParams();

  if(subpage===undefined){
    subpage='profile';
  }

  if(!ready){
    return 'Loading...';
  }

  if(ready && !user && !redirect){
    return <Navigate to = {'/login'} />
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  function linkClasses(type=null) {
    let classVal = 'py-2 px-6';

    if(subpage=== type){
      classVal += ' bg-primary text-white rounded-full';
    }

    return classVal;
  }

  async function logout() {
    await axios.post('/logout');
    setUser(null);
    setRedirect('/');
    
  }


  return (
    <div>
      <AccountNav />
      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})<br />
          <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
        </div>
      )}
      {
        subpage === 'places' &&
        (<PlacesPage />)
      }
    </div>
  )
}

export default AccountsPage
