require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());


// =========================
// FISH AI CHAT
// =========================

app.post("/chat", async (req, res) => {

    try {

        const userMessage = req.body.message;

        if (!userMessage) {

            return res.status(400).json({
                error: "No message provided."
            });

        }


        // =========================
        // OPENROUTER REQUEST
        // =========================

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {

                method: "POST",

                headers: {

                    "Authorization":
                        `Bearer ${process.env.OPENROUTER_API_KEY}`,

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    model: "openrouter/free",

                    messages: [

                        {
                            role: "system",

                            content:
                                "You are FishAI, a friendly and knowledgeable fishing assistant. Give short, concise answers. Usually answer in 1-4 sentences or a few short bullet points. Only give longer explanations when the user specifically asks for more detail. Focus on useful fishing advice about fish species, bait, lures, rigs, techniques, and locations. Do not repeat the user's question."
                        },

                        {
                            role: "user",

                            content: userMessage
                        }

                    ]

                })

            }
        );


        // =========================
        // HANDLE OPENROUTER ERROR
        // =========================

        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "OpenRouter error:",
                errorText
            );

            return res.status(500).json({

                error:
                    "FishAI could not generate a response."

            });

        }


        // =========================
        // GET RESPONSE
        // =========================

        const data =
            await response.json();


        const reply =
            data.choices?.[0]?.message?.content;


        if (!reply) {

            console.error(
                "No AI response:",
                data
            );

            return res.status(500).json({

                error:
                    "FishAI did not return a response."

            });

        }


        // =========================
        // SEND TO EXTENSION
        // =========================

        res.json({

            reply: reply

        });


    } catch (error) {

        console.error(
            "Server error:",
            error
        );


        res.status(500).json({

            error:
                "FishAI could not generate a response."

        });

    }

});


// =========================
// SERVER TEST
// =========================

app.get("/", (req, res) => {

    res.send(
        "🎣 FishAI server is running!"
    );

});


// =========================
// START SERVER
// =========================

app.listen(
    PORT,
    () => {

        console.log(
            `🎣 FishAI running at http://localhost:${PORT}`
        );

    }
);