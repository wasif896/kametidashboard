import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

export default function PaymentsTable({ getUser, setCurrentPage, handleGetUser }) {
  const screenWidth = window.innerWidth;

  // Format date function
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  // Define the columns for DataGrid
  const columns = [
    {
      field: 'fullName',
      headerName: 'Kameti Name',
      width: 150,
      align: 'center',
      renderCell: (params) => (params.value ? params.value : 'N/A'),
    },
    {
      field: 'email',
      headerName: 'Total Price',
      width: 200,
      align: 'center',
      renderCell: (params) => (params.value ? params.value : 'N/A'),
    },
    {
      field: 'created_at',
      headerName: 'Kameti Type',
      width: 200,
      align: 'center',
      renderCell: (params) => (params.value ? formatDate(params.value) : 'N/A'),
    },
    {
      field: 'username',
      headerName: 'Username',
      width: 200,
      align: 'center',
      renderCell: (params) => (params.value ? params.value : 'N/A'),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      align: 'center',
      renderCell: (params) => (
        <div className="flex gap-2 justify-center">
          <RiDeleteBin6Line className='text-[red] ml-2 text-[20px] cursor-pointer' />
        </div>
      ),
    },
  ];

  // DataGrid pagination settings
  const pageSize = 10;
  const totalPages = Math.ceil(getUser?.total / pageSize); // Calculate total number of pages

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);  // Update the current page in the state
    handleGetUser(newPage);   // Fetch the data for the new page
  };

  return (
    <div style={{ height: 400, width: '100%', marginTop: 20 }} className="card relative">
      <DataGrid
        rows={getUser?.users}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 20, 50]}
        pagination
        paginationMode="server"  // Telling MUI to handle pagination via the server (API)
        page={getUser?.current_page - 1} // MUI expects page index starting from 0
        onPageChange={(newPage) => handlePageChange(newPage + 1)}  // Adjust for 0-based indexing
        disableSelectionOnClick
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'yellow',
            color: 'black', 
          },
          '& .MuiDataGrid-cell': {
            color: 'white',
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: '#333',
            color: 'white',
          },
          fontSize: '0.90rem',
          color: '#fff',
        }}
      />

      {/* Total Items Display */}
      <div className="absolute sm:bottom-2 font-[500] left-0 text-md text-white">
        Total Items: {getUser?.total}
      </div>
    </div>
  );
}
