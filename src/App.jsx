
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
      return <Navigate to="/dashboard" />;
    }
  
    // If no currentUser, render the children components
    return children;
  };

  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<RequireAuthhome><SignIn/> </RequireAuthhome>}/>
    <Route path="/dashboard" element={<RequireAuth><Dashboard/></RequireAuth>}/>
    <Route path="/userlist" element={<RequireAuth><UserList/></RequireAuth>}/>
    <Route path="/Role-Access" element={<RequireAuth><RoleAccess/></RequireAuth>}/>
    <Route path="/Kameties" element={<RequireAuth><Kameties/></RequireAuth>}/>
    <Route path="/Payments" element={<RequireAuth><Payment/></RequireAuth>}/>
    
    <Route path="/settings" element={<RequireAuth><Settings/></RequireAuth>}/>
    <Route path="/Forgot-Password" element={<RequireAuthhome><ForgotPassword/></RequireAuthhome>}/>
    <Route path="/User-Kameti" element={<RequireAuth><UserKameti/></RequireAuth>}/>







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
