import React, { useEffect, useState } from "react";
import adminicon from '../../images/auth/adminicon.png'
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { TbMenu2 } from "react-icons/tb";
import MobileSidebar from "../../components/MobileSidebar/MobileSidebar";
import more from "../../images/Frame 2085663857 (1).png";
import { LineChart } from "@mui/x-charts/LineChart";
import { IconButton } from "@mui/material";
import dayjs from "dayjs";
import { FaCaretUp } from "react-icons/fa";
import userImg from "../../images/Wallet.png"
import clickImg from "../../images/Wallet-1.png"
import iosImg from "../../images/Wallet-2.png"
import androidImg from "../../images/Wallet-3.png"
import webImg from "../../images/Wallet-4.png"
import Header from "../../components/Header/Header";
import axios from "axios";
import { PuffLoader } from "react-spinners";

export default function Dashboard() {
  const [btnloader, setBTnloader] = useState(false);
  let navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("monthly"); // Default option
  const apiBaseUrl = import.meta.env.VITE_APP_API_URL;
  const token = localStorage.getItem("token");
  let [screenLoader,setScreenLoader]=useState(false)
  let [getAnalaytics,setGetAnalaytics]=useState([])
let stats = getAnalaytics?.stats

const countryUsers = getAnalaytics?.country_users || {};
console.log(countryUsers);
const totalUsers = Object.values(countryUsers || {}).reduce((sum, num) => sum + num, 0) || 1; // Avoid division by zero


const formatChartData = () => {
  if (!stats || !Array.isArray(stats)) {
    return { xLabels: [1], yValues: [1] }; // Ensure the first index is 0
  }

  let xLabels = [1]; // Initialize with 0
  let yValues = [1]; // Initialize with 0

  if (selectedOption === "daily") {
    xLabels = [0, ...stats.map((item) => item.day)];
    yValues = [0, ...stats.map((item) => item.count)];
  } else if (selectedOption === "weekly") {
    xLabels = [0, ...stats.map((item) => item.week)];
    yValues = [0, ...stats.map((item) => item.count)];
  } else if (selectedOption === "monthly") {
    xLabels = [0, ...stats.map((item) => item.month)];
    yValues = [0, ...stats.map((item) => item.count)];
  } else if (selectedOption === "yearly") {
    xLabels = [0, ...stats.map((item) => item.year)];
    yValues = [0, ...stats.map((item) => item.count)];
  }

  return { xLabels, yValues };
};

  const { xLabels, yValues } = formatChartData();

  const handleGetAnalaytics = async (range) => {
    setScreenLoader(true);
    try {
      const response = await axios.post(`${apiBaseUrl}Analytics`, 
        {
          timePeriod:selectedOption,
        }, 
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data?.status === true) {
       console.log(response?.data);
        setGetAnalaytics(response?.data);

        setScreenLoader(false);
      }
    } catch (error) {
      setScreenLoader(false);
    }
  };

  useEffect(() => {
    // Initial call with 'alltime' range
    handleGetAnalaytics(selectedOption);
  }, [selectedOption]);
  useEffect(() => {
    // Initial call with 'alltime' range
    handleGetAnalaytics(selectedOption);
  }, []);

  const handleChange = (event) => {
    setSelectedOption(event.target.value); // Update selected value
  };


  const countries = [
    { name: "Pakistan", users: countryUsers?.Pakistan || 0, flag: "https://flagcdn.com/w320/pk.png" },
    { name: "India", users: countryUsers?.india || 0, flag: "https://flagcdn.com/w320/in.png" },
    { name: "Bangladesh", users: countryUsers?.bangladesh || 0, flag: "https://flagcdn.com/w320/bd.png" },
    { name: "Sri Lanka", users: countryUsers?.srilanka || 0, flag: "https://flagcdn.com/w320/lk.png" },
    { name: "Saudi Arabia", users: countryUsers?.saudiarabia || 0, flag: "https://flagcdn.com/w320/sa.png" }
  ].map(country => {
    console.log("Updated Countries Data:", country.users ); 
    console.log(totalUsers ); 
  
    return {
      ...country,
      percentage: totalUsers > 0 ? Math.round((country.users / totalUsers) * 100) : 0 // ✅ Prevent division by zero
    };
  });
  
 

  let screenwidth = window.innerWidth;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([dayjs("2023-11-23"), dayjs("2024-01-25")]);
  const userData = [
    { title: "Total user", count: getAnalaytics?.analytic?.total_users, img:  userImg, description: "Last 30 days users",last30day:getAnalaytics?.analytic?.totalUsersLast30days },
    { title: "Website Clicks", count: getAnalaytics?.analytic?.webClicks, img:  webImg, description: "Last 30 days users",last30day:0 },
    { title: "iOS Insights", count:  getAnalaytics?.analytic?.ios_users, img: iosImg, description: "Last 30 days users",last30day:getAnalaytics?.analytic?.iosLast30Days},
    { title: "Android Insights", count:  getAnalaytics?.analytic?.android_users, img:  androidImg, description: "Last 30 days users",last30day:getAnalaytics?.analytic?.androidLast30Days },
    { title: "Web App Insights", count:  getAnalaytics?.analytic?.web_users, img: clickImg, description:"Last 30 days users",last30day:getAnalaytics?.analytic?.webLast30Days},
  ];
  return (
    <>
      <div className="w-[100%] h-[100vh] flex justify-center items-center bg-black">
        <div className="w-[100%] h-[100vh] flex">
          {screenwidth > 480 && <Sidebar />}
          <div className="sm:w-[80%] w-[100%] h-[100vh] overflow-y-scroll  pb-3 sm:ml-[2px] sm:rounded-l-[0px] rounded-l-[20px] rounded-r-[20px]">
          <Header
          screenwidth={screenwidth}
          drawerOpen={drawerOpen}
          toggleDrawer={toggleDrawer}
          setOpen={setOpen}
          value={value}
          title="Dashboard Analytics"
          img={more}
        />

            <div className="w-[100%] flex items-center justify-center flex-col">
              <div className="w-[95%] sm:w-[100%] flex items-center justify-center flex-col  sm:p-[25px] mt-[10px] rounded-[15px]">
              {/* <div className="w-full bg-[#64646469] flex items-center  rounded-lg overflow-hidden  mb-4">
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
</div> */}

<div className="flex justify-between w-[100%] flex-wrap  sm:w-[100%]">
{userData.map((data, index) => (
  <div key={index} className="sm:w-[19%] w-[49%] sm:mb-0 mb-4 p-2 bg-white text-center border rounded-lg shadow-lg">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{data.title}</p>
        <h5 className="text-xl text-start font-semibold text-gray-800"> {data?.count || 0}</h5>
      </div>
      <div>
        <img src={data.img} alt="More" className="w-10 h-10 cursor-pointer" />
      </div>
    </div>
    <p className="text-[13px] text-gray-500 flex items-center "><span className="text-[#45B369]">+{data?.last30day}</span>{data.description}</p>
  </div>
))}
</div>
                <div className="flex justify-between flex-col sm:flex-row w-[100%] sm:w-[100%] flex-wrap ">
                <div className="bg-white sm:w-[60%] w-[100%] rounded-lg mt-4">
                  <div className="flex justify-between items-center w-full bg-white p-4 rounded-lg">
                    <p className="text-md font-semibold text-gray-700">
                      Total Users Statistic
                    </p>
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="timeframe-select"
                        className="text-gray-600 font-medium"
                      ></label>
                      <select
                        id="timeframe-select"
                        value={selectedOption}
                        onChange={handleChange}
                        className="p-2 text-sm border border-gray-300 rounded-md"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>
                  {screenLoader ? (
                    <div className='flex justify-center items-center flex-col p-5 w-[100%] h-[200px] rounded-lg mt-5'>
                      <PuffLoader />
                    </div>)
:
(
  <LineChart
  xAxis={[{ scaleType: "point", data: xLabels }]}
    // yAxis={[{ min: 0 }]}
  series={[
    {
      data: yValues,
      color: "#A87F0B",
    },
  ]}
  width={screenwidth > 450 ? 590 : 300}
  height={300}
/>

)}
                </div>
                <div className="bg-white sm:w-[39%] w-[100%] rounded-lg mt-4">
                <div className="bg-white rounded-lg shadow-md p-6 ">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sessions by Country</h3>
      {countries.map((country, index) => (
        <div key={index} className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Circular Flag */}
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src={country.flag} alt={`${country.name} flag`} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-medium text-gray-800">{country.name}</p>
              
              <p className="text-sm text-gray-500">{country.users} Users</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-1/2">
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-yellow-500 rounded-full"
                style={{ width: `${country.percentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-600">{country.percentage}%</span>
          </div>
        </div>
      ))}
    </div>
                </div>
                </div>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
