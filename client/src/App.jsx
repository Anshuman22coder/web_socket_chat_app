import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { motion } from "framer-motion";

import Group from "./Group";
import Individual from "./Individual";
import SunIcon from "./assets/sun_icon.jpeg";
import Landing from "./Landing";
import ProtectedRoute from "./ProtectedRoute";

import {
  Box,
  IconButton,
  AppBar,
  Toolbar,
  Stack,
  Typography,
} from "@mui/material";

function App() {
  const [colorNo, setColorNo] = useState(0);
  const colors = ["black", "darkblue", "darkgreen", "maroon", "purple", "gray"];
  const color1 = ["#0f172a", "#fff7ad"];
  const color2 = ["#1e293b", "#1d4ed8"];
  const [color2No, setColor2No] = useState(0);

  const navStyle = ({ isActive }) => ({
    textDecoration: "none",
    color: isActive ? "#ffffff" : "rgba(255,255,255,0.75)",
    fontSize: isActive ? "16px" : "14px",
    fontWeight: isActive ? 700 : 500,
    padding: "8px 16px",
    borderRadius: "999px",
    background: isActive ? "rgba(255,255,255,0.18)" : "transparent",
    backdropFilter: "blur(10px)",
    transition: "all 0.25s ease",
  });

  return (
    <Box
      className="toggle"
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `linear-gradient(135deg, ${color1[color2No]}, ${color2[color2No]})`,
        backgroundColor: colors[colorNo],
        transition: "all 0.5s ease",
        overflowX: "hidden",
      }}
    >
      <Router>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(18px)",
            borderBottom: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              minHeight: "72px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontWeight: 900,
                  letterSpacing: "0.8px",
                  background:
                    "linear-gradient(90deg, #38bdf8, #8b5cf6, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 25px rgba(255,255,255,0.2)",
                }}
              >
                My Chat App
              </Typography>
            </motion.div>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <NavLink to="/" style={navStyle}>
                Login
              </NavLink>

              <NavLink to="/chat" style={navStyle}>
                Individual Chat
              </NavLink>

              <NavLink to="/group" style={navStyle}>
                Group Chat
              </NavLink>

              <IconButton
                onClick={() => {
                  setColorNo((prev) => (prev + 1) % colors.length);
                  setColor2No((prev) => (prev + 1) % color1.length);
                }}
                sx={{
                  ml: 1,
                  width: 44,
                  height: 44,
                  border: "1px solid rgba(255,255,255,0.45)",
                  background: "rgba(255,255,255,0.14)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(255,255,255,0.25)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <img
                  src={
                    colorNo % 2 === 0
                      ? "https://cdn-icons-png.flaticon.com/512/6714/6714978.png"
                      : SunIcon
                  }
                  alt="Toggle Colors"
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            maxWidth: "1200px",
            mx: "auto",
            px: { xs: 2, md: 4 },
            py: 4,
          }}
        >
          <Box
            sx={{
              background: "rgba(255,255,255,0.10)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "28px",
              minHeight: "calc(100vh - 140px)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                pt: 4,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  fontWeight: 700,
                }}
              >
                Welcome to
              </Typography>

              <motion.div
                animate={{
                  y: [0, -6, 0],
                  scale: [1, 1.04, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    background:
                      "linear-gradient(90deg,#38bdf8,#8b5cf6,#ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mt: 1,
                  }}
                >
                  ChatSphere
                </Typography>
              </motion.div>

              <Typography
                sx={{
                  mt: 1,
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "1rem",
                }}
              >
                Connect • Chat • Collaborate
              </Typography>
            </Box>

            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Individual />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/group"
                element={
                  <ProtectedRoute>
                    <Group />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Box>
        </Box>
      </Router>
    </Box>
  );
}

export default App;
