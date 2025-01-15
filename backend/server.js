const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const env = require("dotenv")
const app = express();
const PORT = process.env.PORT || 9000;
env.config()
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.URI);

const stockSchema = new mongoose.Schema({
	company: String,
	description: String,
	initial_price: Number,
	price_2002: Number,
	price_2007: Number,
	symbol: String,
});

const Stock = mongoose.model("stocks", stockSchema);
app.get("/api/stocks", async (req, res) => {
	try {
		const stocks = await Stock.find();
		res.json(stocks);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.post("/api/watchlist", async (req, res) => {
	try {
		const {
			company,
			description,
			initial_price,
			price_2002,
			price_2007,
			symbol,
		} = req.body;
		const stock = new Stock({
			company,
			description,
			initial_price,
			price_2002,
			price_2007,
			symbol,
		});
		await stock.save();
		res.json({ message: "Stock added to watchlist successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
