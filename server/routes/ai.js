const express = require('express');
const router = express.Router();

let OpenAI;
try {
  OpenAI = require('openai');
} catch (err) {
  console.warn('⚠️  OpenAI library not available:', err.message);
}

router.post('/ai-insights', async (req, res) => {
  const { commits, languages, contributors, stars, forks, streak } = req.body;
  try {

    if (!OpenAI || !process.env.OPENAI_API_KEY) {
      // Return mock insights instead of crashing
      const dominantLanguage = Object.keys(languages || {})[0] || 'code';
      const mockInsights = [
        `Consistent commit activity observed with a total of ${commits || 0} commits processed.`,
        `${dominantLanguage} deeply dominates the current structural pattern.`,
        `${(contributors || 0) > 5 ? 'High' : 'Focused'} contributor velocity detected across ${contributors || 0} active developers.`,
        `Repository footprint shows healthy engagement metrics with ${stars || 0} stars and ${forks || 0} forks.`
      ];
      return res.json({ insights: mockInsights, isMock: true });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
Analyze the following GitHub repository data and generate 4 short insights about:
- Commit trends
- Contribution patterns
- Language usage
- Growth indicators

Return only bullet points.

Data:
Commits: ${commits}
Top Languages: ${JSON.stringify(languages)}
Contributors count: ${contributors}
Stars: ${stars}
Forks: ${forks}
Streak: ${JSON.stringify(streak)}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 250,
    });

    const rawInsights = completion.choices[0].message.content;
    
    const insights = rawInsights
      .split('\n')
      .map(line => line.replace(/^[\s*\-•]+/, '').trim())
      .filter(line => line.length > 0);

    res.json({ insights });
  } catch (error) {
    console.error('OpenAI Error:', error.message);
    
    const dominantLanguage = Object.keys(languages || {})[0] || 'code';
    const mockInsights = [
      `Consistent commit activity observed with a total of ${commits} commits processed.`,
      `${dominantLanguage} deeply dominates the current structural pattern.`,
      `${contributors > 5 ? 'High' : 'Focused'} contributor velocity detected across ${contributors} active developers.`,
      `Repository footprint shows healthy engagement metrics with ${stars} stars and ${forks} forks.`
    ];

    res.json({ insights: mockInsights, isMock: true });
  }
});

module.exports = router;
