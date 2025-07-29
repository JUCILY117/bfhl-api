require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function isNumeric(str) {
  if (typeof str !== 'string') return false;
  return /^\d+$/.test(str);
}

function alternatingCaps(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += (i % 2 === 0) ? str[i].toUpperCase() : str[i].toLowerCase();
  }
  return result;
}

app.post('/bfhl', (req, res) => {
  try {
    const input = req.body;

    if (!input || !Array.isArray(input.data)) {
      return res.status(400).json({
        is_success: false,
        message: "Invalid request: 'data' array is required"
      });
    }

    const dataArray = input.data;

    let odd_numbers = [];
    let even_numbers = [];
    let alphabets = [];
    let special_characters = [];
    let totalSum = 0;
    let allAlphaChars = [];

    for (const element of dataArray) {
      if (typeof element !== 'string') {
        continue;
      }

      const elem = element.trim();

      if (elem === '') {
        continue;
      }

      if (isNumeric(elem)) {
        const num = parseInt(elem, 10);
        totalSum += num;

        if (num % 2 === 0) {
          even_numbers.push(elem);
        } else {
          odd_numbers.push(elem);
        }

      } else {
        if (/^[a-zA-Z]+$/.test(elem)) {
          alphabets.push(elem.toUpperCase());
          for (const ch of elem) {
            allAlphaChars.push(ch);
          }

        } else if (/^[^a-zA-Z0-9]+$/.test(elem)) {
          special_characters.push(elem);
        } else {
          if (/^[a-zA-Z]+$/.test(elem.replace(/[^a-zA-Z]/g, ''))) {
            let lettersOnly = elem.replace(/[^a-zA-Z]/g, '');
            alphabets.push(lettersOnly.toUpperCase());

            for (const ch of lettersOnly) {
              allAlphaChars.push(ch);
            }

            let specialsInElem = elem.replace(/[a-zA-Z0-9]/g, '');
            if (specialsInElem.length > 0) {
              special_characters.push(specialsInElem);
            }
          } else {
            special_characters.push(elem);
          }
        }
      }
    }

    const reversedAlphaChars = allAlphaChars.reverse().join('');
    const concat_string = alternatingCaps(reversedAlphaChars);

    const user_id = process.env.USER_ID || "fallback";
    const email = process.env.USER_EMAIL || "fallback";
    const roll_number = process.env.USER_ROLL_NUMBER || "fallback";
    // console.log(process.env.USER_EMAIL);

    res.status(200).json({
      is_success: true,
      user_id,
      email,
      roll_number,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: totalSum.toString(),
      concat_string
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      is_success: false,
      message: "Internal server error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
