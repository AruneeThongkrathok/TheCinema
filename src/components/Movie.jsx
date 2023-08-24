import React from "react";
import { Card } from "react-bootstrap";
import "../css/Movie.css";

export const Movie = (props) => {
  const { title, description, date } = props;
  const { posterImage, length, categories } = description;
  const posterImageURL = "https://cinema-rest.nodehill.se/" + posterImage;

  return (
    <Card className="movie-card">
      <div className="card-content">
        <div className="poster-container">
          <Card.Img
            className="movie-poster"
            variant="top"
            src={posterImageURL}
          />
        </div>
        <div className="movie-details">
          <Card.Body>
            <Card.Title className="movie-title">{title}</Card.Title>
            <Card.Text className="movie-info">
              Length: {length} minutes
            </Card.Text>
            <Card.Text className="movie-info">
              Categories: {categories.join(", ")}
            </Card.Text>
          </Card.Body>
        </div>
      </div>
    </Card>
  );
};

export default Movie;
