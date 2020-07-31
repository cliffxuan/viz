import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Grid, Paper, AppBar, Toolbar, Button, IconButton } from "@material-ui/core";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import GitHubIcon from "@material-ui/icons/GitHub";
import { Vega } from "react-vega";
import {
  ControlledEditor as Editor,
  monaco,
  EditorDidMount,
} from "@monaco-editor/react";
import firebase from "firebase/app";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "firebase/firestore";
import treeSpec from "./TreeSpec";
import { parse, DirectedGraph, Tree } from "./parser";
import { flatten } from "ramda";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      height: "calc(100vh - 10px)",
      display: "flex",
      flexDirection: "column",
    },
    appBar: {
      backgroundColor: "#fff",
      color: "#000",
    },
    saveButton: {
      marginLeft: theme.spacing(6),
    },
    toolbarRightDiv: {
      marginLeft: "auto",
    },
    main: {
      flexGrow: 1,
      flexDirection: "row-reverse",
      overflow: "auto",
      padding: theme.spacing(1),
    },
    pane: {
      height: "100%",
    },
    paper: {
      color: theme.palette.text.secondary,
      height: "100%",
      overflow: "auto",
    },
  });
});

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
        setRedirect("");
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

function MultiTree({ multiTree }: { multiTree: DirectedGraph }) {
  return (
    <>
      {multiTree.roots.map((root, index) => {
        const tree = Tree.fromRoot(root);
        const depth = tree.depth;
        const width = depth === Infinity ? 600 : 120 * depth;
        const breadth = tree.breadth;
        const space = 30 * Math.E ** (-breadth / 40) + 7;
        const height = breadth * space;
        return (
          <Vega
            key={index}
            spec={{ ...treeSpec, width, height }}
            data={{ tree: tree.data }}
          />
        );
      })}
    </>
  );
}

interface RefObject {
  getModel: () => void;
}

function Graph({ data, handleChange, handleSave }: GraphProps) {
  const editorRef = useRef<RefObject | null>(null);
  const classes = useStyles();
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [directedGraph, pairToPositions] = parse(data);
  const [tree, rest] = directedGraph.findTree();
  const errors = flatten(
    rest.map((arrow) => pairToPositions[arrow.toString()])
  ).map(({ startRow, startCol, endRow, endCol }) => ({
    startLineNumber: startRow,
    startColumn: startCol,
    endLineNumber: endRow,
    endColumn: endCol,
    message: "This arrow is discarded as it makes the tree invalid.",
  }));

  useLayoutEffect(() => {
    monaco.init().then((monacoInstance) => {
      if (isEditorReady && editorRef.current !== null) {
        monacoInstance.editor.setModelMarkers(
          editorRef.current.getModel(),
          "owner",
          errors.map((error) => ({
            ...error,
            severity: monacoInstance.MarkerSeverity.Error,
          }))
        );
      }
    });
  });

  const handleEditorDidMount: EditorDidMount = (_, editor) => {
    setIsEditorReady(true);
    editorRef.current = editor;
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar} elevation={1}>
        <Toolbar>
          <Typography variant="h6">Visualize Hierarchical Data</Typography>
          <Button
            className={classes.saveButton}
            onClick={() => handleSave(data)}
          >
            <SaveOutlinedIcon />
            save
          </Button>
          <div className={classes.toolbarRightDiv}>
            <IconButton
              href="https://github.com/cliffxuan/viz"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Grid container spacing={1} className={classes.main}>
        <Grid item xs={12} md={8} className={classes.pane}>
          <Paper variant="outlined" className={classes.paper} square>
            <MultiTree multiTree={tree} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} className={classes.pane}>
          <Paper variant="outlined" className={classes.paper} square>
            <Editor
              language="plain_text"
              value={data}
              width="100%"
              editorDidMount={handleEditorDidMount}
              onChange={(_, value) =>
                value === undefined ? value : handleChange(value)
              }
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
