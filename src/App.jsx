
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import './App.css'
import UserList from "./pages/Userlist/Userlist";
import Dashboard from "./pages/DashboardPage/Dashboard";
import SignIn from "./pages/SignIn/SignIn";
import RoleAccess from "./pages/Role&Access/RoleAccess";
import Kameties from "./pages/Kameties/Kameties";
import Payment from "./pages/Payments/Payment";
import Settings from "./pages/Settings/Settings";
import ForgotPassword from "./pages/Forgotpassword.jsx/ForgotPassword";
import UserKameti from "./pages/UserKameti/UserKameti";
import { Toaster } from "react-hot-toast";

function App() {
  const RequireAuth = ({ children }) => {
    const currentUser = localStorage.getItem("id");
    return currentUser?.length>0 && currentUser !=undefined  ? children : <Navigate to="/signin" />;
  };
  const RequireAuthhome = ({ children }) => {
    const currentUser = localStorage.getItem("id");
  
    // If currentUser is found, redirect to "/create"
    if (currentUser) {
      return <Navigate to="/create" />;
    }
  
    // If no currentUser, render the children components
    return children;
  };

  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<SignIn/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/userlist" element={<UserList/>}/>
    <Route path="/Role-Access" element={<RoleAccess/>}/>
    <Route path="/Kameties" element={<Kameties/>}/>
    <Route path="/Payments" element={<Payment/>}/>
    
    <Route path="/settings" element={<Settings/>}/>
    <Route path="/Forgot-Password" element={<ForgotPassword/>}/>
    <Route path="/User-Kameti" element={<UserKameti/>}/>







    {/* <Route path="/history" element={<History/>}/>
    <Route path="/more" element={<More/>}/> */}



    </Routes>
    </BrowserRouter>
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: '',
        duration: 5000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        // Default options for specific types
        success: {
          duration: 3000,
          theme: {
            primary: 'green',
            secondary: 'black',
          },
        },
      }}
    />
   
    </>
  )
}

export default App
