import React, { useState, useEffect } from "react";
import openSocket from "socket.io-client";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Select from "@material-ui/core/Select";
import { toast } from "react-toastify";

import Tooltip from "@material-ui/core/Tooltip";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import api from "../../services/api";
import { i18n } from "../../translate/i18n.js";
import toastError from "../../errors/toastError";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(4),
    flexDirection: "column",
  },

  paper: {
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: theme.shape.borderRadius,
    transition: "box-shadow 0.3s ease-in-out",
    "&:hover": {
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    },
  },

  settingOption: {
    marginLeft: "auto",
  },

  margin: {
    margin: theme.spacing(1),
  },

  switchLabel: {
    fontSize: "1rem",
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
}));

const Settings = () => {
  const classes = useStyles();
  const history = useHistory();

  const [settings, setSettings] = useState([]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await api.get("/settings");
        setSettings(data);
      } catch (err) {
        toastError(err);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const socket = openSocket(process.env.REACT_APP_BACKEND_URL);

    socket.on("settings", (data) => {
      if (data.action === "update") {
        setSettings((prevState) => {
          const aux = [...prevState];
          const settingIndex = aux.findIndex((s) => s.key === data.setting.key);
          aux[settingIndex].value = data.setting.value;
          return aux;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChangeBooleanSetting = async (e) => {
    const selectedValue = e.target.checked ? "enabled" : "disabled";
    const settingKey = e.target.name;

    try {
      await api.put(`/settings/${settingKey}`, {
        value: selectedValue,
      });
      toast.success(i18n.t("settings.success"));
      history.go(0);
    } catch (err) {
      toastError(err);
    }
  };

  const handleChangeSetting = async (e) => {
    const selectedValue = e.target.value;
    const settingKey = e.target.name;

    try {
      await api.put(`/settings/${settingKey}`, {
        value: selectedValue,
      });
      toast.success(i18n.t("settings.success"));
    } catch (err) {
      toastError(err);
    }
  };

  const getSettingValue = (key) => {
    const { value } = settings.find((s) => s.key === key);
    return value;
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom align="center">
          {i18n.t("settings.title")}
        </Typography>

        <Paper className={classes.paper}>
          <Tooltip title={i18n.t("settings.settings.userCreation.note")}>
            <FormControlLabel
              control={
                <Switch
                  checked={
                    settings && settings.length > 0 && getSettingValue("userCreation") === "enabled"
                  }
                  onChange={handleChangeBooleanSetting}
                  name="userCreation"
                  color="primary"
                />
              }
              label={
                <Typography variant="body1" className={classes.switchLabel}>
                  {i18n.t("settings.settings.userCreation.name")}
                </Typography>
              }
            />
          </Tooltip>
        </Paper>

        <Paper className={classes.paper}>
          <Tooltip title={i18n.t("settings.settings.allTicket.note")}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings && settings.length > 0 && getSettingValue("allTicket") === "enabled"}
                  onChange={handleChangeBooleanSetting}
                  name="allTicket"
                  color="primary"
                />
              }
              label={
                <Typography variant="body1" className={classes.switchLabel}>
                  {i18n.t("settings.settings.allTicket.name")}
                </Typography>
              }
            />
          </Tooltip>
        </Paper>

        <Paper className={classes.paper}>
          <Tooltip title={i18n.t("settings.settings.CheckMsgIsGroup.note")}>
            <FormControlLabel
              control={
                <Switch
                  checked={
                    settings && settings.length > 0 && getSettingValue("CheckMsgIsGroup") === "enabled"
                  }
                  onChange={handleChangeBooleanSetting}
                  name="CheckMsgIsGroup"
                  color="primary"
                />
              }
              label={
                <Typography variant="body1" className={classes.switchLabel}>
                  {i18n.t("settings.settings.CheckMsgIsGroup.name")}
                </Typography>
              }
            />
          </Tooltip>
        </Paper>

        <Paper className={classes.paper}>
          <Tooltip title={i18n.t("settings.settings.call.note")}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings && settings.length > 0 && getSettingValue("call") === "enabled"}
                  onChange={handleChangeBooleanSetting}
                  name="call"
                  color="primary"
                />
              }
              label={
                <Typography variant="body1" className={classes.switchLabel}>
                  {i18n.t("settings.settings.call.name")}
                </Typography>
              }
            />
          </Tooltip>
        </Paper>

        <Paper className={classes.paper}>
          <Tooltip title={i18n.t("settings.settings.sideMenu.note")}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings && settings.length > 0 && getSettingValue("sideMenu") === "enabled"}
                  onChange={handleChangeBooleanSetting}
                  name="sideMenu"
                  color="primary"
                />
              }
              label={
                <Typography variant="body1" className={classes.switchLabel}>
                  {i18n.t("settings.settings.sideMenu.name")}
                </Typography>
              }
            />
          </Tooltip>
        </Paper>

        <Paper className={classes.paper}>
          <Tooltip title={i18n.t("settings.settings.closeTicketApi.note")}>
            <FormControlLabel
              control={
                <Switch
                  checked={
                    settings && settings.length > 0 && getSettingValue("closeTicketApi") === "enabled"
                  }
                  onChange={handleChangeBooleanSetting}
                  name="closeTicketApi"
                  color="primary"
                />
              }
              label={
                <Typography variant="body1" className={classes.switchLabel}>
                  {i18n.t("settings.settings.closeTicketApi.name")}
                </Typography>
              }
            />
          </Tooltip>
        </Paper>

        <Paper className={classes.paper}>
          <Tooltip title={i18n.t("settings.settings.darkMode.note")}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings && settings.length > 0 && getSettingValue("darkMode") === "enabled"}
                  onChange={handleChangeBooleanSetting}
                  name="darkMode"
                  color="primary"
                />
              }
              label={
                <Typography variant="body1" className={classes.switchLabel}>
                  {i18n.t("settings.settings.darkMode.name")}
                </Typography>
              }
            />
          </Tooltip>
        </Paper>

        <Paper className={classes.paper}>
          <Tooltip title={i18n.t("settings.settings.ASC.note")}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings && settings.length > 0 && getSettingValue("ASC") === "enabled"}
                  onChange={handleChangeBooleanSetting}
                  name="ASC"
                  color="primary"
                />
              }
              label={
                <Typography variant="body1" className={classes.switchLabel}>
                  {i18n.t("settings.settings.ASC.name")}
                </Typography>
              }
            />
          </Tooltip>
        </Paper>

        <Paper className={classes.paper}>
          <Tooltip title={i18n.t("settings.settings.created.note")}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings && settings.length > 0 && getSettingValue("created") === "enabled"}
                  onChange={handleChangeBooleanSetting}
                  name="created"
                  color="primary"
                />
              }
              label={
                <Typography variant="body1" className={classes.switchLabel}>
                  {i18n.t("settings.settings.created.name")}
                </Typography>
              }
            />
          </Tooltip>
        </Paper>

        <Paper className={classes.paper}>
          <Tooltip title={i18n.t("settings.settings.timeCreateNewTicket.note")}>
            <div>
              <Typography variant="body1" className={classes.switchLabel}>
                {i18n.t("settings.settings.timeCreateNewTicket.name")}
              </Typography>
              <Select
                margin="dense"
                variant="outlined"
                native
                id="timeCreateNewTicket-setting"
                name="timeCreateNewTicket"
                value={settings && settings.length > 0 && getSettingValue("timeCreateNewTicket")}
                className={classes.settingOption}
                onChange={handleChangeSetting}
              >
                <option value="10">
                  {i18n.t("settings.settings.timeCreateNewTicket.options.10")}
                </option>
                <option value="30">
                  {i18n.t("settings.settings.timeCreateNewTicket.options.30")}
                </option>
                <option value="60">
                  {i18n.t("settings.settings.timeCreateNewTicket.options.60")}
                </option>
                <option value="300">
                  {i18n.t("settings.settings.timeCreateNewTicket.options.300")}
                </option>
                <option value="1800">
                  {i18n.t("settings.settings.timeCreateNewTicket.options.1800")}
                </option>
                <option value="3600">
                  {i18n.t("settings.settings.timeCreateNewTicket.options.3600")}
                </option>
                <option value="7200">
                  {i18n.t("settings.settings.timeCreateNewTicket.options.7200")}
                </option>
                <option value="21600">
                  {i18n.t("settings.settings.timeCreateNewTicket.options.21600")}
                </option>
                <option value="43200">
                  {i18n.t("settings.settings.timeCreateNewTicket.options.43200")}
                </option>
                <option value="86400">
                  {i18n.t("settings.settings.timeCreateNewTicket.options.86400")}
                </option>
                <option value="604800">
                  {i18n.t("settings.settings.timeCreateNewTicket.options.604800")}
                </option>
                <option value="1296000">
                  {i18n.t("settings.settings.timeCreateNewTicket.options.1296000")}
                </option>
                <option value="2592000">
                  {i18n.t("settings.settings.timeCreateNewTicket.options.2592000")}
                </option>
              </Select>
            </div>
          </Tooltip>
        </Paper>
      </Container>
    </div>
  );
};

export default Settings;