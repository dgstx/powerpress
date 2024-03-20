import React, { useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
    Badge,
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
        color: theme.palette.secondary.main,
        fontSize: 20 // Aumento o tamanho dos ícones para evitar efeito pixelizado
    },
    listItem: {
        backgroundColor: theme.palette.background.default,
        borderRadius: 7, // Diminuí o raio de borda
        marginBottom: 4, // Diminuí o espaçamento entre os itens
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" // Diminuí a sombra
    },
    listItemText: {
        fontWeight: 500,
        fontSize: 14
    },
    subheader: {
        fontWeight: 600,
        fontSize: 16,
        marginTop: 6,
        marginBottom: 4 // Diminuí o espaçamento abaixo do subheader
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
        <div onClick={drawerClose} style={{ overflowY: "auto", maxHeight: "calc(100vh - 64px)" }}>
            <List>
                <ListSubheader inset className={classes.subheader}>
                    {i18n.t("mainDrawer.listItems.attendance")}
                </ListSubheader>
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

                <ListSubheader inset className={classes.subheader}>
                    {i18n.t("mainDrawer.listItems.administration")}
                </ListSubheader>
                <Can
                    role={user.profile}
                    perform="drawer-admin-items:view"
                    yes={() => (
                        <>
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
                        </>
                    )}
                />

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
            </List>
        </div>
    );
};

export default MainListItems;