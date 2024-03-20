import React, { useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
   Badge,
   Divider,
   List,
   ListItem,
   ListItemIcon,
   ListItemText,
   ListSubheader,
   makeStyles
} from "@material-ui/core";

import {
   AccountTreeOutlined,
   Code,
   ContactPhoneOutlined,
   DashboardOutlined,
   DeveloperModeOutlined,
   LocalOffer,
   MenuBook,
   PeopleAltOutlined,
   QuestionAnswerOutlined,
   SettingsOutlined,
   SyncAlt,
   VpnKeyRounded,
   WhatsApp
} from "@material-ui/icons";

import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import { Can } from "../components/Can";

const useStyles = makeStyles(theme => ({
   icon: {
       color: theme.palette.secondary.main
   },
   listItem: {
       backgroundColor: theme.palette.background.default,
       borderRadius: 8,
       marginBottom: 8,
       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
   },
   listItemText: {
       fontWeight: 500,
       fontSize: 14
   },
   subheader: {
       fontWeight: 600,
       fontSize: 16,
       marginTop: 16
   },
   divider: {
       backgroundColor: theme.palette.divider,
       margin: "16px 0"
   }
}));

function ListItemLink(props) {
   const { icon, primary, to, href, className } = props;
   const classes = useStyles();

   if (to) {
       return (
           <ListItem
               button
               component={RouterLink}
               to={to}
               className={`${classes.listItem} ${className}`}
           >
               {icon ? <ListItemIcon className={classes.icon}>{icon}</ListItemIcon> : null}
               <ListItemText primary={primary} className={classes.listItemText} />
           </ListItem>
       );
   }

   if (href) {
       return (
           <ListItem
               button
               component="a"
               href={href}
               className={`${classes.listItem} ${className}`}
               target="_blank"
               rel="noopener noreferrer"
           >
               {icon ? <ListItemIcon className={classes.icon}>{icon}</ListItemIcon> : null}
               <ListItemText primary={primary} className={classes.listItemText} />
           </ListItem>
       );
   }

   return null;
}

const MainListItems = (props) => {
   const { drawerClose } = props;
   const { whatsApps } = useContext(WhatsAppsContext);
   const { user } = useContext(AuthContext);
   const [connectionWarning, setConnectionWarning] = useState(false);
   const classes = useStyles();

   useEffect(() => {
       const delayDebounceFn = setTimeout(() => {
           if (whatsApps.length > 0) {
               const offlineWhats = whatsApps.filter((whats) => {
                   return (
                       whats.status === "qrcode" ||
                       whats.status === "PAIRING" ||
                       whats.status === "DISCONNECTED" ||
                       whats.status === "TIMEOUT" ||
                       whats.status === "OPENING"
                   );
               });
               if (offlineWhats.length > 0) {
                   setConnectionWarning(true);
               } else {
                   setConnectionWarning(false);
               }
           }
       }, 2000);
       return () => clearTimeout(delayDebounceFn);
   }, [whatsApps]);

   return (
       <div onClick={drawerClose}>
           <List>
               <ListItemLink to="/" primary="Dashboard" icon={<DashboardOutlined />} />
               <ListItemLink
                   to="/tickets"
                   primary={i18n.t("mainDrawer.listItems.tickets")}
                   icon={<WhatsApp />}
               />
               <ListItemLink
                   to="/contacts"
                   primary={i18n.t("mainDrawer.listItems.contacts")}
                   icon={<ContactPhoneOutlined />}
               />
               <ListItemLink
                   to="/quickAnswers"
                   primary={i18n.t("mainDrawer.listItems.quickAnswers")}
                   icon={<QuestionAnswerOutlined />}
               />
               <ListItemLink
                   to="/tags"
                   primary={i18n.t("mainDrawer.listItems.tags")}
                   icon={<LocalOffer />}
               />
               <Can
                   role={user.profile}
                   perform="drawer-admin-items:view"
                   yes={() => (
                       <>
                           <Divider className={classes.divider} />
                           <ListSubheader inset className={classes.subheader}>
                               {i18n.t("mainDrawer.listItems.administration")}
                           </ListSubheader>
                           <ListItemLink
                               to="/connections"
                               primary={i18n.t("mainDrawer.listItems.connections")}
                               icon={
                                   <Badge
                                       badgeContent={connectionWarning ? "!" : 0}
                                       color="error"
                                       overlap="rectangular"
                                   >
                                       <SyncAlt />
                                   </Badge>
                               }
                           />
                           <ListItemLink
                               to="/users"
                               primary={i18n.t("mainDrawer.listItems.users")}
                               icon={<PeopleAltOutlined />}
                           />
                           <ListItemLink
                               to="/queues"
                               primary={i18n.t("mainDrawer.listItems.queues")}
                               icon={<AccountTreeOutlined />}
                           />
                           <ListItemLink
                               to="/Integrations"
                               primary={i18n.t("mainDrawer.listItems.integrations")}
                               icon={<DeveloperModeOutlined />}
                           />
                           <ListItemLink
                               to="/settings"
                               primary={i18n.t("mainDrawer.listItems.settings")}
                               icon={<SettingsOutlined />}
                           />
                           <Divider className={classes.divider} />
                           <ListSubheader inset className={classes.subheader}>
                               {i18n.t("mainDrawer.listItems.apititle")}
                           </ListSubheader>
                           <ListItemLink
                               to="/api"
                               primary={i18n.t("mainDrawer.listItems.api")}
                               icon={<Code />}
                           />
                           <ListItemLink
                               href="https://docs.meuhub.com.br/categoria/wasap/"
                               primary={i18n.t("mainDrawer.listItems.apidocs")}
                               icon={<MenuBook />}
                           />
                           <ListItemLink
                               to="/apikey"
                               primary={i18n.t("mainDrawer.listItems.apikey")}
                               icon={<VpnKeyRounded />}
                           />
                       </>
                   )}
               />
           </List>
       </div>
   );
};

export default MainListItems;