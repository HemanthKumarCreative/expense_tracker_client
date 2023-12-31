import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Grid,
} from "@mui/material";
import ReportGeneration from "../components/ReportGeneration";
import PaymentRequest from "../components/PaymentRequest";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import ReportHistoryTable from "../components/ReportsDownloads";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import UserList from "../components/UserList";
import NoExpensesMessage from "../ui/NoExpenseMessage";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function formatTimestamp(timestamp) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(timestamp).toLocaleDateString(undefined, options);
  const time = new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    date: date,
    time: time,
  };
}

export default function CustomizedAccordions() {
  const [expanded, setExpanded] = React.useState("panel2");
  const [userInfo, setUserInfo] = useState(JSON.parse(Cookies.get("userInfo")));
  const [isLeaderBoardShown, setIsLeaderBoardShown] = useState(false);
  const [downloads, setDownloads] = useState([]);
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [currentPage, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const getAllDownloads = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/downloads/${userInfo.id}`
      );
      let data = await response.json();
      data = data.map((download) => {
        const updatedDownload = {};
        updatedDownload.id = download.id;
        const dateTimeObject = formatTimestamp(download.createdAt);
        updatedDownload.date = dateTimeObject.date;
        updatedDownload.time = dateTimeObject.time;
        updatedDownload.fileLink = download.file_link;
        return updatedDownload;
      });
      setDownloads(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExpenses = async () => {
    const userId = userInfo.id;
    const page = currentPage || 1; // Get the current page from state, default to 1

    try {
      const response = await fetch(
        `http://localhost:5000/api/expenses/${userId}?page=${page}`
      );

      const data = await response.json();
      setExpenses(data.expenses);

      // Update total pages if available in the response
      if (data.totalPages !== undefined) {
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userInfo");
    navigate("/");
  };

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    fetchExpenses();
    getAllDownloads();
  }, [currentPage]);

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {`Welcome ${userInfo.name}, you are the ${
              userInfo.isPremiumUser ? "Premium" : "basic"
            } user of Expense Tracker`}
          </Typography>
          {userInfo.isPremiumUser ? (
            <ReportGeneration
              userInfo={userInfo}
              isPremiumUser={userInfo.isPremiumUser}
              getAllDownloads={getAllDownloads}
            />
          ) : (
            <></>
          )}
          <PaymentRequest
            setUserInfo={setUserInfo}
            userInfo={userInfo}
            isLeaderBoardShown={isLeaderBoardShown}
            setIsLeaderBoardShown={setIsLeaderBoardShown}
          />
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 14 }}>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>ExpenseForm</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ExpenseForm
              expenses={expenses}
              setExpenses={setExpenses}
              userInfo={userInfo}
              fetchExpenses={fetchExpenses}
              setExpanded={setExpanded}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
            <Typography>
              {!isLeaderBoardShown ? "Expense List" : "Leader Board"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {!isLeaderBoardShown &&
              (expenses.length ? (
                <ExpenseList
                  expenses={expenses}
                  setExpenses={setExpenses}
                  userInfo={userInfo}
                  currentPage={currentPage}
                  setPage={setPage}
                  totalPages={totalPages}
                  fetchExpenses={fetchExpenses}
                />
              ) : (
                <NoExpensesMessage />
              ))}
            {isLeaderBoardShown && <UserList />}
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
            <Typography>Reports Download History</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {downloads.length ? (
              <ReportHistoryTable downloads={downloads} />
            ) : (
              <></>
            )}
          </AccordionDetails>
        </Accordion>
      </Container>
    </div>
  );
}
