import React, { useEffect, useState, useRef } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import adminicon from "../../images/auth/adminicon.png";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { FaChevronDown } from "react-icons/fa";
import "react-calendar/dist/Calendar.css";
import "./Payment.css";
import { IconButton } from "@mui/material";
import { AiOutlinePlus } from "react-icons/ai";
import payment from "../../images/Group 1965 (1).png";
import { TbMenu2 } from "react-icons/tb";
import MobileSidebar from "../../components/MobileSidebar/MobileSidebar";
import CreateRole from "../../Modal/CreateRole";
import AlertModal from "../../Modal/AlertModal";
import Header from "../../components/Header/Header";
import axios from "axios";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

const apiBaseUrl = import.meta.env.VITE_APP_API_URL;
const token = localStorage.getItem("token");

export default function RoleAccess({ totalEntries = 12, entriesPerPage = 10 }) {
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const [openRoleModal, setOpenRoleModal] = useState(false);
  let [screenLoader, setScreenLoader] = useState(false);
  let [update, setUpdate] = useState(false);


  const handleOpen = () => {
    setOpenRoleModal(true);
    setEdit(false);
  };
  const handleClose = () => {
    setOpenRoleModal(false);
    setEdit(false);
    setUpdate(!update)
  }
    
 

  const [open, setOpen] = useState(false);
  const [roleId, setRoleId] = useState("");
  const [editRoleData, setEditRoleData] = useState(null);
  const [roleAction, setRoleAction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDleteModalOpen = (id) => {
    setRoleId(id);
    setOpen(true);
  };

  const handleEditRole = (data) => {
    setEdit(true);
    setEditRoleData(data);
    setRoleAction("edit");

    setOpenRoleModal(true);
  };

  const handleCloseDleteModal = () => setOpen(false);

  const [isOpen, setIsOpen] = useState(false);
  const [edit, setEdit] = useState(false);

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
  const [roles, setRoles] = useState([]);

  const [filterOptions, setFilterOptions] = useState({
    daily: false,
    weekly: false,
    monthly: false,
    yearly: false,
  });

  const toggleFilter = () => setShowFilter(!showFilter);

  const handleCheckboxChange = (option) => {
    setFilterOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const fetchRoles = async (searchQuery = "") => {
    setScreenLoader(true);

    try {
      const response = await axios.get(`${apiBaseUrl}admin/getroles`, {
        params: { search: searchQuery }, // Pass search query as a parameter
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);
      setRoles(response?.data?.data); // Update state with filtered roles
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setScreenLoader(false);
    }
  };

  const deleteRoles = async () => {
    try {
      const response = await axios.delete(
        `${apiBaseUrl}admin/deleterole/${roleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Role deleted successfully");
        handleCloseDleteModal();
        fetchRoles(); // Call fetchRoles to update the list after deletion
      }
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    fetchRoles(e.target.value); // Call fetchRoles with the search query
  };
  const [sortKey, setSortKey] = useState("sort"); // default sort key
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc
  
  const sortedRoles = [...roles].sort((a, b) => {
    const valueA = a[sortKey]?.toLowerCase?.() || "";
    const valueB = b[sortKey]?.toLowerCase?.() || "";
  
    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
  
  return (
    <>
      <div className="w-[100%] h-[100vh] flex justify-center items-center bg-black">
        <div className="w-[100%] h-[100vh] flex  ">
          {screenwidth > 430 && <Sidebar />}

          <div className="sm:w-[80%] w-[100%] h-[100vh] overflow-y-scroll sm:pb-3  sm:rounded-l-[0px] rounded-l-[20px] rounded-r-[20px] ">
            <Header
              screenwidth={screenwidth}
              drawerOpen={drawerOpen}
              toggleDrawer={toggleDrawer}
              title="Roles & Access"
              img={payment}
            />

            <div className="w-[100%] flex items-center justify-center flex-col relative ">
              <div className="w-[100%]  sm:w-[100%] flex items-center justify-center flex-col p-[12px] sm:p-[27px]  rounded-[15px]">
                <div className="relative w-full">
                  {/* Search Bar */}
                  <div className="w-full bg-[#64646469] flex items-center rounded-lg overflow-hidden">
                    <span className="px-3 text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-4.35-4.35M16.65 10.5a6.15 6.15 0 11-12.3 0 6.15 6.15 0 0112.3 0z"
                        />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full py-2 px-3 bg-transparent text-white focus:outline-none"
                    />
                    {/* <button
                      onClick={toggleFilter}
                      className="px-3 text-gray-500 hover:text-gray-300"
                    >
                      Filter
                    </button> */}
                  </div>
                  Filter Dropdown
                  {showFilter && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg z-10">
                      <div className="p-4">
                        {["daily", "weekly", "monthly", "yearly"].map(
                          (option) => (
                            <div
                              key={option}
                              className="flex items-center space-x-2 mb-2 cursor-pointer"
                              onClick={() => handleCheckboxChange(option)}
                            >
                              <div
                                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                                  filterOptions[option]
                                    ? "bg-blue-500 border-blue-500"
                                    : "border-gray-400"
                                }`}
                              >
                                {filterOptions[option] && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="white"
                                    className="w-4 h-4"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </div>
                              <span className="text-gray-700 capitalize">
                                {option}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-1 mb-1 bg-[#2B2B2B] overflow-x-scroll pb-3 rounded-[8px] w-[100%] sm:w-[100%]  border-[#2b2b2b]">
                  <div className="relative flex w-[100%] justify-end text-white">
                    <div
                      onClick={handleOpen}
                      className="flex items-center cursor-pointer m-3 border rounded-md p-2 border-white"
                    >
                      <span className="text-[13px] flex items-center">
                        <AiOutlinePlus className="text-white mr-2" />
                        Create User
                      </span>
                    </div>


<div className=" flex items-center space-x-4 mr-2 border-white">
  <FormControl variant="outlined" size="small" sx={{ minWidth: 110, }}>
    <Select
      value={sortKey}
      onChange={(e) => setSortKey(e.target.value)}
      MenuProps={{
        PaperProps: {
          sx: {
            backgroundColor: '#1F1F1F', // ✅ menu background color
            color: 'white',
            fontSize: '12px',
          },
        },
      }}
      sx={{
        color: "white",
        height:'37px',
     fontSize: '14px',
     borderRadius:'7px',
        backgroundColor: "#2B2B2B",
        borderColor: "white",
        '.MuiOutlinedInput-notchedOutline': {
          borderColor: 'white',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'white',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'lightgray',
        },
        '& .MuiSvgIcon-root': {
          color: 'white', // ✅ arrow color
        },
      }}
    >
    <MenuItem value="sort" disabled>
    Sort
  </MenuItem>
      <MenuItem value="name">Name</MenuItem>
      <MenuItem value="email">Email</MenuItem>
      <MenuItem value="date">Date</MenuItem>
      <MenuItem value="role">Role</MenuItem>
    </Select>
  </FormControl>
</div>

                    {isOpen && (
                      <ul className="absolute right-0 mt-2 w-[130px] bg-[#2B2B2B] rounded-md shadow-md border border-gray-500">
                        {options.map((option) => (
                          <li
                            key={option}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-600"
                            onClick={() => handleSelect(option)}
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="w-full bg-black overflow-x-auto ">
                    <table className="w-full text-left text-white sm:w-[100%] w-[900px] min-h-[200px]  ">
                      <thead className="bg-[#A87F0B] text-white">
                        <tr>
                          <th className="py-2 px-4 text-[14px]">User #</th>
                          <th className="py-2 px-4 text-[14px]">Joining Date</th>
                          <th className="py-2 px-4 text-[14px]">Name</th>
                          <th className="py-2 px-4 text-[14px]">Email</th>
                          <th className="py-2 px-4 text-[14px]">Phone</th>
                          <th className="py-2 px-4 text-[14px]">Description</th>
                          <th className="py-2 px-4 text-[14px]">User Type</th>
                          <th className="py-2 px-4 text-[14px]">Action</th>
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
                        ) : sortedRoles?.length > 0 ? (
                          sortedRoles?.map((user, index) => (
                            <tr
                              key={user.id}
                              className="border-t border-gray-600 bg-black"
                            >
                              <td className="py-2 px-4 text-[14px]">{index + 1}</td>
                              <td className="py-2 px-4 text-[14px]">
                                {user.created_at
                                  ? new Date(
                                      user.created_at
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })
                                  : "N/A"}
                              </td>
                              <td className="py-2 px-4 text-[14px]">{user.name}</td>
                              <td className="py-2 px-4 text-[14px]">{user.email}</td>
                              <td className="py-2 px-4 text-[14px]">{user.phone}</td>
                              <td className="py-2 px-4 text-[14px]">{user.description}</td>
                              <td className="py-2 px-4 ">
                              <div className="bg-[#A87F0B] text-[14px] min-w-[100px] text-center p-1 rounded-lg">
                              {user.type === "admin"
                                ? "Admin"
                                : user.type === "subadmin"
                                ? "Sub Admin"
                                : ""}
                                </div>
                            </td>
                            

                              <td className="py-2 px-4 space-x-2">
                                {/* <button className="text-blue-500 hover:text-blue-700">
                    <FaEye /> 
                  </button> */}
                            {user.type !== 'admin' && (
  <>
                                <button
                                  onClick={() => handleEditRole(user)}
                                  className="text-[#45B369] hover:[#45B36910]"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDleteModalOpen(user?.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FaTrashAlt />
                                </button>
                                </>
)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-4">
                              No roles found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex justify-between w-full p-4 bg-black text-white">
                  {/* Showing Entries Info */}
                  {/* <div className="text-sm mb-2">
                    Showing {entriesPerPage * (currentPage - 1) + 1} to{" "}
                    {Math.min(entriesPerPage * currentPage, totalEntries)} of{" "}
                    {totalEntries} entries
                  </div> */}

                  {/* Pagination Buttons */}
                  {/* <div className="flex items-center space-x-2">
                 
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-2 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
                      disabled={currentPage === 1}
                    >
                      &laquo;
                    </button>

                   
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 rounded ${
                          currentPage === index + 1
                            ? "bg-yellow-600 text-white"
                            : "bg-white text-black"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

  
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-2 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
                      disabled={currentPage === totalPages}
                    >
                      &raquo;
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateRole
        edit={edit}
        open={openRoleModal}
        handleClose={handleClose}
        fetchRoles={fetchRoles}
        editData={editRoleData}
        action={roleAction}
        update={update}
      />
      <AlertModal
        open={open}
        handleClose={handleCloseDleteModal}
        title="Are you sure you want to delete the role?"
        onConfirm={deleteRoles}
      />
    </>
  );
}
