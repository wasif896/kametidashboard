import React, { useEffect, useState, useRef } from "react";
import { FaEye } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import adminicon from '../../images/auth/adminicon.png'

import Sidebar from "../../components/Sidebar/Sidebar";
import { FaChevronDown } from "react-icons/fa";

import "react-calendar/dist/Calendar.css";
import "./Payment.css";
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
export default function UserKameti({ totalEntries = 12, entriesPerPage = 10 }) {
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const [open, setOpen] = useState(false);

  const handleDleteModalOpen = () => setOpen(true);
  const handleCloseDleteModal = () => setOpen(false);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
  const users = [
    {
      id: 1,
      joiningDate: "01-02-2025",
      name: "John Doe",
      type: "Daily",
      totalKameti: 5,
      paid: 8,
      unpaid:10,
    },
    {
        id: 2,
        joiningDate: "01-02-2025",
        name: "John Doe",
        type: "Daily",
        totalKameti: 5,
        paid: 8,
        unpaid:10,
      },
      {
        id: 1,
        joiningDate: "01-02-2025",
        name: "John Doe",
        type: "Daily",
        totalKameti: 5,
        paid: 8,
        unpaid:10,
      },
      {
        id: 1,
        joiningDate: "01-02-2025",
        name: "John Doe",
        type: "Daily",
        totalKameti: 5,
        paid: 8,
        unpaid:10,
      },
      {
        id: 1,
        joiningDate: "01-02-2025",
        name: "John Doe",
        type: "Daily",
        totalKameti: 5,
        paid: 8,
        unpaid:10,
      },
      {
        id: 1,
        joiningDate: "01-02-2025",
        name: "John Doe",
        type: "Daily",
        totalKameti: 5,
        paid: 8,
        unpaid:10,
      },
  ];

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
          title="User Kameti's"
          img={payment}
        />

            <div className="w-[100%] flex items-center justify-center flex-col">
              <div className="w-[100%] sm:w-[97%] flex items-center justify-center flex-col p-[12px] sm:p-[px] sm:mt-[15px] rounded-[15px]">
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
                      placeholder="Search"
                      className="w-full py-2 text-white focus:outline-none"
                    />
                    <button
                      onClick={toggleFilter}
                      className="px-3 text-gray-500 hover:text-gray-300"
                    >
                      Filter
                    </button>
                  </div>

                  {/* Filter Dropdown */}
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
                <div className="mt-6 mb-1 bg-[#2B2B2B] pb-3 overflow-x-scroll rounded-[8px] w-[100%] sm:w-[100%] border border-[#2b2b2b]">
                  <div className="relative inline-block text-white">
                    <div className="flex items-center m-3">
                      <span className="pr-3 text-[13px]">Show</span>

                      <div
                        className="flex items-center bg-transparent px-2 py-1 rounded-md cursor-pointer border border-gray-500"
                        onClick={toggleDropdown}
                      >
                        <span className="mr-4 text-sm">{selectedValue}</span>
                        <FaChevronDown className="w-3 h-3 text-gray-300" />
                      </div>
                    </div>

                    {isOpen && (
                      <ul className="absolute left-0 mt-2 w-full bg-[#2B2B2B] rounded-md shadow-md border border-gray-500">
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
                  <div className="w-full bg-black ">
                    <table className="w-full text-left text-white min-w-[900px]">
                      <thead className="bg-[#A87F0B] text-white">
                        <tr>
                          <th className="py-2 px-4">Kameti Holder Name</th>
                          <th className="py-2 px-4">Create Date</th>
                          <th className="py-2 px-4">Kameti Type</th>
                          <th className="py-2 px-4">Total Kameti's</th>
                          <th className="py-2 px-4">Paid Kameti</th>
                          <th className="py-2 px-4">Unpaid Kameti</th>
                     
                   
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr
                            key={user.id}
                            className={`border-t border-gray-600 ${"bg-black"}`}
                          >
                            <td className="py-2 px-4">{user.name}</td>
                            <td className="py-2 px-4">{user.joiningDate}</td>
                            <td className="py-2 px-4">{user.type}</td>
                            <td className="py-2 px-4">{user.totalKameti}</td>
                            <td className="py-2 px-4">{user.paid}</td>
                            <td className="py-2 px-4">{user.unpaid}</td>
                      
                          
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex justify-between w-full p-4 bg-black text-white">
                  {/* Showing Entries Info */}
                  <div className="text-sm mb-2">
                    Showing {entriesPerPage * (currentPage - 1) + 1} to{" "}
                    {Math.min(entriesPerPage * currentPage, totalEntries)} of{" "}
                    {totalEntries} entries
                  </div>

                  {/* Pagination Buttons */}
                  <div className="flex items-center space-x-2">
                    {/* Previous Arrow */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-2 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
                      disabled={currentPage === 1}
                    >
                      &laquo;
                    </button>

                    {/* Page Numbers */}
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

                    {/* Next Arrow */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-2 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
                      disabled={currentPage === totalPages}
                    >
                      &raquo;
                    </button>
                  </div>
                </div>
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
