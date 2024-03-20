import React, { useState, useEffect } from "react";
import openSocket from "socket.io-client";
import { useHistory } from "react-router-dom";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Select from "@material-ui/core/Select";
import { toast } from "react-toastify";

import Tooltip from "@material-ui/core/Tooltip";

import api from "../../services/api";
import { i18n } from "../../translate/i18n.js";
import toastError from "../../errors/toastError";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(4),
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    width: "100%",
    maxWidth: 400,
  },
  settingOption: {
    marginLeft: "auto",
  },
}));

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

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

    socket.on("settings", data => {
      if (data.action === "update") {
        setSettings(prevState => {
          const aux = [...prevState];
          const settingIndex = aux.findIndex(s => s.key === data.setting.key);
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
      <Container className={classes.container} maxWidth="md">
        <Typography variant="h6" gutterBottom>
          {i18n.t("settings.title")}
        </Typography>

        {settings.map((setting) => (
          <Paper key={setting.key} className={classes.paper}>
            <Tooltip title={setting.note}>
              <FormControlLabel
                control={
                  <IOSSwitch
                    checked={
                      settings.length > 0 &&
                      getSettingValue(setting.key) === "enabled"
                    }
                    onChange={handleChangeBooleanSetting}
                    name={setting.key}
                  />
                }
                label={setting.name}
              />
            </Tooltip>
          </Paper>
        ))}

        <Paper className={classes.paper} elevation={3}>
          <Tooltip title={i18n.t("settings.settings.timeCreateNewTicket.note")}>
            <Typography variant="body1">
              {i18n.t("settings.settings.timeCreateNewTicket.name")}
            </Typography>
            <Select
              margin="dense"
              variant="outlined"
              native
              id="timeCreateNewTicket-setting"
              name="timeCreateNewTicket"
              value={
                settings.length > 0 &&
                getSettingValue("timeCreateNewTicket")
              }
              className={classes.settingOption}
              onChange={handleChangeSetting}
            >
              {[10, 30, 60, 300, 1800, 3600, 7200, 21600, 43200, 86400, 604800, 1296000, 2592000].map((option) => (
                <option key={option} value={option}>
                  {i18n.t(`settings.settings.timeCreateNewTicket.options.${option}`)}
                </option>
              ))}
            </Select>
          </Tooltip>
        </Paper>
      </Container>
    </div>
  );
};

export default Settings;
