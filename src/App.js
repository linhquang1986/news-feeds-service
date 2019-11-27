import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import PostAddIcon from "@material-ui/icons/PostAdd";
import { makeStyles } from "@material-ui/core/styles";

import Modal from "@material-ui/core/Modal";

import News from "./components/News.js";

import axios from "axios";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
const qs = require("querystring");
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  formControl: {
    marginRight: theme.spacing(5),
    minWidth: 220
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  }
}));

function SearchAppBar({ ...props }) {
  const classes = useStyles();
  const { authorArr, sourceArr } = props;

  const [open, setOpen] = React.useState(false);
  const state = {
    txtSource: "",
    txtAuthor: null,
    txtSourceName:  null
  };
  const [age, setAge, source] = React.useState("");
  const handleAuthorChange = event => {
    setAge(event.target.value);
    state.txtAuthor = event.target.value;
  };
  const handleChangeInput = event => {
    state.txtSource = event.target.value;
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const fiterClick = (author, sourceName) => {
    props.funcFilter(author, sourceName);
  };
  const addNewsClick = linkSource => {
    props.funcAdd(linkSource);
    handleClose();
  };
  return (
    <div className={classes.root}>
      <AppBar position="sticky" color="secondary">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={handleOpen}
          >
            <PostAddIcon />
          </IconButton>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
          >
            <div className={classes.paper}>
              <h2 id="transition-modal-title">Add news modal</h2>
              <form>
                <TextField
                  id="txtSource"
                  label="Link source"
                  variant="outlined"
                  value={source}
                  onChange={handleChangeInput}
                />
                &nbsp;
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => addNewsClick(state.txtSource)}
                >
                  Add News
                </Button>
              </form>
            </div>
          </Modal>
          <Typography className={classes.title} variant="h6" noWrap>
            Pizza Hunt News
          </Typography>
          <div style={{ color: "white" }}>
            <FormControl className={classes.formControl}>
              <InputLabel id="author-filter">Author filter</InputLabel>
              <Select
                labelId="author-filter"
                id="authorFilter"
                value={age}
                onChange={handleAuthorChange}
              >
                {authorArr.map((item, i) => (
                  <MenuItem key={i} value={item.author}>
                    {item.author}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="source-filter">Source filter</InputLabel>
              <Select
                labelId="source-filter"
                id="sourceFilter"
                value={age}
                onChange={handleChange}
              >
                {sourceArr.map((item, i) => (
                  <MenuItem key={i} value={item.sourceName}>
                    {item.sourceName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleFilterClick(state.txtSource)}
            >
              filter
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      author: [],
      source: []
    };
  }

  // Add news
  handleAddNewsClick = linkSource => {
    axios
      .post(
        "http://localhost:8000/api/articles/",
        qs.stringify({ newSource: linkSource }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      )
      .then(res => {
        this.loadNews();
      })
      .catch(error => console.log(error));
  };

  // delete news by id
  handleRemoveClick = idNews => {
    axios
      .delete(`http://localhost:8000/api/article/${idNews}`)
      .then(res => {
        const articles = this.state.articles.filter(item => item.id !== idNews);
        this.setState({ articles });
      })
      .catch(error => console.log(error));
  };

  // handle filter by author or source
  handleFilterClick = (_author, _sourceName) => {
    axios
      .post(
        "http://localhost:8000/api/getNewByAuthorAndSource",
        qs.stringify({ author: _author, sourceName: _sourceName }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      )
      .then(res => {
        let articles = res.data.data;
        this.setState({ articles });
      })
      .catch(error => console.log(error));
  };

  loadAuthor = () => {
    axios
      .get("http://localhost:8000/api/getAuthor")
      .then(res => {
        let author = res.data.data;
        this.setState({ author });
      })
      .catch(error => console.log(error));
  };
  loadSource = () => {
    axios
      .get("http://localhost:8000/api/getSource")
      .then(res => {
        let source = res.data.data;
        this.setState({ source });
      })
      .catch(error => console.log(error));
  };
  loadNews = () => {
    axios
      .get("http://localhost:8000/api/articles/")
      .then(res => {
        let articles = res.data.data;
        this.setState({ articles });
      })
      .catch(error => console.log(error));
  };
  componentDidMount() {
    this.loadNews();
    this.loadAuthor();
    this.loadSource();
  }
  render() {
    const { articles, author, source } = this.state;
    return (
      <div>
        <SearchAppBar
          authorArr={author}
          sourceArr={source}
          funcAdd={this.handleAddNewsClick}
          funcFilter={this.handleFilterClick}
        />
        <div style={{ padding: 10 }}></div>
        <News
          articleArr={articles}
          handleRemoveClick={this.handleRemoveClick}
        />
      </div>
    );
  }
}

export default App;
