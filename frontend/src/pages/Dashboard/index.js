import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Container, Grid, Paper, Card, CardContent, CardHeader, Avatar } from "@material-ui/core";
import useTickets from "../../hooks/useTickets";
import { AuthContext } from "../../context/Auth/AuthContext";
import { i18n } from "../../translate/i18n";
import Chart from "./Chart";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import DoneAllIcon from "@material-ui/icons/DoneAll";

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    card: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[4],
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2),
        transition: "all 0.3s ease",
        "&:hover": {
            boxShadow: theme.shadows[8],
            transform: "translateY(-5px)",
        },
    },
    chartCard: {
        height: 400,
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[4],
        borderRadius: theme.shape.borderRadius,
        transition: "all 0.3s ease",
        "&:hover": {
            boxShadow: theme.shadows[8],
            transform: "translateY(-5px)",
        },
    },
    avatar: {
        backgroundColor: theme.palette.primary.main,
    },
}));

const Dashboard = () => {
    const classes = useStyles();
    const { user } = useContext(AuthContext);
    const userQueueIds = user.queues && user.queues.length > 0 ? user.queues.map((q) => q.id) : [];

    const GetTickets = (status, showAll, withUnreadMessages) => {
        const { count } = useTickets({
            status: status,
            showAll: showAll,
            withUnreadMessages: withUnreadMessages,
            queueIds: JSON.stringify(userQueueIds),
        });
        return count;
    };

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <CardHeader
                            avatar={
                                <Avatar className={classes.avatar}>
                                    <HelpOutlineIcon />
                                </Avatar>
                            }
                            title={i18n.t("dashboard.messages.inAttendance.title")}
                        />
                        <CardContent>
                            <Typography variant="h4">{GetTickets("open", "true", "false")}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <CardHeader
                            avatar={
                                <Avatar className={classes.avatar}>
                                    <QueryBuilderIcon />
                                </Avatar>
                            }
                            title={i18n.t("dashboard.messages.waiting.title")}
                        />
                        <CardContent>
                            <Typography variant="h4">{GetTickets("pending", "true", "false")}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <CardHeader
                            avatar={
                                <Avatar className={classes.avatar}>
                                    <DoneAllIcon />
                                </Avatar>
                            }
                            title={i18n.t("dashboard.messages.closed.title")}
                        />
                        <CardContent>
                            <Typography variant="h4">{GetTickets("closed", "true", "false")}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.chartCard}>
                        <Chart />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;