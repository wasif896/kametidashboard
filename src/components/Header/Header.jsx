import React from "react";
import { IconButton } from "@mui/material";
import { TbMenu2 } from "react-icons/tb";
import MobileSidebar from "../../components/MobileSidebar/MobileSidebar";
import adminicon from "../../images/auth/adminicon.png";
import csv from "../../images/csv.png";


const Header = ({ screenwidth, drawerOpen, toggleDrawer, value,title,img,onCSVDownload,show }) => {
  return (
    <div className="sm:w-[97%] w-[100%] flex justify-between sm:mb-3 items-center sm:h-max h-[80px] sm:p-0 p-3 sm:mt-6">
      <span className="flex justify-center items-center w-full sm:w-auto sm:flex-row">
        {screenwidth < 430 && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
            edge="start"
          >
            <TbMenu2 className="text-white text-[35px]" />
          </IconButton>
        )}
        <MobileSidebar drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />

        <h1 className="text-[white] sm:text-[25px] text-[15px] font-bold sm:ml-7 flex items-center sm:justify-center sm:justify-start w-full">
          <img className="hidden sm:block w-[40px] mr-3" src={img} alt="Icon" />
          {title}
        </h1>
      </span>
   
      <div className="flex items-center space-x-4">
        {show == "true" &&
    <div className="flex items-center sm:px-4 px-1 py-1 cursor-pointer text-white rounded-lg border-[1px] 
    sm:px-3 sm:py-2 sm:text-[5px]">
      
<img src={csv} width="25px" />

<span 
  className="pl-2 sm:text-[12px] text-[9px] cursor-pointer hover:text-blue-500 hover:underline transition duration-200" 
  onClick={onCSVDownload}
>
  Download as CSV file
</span>

</div>

}
        {/* {screenwidth > 450 && (
          <div className="flex items-center px-4 py-2 cursor-pointer bg-yellow-600 text-white rounded-lg">
            <img src={adminicon} width="25px" />
            <span className="pl-2">Admin</span>
          </div>
        )} */}
      </div>
    
    </div>
  );
};

export default Header;
