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
  Checkbox,
  Typography,
  Chip,
} from "@mui/material";

import { Card, CardActions } from "../../styled/Card.styled";
import { useAppSelector } from "../../../app/hooks";
import { GridCloseIcon } from "@mui/x-data-grid";
import { Box } from "@mui/system";

const arr = [1, 2, 3, 4, 5, 6];

export const Home = () => {
  const [open, setOpen] = useState(false);

  const drawerOpen: boolean = useAppSelector((state) => state.app.drawerOpen);
  const elevation: number = useMemo(() => (drawerOpen ? 0 : 2), [drawerOpen]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {arr.map((el) => {
          return (
            <Card elevation={elevation} drawerOpen={drawerOpen}>
              <CardHeader
                title="Material UI Boilerplate"
                subheader={`${new Date().toLocaleString("en-US", {
                  dateStyle: "full",
                })}`}
              />
              <CardActions>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => setOpen(true)}
                >
                  Open
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Card sx={{ width: "100%" }}>
          <CardHeader title="Key Actionable" sx={{ padding: "16px 0px" }} />
          <Box>
            <Chip label="Actionable" sx={{ borderRadius: "0px" }} />
            <CardContent>
              <Box>
                <FormGroup>
                  <FormControlLabel
                    sx={{
                      width: "100%",
                      "& > span:last-child": {
                        width: "100%",
                      },
                    }}
                    control={<Checkbox color="secondary" />}
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
                    control={<Checkbox color="secondary" />}
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
