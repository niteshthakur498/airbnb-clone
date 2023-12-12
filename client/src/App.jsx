import './App.css';
import {Route ,Routes} from "react-router-dom";
import IndexPage from "./pages/IndexPage.jsx"
import LoginPage from './pages/LoginPage';
import Layout from './Layout';
import RegisterPage from './pages/RegisterPage';
import axios from 'axios';
import { UserContextProvider } from './userContext';
import AccountsPage from './pages/AccountsPage';
import PlacesFormPage from './pages/PlacesFormPage';
import PlacesPage from './pages/PlacesPage';
import BookingsPage from './pages/BookingsPage';


axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {

  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/account/:subpage?" element={<AccountsPage />} />
          <Route path="/account/:subpage/:action" element={<AccountsPage />} /> */}
          <Route path="/account" element={<AccountsPage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/:id" element={<PlacesFormPage />} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
    
  )
}

export default App
