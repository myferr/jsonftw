import readline from "readline";
import { stdin as input, stdout as output } from "process";

const rl = readline.createInterface({ input, output });

function askQuestion(query) {
  return new Promise((resolve) =>
    rl.question(query, (ans) => resolve(ans.trim()))
  );
}

async function prompt(questions) {
  const answers = {};

  for (const q of questions) {
    const name = q.name;
    const message = q.message || q.name;
    const type = q.type || "input";

    if (type === "input") {
      const answer = await askQuestion(`❓ ${message}: `);
      answers[name] = answer;
    } else if (type === "confirm") {
      let answer = await askQuestion(`❓ ${message} (y/n): `);
      answers[name] = /^y(es)?$/i.test(answer);
    } else if (type === "select") {
      console.log(`❓ ${message}`);
      q.choices.forEach((c, i) => {
        console.log(`  ${i + 1}) ${typeof c === "string" ? c : c.name}`);
      });

      while (true) {
        const answer = await askQuestion(`Choose [1-${q.choices.length}]: `);
        const idx = parseInt(answer) - 1;
        if (idx >= 0 && idx < q.choices.length) {
          const choice = q.choices[idx];
          answers[name] =
            typeof choice === "string" ? choice : choice.value ?? choice.name;
          break;
        }
      }
    }
  }

  rl.close();
  return answers;
}

export { prompt };
