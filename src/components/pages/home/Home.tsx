import { useEffect, useMemo, useState } from "react";
import {
  CardHeader,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
  CardContent,
  FormGroup,
  FormControlLabel,
  Typography,
  Chip,
  Tab,
  Radio,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Card, CardActions } from "../../styled/Card.styled";
import { useAppSelector } from "../../../app/hooks";
import { GridCloseIcon } from "@mui/x-data-grid";
import { Box } from "@mui/system";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  useDeleteActionItemsMutation,
  useGetActionItemsQuery,
  useTicketCountQuery,
  useUpdateActionItemsMutation,
  useGetInsightFromPromptQuery,
  useLazyGetInsightsQuery,
} from "../../../apis/usersApi";
import groupBy from "lodash/groupBy";
import SearchIcon from "@mui/icons-material/Search";
import { Spinner } from "../../design";

const refresh = false;

export const Home = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("1");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [selectValue, setSelectValue] = useState("CREATED");
  const [selectedInsight, setSelectedInsight] = useState("");
  const [insightsData, setInsightsData] = useState<any>();
  const [openPromptResult, setOpenPromptResult] = useState(false);
  const [dataFromPrompt, setDataFromPrompt] = useState<any>();

  const fetchInsight = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.watchtower.gohq.in/api/rag/insight",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie:
              "connect.sid=s%3AT8eUzCetQj_R_cWwF3O_JdgWLjMNvkj-.rNHeeitvwTJhHuzO9JXJweLUHd5DYdYuofyBchKQ%2Fj0",
          },
          body: JSON.stringify({ prompt: searchQuery }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data?.text);
      setDataFromPrompt(data?.text); // Update state with the parsed JSON
      setOpenPromptResult(true); // Set dialog open state to true when dataFromPrompt is updated
    } catch (error) {
      console.error("Error fetching insight:", error);
    } finally {
      setLoading(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState<any>("");

  const [deleteActionItem] = useDeleteActionItemsMutation();
  const [updateActionItem] = useUpdateActionItemsMutation();
  const [getInsights, { isLoading, isFetching }] = useLazyGetInsightsQuery();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const drawerOpen: boolean = useAppSelector((state) => state.app.drawerOpen);
  const elevation: number = useMemo(() => (drawerOpen ? 0 : 2), [drawerOpen]);

  const { data: countData } = useTicketCountQuery({
    refetchOnMountOrArgChange: true,
  });

  const handleGetInsights = async () => {
    const data = await getInsights(refresh);
    setInsightsData(data?.data);
  };

  useEffect(() => {
    handleGetInsights();
  }, []);

  const { data: actionsData } = useGetActionItemsQuery(selectValue, {
    refetchOnMountOrArgChange: true,
  });

  const result = groupBy(
    actionsData,
    (action: any) => action?.action_item_type
  );

  const handleDelete = (id: string) => {
    deleteActionItem(id);
  };

  const handleUpdate = (id: string) => {
    updateActionItem(id);
  };

  const handleSelectChange = (event: any) => {
    setSelectValue(event.target.value);
  };

  return (
    <>
      <TextField
      label="How can I help you today?"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      sx={{
        width: '100%',
        borderRadius: "50px", // Increased border-radius value for roundness
        '& .MuiOutlinedInput-root': {
          borderRadius: "50px", // Ensures the input field itself is rounded
        },
      }}

      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          fetchInsight();
        }
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton edge="end" onClick={fetchInsight} disabled={loading}>
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#00637F' }} />
              ) : (
                <SearchIcon />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Overview" value="1" />
            <Tab label="Summary of Actionables" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Box>
            <Typography
              component="div"
              variant="h6"
              sx={{ width: "100%", margin: "0 32px" }}
            >
              <Box sx={{ display: "flex" }}>
                <Typography
                  noWrap
                  sx={{
                    borderRight: "1px solid #9E9E9E",
                    paddingRight: "28px",
                    marginRight: "28px",
                    color: "#424242",
                    fontSize: "20px",
                  }}
                >
                  Tickets
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "80%",
                  }}
                >
                  <Typography
                    sx={{ color: "#424242", fontSize: "20px" }}
                    noWrap
                  >
                    <b>Total:</b> {countData?.totalTickets}
                  </Typography>
                  <Typography
                    sx={{ color: "#424242", fontSize: "20px" }}
                    noWrap
                  >
                    <b>Closed:</b> {countData?.closedTickets}
                  </Typography>
                  <Typography
                    sx={{ color: "#424242", fontSize: "20px" }}
                    noWrap
                  >
                    <b>Opened:</b> {countData?.openTickets}
                  </Typography>
                  <Typography
                    sx={{ color: "#424242", fontSize: "20px" }}
                    noWrap
                  >
                    <b>Escalated:</b> {countData?.escalatedTickets}
                  </Typography>
                </Box>
              </Box>
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              margin: "32px 32px 0px 32px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
              <Typography sx={{ color: "#424242", fontSize: "20px", marginRight: "10px" }} noWrap>
                Insights for you
              </Typography>
              <img
                src="/Frame-75104.png" // Path to the image
                alt="Insights Icon"
                height="30" // Adjust size of the image as needed
                style={{ objectFit: "contain" }} // Ensures the image fits within the specified height
              />
            </Box>
            <Typography
              sx={{ color: "#00637F", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}
              noWrap
              onClick={() => getInsights(true)}
            >
              Refresh
            </Typography>
          </Box>
          {isLoading || isFetching ? (
            <Spinner />
          ) : (
            <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "16px", // Adjust this to reduce the space between cards
  }}
>
  {insightsData &&
    insightsData?.map((el: any) => {
      return (
        <Card
          key={el?._id}
          elevation={elevation}
          drawerOpen={drawerOpen}
          sx={{
            backgroundImage: "linear-gradient(to bottom, #DFF2F1, #F2FAF9)",
            width: "250px",
            height: "250px",
            cursor: "pointer",
            margin: "0", // Removed margin to reduce space between cards
          }}
          onClick={() => {
            setSelectedInsight(el?._id);
            setOpen(true);
          }}
        >
          <CardHeader
          
            title={el?.title}
            subheader={
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 400,
                  marginTop: 2,
                  display: "-webkit-box", // Enables multi-line truncation
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical", // Ensures vertical text orientation
                  WebkitLineClamp: 5, // Limits text to 5 lines
                  textOverflow: "ellipsis", // Adds the ellipsis
                }}
              >
                {el?.description}
              </Typography>}
            subheaderTypographyProps={{
              fontSize: 14,
              fontWeight: 500,
              marginTop: 2,
            }}
          />
        </Card>
      );
    })}
</Box>

          )}
        </TabPanel>
        <TabPanel value="2">
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              noWrap
              sx={{
                color: "#424242",
                fontSize: "20px",
                margin: "0 32px",
              }}
            >
              Key Actionables
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-helper-label">
                Status of Actionable
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={selectValue}
                label="Status of Actionable"
                onChange={handleSelectChange}
              >
                <MenuItem value={"CREATED"}>Pending</MenuItem>
                <MenuItem value={"PROCESSED"}>Implemented</MenuItem>
                <MenuItem value={"REJECTED"}>Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            sx={{
              width: "100%",
              margin: "0 32px",
            }}
          >
            {Object.keys(result).map((el, index) => {
              return (
                <Card
                  sx={{ width: "100%", backgroundColor: "#FFF" }}
                  key={index}
                >
                  <Box sx={{ position: "relative" }}>
                    <Chip
                      label={
                        el === "jira"
                          ? "Tech/Product Enhancement"
                          : el === "alert"
                          ? "Operational Alerts"
                          : el === "faq"
                          ? "FAQs/Communication Related"
                          : null
                      }
                      sx={{
                        position: "absolute",
                        top: "-16px",
                        left: "-16px",
                        backgroundColor: "#DFF2F1",
                      }}
                    />
                    <>
                      {selectValue === "REJECTED" ? (
                        <Chip
                          label="Rejected"
                          sx={{
                            position: "absolute",
                            top: "-16px",
                            right: "-16px",
                          }}
                          color="error"
                        />
                      ) : selectValue === "PROCESSED" ? (
                        <Chip
                          label="Implemented"
                          sx={{
                            position: "absolute",
                            top: "-16px",
                            right: "-16px",
                            backgroundColor: "#DFF2F1",
                            color: "#08753F",
                          }}
                        />
                      ) : null}
                    </>
                    <CardContent>
                      <Box>
                        <FormGroup>
                          {result[el].map((action) => {
                            return (
                              <FormControlLabel
                                key={action?._id}
                                sx={{
                                  width: "100%",
                                  "& > span:last-child": {
                                    width: "100%",
                                  },
                                  marginTop: "16px",
                                }}
                                control={
                                  <Radio
                                    color="secondary"
                                    checked={action?._id === selectedId}
                                    onClick={() => setSelectedId(action?._id)}
                                    sx={{
                                      display:
                                        action?.status === "CREATED"
                                          ? "block"
                                          : "none",
                                    }}
                                  />
                                }
                                label={
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      width: "100%",
                                    }}
                                  >
                                    <Box>
                                      <Typography>
                                        {action?.action_item_data?.question ||
                                          action?.action_item_data?.title ||
                                          action?.action_item_data?.subject}
                                      </Typography>
                                      <Typography variant="body2">
                                        {action?.action_item_data?.answer ||
                                          action?.action_item_data
                                            ?.description ||
                                          action?.action_item_data?.body}
                                      </Typography>
                                    </Box>
                                    <Box>
                                      {action?.status === "CREATED" ? (
                                        <>
                                          {action?._id === selectedId ? (
                                            <Button
                                              type="submit"
                                              variant="contained"
                                              sx={{ color: "#fff" }}
                                              onClick={() =>
                                                handleUpdate(action?._id)
                                              }
                                            >
                                              Implement
                                            </Button>
                                          ) : (
                                            <IconButton
                                              onClick={() =>
                                                handleDelete(action?._id)
                                              }
                                            >
                                              <GridCloseIcon />
                                            </IconButton>
                                          )}
                                        </>
                                      ) : null}
                                    </Box>
                                  </Box>
                                }
                              />
                            );
                          })}
                        </FormGroup>
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              );
            })}
          </Box>
        </TabPanel>
      </TabContext>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="modal-modal-title"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {insightsData?.find((el: any) => el?._id === selectedInsight)?.title}
          <IconButton onClick={() => setOpen(false)}>
            <GridCloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {
              insightsData?.find((el: any) => el?._id === selectedInsight)
                ?.description
            }
            <Typography
              sx={{ color: "#424242", fontSize: "20px", margin: "20px 0 8px" }}
              noWrap
            >
              Insights
            </Typography>
            <Box>
              {insightsData
                ?.find((el: any) => el?._id === selectedInsight)
                ?.insights?.map((insight: any) => {
                  return (
                    <Typography
                      sx={{
                        color: "#424242",
                        fontSize: "14px",
                      }}
                    >
                      {insight}
                    </Typography>
                  );
                })}
            </Box>
            <Typography
              sx={{ color: "#424242", fontSize: "20px", margin: "20px 0 8px" }}
              noWrap
            >
              Impact
            </Typography>
            <Box>
              <Typography
                sx={{
                  color: "#424242",
                  fontSize: "14px",
                }}
              >
                {
                  insightsData?.find((el: any) => el?._id === selectedInsight)
                    ?.impact
                }
              </Typography>
            </Box>
            <Box sx={{ margin: "20px 0 8px" }}>
              <Accordion sx={{ backgroundColor: "white" }}>

              <AccordionSummary
              expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1-content"
                id="panel1-header"

              >
                <Typography component="span">Supporting Data</Typography>
              </AccordionSummary>

            <AccordionDetails>
              <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ticket id</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {insightsData
                      ?.find((el: any) => el?._id === selectedInsight)
                      ?.tickets?.map((row: any) => (
                        <TableRow key={row?._id}>
                          <TableCell>{row?.id}</TableCell>
                          <TableCell>{row?.status}</TableCell>
                          <TableCell>{row?.subject}</TableCell>
                          <TableCell>{row?.description}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              </AccordionDetails>
              </Accordion>
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      {dataFromPrompt && (
        <Dialog
          open={openPromptResult}
          onClose={() => setOpenPromptResult(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="modal-modal-title"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            Here is Your Answer
            <IconButton onClick={() => setOpenPromptResult(false)}>
              <GridCloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {searchQuery}
              <Box
                sx={{
                  borderRadius: "16px",
                  border: "1px solid #ccc",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  backgroundColor: "white",
                }}
              >
                <Typography variant="body1">{dataFromPrompt}</Typography>
              </Box>
              <Typography sx={{ margin: "1rem", color: "blue" }}>
                Show me an alternate answer
              </Typography>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
