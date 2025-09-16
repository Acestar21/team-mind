import express from "express";
import cors from "cors";    

const app = express();
const PORT = 5000;
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World! This is your backend server.");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
