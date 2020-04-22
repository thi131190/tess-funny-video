import React, { useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Movie from "../components/Movie";

export default function Home(props) {
  const { movies } = props;

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        <Container>
          {movies.length > 0 &&
            movies.map((movie, index) => <Movie movie={movie} key={++index} sharedBy={props.user.email} />)}
        </Container>
      </main>
    </React.Fragment>
  );
}
