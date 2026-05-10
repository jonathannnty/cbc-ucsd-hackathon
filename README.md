# CertConvert | Claude Builders Club @ UC San Diego Hackathon Submission
Inspiration
Every year, thousands of immigrants and refugees arrive in the United States carrying degrees, licenses, and certifications earned through years of hard work and discover that none of it is recognized here. A Syrian civil engineer. An Afghan physician. An Eritrean nurse. They don't lack skill or training. They lack a map. There is no single entry point to figure out what a foreign credential is worth in the US, what steps to take to get recognized, or how long and how much it will cost. We built CertConvert to be that entry point.

What it does
CertConvert walks users through a multi-step intake: their profession, country of origin, education and documentation history, and how much time and money they can realistically spend. From that profile, two Claude-powered agents go to work:

Pathway Matching surfaces not just a recertification path in the user's original field, but also adjacent careers they may qualify for (e.g. a foreign-trained physician matched to healthcare administration, medical research, or clinical consulting)
SMART Plan Generation produces a personalized recertification plan with specific tasks, progress metrics, state-level resources, anticipated roadblocks, and a phase-by-phase budget breakdown
Every pathway card shows a confidence percentage and presents time and cost as ranges with stated assumptions, not false precision. Users can hand off their plan to a NACES credential evaluator in one click, and download a PDF to bring to a resettlement agency, immigration attorney, or state licensing board.

How we built it
Frontend: React with a multi-step form flow guiding users through profile intake, pathway selection, verification, and plan review
AI Agents: Two separate Anthropic Claude API calls, one for pathway matching and one for SMART plan generation, each receiving the full user profile as context
PDF Export: Downloadable plan document users can bring to human advisors
Data Privacy: No user data is stored beyond the active session
Challenges we ran into
The hardest problem was not technical. It was knowing when to not trust the model. Claude's training data covers UK, German, and Canadian credential systems far more thoroughly than Syrian, Afghan, or Congolese ones. Our highest need users get the lowest-quality answers by default. We addressed this by treating the model as a starting point, not an authority: confidence percentages, cost ranges instead of precise numbers, and a mandatory NACES handoff before any user commits to a path. We also had to resist the temptation to make the plan feel more certain than it is. Hiding difficulty from someone making a life-altering decision is not protection, it is negligence. The roadblocks section exists because of that belief.

What we learned
Prompt engineering for structured, multi-field output requires more iteration than expected
For high-stakes decisions, UI design is safety design. How you frame confidence matters as much as the answer itself
An English-only tool for non-native speakers is itself a barrier; multilingual support is the first thing we would add with more time
What's next
Bias audit across 50+ country-of-origin profiles to measure plan quality degradation for underrepresented regions
Multilingual support, the most important missing feature for the people this is actually built for
State comparison tool so users can see how their recertification path differs across states. Licensing requirements, program costs, and processing timelines vary significantly from state to state, and for someone starting over, choosing where to settle could be as important as choosing what to pursue. A foreign-trained nurse in California faces a very different path than one in Texas or Florida, and that information should be part of the decision from day one
