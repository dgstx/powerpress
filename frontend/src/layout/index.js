import React, { useState, useContext, useEffect } from "react";
import clsx from "clsx";
import {
  AppBar,
  Drawer,
  IconButton,
  List,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MainListItems from "./MainListItems";
import NotificationsPopOver from "../components/NotificationsPopOver";
import UserModal from "../components/UserModal";
import { AuthContext } from "../context/Auth/AuthContext";
import BackdropLoading from "../components/BackdropLoading";
import { i18n } from "../translate/i18n";
import api from "../services/api";
import toastError from "../errors/toastError";
import { system } from "../config.json";
import { systemVersion } from "../../package.json";
import logodash from "../assets/logo-dash.png";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    [theme.breakpoints.down("sm")]: {
      height: "calc(100vh - 56px)",
    },
  },
  toolbar: {
    paddingRight: 24,
    color: "#ffffff",
    background: theme.palette.toolbar.main,
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    minHeight: "48px",
    backgroundColor: theme.palette.toolbarIcon.main,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: {
    minHeight: "48px",
  },
  content: {
    flex: 1,
    overflow: "auto",
  },
}));

const LoggedInLayout = ({ children }) => {
  const classes = useStyles();
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { handleLogout, loading } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerVariant, setDrawerVariant] = useState("permanent");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (document.body.offsetWidth > 600) {
      const fetchDrawerState = async () => {
        try {
          const { data } = await api.get("/settings");
          const settingIndex = data.filter((s) => s.key === "sideMenu");
          setDrawerOpen(settingIndex[0]?.value === "disabled" ? false : true);
        } catch (err) {
          setDrawerOpen(true);
          toastError(err);
        }
      };
      fetchDrawerState();
    }
  }, []);

  useEffect(() => {
    if (document.body.offsetWidth < 600) {
      setDrawerVariant("temporary");
    } else {
      setDrawerVariant("permanent");
    }
  }, [drawerOpen]);

  const handleMenu = () => {
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const handleOpenUserModal = () => {
    setUserModalOpen(true);
    handleCloseMenu();
  };

  const handleClickLogout = () => {
    handleCloseMenu();
    handleLogout();
  };

  const drawerClose = () => {
    if (document.body.offsetWidth < 600) {
      setDrawerOpen(false);
    }
  };

  if (loading) {
    return <BackdropLoading />;
  }

  return (
    <div className={classes.root}>
      <Drawer
        variant={drawerVariant}
        className={clsx(
          classes.drawerPaper,
          !drawerOpen && classes.drawerPaperClose
        )}
        classes={{
          paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose),
        }}
        open={drawerOpen}
      >
        <div className={classes.toolbarIcon}>
          <img src={logodash} alt="logo" />
          <IconButton color="secondary" onClick={() => setDrawerOpen(!drawerOpen)}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <MainListItems drawerClose={drawerClose} />
        </List>
        <Divider />
      </Drawer>
      <UserModal
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        userId={user?.id}
      />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}
      >
        <Toolbar variant="dense" className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={clsx(classes.menuButton, drawerOpen && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {i18n.t("mainDrawer.appBar.message.hi")} {user.name},{" "}
            {i18n.t("mainDrawer.appBar.message.text")} {system.name || "WaSap"}
          </Typography>
          <IconButton
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>
          <NotificationsPopOver />
          <Menu
            id="menu-appbar"
            anchorEl={null}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={menuOpen}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleOpenUserModal}>
              {i18n.t("mainDrawer.appBar.user.profile")}
            </MenuItem>
            <MenuItem onClick={handleClickLogout}>
              {i18n.t("mainDrawer.appBar.user.logout")}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {children ? children : null}
      </main>
    </div>
  );
};

export default LoggedInLayout;
