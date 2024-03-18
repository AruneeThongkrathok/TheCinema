import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../css/ChooseSeats.css";
import { Card, Col, Row, Image } from "react-bootstrap";
import TicketDropdown from "./TicketDropdown";

export default function ChooseSeat() {
  const [seats, setSeats] = useState([]);
  const location = useLocation();
  const { screening, auditorium, movieImage, movieTitle, screeningTime } =
    location.state || {};
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketCounts, setTicketCounts] = useState({
    child: 0,
    senior: 0,
    adult: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/seats`);
        const seatData = await response.json();

        const filteredSeats = seatData.filter(
          (seat) => seat.auditoriumId === screening.auditoriumId
        );

        const occupiedResponse = await fetch(`/api/occupied_seats`);
        const occupiedData = await occupiedResponse.json();
        const occupiedSeatsForScreening = occupiedData.find(
          (occupied) => occupied.screeningId === screening.id
        );

        setSeats(filteredSeats);
        setOccupiedSeats(
          occupiedSeatsForScreening
            ? occupiedSeatsForScreening.occupiedSeats.split(", ")
            : []
        );
      } catch (error) {
        console.error("Error fetching seat data:", error);
      }
    };

    fetchData();
  }, [screening]);

  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.rowNumber]) {
      acc[seat.rowNumber] = [];
    }
    acc[seat.rowNumber].push(seat);
    return acc;
  }, {});

  const handleSeatClick = (seat) => {
    if (!seat.occupied && !occupiedSeats.includes(seat.seatNumber.toString())) {
      const totalTicketsSelected = Object.values(ticketCounts).reduce(
        (acc, count) => acc + count,
        0
      );

      if (selectedSeats.length < totalTicketsSelected) {
        setSelectedSeats((prevSelectedSeats) => [...prevSelectedSeats, seat]);
      } else {
        console.log("You've already selected the maximum number of seats.");
      }
    } else {
      console.log(`Seat ${seat.seatNumber} is already occupied.`);
    }
  };

  const handleTicketSelection = (ticketCounts) => {
    setTicketCounts(ticketCounts);
    console.log("Selected Ticket Counts:", ticketCounts);
    const totalTicketsChosen = Object.values(ticketCounts).reduce(
      (acc, count) => acc + count,
      0
    );
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.slice(0, totalTicketsChosen)
    );
  };

  return (
    <Card className="choose-seat-container">
      <Card.Title className="auditorium-title">{auditorium}</Card.Title>
      <Row className="choose-seat-row">
        <Card className="movie-info">
          <Image
            src={`https://cinema-rest.nodehill.se/${movieImage}`}
            alt={movieTitle}
            className="movie-image"
          />
          <Card.Title className="movies-title">{movieTitle}</Card.Title>
          <Card.Text className="screening-time-text">{screeningTime}</Card.Text>
        </Card>
        <Card className="seats-container">
          <TicketDropdown handleTicketSelection={handleTicketSelection} />
          <Card className="auditorium-seats">
            {Object.keys(seatsByRow).map((rowNumber) => (
              <Row key={rowNumber} className="seat-row">
                {seatsByRow[rowNumber].map((seat) => (
                  <div
                    key={seat.id}
                    className={`seat ${
                      seat.occupied ||
                      occupiedSeats.includes(seat.seatNumber.toString())
                        ? "occupied"
                        : selectedSeats.some(
                            (selectedSeat) => selectedSeat.id === seat.id
                          )
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleSeatClick(seat)}
                  >
                    {seat.occupied ||
                    occupiedSeats.includes(seat.seatNumber.toString())
                      ? "X"
                      : seat.seatNumber}
                  </div>
                ))}
              </Row>
            ))}
          </Card>
        </Card>
      </Row>
    </Card>
  );
}
