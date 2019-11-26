import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";

import News from "./components/News.js";

import axios from "axios";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    formControl: {
        marginRight: theme.spacing(5),
        minWidth: 220
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
    const [age, setAge] = React.useState("");
    const handleChange = event => {
        setAge(event.target.value);
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
                    >
                        <MenuIcon />
                    </IconButton>
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
                                onChange={handleChange}
                            >
                                {authorArr.map((item,i) => (
                                    <MenuItem key={i} value={item.author}>{item.author}</MenuItem>
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
                                    <MenuItem key={i} value={item.sourceName}>{item.sourceName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
    testMethod = () => {
        alert("ssss");
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
                <SearchAppBar authorArr={author} sourceArr={source} />
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
