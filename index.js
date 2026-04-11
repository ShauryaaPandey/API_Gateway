const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const app = express();
const PORT = 3005;

// ✅ Rate limiter
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  limit: 5,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many requests",
      err: {}
    });
  }
});

// ✅ Morgan
app.use(morgan('combined'));


// ✅ AUTH MIDDLEWARE (FIXED)
app.use('/bookingservice', async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];

    console.log("🔐 TOKEN:", token);

    // ❌ No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
        err: {}
      });
    }

    // ✅ Call Auth Service
    const response = await axios.get(
      'http://localhost:3001/api/v1/isAuthenticated',
      {
        headers: {
          'x-access-token': token
        }
      }
    );

    console.log("✅ Auth response:", response.data);

    // ✅ Valid token
    if (response.data.success) {
      return next();
    }

    // ❌ Unauthorized
    return res.status(401).json({
      success: false,
      message: "Unauthorized user",
      err: {}
    });

  } catch (error) {

    console.log("❌ Auth Error:", error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Invalid token",
      err: error.response?.data?.err || {}
    });
  }
});


// ✅ RATE LIMIT (AFTER AUTH)
app.use('/bookingservice', limiter);


// ✅ PROXY
app.use('/bookingservice', createProxyMiddleware({
  target: 'http://127.0.0.1:3002',
  changeOrigin: true
}));


// ✅ TEST ROUTE
app.get('/home', (req, res) => {
  return res.json({ message: 'API Gateway called' });
});


// ✅ GLOBAL ERROR HANDLER (VERY IMPORTANT)
app.use((err, req, res, next) => {
  console.error("💥 GLOBAL ERROR:", err);

  return res.status(500).json({
    success: false,
    message: "Something went wrong at API Gateway",
    err: err.message
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Server started at PORT : ${PORT}`);
});