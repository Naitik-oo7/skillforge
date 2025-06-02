const OpenAI = require("openai");
const Submission = require("../models/Submission");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function evaluateSubmission(submission) {
  const populatedSubmission = await Submission.findById(submission._id).populate("challenge");

  const prompt = `
Challenge description:
${populatedSubmission.challenge.description}

User submitted code:
${populatedSubmission.code}

Does this code correctly solve the challenge? Reply only with "Passed" or "Failed" and a short explanation.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are an expert code evaluator." },
      { role: "user", content: prompt },
    ],
    max_tokens: 100,
    temperature: 0,
  });

  const aiResponse = completion.choices[0].message.content.trim();
  const result = aiResponse.toLowerCase().includes("passed") ? "Passed" : "Failed";

  populatedSubmission.result = result;
  populatedSubmission.aiExplanation = aiResponse;
  await populatedSubmission.save();
}

module.exports = evaluateSubmission;
