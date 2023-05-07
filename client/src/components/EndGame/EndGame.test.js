import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from "../../helpers/AuthContext";
import EndGame from "./EndGame";
import axios from "axios";

const mockAuthState = {
  id: 1,
  username: "testUser",
  level: 1,
  experience: 100,
};

const mockPlayers = [
  { username: "player1", score: 15 },
  { username: "player2", score: 12 },
  { username: "player3", score: 9 },
];

describe("EndGame component", () => {
  test("renders the game ended message", () => {
    render(
      <AuthContext.Provider value={{ authState: mockAuthState }}>
        <Router>
          <EndGame
            socket={null}
            players={mockPlayers}
            playerName="testUser"
            position={1}
            rounds={3}
            earnings={20}
            gameMode="RankedGame"
            roomName="TestRoom"
          />
        </Router>
      </AuthContext.Provider>
    );

    const gameEndedMessage = screen.getByText(/The game has ended/i);
    expect(gameEndedMessage).toBeInTheDocument();
  });

  test("renders player's position", () => {
    render(
      <AuthContext.Provider value={{ authState: mockAuthState }}>
        <Router>
          <EndGame
            socket={null}
            players={mockPlayers}
            playerName="testUser"
            position={1}
            rounds={3}
            earnings={20}
            gameMode="RankedGame"
            roomName="TestRoom"
          />
        </Router>
      </AuthContext.Provider>
    );

    const positionMessage = screen.getByText(/Your position: 1/i);
    expect(positionMessage).toBeInTheDocument();
  });

  test("renders player's score", () => {
    render(
      <AuthContext.Provider value={{ authState: mockAuthState }}>
        <Router>
          <EndGame
            socket={null}
            players={mockPlayers}
            playerName="testUser"
            position={1}
            rounds={3}
            earnings={20}
            gameMode="RankedGame"
            roomName="TestRoom"
          />
        </Router>
      </AuthContext.Provider>
    );

    const scoreMessage = screen.getByText(/Your score: 15/i);
    expect(scoreMessage).toBeInTheDocument();
  });
});
