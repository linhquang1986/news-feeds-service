import React, { Component } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import SendIcon from "@material-ui/icons/Send";
import pizzaLogo from "../images/1.png";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    width: 345,
    padding: theme.spacing(2),
    margin: 5
  },
  description: {
    height: 100
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  expand: {
    marginLeft: "auto"
  }
}));

function NewsComponent({ ...props }) {
  const classes = useStyles();
  const { articleArr } = props;

  const handleExpandClick = _url => {
    window.open(_url, "_blank");
  };
  const handleRemoveClick = idNews => {
    props.funDel(idNews);
  };
  return (
    <div className={classes.root}>
      <Grid container spacing={2} justify="center">
        {articleArr.map((article, i) => (
          <Card className={classes.card} key={i}>
            <CardHeader
              avatar={<Avatar aria-label="recipe" src={pizzaLogo}></Avatar>}
              action={
                <IconButton
                  aria-label="remove"
                  className={classes.expand}
                  onClick={() => handleRemoveClick(article.id)}
                >
                  <DeleteForeverIcon />
                </IconButton>
              }
              title={article.author || "no author"}
              subheader={article.publishedAt}
            />
            <CardMedia
              className={classes.media}
              image={article.urlToImage}
              title={article.title}
            />
            <CardContent className={classes.description}>
              <Typography variant="body2" color="textSecondary" component="p">
                {article.description}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>

              <IconButton
                aria-label="show more"
                className={classes.expand}
                onClick={() => handleExpandClick(article.url)}
              >
                <SendIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Grid>
    </div>
  );
}
class News extends Component {
  render() {
    return (
      <NewsComponent
        articleArr={this.props.articleArr}
        funDel={this.props.handleRemoveClick}
      />
    );
  }
}
export default News;
