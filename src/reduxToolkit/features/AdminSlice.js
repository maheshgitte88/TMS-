import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createTicket = createAsyncThunk(
  "createNewticket",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://tmsfinalserver.onrender.com/api/create-ticket",
        data
      );
      const result = response.data;
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updatesTickets = createAsyncThunk(
  "updateTicket",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://tmsfinalserver.onrender.com/api/update-ticket",
        data
      );
      const result = response.data;
      return result;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const getAdminAssignedTicket = createAsyncThunk(
  "getAdminAssignedTicket",
  async ({ departmentId, SubDepartmentId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://tmsfinalserver.onrender.com/api/tickets/${departmentId}/${SubDepartmentId}`
      );
      const resData = res.data.tickets;
      return resData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);




export const getAdminTicketFromOtherDep = createAsyncThunk(
  "getAdminTicketFromOtherDep",
  async ({ departmentId, SubDepartmentId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://tmsfinalserver.onrender.com/api/trs-tickets/${departmentId}/${SubDepartmentId}`
      );
      const resData = res.data.tickets;
      return resData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAdminTicketClaimed = createAsyncThunk(
  "getAdminClaimedTickets",
  async ({ user_id }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://tmsfinalserver.onrender.com/api/emp-ticket/less/claimed/${user_id}`
      );
      const resData = res.data.tickets;
      return resData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAdminTicketBetweenClaimed = createAsyncThunk(
  "getAdminClaimedBetweenTickets",
  async ({ user_id }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://tmsfinalserver.onrender.com/api/emp-ticket/between/claimed/${user_id}`
      );
      const resData = res.data.tickets;
      return resData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAdminTicketAboveClaimed = createAsyncThunk(
  "getAdminClaimedAboveTickets",
  async ({ user_id }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://tmsfinalserver.onrender.com/api/emp-ticket/above/claimed/${user_id}`
      );
      // console.log(res , 106)
      const resData = res.data.tickets;
      return resData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAdminTranfTicketClaimed = createAsyncThunk(
  "getAdminTransfClaimedTickets",
  async ({ user_id }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://tmsfinalserver.onrender.com/api/emp-ticket/claimed-trf/${user_id}`
      );
      const resData = res.data.tickets;
      return resData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


// export const getDepResolvedTicket = createAsyncThunk(
//   "getdepResTickets",
//   async ({ departmentId, SubDepartmentId, EmployeeID }, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(
//         `https://tmsfinalserver.onrender.com/Ticket/department/Resolved/${departmentId}/${SubDepartmentId}/${EmployeeID}`
//       );
//       const resData = res.data.tickets;
//       return resData;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// export const getDepClosedTicket = createAsyncThunk(
//   "getdepClosedTickets",
//   async ({ departmentId, SubDepartmentId, EmployeeID }, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(
//         `https://tmsfinalserver.onrender.com/Ticket/department/Closed/${departmentId}/${SubDepartmentId}/${EmployeeID}`
//       );
//       const resData = res.data.tickets;
//       return resData;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );



export const AdminSlice = createSlice({
  name: "DepTicketDetails",
  initialState: {
    AdminTickets: [],
    ResFromOtherDepTickets: [],
    AdminClaimedTickets: [],
    AdminClaimedBetweenTickets: [],
    AdminClaimedAboveTickets: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateAdminTicket: (state, action) => {
      state.AdminTickets.push(action.payload);
    },
    // updateForAdminTicket: (state, action) => {
    //   const ticketIndex = state.AdminClaimedTickets.findIndex(ticket => ticket.TicketID === action.payload.TicketID);
    //   if (ticketIndex !== -1) {
    //     // Replace the existing ticket with the new ticket data
    //     state.AdminClaimedTickets[ticketIndex] = action.payload;
    //   } else {
    //     // If the ticket doesn't exist, add it to the array
    //     state.AdminClaimedTickets.push(action.payload);
    //   }
    // },

    updateForAdminTicket: (state, action) => {
      // Check if the ticket exists in any of the arrays
      let found = false;
      
      // Update AdminClaimedTickets
      const ticketIndex1 = state.AdminClaimedTickets.findIndex(ticket => ticket.TicketID === action.payload.TicketID);
      if (ticketIndex1 !== -1) {
        state.AdminClaimedTickets[ticketIndex1] = action.payload;
        found = true;
      }
    
      // Update AdminClaimedBetweenTickets
      const ticketIndex2 = state.AdminClaimedBetweenTickets.findIndex(ticket => ticket.TicketID === action.payload.TicketID);
      if (ticketIndex2 !== -1) {
        state.AdminClaimedBetweenTickets[ticketIndex2] = action.payload;
        found = true;
      }
    
      // Update AdminClaimedAboveTickets
      const ticketIndex3 = state.AdminClaimedAboveTickets.findIndex(ticket => ticket.TicketID === action.payload.TicketID);
      if (ticketIndex3 !== -1) {
        state.AdminClaimedAboveTickets[ticketIndex3] = action.payload;
        found = true;
      }
    
      // If the ticket was not found in any array, add it to AdminClaimedTickets by default
      if (!found) {
        state.AdminClaimedTickets.push(action.payload);
      }
    },
    updateForAdminOtherDepTicket: (state, action) => {
      const ticketIndex = state.ResFromOtherDepTickets.findIndex(ticket => ticket.TicketID === action.payload.TicketID);
      if (ticketIndex !== -1) {
        // Replace the existing ticket with the new ticket data
        state.ResFromOtherDepTickets[ticketIndex] = action.payload;
      } else {
        // If the ticket doesn't exist, add it to the array
        state.ResFromOtherDepTickets.push(action.payload);
      }
    },
    claimAdminTicketRemoveAfterTF: (state, action) => {
      state.AdminClaimedTickets = state.AdminClaimedTickets.filter(ticket => ticket.TicketID !== action.payload.TicketID);
      state.AdminClaimedBetweenTickets = state.AdminClaimedBetweenTickets.filter(ticket => ticket.TicketID !== action.payload.TicketID);
      state.AdminClaimedAboveTickets = state.AdminClaimedAboveTickets.filter(ticket => ticket.TicketID !== action.payload.TicketID);
      // state.ResFromOtherDepTickets = state.ResFromOtherDepTickets.filter(ticket => ticket.TicketID !== action.payload.TicketID);
      // Add additional logic to add the ticket to the claiming user's pending tickets list if necessary
    },
    // claimAdminTicketRemoveForOtherDeptAfteSolverd: (state, action) => {
    //   state.AdminClaimedTickets = state.AdminClaimedTickets.filter(ticket => ticket.TicketID !== action.payload.TicketID);
    //   state.AdminClaimedBetweenTickets = state.AdminClaimedBetweenTickets.filter(ticket => ticket.TicketID !== action.payload.TicketID);
    //   state.AdminClaimedAboveTickets = state.AdminClaimedAboveTickets.filter(ticket => ticket.TicketID !== action.payload.TicketID);
    //   // state.ResFromOtherDepTickets = state.ResFromOtherDepTickets.filter(ticket => ticket.TicketID !== action.payload.TicketID);
    //   // Add additional logic to add the ticket to the claiming user's pending tickets list if necessary
    // },

    // claimAdminTicket: (state, action) => {
    //   const ticketIndex = state.AdminTickets.findIndex(ticket => ticket.TicketID === action.payload.TicketID);
    //   if (ticketIndex !== -1) {
    //     // Remove the ticket from AdminTickets for all users
    //     const [claimedTicket] = state.AdminTickets.splice(ticketIndex, 1);

    //     // If the ticket is being claimed by the current user, add it to AdminClaimedTickets
    //     if (action.payload.currentUserId === action.payload.claim_User_Id) {
    //       state.AdminClaimedTickets.push(claimedTicket);
    //     }
    //   }
    // }, 



    claimAdminTicket: (state, action) => {
      const { TicketID, currentUserId } = action.payload;
      const ticketIndex = state.AdminTickets.findIndex(ticket => ticket.TicketID === TicketID);
    
      if (ticketIndex !== -1) {
        // Remove the ticket from AdminTickets
        const [claimedTicket] = state.AdminTickets.splice(ticketIndex, 1);
        
        // Calculate time difference in hours
        const createdAt = new Date(claimedTicket.createdAt); // Assuming createdAt is a valid date string or Date object
        const now = new Date();
        const hoursDifference = (now - createdAt) / (1000 * 60 * 60);
    
        // Set the claim_User_Id to currentUserId
        claimedTicket.claim_User_Id = currentUserId;
    
        // Determine which array to push the ticket into based on time difference
        if (hoursDifference <= 24) {
          state.AdminClaimedTickets.push(claimedTicket);
        } else if (hoursDifference <= 48) {
          state.AdminClaimedBetweenTickets.push(claimedTicket);
        } else {
          state.AdminClaimedAboveTickets.push(claimedTicket);
        }
      }
    },    
    // claimAdminTicket: (state, action) => {
    //   const { TicketID, currentUserId } = action.payload;
    //   const ticketIndex = state.AdminTickets.findIndex(ticket => ticket.TicketID === TicketID);

    //   if (ticketIndex !== -1) {
    //     // Remove the ticket from AdminTickets
    //     const [claimedTicket] = state.AdminTickets.splice(ticketIndex, 1);
    //     // Set the claim_User_Id to currentUserId
    //     claimedTicket.claim_User_Id = currentUserId;
    //     // Add the ticket to AdminClaimedTickets if claimed by the current user
    //     state.AdminClaimedTickets.push(claimedTicket);
    //   }
    // },



    AfterOtherAdminClaimRemoveTicket: (state, action) => {
      const { TicketID } = action.payload;
      const ticketIndex = state.AdminTickets.findIndex(ticket => ticket.TicketID === TicketID);

      if (ticketIndex !== -1) {
        state.AdminTickets.splice(ticketIndex, 1);
      }
    },

    claimTransfAdminTicket: (state, action) => {
      const { TicketID, currentUserId } = action.payload;
      const ticketIndex = state.ResFromOtherDepTickets.findIndex(ticket => ticket.TicketID === TicketID);
    
      if (ticketIndex !== -1) {
        // Remove the ticket from ResFromOtherDepTickets
        const [claimedTicket] = state.ResFromOtherDepTickets.splice(ticketIndex, 1);
        
        // Calculate time difference in hours
        const createdAt = new Date(claimedTicket.createdAt); // Assuming createdAt is a valid date string or Date object
        const now = new Date();
        const hoursDifference = (now - createdAt) / (1000 * 60 * 60);
    
        // Set the transferred_Claim_User_id to currentUserId
        claimedTicket.transferred_Claim_User_id = currentUserId;
    
        // Determine which array to push the ticket into based on time difference
        if (hoursDifference <= 24) {
          state.AdminClaimedTickets.push(claimedTicket);
        } else if (hoursDifference <= 48) {
          state.AdminClaimedBetweenTickets.push(claimedTicket);
        } else {
          state.AdminClaimedAboveTickets.push(claimedTicket);
        }
      }
    },
    
    // claimTransfAdminTicket: (state, action) => {
    //   const { TicketID, currentUserId } = action.payload;
    //   const ticketIndex = state.ResFromOtherDepTickets.findIndex(ticket => ticket.TicketID === TicketID);

    //   if (ticketIndex !== -1) {
    //     // Remove the ticket from AdminTickets
    //     const [claimedTicket] = state.ResFromOtherDepTickets.splice(ticketIndex, 1);
    //     // Set the claim_User_Id to currentUserId
    //     claimedTicket.transferred_Claim_User_id = currentUserId;
    //     // Add the ticket to AdminClaimedTickets if claimed by the current user
    //     if (currentUserId === claimedTicket.transferred_Claim_User_id) {
    //       state.AdminClaimedTickets.push(claimedTicket);
    //     }
    //   }
    // },




    
    AfterOtherTranfAdminClaimRemoveTicket: (state, action) => {
      const { TicketID } = action.payload;
      const ticketIndex = state.ResFromOtherDepTickets.findIndex(ticket => ticket.TicketID === TicketID);

      if (ticketIndex !== -1) {
        state.ResFromOtherDepTickets.splice(ticketIndex, 1);
      }
    },

  }, // Use an empty `reducers` object if you don't have custom reducers
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.AdminTickets.push(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "An error occurred"; // Handle potential missing error message
      })
      .addCase(updatesTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatesTickets.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTicket = action.payload.ticket;

        // Find the index of the existing ticket
        const index = state.AdminClaimedTickets.findIndex(
          (ticket) => ticket.TicketID === updatedTicket.TicketID
        );

        if (index !== -1) {
          // Replace the existing ticket with the updated ticket
          state.AdminClaimedTickets[index] = updatedTicket;
        } else {
          // If the ticket is not found, add it to the array (optional)
          state.AdminClaimedTickets.push(updatedTicket);
        }
      })
      .addCase(updatesTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "An error occurred"; // Handle potential missing error message
      })
      .addCase(getAdminAssignedTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminAssignedTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.AdminTickets = action.payload;
      })
      .addCase(getAdminAssignedTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "An error occurred";
      })
      .addCase(getAdminTicketFromOtherDep.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminTicketFromOtherDep.fulfilled, (state, action) => {
        state.loading = false;
        state.ResFromOtherDepTickets = action.payload;
      })
      .addCase(getAdminTicketFromOtherDep.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "An error occurred";
      })
      .addCase(getAdminTicketClaimed.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminTicketClaimed.fulfilled, (state, action) => {
        state.loading = false;
        state.AdminClaimedTickets = action.payload;
      })
      .addCase(getAdminTicketClaimed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "An error occurred"; // Handle potential missing error message
      })
      .addCase(getAdminTicketBetweenClaimed.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminTicketBetweenClaimed.fulfilled, (state, action) => {
        state.loading = false;
        state.AdminClaimedBetweenTickets = action.payload;
      })
      .addCase(getAdminTicketBetweenClaimed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "An error occurred"; // Handle potential missing error message
      })
      .addCase(getAdminTicketAboveClaimed.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminTicketAboveClaimed.fulfilled, (state, action) => {
        state.loading = false;
        state.AdminClaimedAboveTickets = action.payload;
      })
      .addCase(getAdminTicketAboveClaimed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "An error occurred"; // Handle potential missing error message
      })
      .addCase(getAdminTranfTicketClaimed.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminTranfTicketClaimed.fulfilled, (state, action) => {
        state.loading = false;
        state.AdminClaimedTickets = [...state.AdminClaimedTickets, ...action.payload];
      })
      .addCase(getAdminTranfTicketClaimed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "An error occurred"; // Handle potential missing error message
      })
  },
});

export const { updateAdminTicket, updateForAdminTicket, updateForAdminOtherDepTicket, updateTicket, claimAdminTicket, AfterOtherAdminClaimRemoveTicket, claimAdminTicketRemoveAfterTF, AfterOtherTranfAdminClaimRemoveTicket, updateDtTicketUpdate, StatusResTicket, claimTransfAdminTicket } = AdminSlice.actions;
export default AdminSlice.reducer;