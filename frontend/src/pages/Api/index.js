import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    backgroundColor: "#f5f5f5",
  },
  header: {
    marginBottom: theme.spacing(4),
    color: theme.palette.primary.main,
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  sectionHeader: {
    color: theme.palette.secondary.main,
    marginBottom: theme.spacing(2),
  },
  text: {
    color: theme.palette.text.primary,
  },
  code: {
    backgroundColor: "#e0e0e0",
    padding: theme.spacing(1),
    borderRadius: theme.spacing(0.5),
    fontFamily: "monospace",
  },
  list: {
    marginLeft: theme.spacing(4),
  },
}));

const Api = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Typography variant="h4" className={classes.header}>
          Documentação para envio de mensagens
        </Typography>

        <div className={classes.section}>
          <Typography variant="h6" className={classes.sectionHeader}>
            Métodos de Envio
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="1. Mensagens de Texto" />
            </ListItem>
            <ListItem>
              <ListItemText primary="2. Mensagens de Mídia" />
            </ListItem>
          </List>
        </div>

        <div className={classes.section}>
          <Typography variant="h6" className={classes.sectionHeader}>
            Instruções
          </Typography>
          <Typography variant="h6" className={classes.text}>
            Observações Importantes
          </Typography>
          <List className={classes.list}>
            <ListItem>
              <ListItemText
                primary="Para pegar o token da API, vá em configurações que seu token estará la, sem ele não será possivel enviar mensagens."
                className={classes.text}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="O número para envio não deve ter mascara ou caracteres especiais e deve ser composto por:"
                className={classes.text}
              />
            </ListItem>
            <List className={classes.list}>
              <ListItem>
                <ListItemText
                  primary="Código do pais - Ex: 55 (Brasil)"
                  className={classes.text}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="DDD" className={classes.text} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Número" className={classes.text} />
              </ListItem>
            </List>
          </List>
        </div>

        <div className={classes.section}>
          <Typography variant="h6" className={classes.sectionHeader}>
            1. Mensagens de Texto
          </Typography>
          <Typography variant="body1" className={classes.text}>
            Seguem abaixo lista de informações necessárias para envio das
            mensagens de texto:
          </Typography>
          <Box mt={2}>
            <Typography variant="body1" className={classes.text}>
              <span className={classes.code}>
                URL: {process.env.REACT_APP_BACKEND_URL}/api/messages/send
              </span>
            </Typography>
            <Typography variant="body1" className={classes.text}>
              <span className={classes.code}>Metódo: POST</span>
            </Typography>
            <Typography variant="body1" className={classes.text}>
              <span className={classes.code}>
                Headers: Authorization: Bearer (token) e Content-Type
                application/json
              </span>
            </Typography>
            <Typography variant="body1" className={classes.text}>
              <span className={classes.code}>
                Body: "number": "5599999999999", "body": "Enviado via api"
              </span>
            </Typography>
          </Box>
        </div>

        <div className={classes.section}>
          <Typography variant="h6" className={classes.sectionHeader}>
            2. Mensagens de Mídia
          </Typography>
          <Typography variant="body1" className={classes.text}>
            Seguem abaixo lista de informações necessárias para envio de midias:
          </Typography>
          <Box mt={2}>
            <Typography variant="body1" className={classes.text}>
              <span className={classes.code}>
                URL: {process.env.REACT_APP_BACKEND_URL}/api/messages/send
              </span>
            </Typography>
            <Typography variant="body1" className={classes.text}>
              <span className={classes.code}>Metódo: POST</span>
            </Typography>
            <Typography variant="body1" className={classes.text}>
              <span className={classes.code}>
                Headers: Authorization: Bearer (token) e Content-Type
                multipart/form-data
              </span>
            </Typography>
            <Typography variant="body1" className={classes.text}>
              <span className={classes.code}>
                Body: "number": "5599999999999", "medias": "aqui vai sua midia",
                "body": "Enviado via api"
              </span>
            </Typography>
          </Box>
        </div>
      </Container>
    </div>
  );
};

export default Api;