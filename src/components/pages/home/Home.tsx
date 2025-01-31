import { useMemo, useState } from "react";
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
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { Card, CardActions } from "../../styled/Card.styled";
import { useAppSelector } from "../../../app/hooks";
import { GridCloseIcon } from "@mui/x-data-grid";
import { Box } from "@mui/system";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  useGetActionItemsQuery,
  useGetInsightsQuery,
  useTicketCountQuery,
  useGetInsightFromPromptQuery,
} from "../../../apis/usersApi";

export const Home = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [dataFromPrompt, setDataFromPrompt] = useState<any>();
  const { data, refetch: refetchInsightsFromPrompt } = useGetInsightFromPromptQuery(searchQuery, {
    skip: !searchQuery, 
  });
  setDataFromPrompt(data);
  const handleSearch = () => {
    if (searchQuery.trim()) {
      refetchInsightsFromPrompt();
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const drawerOpen: boolean = useAppSelector((state) => state.app.drawerOpen);
  const elevation: number = useMemo(() => (drawerOpen ? 0 : 2), [drawerOpen]);

  const { data: countData } = useTicketCountQuery({
    refetchOnMountOrArgChange: true,
  });

  const { data: insightsData, refetch } = useGetInsightsQuery({
    refetchOnMountOrArgChange: true,
  });

  const { data: actionsData } = useGetActionItemsQuery({
    refetchOnMountOrArgChange: true,
  });

  console.log(insightsData, "insightsData");
  console.log(actionsData, "actionsData");

  return (
    <>
      <TextField
        label="How can I help you today?"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ width: '100%', borderRadius: "50px" }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end" onClick={handleSearch}>
                <SearchIcon />
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
                    Tickets Total : {countData?.totalTickets}
                  </Typography>
                  <Typography
                    sx={{ color: "#424242", fontSize: "20px" }}
                    noWrap
                  >
                    Tickets Closed: {countData?.closedTickets}
                  </Typography>
                  <Typography
                    sx={{ color: "#424242", fontSize: "20px" }}
                    noWrap
                  >
                    Tickets Opened: {countData?.openTickets}
                  </Typography>
                  <Typography
                    sx={{ color: "#424242", fontSize: "20px" }}
                    noWrap
                  >
                    Tickets Escalated: {countData?.escalatedTickets}
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
            <Typography sx={{ color: "#424242", fontSize: "20px" }} noWrap>
              Insights for you
            </Typography>
            <Typography
              sx={{ color: "#00637F", fontSize: "16px", fontWeight: "600" }}
              noWrap
              onClick={() => refetch()}
            >
              Refresh
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            {insightsData?.map((el: any) => {
              return (
                <Card
                  key={el?._id}
                  elevation={elevation}
                  drawerOpen={drawerOpen}
                  sx={{
                    backgroundColor: "#DFF2F1",
                    margin: "32px",
                    width: "250px",
                    height: "250px",
                  }}
                >
                  <CardHeader
                    title={el?.title}
                    subheader={el?.description}
                    titleTypographyProps={{
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                    subheaderTypographyProps={{
                      fontSize: 14,
                      fontWeight: 500,
                      marginTop: 2,
                    }}
                  />
                  <CardActions sx={{ justifyContent: "right" }}>
                    <Button
                      color="secondary"
                      variant="text"
                      onClick={() => setOpen(true)}
                      sx={{
                        color: "#00637F",
                        fontSize: "12px",
                        textTransform: "capitalize",
                      }}
                    >
                      Know more
                    </Button>
                  </CardActions>
                </Card>
              );
            })}
          </Box>
        </TabPanel>
        <TabPanel value="2">
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              margin: "0 32px",
            }}
          >
            <Card sx={{ width: "100%", backgroundColor: "#FFF" }}>
              <Box sx={{ position: "relative" }}>
                <Chip
                  label="Tech/Product Enhancement"
                  sx={{
                    position: "absolute",
                    top: "-16px",
                    left: "-16px",
                    backgroundColor: "#DFF2F1",
                  }}
                />
                <CardContent>
                  <Box>
                    <FormGroup>
                      <FormControlLabel
                        sx={{
                          width: "100%",
                          "& > span:last-child": {
                            width: "100%",
                          },
                          marginTop: "16px",
                        }}
                        control={<Radio color="secondary" />}
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
                                Introduce a new support category- Lorem Ipsum{" "}
                              </Typography>
                              <Typography variant="body2">
                                Subtitle comes here if required
                              </Typography>
                            </Box>
                            <Box>
                              <IconButton onClick={() => {}}>
                                <GridCloseIcon />
                              </IconButton>
                            </Box>{" "}
                          </Box>
                        }
                      />
                      <FormControlLabel
                        sx={{
                          width: "100%",
                          "& > span:last-child": {
                            width: "100%",
                          },
                        }}
                        control={<Radio color="secondary" />}
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
                                Introduce a new support category- Lorem Ipsum{" "}
                              </Typography>
                              <Typography variant="body2">
                                Subtitle comes here if required
                              </Typography>
                            </Box>
                            <Box>
                              <IconButton onClick={() => {}}>
                                <GridCloseIcon />
                              </IconButton>
                            </Box>{" "}
                          </Box>
                        }
                      />
                    </FormGroup>
                  </Box>
                </CardContent>
              </Box>
            </Card>
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
          Material UI Boilerplate
          <IconButton onClick={() => setOpen(false)}>
            <GridCloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};
