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
// import { Slide, ToastContainer, toast } from "react-toastify";
import toast from "react-hot-toast";
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
import { FaSortUp, FaSortDown } from "react-icons/fa";
// import { Parser } from "json2csv";

import { TbMenu2 } from "react-icons/tb";
import MobileSidebar from "../../components/MobileSidebar/MobileSidebar";
import Header from "../../components/Header/Header";
import AlertModal from "../../Modal/AlertModal";
import UserTable from "../../DataTable/UserTable";
import KametiesTable from "../../DataTable/KametiesTable";
import create from "../../images/create.png";
import Flag from "react-world-flags";
import ReactCountryFlag from "react-country-flag";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaSearch, FaFilter } from "react-icons/fa";

import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
// import Flag from "react-world-flags-icons";

export default function Kameties({ totalEntries = 12, entriesPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [roleId, setRoleId] = useState("");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("");

  const handleDleteModalOpen = (id) => {
    setRoleId(id);
    setOpen(true);
  };

  const handleCloseDleteModal = () => setOpen(false);

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(10);
  const options = [10, 20, 30, 50];

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
 
  const [downloading, setDownloading] = useState({
    csv: false,
    pdf: false,
    excel: false,
  });
  
  const [getKametis, setGetAllKametis] = useState([]); // Renamed state for clarity
  // console.log(getKametis);
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

  const handleGetAllUsers = async (page = 1, query = "", order = "desc", timePeriod = "") => {
    setScreenLoader(true);
  
    try {
      const response = await axios.post(
        `${apiBaseUrl}getUsers`,
        { page, perPage: 10, search: query, sortOrder: order, timePeriod }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response?.data?.status === true) {
        let newUsers = response?.data?.data?.users || [];
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
  

  const handleSearchUsers = async (searchQuery, page = 1) => {
    setScreenLoader(true);
    try {
      const response = await axios.post(
        `${apiBaseUrl}getUsers`, // Same API endpoint
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

        setGetAllKametis(response?.data?.data?.users || []); // Filtered data
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

  const deleteUsers = async () => {
    try {
      const response = await axios.delete(`${apiBaseUrl}users/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log("User deleted successfully");
        toast.success("User deleted successfully");
        handleCloseDleteModal();

        // Ensure we stay on the current page after deletion
        const newPage =
          getKametis.length === 1 && currentPage > 1
            ? currentPage - 1
            : currentPage;

        // Fetch users again with the same search query
        handleGetAllUsers(newPage, searchQuery);
      }
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      handleGetAllUsers(currentPage, "", sortOrder,selectedTimePeriod);
    }
  }, [currentPage, searchQuery, sortOrder]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
  
    setIsLoading(true);
    setCurrentPage(newPage);
  
    handleGetAllUsers(newPage, searchQuery, "desc", selectedTimePeriod).finally(() => {
      setIsLoading(false);
    });
  };
  

  const [filterOptions, setFilterOptions] = useState({
    daily: false,
    weekly: false,
    monthly: false,
    yearly: false,
    all : true
  });

  const toggleFilter = () => setShowFilter(!showFilter);

  const handleCheckboxChange = async (option) => {
    // Update the state
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
        handleGetAllUsers(1, searchQuery, "desc", option);
      }
  
      return updatedFilters;
    });
  };
  
  
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase(); // Convert input to lowercase
    setSearchQuery(value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTimeout = setTimeout(() => {
      handleSearchUsers(value, 1); // Send lowercase search term
    }, 500);

    setTypingTimeout(newTimeout);
  };

  // Filter getKametis based on search query
  const filteredKametis = getKametis?.filter((kameti) =>
    Object.values(kameti).some((value) =>
      String(value).toLowerCase().includes(searchQuery)
    )
  );


  const handleExportCSV = async () => {
    setDownloading((prev) => ({ ...prev, csv: true }));
    
    try {
      const response = await axios.post(
        `${apiBaseUrl}getUsers`,
        { data: "all" }, // Sending 'all' to fetch all users
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response?.data?.status === true) {
        const allUsers = response?.data?.data?.users || [];
  
        if (allUsers.length === 0) {
          alert("No data available to export.");
          setDownloading(false);
          return;
        }
  
        exportCSV(allUsers); // Call function to generate CSV
      }
    } catch (error) {
      console.error("Error fetching all users for export:", error);
    } finally {
    
    setDownloading((prev) => ({ ...prev, csv: false }));

    }
  };
  
  

  const exportCSV = (users) => {
    const headers = ["Name", "Email", "Phone", "Create Date", "Country"];
  
    const data = users.map((user) => [
      user.fullName || "",
      user.email || "",
      user.phoneNum || "",
      user.created_at || "",
      user.country || "",
    ]);
  
    const csvContent = [headers, ...data].map((row) => row.join(",")).join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "users_data.csv";
    link.click();
  };
      
  const handleExportPDF = async () => {
  
    setDownloading((prev) => ({ ...prev, pdf: true }));

  

    try {
      const response = await axios.post(
        `${apiBaseUrl}getUsers`,
        { data: "all" }, // Fetch all users
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.data?.status === true) {
        const allUsers = response?.data?.data?.users || [];

        if (allUsers.length === 0) {
          alert("No data available to export.");
          return;
        }

        generatePDF(allUsers); // Call function to create PDF
      }
    } catch (error) {
      console.error("Error fetching users for PDF export:", error);
    }finally{

    setDownloading((prev) => ({ ...prev, pdf: false }));


    }
  };
  const generatePDF = (users) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("User Data Report", 14, 15);

    // Table Headers
    const headers = [[ "Full Name", "Email", "Phone Number", "Created At"]];

    // Table Rows
    const data = users.map((user) => [
        user.fullName,
        user.email,
        user.phoneNum,
        new Date(user.created_at).toLocaleDateString(),
    ]);

    // ✅ Ensure autoTable is correctly used
    autoTable(doc, {
        head: headers,
        body: data,
        startY: 20,
    });

    // Save PDF
    doc.save("users_report.pdf");
};

const handleExportExcel = async () => {
  
  setDownloading((prev) => ({ ...prev, excel: true }));


  try {
    const response = await axios.post(
      `${apiBaseUrl}getUsers`,
      { data: "all" }, // Fetch all users
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response?.data?.status === true) {
      const allUsers = response?.data?.data?.users || [];

      if (allUsers.length === 0) {
        alert("No data available to export.");
        return;
      }

      generateExcel(allUsers); // Call function to create Excel
    }
  } catch (error) {
    console.error("Error fetching users for Excel export:", error);
  }finally{
  
  setDownloading((prev) => ({ ...prev, excel: false }));


  }
};

const generateExcel = (users) => {
  // Convert user data to worksheet
  const ws = XLSX.utils.json_to_sheet(users);

  // Create a new workbook and append the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Users");

  // Save the Excel file
  XLSX.writeFile(wb, "users_report.xlsx");
};


  const handleSortByDate = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const CountryFlag = ({ country }) => {
    const countryCodeMapping = {
      Pakistan: "PK",
      India: "IN",
      "United States": "US",
      Canada: "CA",
      "United Kingdom": "GB",
    };

    const countryCode = countryCodeMapping[country];

    return countryCode ? (
      <ReactCountryFlag
        className="emojiFlag"
        countryCode={countryCode}
        svg
        style={{ fontSize: "2em", lineHeight: "2em" }}
        aria-label={country}
      />
    ) : (
      <span>N/A</span>
    );
  };

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
  title={
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span>All Users</span>


    </div>
  }
  img={payment}
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

      {/* Filter Options */}
      {showFilter && (
        <div className="absolute right-0 mt-2 p-3 bg-white shadow-md rounded-lg w-30">
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
                <div className="mt-6 mb-1 bg-black overflow-x-scroll pb-3 rounded-[8px] w-[100%] sm:w-[100%] border border-[#2b2b2b]">
  <div className="w-full bg-black overflow-x-auto  justify-center">
    
    {/* Centered Button Group */}
    <div className="flex justify-end p-4 bg-black gap-3">
      <button
        style={{
          background: "transparent",
          color: "white",
          border: "1px solid white",
          padding: "8px 16px",
          borderRadius: "5px",
          fontSize: "14px",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#545454";
          e.target.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "transparent";
          e.target.style.color = "white";
        }}
        onClick={handleExportCSV}
      >
        {downloading.csv ? "Downloading..." : "Export CSV"}
      </button>
      <button
  style={{
    background: "transparent",
    color: "white",
    border: "1px solid white",
    padding: "8px 16px",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background 0.3s ease, color 0.3s ease",
  }}
  onMouseEnter={(e) => {
    e.target.style.background = "#545454";
    e.target.style.color = "white";
  }}
  onMouseLeave={(e) => {
    e.target.style.background = "transparent";
    e.target.style.color = "white";
  }}
  onClick={handleExportPDF}
>
  {downloading.pdf ? "Downloading..." : "Export PDF"}
</button>


      <button
        style={{
          background: "transparent",
          color: "white",
          border: "1px solid white",
          padding: "8px 16px",
          borderRadius: "5px",
          fontSize: "14px",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#545454";
          e.target.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "transparent";
          e.target.style.color = "white";
        }}
        onClick={handleExportExcel}
      >
        {downloading.excel ? "Downloading..." : "Export EXCEL"}
      </button>
    </div>

    {/* Table */}
    <table className="w-full text-left text-white sm:w-[100%] w-[900px] min-h-[200px]">
      <thead className="bg-[#A87F0B] text-white">
        <tr>
          <th className="py-2 px-4">Sr #</th>
          <th className="py-2 px-4">Name</th>
          <th className="py-2 px-4">Email</th>
          <th className="py-2 px-4">Phone</th>
          <th
            className="py-2 px-4 cursor-pointer flex items-center gap-1"
            onClick={handleSortByDate}
          >
            Create Date{" "}
            {sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}
          </th>
          <th className="py-2 px-4">Country</th>
          <th className="py-2 px-4">Action</th>
        </tr>
      </thead>
      <tbody>
        {screenLoader ? (
          <tr>
            <td colSpan="7" className="text-center py-4">
              <div className="absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 inset-0 flex justify-center items-center">
                <FaSpinner className="animate-spin text-yellow-500 text-3xl" />
              </div>
            </td>
          </tr>
        ) : filteredKametis.length > 0 ? (
          filteredKametis.map((kameti, index) => (
            <tr
              key={kameti.id}
              className="border-t border-gray-600 bg-black h-[20px] min-h-[50px] text-sm md:text-base"
              style={{ height: "20px", minHeight: "30px" }}
            >
              <td className="py-2 px-4 md:px-4">
                {(currentPage - 1) * perPage + (index + 1)}
              </td>
              <td className="py-2 px-4 md:px-4">
                {kameti.fullName ? kameti.fullName : "N/A"}
              </td>
              <td className="py-2 px-4 md:px-4">
                {kameti.email ? kameti.email : "N/A"}
              </td>
              <td className="py-2 px-4 md:px-4">
                {kameti.phoneNum ? kameti.phoneNum : "N/A"}
              </td>
              <td className="py-2 px-4 md:px-4">
                {kameti.created_at
                  ? new Date(kameti.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </td>
              <td className="py-2 px-4 md:px-4 ">
                {kameti.country ? <CountryFlag country={kameti.country} /> : "N/A"}
              </td>
              <td className="py-2 px-4 md:px-4">
                <button
                  onClick={() => handleDleteModalOpen(kameti?.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center py-4 text-gray-400">
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

                {/* <KametiesTable Kameties={getAllKametis} handleGetKameti={handleGetAllUsers } setCurrentPage={setCurrentPage} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertModal
        open={open}
        handleClose={handleCloseDleteModal}
        title="Are you sure you want to delete this?"
        // onConfirm={handleCloseDleteModal}
        onConfirm={deleteUsers}
      />
    </>
  );
}
