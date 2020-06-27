import React, { useState, useEffect } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Grid, Paper, AppBar, Toolbar, Button } from "@material-ui/core";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import { Vega } from "react-vega";
import { PlainObject } from "react-vega/lib/types";
import AceEditor from "react-ace";
import firebase from "firebase/app";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "firebase/firestore";
import treeSpec from "./Tree";
import { parse } from "./parser";

import "ace-builds/src-noconflict/theme-github";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appBar: {
      backgroundColor: "#fff",
      color: "#000",
    },
    saveButton: {
      marginLeft: theme.spacing(5),
    },
    title: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      color: theme.palette.text.secondary,
      height: "100%",
    },
  })
);

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAcRmmHUN_Yyqd0al0MSvRz82kIbrHvh-8",
  authDomain: "hierarchy-28591.firebaseapp.com",
  databaseURL: "https://hierarchy-28591.firebaseio.com",
  projectId: "hierarchy-28591",
  storageBucket: "hierarchy-28591.appspot.com",
  messagingSenderId: "761635818549",
  appId: "1:761635818549:web:b6d6fecfd7747c6345f57c",
  measurementId: "G-TJJF0BJ57G",
});
const firestore = firebase.firestore();

export default function App() {
  return (
    <Router>
      <Switch>
        <Route
          path="/:docId"
          render={({ match }) => <GraphContainer docId={match.params.docId} />}
        />
        <Route path="/" render={() => <GraphContainer docId="default" />} />
      </Switch>
    </Router>
  );
}

type GraphContainerProps = {
  docId: string;
};

function makeid(length: number): string {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function GraphContainer({ docId }: GraphContainerProps) {
  const [data, setData] = useState("");
  const [redirect, setRedirect] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoc = async () => {
      const doc = await firestore.collection("graphs").doc(docId).get();
      const data = doc.data()?.graph;
      if (!doc.exists || data === null) {
        setRedirect("/");
      } else {
        setRedirect(null);
        setData(data.replace(/\\n/gi, "\n"));
      }
    };
    fetchDoc();
  }, [docId]);

  if (redirect !== null) {
    return <Redirect to={redirect} />;
  }
  return (
    <Graph
      data={data}
      handleChange={setData}
      handleSave={async (data) => {
        const id = makeid(6);
        await firestore.collection("graphs").doc(id).set({ graph: data });
        setRedirect(id);
      }}
    />
  );
}

type GraphProps = {
  data: string;
  handleChange(data: string): void;
  handleSave(data: string): void;
};

function Graph({ data, handleChange, handleSave }: GraphProps) {
  const graph = parse(data);
  const classes = useStyles();
  const size = graph.tree.length;
  const height = size * 30;

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6">Visualize Hierarchical Data</Typography>
            <Button
              className={classes.saveButton}
              onClick={() => handleSave(data)}
            >
              <SaveOutlinedIcon />
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <AceEditor
              mode="plain_text"
              placeholder="Root -> Parent -> Child;"
              maxLines={100}
              minLines={55}
              theme="github"
              onChange={(value) => handleChange(value)}
              value={data}
              width="100%"
            />
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper className={classes.paper}>
            <Vega spec={{ ...treeSpec, height }} data={graph as PlainObject} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
