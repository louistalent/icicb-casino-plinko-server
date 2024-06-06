const axios = require("axios");
const rand = require("random-seed").create();
require("dotenv").config();

// Users List
const usersPoints = {};
var amount;

var Amount = {
    0: 12,
    1: 5.6,
    2: 1.3,
    3: 0.7,
    4: 0.3,
    5: 0.7,
    6: 1.3,
    7: 5.6,
    8: 12,
}

const RandomDirection = (user) => {
    var sum = 0;
    for (var i = 0; i < 8; i++) {
        var rNum = rand.intBetween(0, 1);
        user.Balldirection[i] = rNum;
        sum += rNum;
    }
    user.amount = Amount[sum] * user.betBalance;
    console.log(user.Balldirection, Amount[sum], sum);
}

module.exports = {
    StartSignal: async (req, res) => {
        try {
            const { token, betValue } = req.body;

            let user = usersPoints[token];
            if (user === undefined) {
                usersPoints[token] = {
                    betBalance: 0,
                    Balldirection: [],
                    amount: 0,
                }
                user = usersPoints[token];
            }
            user.betBalance = betValue;
            try {
                axios.post(
                    process.env.PLATFORM_SERVER + "api/games/bet",
                    {
                        token: token,
                        amount: BetAmount,
                    }
                )
            } catch {
                throw new Error(2);
            }

            await RandomDirection(user);

            try {
                await axios.post(
                    process.env.PLATFORM_SERVER + "api/games/winlose",
                    {
                        token: token,
                        amount: user.amount,
                        winState: user.amount != 0 ? true : false,
                    }
                );
            } catch {
                throw new Error("Server Error");
            }
            res.json({
                Message: "Success",
                Amount: user.amount,
                ballRandom: user.Balldirection
            })
        } catch (err) {
            res.json({
                Message: err.message,
                Amount: 0,
                ballRandom: []
            });
        }
    },
};
