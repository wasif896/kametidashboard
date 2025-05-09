import React, { useEffect, useState, useRef } from "react";
import { FaEye } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import adminicon from "../../images/auth/adminicon.png";

import Sidebar from "../../components/Sidebar/Sidebar";
import { FaChevronDown } from "react-icons/fa";

import "react-calendar/dist/Calendar.css";
import { FaSpinner } from "react-icons/fa";

import Alert from "../../components/Alert/Alert";
import { MdOutlineRestartAlt } from "react-icons/md";
import unpay from "../../images/paymentImage/unpay.png";
import axios from "axios";
import { Slide, ToastContainer, toast } from "react-toastify";
import { FadeLoader, HashLoader } from "react-spinners";
import { Button, IconButton } from "@mui/material";
import kametiLogo2 from "../../images/kametiLogo2.png";
import { IoShareSocialSharp } from "react-icons/io5";
import { IoShareSocial } from "react-icons/io5";
import { GrLanguage } from "react-icons/gr";
import { MdContentCopy } from "react-icons/md";
import payment from "../../images/Frame 2085663856 (2).png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LuCopyCheck } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";

import { TbMenu2 } from "react-icons/tb";
import MobileSidebar from "../../components/MobileSidebar/MobileSidebar";
import Header from "../../components/Header/Header";
import AlertModal from "../../Modal/AlertModal";
import UserTable from "../../DataTable/UserTable";
import KametiesTable from "../../DataTable/KametiesTable";
import create from "../../images/create.png";
import payment2 from '../../images/payment2.png';
import { FaSearch, FaFilter } from "react-icons/fa";
import { FaSortUp, FaSortDown } from "react-icons/fa";




export default function Kameties({ totalEntries = 12, entriesPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);

  const [open, setOpen] = useState(false);

  const handleDleteModalOpen = () => setOpen(true);
  const handleCloseDleteModal = () => setOpen(false);

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(10);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("");


  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  const [showFilter, setShowFilter] = useState(false);
  let screenwidth = window.innerWidth;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  let [screenLoader, setScreenLoader] = useState(false);
  const [getKametis, setGetAllKametis] = useState([]); // Renamed state for clarity
  console.log(getKametis);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const perPage = 10;
  const [cachedPages, setCachedPages] = useState({});
    const [sortOrder, setSortOrder] = useState("desc");

  const apiBaseUrl = import.meta.env.VITE_APP_API_URL;
  const token = localStorage.getItem("token");

   const handleGetAllPayments = async (page = 1, query = "", order = "desc", timePeriod = "") => {
      setScreenLoader(true);
    
      try {
        const response = await axios.post(
          `${apiBaseUrl}getPayment`,
          { page, perPage: 10, search: query, sortOrder: order, timePeriod }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
    
        if (response?.data?.status === true) {
          let newUsers = response?.data?.data?.payments || [];
          let currPage = response?.data?.data?.current_page || 1;
          let totalPage = response?.data?.data?.total_pages || 1;
          let totalRecords = response?.data?.data?.total || 0;
    
          setCachedPages((prevCache) => ({
            ...prevCache,
            [currPage]: newUsers,
          }));
    
          setGetAllKametis(newUsers);
          setCurrentPage(currPage);
          setTotalPages(totalPage);
          setTotalUsers(totalRecords);
    
         
        }
      } catch (error) {
        console.error("Error fetching Kametis", error);
      } finally {
        setScreenLoader(false);
      }
    };
  

 

  const handleSortByDate = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };
  const handleSearchPayments = async (searchQuery, page = 1) => {
    setScreenLoader(true);
    try {
      const response = await axios.post(
        `${apiBaseUrl}getPayment`, // Same API endpoint
        {
          page: page,
          perPage: perPage, // Keeping pagination
          search: searchQuery, // Pass search query
          timePeriod : selectedTimePeriod
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.status === true) {
 
        let currPage = response?.data?.data?.current_page || 1;
        let totalPage = response?.data?.data?.total_pages || 1;

        setGetAllKametis(response?.data?.data?.payments || []); // Filtered data
        setUsers(response?.data?.data?.users || []);
        setTotalUsers(response?.data?.data?.total || 0);
        setCurrentPage(currPage);
        setTotalPages(totalPage);
      }
    } catch (error) {
      console.error("Error searching Kametis", error);
    } finally {
      setScreenLoader(false);
    }
  };


   useEffect(() => {
      if (!searchQuery) {
        handleGetAllPayments(currentPage, "", sortOrder,selectedTimePeriod);
      }
    }, [currentPage, searchQuery, sortOrder]);


  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
  
    setIsLoading(true);
    setCurrentPage(newPage);
  
    handleGetAllPayments(newPage, searchQuery, "desc", selectedTimePeriod).finally(() => {
      setIsLoading(false);
    });
  };
  

  const [filterOptions, setFilterOptions] = useState({
    daily: false,
    weekly: false,
    monthly: false,
    yearly: false,
    all : true,
  });

  const toggleFilter = () => setShowFilter(!showFilter);

  const handleCheckboxChange = async (option) => {
    // Update the state
    setShowFilter(false);
    setFilterOptions((prev) => {
      const updatedFilters = {
        daily: false,
        weekly: false,
        monthly: false,
        yearly: false,
        all: false,
        [option]: !prev[option], // Only one option selected at a time
      };
  
      // Send API request only if a new option is selected
      if (!prev[option]) {
        setSelectedTimePeriod(option);
        handleGetAllPayments(1, searchQuery, "desc", option);
      }
  
      return updatedFilters;
    });
  };
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase(); // Convert input to lowercase

    setSearchQuery(value);

    // Clear previous timeout if user is still typing
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout to call API after 500ms of inactivity
    const newTimeout = setTimeout(() => {
      handleSearchPayments(value, 1);
    }, 500);

    setTypingTimeout(newTimeout);
  };

  // Filter getKametis based on search query
  const filteredKametis = getKametis?.filter((kameti) =>
    Object.values(kameti).some((value) =>
      String(value).toLowerCase().includes(searchQuery)
    )
  );
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowFilter]);
  return (
    <>
      <div className="w-[100%] h-[100vh] flex justify-center items-center bg-black">
        <div className="w-[100%] h-[100vh] flex  ">
          {screenwidth > 480 && <Sidebar />}

          <div className="sm:w-[80%] w-[100%] h-[100vh] overflow-y-scroll sm:pb-3  sm:rounded-l-[0px] rounded-l-[20px] rounded-r-[20px] ">
            <Header
              screenwidth={screenwidth}
              drawerOpen={drawerOpen}
              toggleDrawer={toggleDrawer}
              title="All Payments"
              img={payment2}
            />

            <div className="w-[100%] flex items-center justify-center flex-col relative">
              <div className="w-[100%] sm:w-[97%] flex items-center justify-center flex-col p-[12px] sm:p-[px] sm:mt-[15px] rounded-[15px]">
                <div className="relative w-full">
                  {/* Search Bar */}
                <div className="w-full bg-[#64646469] flex items-center rounded-lg overflow-hidden">
                       <span className="px-3 text-gray-500">
                         <FaSearch className="w-5 h-5" />
                       </span>
                       <input
                         type="text"
                         placeholder="Search..."
                         value={searchQuery}
                         onChange={handleSearchChange}
                         className="w-full py-2 px-3 bg-transparent text-white focus:outline-none"
                       />
                        <button
                                                   className="px-3 py-2 text-white rounded-r-lg flex items-center gap-2"
                                                   onClick={toggleFilter}
                                                 >
                                                   Filter <FaFilter className="w-3 h-3" />
                                                 </button>
                     </div>
                     {showFilter && (
        <div   ref={dropdownRef} className="absolute right-0 mt-2 p-3 bg-white shadow-md rounded-lg w-30">
          {Object.keys(filterOptions).map((option) => (
            <label key={option} className="block text-gray-700">
              <input
                type="checkbox"
                checked={filterOptions[option]}
                onChange={() => handleCheckboxChange(option)}
                className="mr-2"
              />
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </label>
          ))}
        </div>
      )}
                </div>
                <div className="mt-6 mb-1 bg-[#2B2B2B] overflow-x-scroll pb-3 rounded-[8px] w-[100%] sm:w-[100%] border border-[#2b2b2b]">
                  <div className="w-full bg-black overflow-x-auto mt-[20px] ">
                      <table className="w-full text-left text-white sm:w-[100%] w-[900px] min-h-[200px]  ">
                      <thead className="bg-[#A87F0B] text-white">
                        <tr>
                          <th className="py-2 px-4">Sr #</th>
                          <th className="py-2 px-4">Kameti Name</th>
                        
                           <th
                                      className="py-2 px-4 cursor-pointer flex items-center gap-1"
                                      onClick={handleSortByDate}
                                    >
                                       Date{" "}
                                      {sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}
                                    </th>
                          <th className="py-2 px-4">Price</th>
                          {/* <th className="py-2 px-4">Action</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {screenLoader ? (
                         <tr>
                                                     <td colSpan="7" className="text-center py-4">
                                                       {/* <div className="flex justify-center items-center h-[53vh] w-[100vh] relative"> */}
                                                       <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 inset-0 flex justify-center items-center">
                                                 <FaSpinner className="animate-spin text-yellow-500 text-3xl" />
                                               </div>
                                               
                                                     </td>
                                                   </tr>
                        ) : filteredKametis.length > 0 ? (
                          filteredKametis.map((kameti, index) => (
                            <tr
                              key={kameti.id}
                              className="border-t border-gray-600 bg-black"
                            >
                              <td className="py-2 px-4">
                                {(currentPage - 1) * perPage + (index + 1)}
                              </td>

                              <td className="py-2 px-4">
                                {kameti.committee_holder_name
                                  ? kameti.committee_holder_name
                                  : "N/A"}
                              </td>
                              <td className="py-2 px-4">
                                {kameti.date
                                  ? new Date(kameti.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      }
                                    )
                                  : "N/A"}
                              </td>

                              <td className="py-2 px-4">
  {kameti.price
    ? new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(kameti.price)
    : "N/A"}
</td>
                          

                              {/* <td className="py-2 px-4 flex space-x-2">
            <button className="text-blue-500 hover:text-blue-700">
              <FaEye />
            </button>
            <button className="text-[#45B369] hover:text-[#45B36910]"></button>
            <button
              onClick={() => console.log("Delete Clicked")}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrashAlt />
            </button>
          </td> */}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-center py-4 text-gray-400"
                            >
                              No records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {!screenLoader && (
                  <div className="flex flex-wrap sm:justify-between justify-center w-full p-4 bg-black text-white text-sm sm:text-sm ">
                    {/* Showing Entries Info */}
                    <div className="mb-2 sm:mb-0">
                      Showing {perPage * (currentPage - 1) + 1} to{" "}
                      {Math.min(perPage * currentPage, totalUsers)} of{" "}
                      {totalUsers} entries
                    </div>

                    {/* Pagination Buttons */}
                    <div className="flex flex-wrap items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-2 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
                        disabled={currentPage === 1}
                      >
                        &laquo;
                      </button>

                      {/* First Page Button */}
                      {currentPage > 4 && (
                        <>
                          <button
                            onClick={() => handlePageChange(1)}
                            className={`px-2 py-1 rounded ${
                              currentPage === 1
                                ? "bg-yellow-600 text-white"
                                : "bg-white text-black"
                            }`}
                          >
                            1
                          </button>
                          <span className="hidden sm:inline-block px-2">
                            ...
                          </span>{" "}
                          {/* Hide on extra small screens */}
                        </>
                      )}

                      {/* Middle Page Numbers (Show fewer numbers on small screens) */}
                      {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                      )
                        .filter(
                          (page) =>
                            page >=
                              Math.max(
                                1,
                                currentPage - (window.innerWidth < 640 ? 1 : 3)
                              ) &&
                            page <=
                              Math.min(
                                totalPages,
                                currentPage + (window.innerWidth < 640 ? 1 : 3)
                              )
                        )
                        .map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-2 sm:px-3 py-1 rounded ${
                              currentPage === page
                                ? "bg-yellow-600 text-white"
                                : "bg-white text-black"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                      {/* Last Page Button */}
                      {currentPage < totalPages - 3 && (
                        <>
                          <span className="hidden sm:inline-block px-2">
                            ...
                          </span>{" "}
                          {/* Hide on extra small screens */}
                          <button
                            onClick={() => handlePageChange(totalPages)}
                            className={`px-2 sm:px-3 py-1 rounded ${
                              currentPage === totalPages
                                ? "bg-yellow-600 text-white"
                                : "bg-white text-black"
                            }`}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-2 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
                        disabled={currentPage === totalPages}
                      >
                        &raquo;
                      </button>
                    </div>
                  </div>
                )}

                {/* <KametiesTable Kameties={getAllKametis} handleGetKameti={handleGetAllPayments } setCurrentPage={setCurrentPage} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertModal
        open={open}
        handleClose={handleCloseDleteModal}
        title="Are you sure you want to delete this?"
        onConfirm={handleCloseDleteModal}
      />
    </>
  );
}
