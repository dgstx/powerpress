import React, { useState, useEffect, useRef } from "react";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import {
    CartesianGrid,
    XAxis,
    Tooltip,
    AreaChart,
    Area,
    YAxis,
    ResponsiveContainer,
} from "recharts";
import { startOfHour, parseISO, format } from "date-fns";
import { i18n } from "../../translate/i18n";
import Typography from "@material-ui/core/Typography";
import useTickets from "../../hooks/useTickets";

const useStyles = makeStyles((theme) => ({
    chartContainer: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[3],
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2),
    },
    title: {
        marginBottom: theme.spacing(2),
    },
}));

const Chart = () => {
    const classes = useStyles();
    const theme = useTheme();
    const date = useRef(new Date().toISOString());
    const { tickets } = useTickets({ date: date.current });
    const [chartData, setChartData] = useState([
        { time: "00:00", amount: 0 },
        { time: "01:00", amount: 0 },
        { time: "02:00", amount: 0 },
        { time: "03:00", amount: 0 },
        { time: "04:00", amount: 0 },
        { time: "05:00", amount: 0 },
        { time: "06:00", amount: 0 },
        { time: "07:00", amount: 0 },
        { time: "08:00", amount: 0 },
        { time: "09:00", amount: 0 },
        { time: "10:00", amount: 0 },
        { time: "11:00", amount: 0 },
        { time: "12:00", amount: 0 },
        { time: "13:00", amount: 0 },
        { time: "14:00", amount: 0 },
        { time: "15:00", amount: 0 },
        { time: "16:00", amount: 0 },
        { time: "17:00", amount: 0 },
        { time: "18:00", amount: 0 },
        { time: "19:00", amount: 0 },
        { time: "20:00", amount: 0 },
        { time: "21:00", amount: 0 },
        { time: "22:00", amount: 0 },
        { time: "23:00", amount: 0 },
    ]);

    function CustomTooltip({ payload, label, active }) {
        if (active) {
            return (
                <div>
                    <div style={{ backgroundColor: theme.palette.background.paper, borderRadius: theme.shape.borderRadius, outline: "none", padding: theme.spacing(1), boxShadow: theme.shadows[3] }}>
                        <div>
                            {payload.map((pld) => (
                                <div style={{ display: "inline-block", padding: theme.spacing(1) }}>
                                    <div style={{ color: theme.palette.text.primary, fontWeight: "600", fontSize: "13px" }}>{`${label}`}</div>
                                    <div style={{ color: theme.palette.text.secondary, fontWeight: "400", fontSize: "13px" }}>Tickets: {pld.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        style={{
                            width: "0",
                            height: "0",
                            borderLeft: "5px solid transparent",
                            marginLeft: "35px",
                            borderRight: "5px solid transparent",
                            borderTop: `5px solid ${theme.palette.background.paper}`,
                        }}
                    ></div>
                </div>
            );
        }
        return null;
    };

    useEffect(() => {
        setChartData((prevState) => {
            let aux = [...prevState];

            aux.forEach((a) => {
                tickets.forEach((ticket) => {
                    format(startOfHour(parseISO(ticket.createdAt)), "HH:mm") === a.time && a.amount++;
                });
            });

            return aux;
        });
    }, [tickets]);

    return (
        <div className={classes.chartContainer}>
            <Typography variant="h6" component="h2" className={classes.title}>
                {`${i18n.t("dashboard.charts.perDay.title")}${tickets.length}`}
            </Typography>
            <ResponsiveContainer>
                <AreaChart
                    data={chartData}
                    barSize={40}
                    width={730}
                    height={250}
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 0,
                    }}
                >
                    <XAxis
                        tick={(tickProps) => {
                            const { x, y } = tickProps;
                            return <circle cx={x} cy={y - 8} r={1} fill={theme.palette.text.secondary} />;
                        }}
                        tickLine={false}
                        axisLine={false}
                        dataKey="time"
                        stroke={theme.palette.text.secondary}
                    />
                    <YAxis type="number" allowDecimals={false} stroke={theme.palette.text.secondary} tickLine={false} axisLine={false}></YAxis>
                    <CartesianGrid vertical={false} strokeDasharray="4" opacity={0.3} />
                    <Tooltip
                        content={<CustomTooltip />}
                        position={{ y: 35 }}
                        animationEasing="ease"
                        cursor={true}
                        shared={false}
                    />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke={theme.palette.primary.main}
                        strokeDasharray="3 4 5 2"
                        strokeWidth={0.1}
                        fillOpacity={1}
                        fill="#a0b3f4"
                        activeDot={true}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;