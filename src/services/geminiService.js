import { GoogleGenerativeAI } from '@google/generative-ai';
import { faProblems, mcqQuizzes } from '../data/problemsData';

// Initialize Gemini AI
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// System context for the AI with personality
const SYSTEM_CONTEXT = `You are an expert computer science tutor specializing in Automata Theory and Finite Automata.
You have a friendly, encouraging personality. You're like a helpful classmate who's really good at FA, but you NEVER give away the answer.

Your personality:
- Friendly and approachable (use casual language, but stay professional)
- Enthusiastic about automata theory
- Patient and encouraging
- Use occasional emojis naturally (but don't overdo it)
- Acknowledge progress: "Nice!" "Good thinking!" "You're getting there!"

Key principles:
1. NEVER give the complete solution or draw the automaton
2. Give CONCISE hints (2-4 sentences max for auto-hints, 3-5 for responses)
3. Base hints on CURRENT PROGRESS - what's the next logical step?
4. Warn if they're going COMPLETELY wrong: "Hmm, let's check your FA structure..."
5. Ask guiding questions: "What should happen when...?" "Think about..."
6. Reference what they've built: "I see you have X states..."
7. Be to the point - no long explanations unless asked
`;

class GeminiService {
  constructor() {
    // Use gemini-2.0-flash - the latest Gemini model
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  /**
   * Get a hint for constructing the FA based on problem statement
   * @param {string} problemStatement - The problem description
   * @param {Object} currentFA - Current FA state { states, transitions, startState }
   * @returns {Promise<string>} AI-generated hint
   */
  async getHint(problemStatement, currentFA) {
    const stateCount = currentFA.states.size;
    const transitionCount = currentFA.transitions.length;
    const hasStartState = !!currentFA.startState;
    const hasAcceptingState = Array.from(currentFA.states.values()).some(s => s.isAccepting);
    
    const prompt = `${SYSTEM_CONTEXT}

PROBLEM STATEMENT:
"${problemStatement}"

STUDENT'S CURRENT PROGRESS:
- Number of states: ${stateCount}
- Number of transitions: ${transitionCount}
- Has start state: ${hasStartState ? 'Yes' : 'No'}
- Has accepting state(s): ${hasAcceptingState ? 'Yes' : 'No'}

Current FA structure:
States: ${Array.from(currentFA.states.keys()).join(', ') || 'None'}
Transitions: ${currentFA.transitions.map(t => `${t.from} --${t.symbols}--> ${t.to}`).join(', ') || 'None'}
Start state: ${currentFA.startState || 'Not set'}
Accepting states: ${Array.from(currentFA.states.values()).filter(s => s.isAccepting).map(s => s.id).join(', ') || 'None'}

The student needs a hint to continue building their FA. 
Provide a GUIDING HINT that helps them think about the next step, but DO NOT give the complete solution.
Focus on:
1. Conceptual understanding (what should this FA accept/reject?)
2. Key questions they should ask themselves
3. Hints about what elements might be missing (without explicitly telling them)

Keep your response concise (3-5 sentences) and encouraging.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting hint from Gemini:', error);
      throw new Error('Failed to get AI hint. Please try again.');
    }
  }

  /**
   * Analyze why the FA failed tests and provide educational feedback
   * @param {string} problemStatement - The problem description
   * @param {Object} currentFA - Current FA state
   * @param {Array} testResults - Array of test results with passed/failed info
   * @returns {Promise<string>} AI-generated analysis
   */
  async analyzeErrors(problemStatement, currentFA, testResults) {
    const failedTests = testResults.filter(t => !t.passed);
    const passedTests = testResults.filter(t => t.passed);
    
    // Get detailed FA structure
    const states = Array.from(currentFA.states.values());
    const startStateObj = currentFA.states.get(currentFA.startState);
    
    const prompt = `${SYSTEM_CONTEXT}

PROBLEM STATEMENT:
"${problemStatement}"

STUDENT'S FINITE AUTOMATON:
States: ${states.map(s => `${s.id}${s.isAccepting ? ' (accepting)' : ''}`).join(', ')}
Start state: ${currentFA.startState}${startStateObj?.isAccepting ? ' (accepting)' : ' (non-accepting)'}
Transitions:
${currentFA.transitions.map(t => `  ${t.from} --${t.symbols}--> ${t.to}`).join('\n') || '  None'}

TEST RESULTS:
Passed: ${passedTests.length}/${testResults.length} tests
Failed: ${failedTests.length}/${testResults.length} tests

Failed test cases:
${failedTests.slice(0, 5).map(t => `
- Input: "${t.input || '(empty string)'}"
  Expected: ${t.expected ? 'ACCEPT' : 'REJECT'}
  Got: ${t.actual ? 'ACCEPT' : 'REJECT'}
  Path: ${t.path.join(' → ')}
  Final state: ${t.finalState}
  ${t.error ? `Error: ${t.error}` : ''}
`).join('\n')}

TASK:
Analyze why the student's FA is failing these tests. Provide educational feedback that:

1. IDENTIFIES THE CONCEPTUAL ERROR: What fundamental misunderstanding does this FA reveal?
2. EXPLAINS THE PATTERN: What pattern in the failed tests shows the problem?
3. ASKS GUIDING QUESTIONS: What should they think about?
4. HINTS AT THE FIX: Without giving the exact solution, what principle should they apply?

DO NOT:
- Give the exact transitions or state structure
- Tell them "add state X with transition Y"
- Draw the correct FA for them

DO:
- Help them understand what their FA is currently doing vs. what it should do
- Point out logical issues (e.g., "Your FA accepts strings it should reject because...")
- Reference automata theory concepts
- Be encouraging - errors are part of learning!

Keep your response structured and clear (around 150-200 words).`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error analyzing errors with Gemini:', error);
      throw new Error('Failed to analyze errors. Please try again.');
    }
  }

  /**
   * Get progress-based hint (auto-generated)
   */
  async getProgressHint(problemStatement, currentFA, conversationHistory = []) {
    const stateCount = currentFA.states.size;
    const transitionCount = currentFA.transitions.length;
    const hasStartState = !!currentFA.startState;
    const hasAcceptingState = Array.from(currentFA.states.values()).some(s => s.isAccepting);
    const acceptingStates = Array.from(currentFA.states.values()).filter(s => s.isAccepting);
    
    // Determine what stage they're at
    let stage = 'starting';
    if (stateCount === 0) stage = 'starting';
    else if (stateCount >= 2 && !hasStartState) stage = 'needs_start';
    else if (hasStartState && !hasAcceptingState) stage = 'needs_accept';
    else if (hasStartState && hasAcceptingState && transitionCount === 0) stage = 'needs_transitions';
    else if (transitionCount > 0 && transitionCount < stateCount) stage = 'building_transitions';
    else stage = 'almost_done';
    
    const recentHints = conversationHistory
      .filter(m => m.type === 'ai')
      .slice(-3)
      .map(m => m.text)
      .join('\n');
    
    const prompt = `${SYSTEM_CONTEXT}

PROBLEM: ${problemStatement.split('\n')[0]}

STUDENT'S CURRENT PROGRESS:
- States: ${stateCount}
- Transitions: ${transitionCount}
- Start state: ${hasStartState ? currentFA.startState : 'None'}
- Accepting states: ${acceptingStates.map(s => s.id).join(', ') || 'None'}

Current FA structure:
States: ${Array.from(currentFA.states.keys()).join(', ') || 'None'}
Transitions: ${currentFA.transitions.map(t => `${t.from}--${t.symbols}-->${t.to}`).join(', ') || 'None'}

Recent conversation:
${recentHints || 'No previous hints yet.'}

TASK: Provide a SHORT, FRIENDLY hint (2-3 sentences) about the NEXT logical step based on their current progress.

Stage: ${stage}

Focus on:
- What's missing? (without being too obvious)
- What should they think about next?
- If going wrong: gently point it out

Keep it CONCISE and PERSONALITY-FILLED. Don't repeat previous hints.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting progress hint:', error);
      throw new Error('Failed to get hint.');
    }
  }

  /**
   * Chat response to user question (ONLY after submission, ONLY about current question)
   */
  async getChatResponse(problemStatement, currentFA, userQuestion, conversationHistory = [], testResults = []) {
    const stateCount = currentFA.states.size;
    const transitionCount = currentFA.transitions.length;
    const passRate = testResults.length > 0 
      ? ((testResults.filter(t => t.passed).length / testResults.length) * 100).toFixed(0)
      : 'N/A';
    
    const conversationContext = conversationHistory
      .slice(-6) // Last 6 messages
      .map(m => `${m.type === 'user' ? 'Student' : 'You'}: ${m.text}`)
      .join('\n');
    
    const prompt = `${SYSTEM_CONTEXT}

CRITICAL RESTRICTION: The student has already SUBMITTED their answer for THIS SPECIFIC PROBLEM.

YOU MUST ONLY answer questions that are DIRECTLY related to:
1. Their submitted FA for THIS problem (states, transitions, structure)
2. How to improve their FA for THIS problem
3. What went wrong with their FA for THIS problem
4. How to fix issues in their FA for THIS problem
5. Test results analysis for THIS problem

YOU MUST NOT answer questions about:
- Other problems or questions
- General automata theory concepts (unless they directly help fix THIS FA)
- Future problems
- Past problems
- Anything unrelated to THIS specific problem statement

If the student asks something unrelated to THIS problem, you MUST respond EXACTLY like this:
"I can only help you with the current problem: '[Problem Title]'. Let's focus on improving your FA for this specific problem. What would you like to know about your submitted automaton?"

Be strict - if the question is not clearly about improving/fixing their submitted FA for THIS problem, redirect them.

PROBLEM: ${problemStatement.split('\n')[0]}

STUDENT'S SUBMITTED FA:
- States: ${stateCount}
- Transitions: ${transitionCount}
- Start state: ${currentFA.startState || 'None'}
- Accepting states: ${Array.from(currentFA.states.values()).filter(s => s.isAccepting).map(s => s.id).join(', ') || 'None'}
- Test Results: ${passRate}% passed

CONVERSATION HISTORY:
${conversationContext || 'No previous conversation.'}

STUDENT'S QUESTION: "${userQuestion}"

TASK: Answer their question ONLY if it's about improving/fixing their FA for THIS problem (3-5 sentences). 
- If unrelated: Politely redirect to current problem only
- Focus on specific improvements for their submitted FA
- Give actionable guidance on what to fix
- Be concise and helpful

Remember: ONLY about THIS problem!`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting chat response:', error);
      throw new Error('Failed to get response.');
    }
  }

  /**
   * Get concise analysis with improvements
   */
  async getAnalysis(problemStatement, currentFA, testResults) {
    const failedTests = testResults.filter(t => !t.passed);
    const passedTests = testResults.filter(t => t.passed);
    const passRate = ((passedTests.length / testResults.length) * 100).toFixed(0);
    
    const states = Array.from(currentFA.states.values());
    
    const prompt = `${SYSTEM_CONTEXT}

PROBLEM: ${problemStatement.split('\n')[0]}

STUDENT'S FA:
States: ${states.map(s => `${s.id}${s.isAccepting ? '(accept)' : ''}`).join(', ')}
Start: ${currentFA.startState || 'None'}
Transitions: ${currentFA.transitions.map(t => `${t.from}--${t.symbols}-->${t.to}`).join(', ') || 'None'}

TEST RESULTS: ${passRate}% passed (${passedTests.length}/${testResults.length})

Failed tests (first 3):
${failedTests.slice(0, 3).map(t => 
  `"${t.input || 'ε'}" → Expected ${t.expected ? 'ACCEPT' : 'REJECT'}, got ${t.actual ? 'ACCEPT' : 'REJECT'}`
).join('\n')}

TASK: Give a CONCISE analysis (100-150 words):
1. Quick assessment: "You're on the right track!" or "Let's check your FA structure..."
2. Main issue (1-2 sentences)
3. What to improve (specific but not solution)
4. Quick guidance question

Format it nicely with personality. Be encouraging but direct.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error analyzing:', error);
      throw new Error('Failed to analyze.');
    }
  }

  /**
   * Quick concept explanation
   * @param {string} concept - The concept to explain (e.g., "accepting state", "dead state")
   * @returns {Promise<string>} AI explanation
   */
  async explainConcept(concept) {
    const prompt = `${SYSTEM_CONTEXT}

Briefly explain the concept: "${concept}" in the context of Finite Automata.
Keep it clear, concise, and student-friendly (2-3 sentences).
Include an example if helpful.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error explaining concept with Gemini:', error);
      throw new Error('Failed to explain concept. Please try again.');
    }
  }

  /**
   * Validate if the API key is working
   * @returns {Promise<boolean>}
   */
  async testConnection() {
    try {
      console.log('🔍 Testing Gemini API connection...');
      console.log('API Key (first 10):', API_KEY?.substring(0, 10));
      console.log('API Key exists:', !!API_KEY);
      
      const result = await this.model.generateContent('Hello');
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Connection successful! Response:', text);
      return true;
    } catch (error) {
      console.error('❌ Gemini API connection failed:');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      
      // Check for common errors
      if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key')) {
        console.error('🔑 Issue: Invalid API key');
      } else if (error.message?.includes('quota') || error.message?.includes('429')) {
        console.error('📊 Issue: API quota exceeded');
      } else if (error.message?.includes('fetch') || error.message?.includes('network')) {
        console.error('🌐 Issue: Network connection problem');
      } else if (error.message?.includes('CORS')) {
        console.error('🔒 Issue: CORS policy blocking request');
      }
      
      return false;
    }
  }

  /**
   * Get comprehensive insights based on all user progress
   * @param {Object} progress - All user progress data
   * @returns {Promise<Object>} AI-generated insights
   */
  async getInsights(progress) {
    // Backend structure: progress.faSimulation.problems[] and progress.mcqs.quizzes[]
    const faProblemsProgress = progress.faSimulation?.problems || [];
    const quizProgress = progress.mcqs?.quizzes || [];
    
    // Get detailed breakdown
    const faProblemsWithDetails = faProblemsProgress.map(p => {
      const problem = faProblems.find(prob => prob.id === p.problemId);
      return {
        title: problem?.title || p.problemId,
        type: problem?.type || 'Unknown',
        difficulty: problem?.difficulty || 'Unknown',
        bestScore: p.bestScore || 0,
        attempts: p.attempts || 0,
        status: p.status
      };
    });
    
    const quizzesWithDetails = quizProgress.map(q => {
      const quiz = mcqQuizzes.find(quizItem => quizItem.id === q.quizId);
      return {
        title: quiz?.title || q.quizId,
        topic: quiz?.topic || 'General',
        difficulty: quiz?.difficulty || 'Unknown',
        bestScore: q.bestScore || 0,
        attempts: q.attempts || 0,
        status: q.status
      };
    });
    
    const prompt = `${SYSTEM_CONTEXT}

Analyze the student's complete progress data and provide meaningful insights about their strengths, weaknesses, and what they're lacking.

FA PROBLEMS PERFORMANCE:
${JSON.stringify(faProblemsWithDetails, null, 2)}

QUIZ PERFORMANCE:
${JSON.stringify(quizzesWithDetails, null, 2)}

Provide a comprehensive analysis in JSON format:
{
  "overallAnalysis": "Overall performance summary - what level are they at? (2-3 sentences)",
  "strengths": ["Specific strength 1", "Specific strength 2", "What they're good at"],
  "weaknesses": ["Specific weakness 1", "What they're lacking", "Areas that need work"],
  "whatToFocusOn": ["Specific area to focus on", "Priority areas for improvement"],
  "keyInsights": ["Key insight 1", "Key insight 2", "Important observation"]
}

Be SPECIFIC and MEANINGFUL:
- Reference actual problems/quizzes they've attempted
- Identify patterns in their performance
- Point out what concepts they're missing
- Highlight what they're doing well
- Give actionable focus areas

Format strengths and weaknesses as specific, actionable items. Be encouraging but honest.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback if JSON parsing fails
      return {
        overallAnalysis: text.substring(0, 200) || 'Unable to generate comprehensive analysis.',
        strengths: [],
        weaknesses: [],
        whatToFocusOn: [],
        keyInsights: []
      };
    } catch (error) {
      console.error('Error getting insights:', error);
      return {
        overallAnalysis: 'Unable to generate comprehensive analysis at this time.',
        strengths: [],
        weaknesses: [],
        whatToFocusOn: [],
        keyInsights: []
      };
    }
  }

  /**
   * Get personalized recommendations based on progress
   * @param {Object} progress - All user progress data
   * @param {Array} weakConcepts - Array of weak concepts
   * @returns {Promise<Object>} Recommendations
   */
  async getConceptImprovement(concept, progress) {
    const faProblemsProgress = progress.faSimulation?.problems || [];
    const quizProgress = progress.mcqs?.quizzes || [];
    
    // Find problems/quizzes related to this concept with detailed results
    const conceptProblems = [];
    const conceptQuizzes = [];
    
    faProblemsProgress.forEach(p => {
      const problem = faProblems.find(prob => prob.id === p.problemId);
      if (problem && (problem.type === concept || problem.title.includes(concept))) {
        conceptProblems.push({
          id: problem.id,
          title: problem.title,
          difficulty: problem.difficulty,
          bestScore: p.bestScore || 0,
          attempts: p.attempts || 0,
          status: p.status,
          lastAttempt: p.lastAttempt
        });
      }
    });
    
    quizProgress.forEach(q => {
      const quiz = mcqQuizzes.find(quizItem => quizItem.id === q.quizId);
      if (quiz && quiz.topic === concept) {
        conceptQuizzes.push({
          id: quiz.id,
          title: quiz.title,
          difficulty: quiz.difficulty,
          bestScore: q.bestScore || 0,
          attempts: q.attempts || 0,
          status: q.status,
          lastAttempt: q.lastAttempt
        });
      }
    });

    const avgFAScore = conceptProblems.length > 0 
      ? Math.round(conceptProblems.reduce((sum, p) => sum + (p.bestScore || 0), 0) / conceptProblems.length) 
      : 0;
    const avgQuizScore = conceptQuizzes.length > 0 
      ? Math.round(conceptQuizzes.reduce((sum, q) => sum + (q.bestScore || 0), 0) / conceptQuizzes.length) 
      : 0;

    const prompt = `${SYSTEM_CONTEXT}

CONCEPT: ${concept}

STUDENT'S DETAILED PERFORMANCE ON "${concept}":

**FA Problems:**
${conceptProblems.map(p => `- ${p.title} (${p.difficulty}): ${p.bestScore}% (${p.attempts} attempts, Status: ${p.status})`).join('\n') || 'No FA problems attempted'}
- Average Score: ${avgFAScore}%
- Total Attempts: ${conceptProblems.reduce((sum, p) => sum + (p.attempts || 0), 0)}

**Quizzes:**
${conceptQuizzes.map(q => `- ${q.title} (${q.difficulty}): ${q.bestScore}% (${q.attempts} attempts, Status: ${q.status})`).join('\n') || 'No quizzes attempted'}
- Average Score: ${avgQuizScore}%
- Total Attempts: ${conceptQuizzes.reduce((sum, q) => sum + (q.attempts || 0), 0)}

TASK: Provide SPECIFIC, ACTIONABLE guidance on HOW to improve understanding of "${concept}".

Format your response EXACTLY like this structure:

**Opening:** A friendly, encouraging greeting (1-2 sentences)

**1. Focus Areas:**
- List 3-5 specific aspects of ${concept} they should focus on
- Use bullet points with bold key terms

**2. Learning Path:**
- Step-by-step learning path (what to practice first, then next)
- Use numbered or lettered steps (a, b, c, d)
- Include specific examples

**3. Common Mistakes to Avoid:**
- List common mistakes related to ${concept}
- Use bullet points with bold terms

**4. Key Concepts to Master:**
- List 3-5 key concepts they need to master
- Use bullet points with brief explanations

**5. Recommended Practice Approach:**
- Provide actionable practice recommendations
- Use bullet points

**Closing:** An encouraging closing statement (1 sentence)

Use markdown formatting:
- **Bold** for emphasis
- *Italics* for emphasis
- Bullet points (-) or numbered lists
- Keep paragraphs concise (2-3 sentences max)

Be encouraging, specific, and actionable. Focus on what they can DO to improve.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting concept improvement:', error);
      throw new Error('Failed to get concept improvement tips.');
    }
  }

  async getRecommendations(progress, weakConcepts) {
    const faProblemsProgress = progress.faSimulation?.problems || [];
    const quizProgress = progress.mcqs?.quizzes || [];
    
    // Get attempted problems with low scores for retake
    const retakeCandidates = [];
    
    faProblemsProgress.forEach(p => {
      const problem = faProblems.find(prob => prob.id === p.problemId);
      if (problem && (p.bestScore || 0) < 100 && (p.attempts || 0) > 0) {
        retakeCandidates.push({
          id: problem.id,
          title: problem.title,
          type: problem.type,
          difficulty: problem.difficulty,
          bestScore: p.bestScore || 0,
          attempts: p.attempts || 0
        });
      }
    });
    
    quizProgress.forEach(q => {
      const quiz = mcqQuizzes.find(quizItem => quizItem.id === q.quizId);
      if (quiz && (q.bestScore || 0) < 70 && (q.attempts || 0) > 0) {
        retakeCandidates.push({
          id: quiz.id,
          title: quiz.title,
          type: 'quiz',
          topic: quiz.topic,
          difficulty: quiz.difficulty,
          bestScore: q.bestScore || 0,
          attempts: q.attempts || 0
        });
      }
    });
    
    // Get unattempted problems for "next"
    const attemptedIds = new Set([
      ...faProblemsProgress.map(p => p.problemId),
      ...quizProgress.map(q => q.quizId)
    ]);
    
    const nextCandidates = [];
    
    // Get unattempted FA problems
    faProblems.forEach(problem => {
      if (!attemptedIds.has(problem.id)) {
        nextCandidates.push({
          id: problem.id,
          title: problem.title,
          type: problem.type,
          difficulty: problem.difficulty
        });
      }
    });
    
    // Get unattempted quizzes
    mcqQuizzes.forEach(quiz => {
      if (!attemptedIds.has(quiz.id)) {
        nextCandidates.push({
          id: quiz.id,
          title: quiz.title,
          type: 'quiz',
          topic: quiz.topic,
          difficulty: quiz.difficulty
        });
      }
    });
    
    // Sort retake by score (lowest first) and next by difficulty/type
    retakeCandidates.sort((a, b) => a.bestScore - b.bestScore);
    nextCandidates.sort((a, b) => {
      const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      return diffOrder[a.difficulty] - diffOrder[b.difficulty];
    });
    
    const prompt = `${SYSTEM_CONTEXT}

Based on the student's progress, provide personalized recommendations:

WEAK CONCEPTS:
${weakConcepts.length > 0 ? weakConcepts.map(c => `${c.concept}: ${c.accuracy}% accuracy`).join('\n') : 'No specific weak concepts identified yet.'}

PROBLEMS TO RETAKE (low scores):
${retakeCandidates.slice(0, 10).map(p => {
  if (p.type === 'quiz') {
    return `- ${p.id} (${p.title}): ${p.bestScore}% (${p.attempts} attempts, ${p.difficulty}, Topic: ${p.topic})`;
  }
  return `- ${p.id} (${p.title}): ${p.bestScore}% (${p.attempts} attempts, ${p.difficulty}, Type: ${p.type})`;
}).join('\n') || 'No problems to retake'}

PROBLEMS TO TRY NEXT (not yet attempted):
${nextCandidates.slice(0, 10).map(p => {
  if (p.type === 'quiz') {
    return `- ${p.id} (${p.title}): ${p.difficulty}, Topic: ${p.topic}`;
  }
  return `- ${p.id} (${p.title}): ${p.difficulty}, Type: ${p.type}`;
}).join('\n') || 'All problems attempted'}

Provide recommendations in JSON format (use the EXACT problem/quiz IDs from above):
{
  "retake": [
    {"title": "fa-001 or mcq-001 format", "reason": "Why retake this - be specific"},
    ...
  ],
  "next": [
    {"title": "fa-002 or mcq-002 format", "reason": "Why try this next - be specific"},
    ...
  ]
}

IMPORTANT:
- Use the EXACT ID format (e.g., "fa-001", "mcq-001") for the title field
- Suggest 3-5 items for retake (prioritize lowest scores)
- Suggest 3-5 items for next (prioritize Easy first, then Medium)
- Be specific in reasons - reference the weak concepts or learning path
- Always return at least some recommendations if data is available

Be specific and actionable.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Ensure we have arrays
        if (!parsed.retake || !Array.isArray(parsed.retake)) {
          parsed.retake = [];
        }
        if (!parsed.next || !Array.isArray(parsed.next)) {
          parsed.next = [];
        }
        
        // If AI returned empty, generate fallback recommendations
        if (parsed.retake.length === 0 && retakeCandidates.length > 0) {
          parsed.retake = retakeCandidates.slice(0, 3).map(p => ({
            title: p.id,
            reason: `Retake "${p.title}" to improve your ${p.bestScore}% score. Focus on ${p.type === 'quiz' ? p.topic : p.type} concepts.`
          }));
        }
        
        if (parsed.next.length === 0 && nextCandidates.length > 0) {
          parsed.next = nextCandidates.slice(0, 3).map(p => ({
            title: p.id,
            reason: `Try "${p.title}" next. This ${p.difficulty} ${p.type === 'quiz' ? 'quiz' : 'problem'} will help you practice ${p.type === 'quiz' ? p.topic : p.type} concepts.`
          }));
        }
        
        return parsed;
      }
      
      // Fallback: Generate recommendations from data
      const fallbackRetake = retakeCandidates.slice(0, 3).map(p => ({
        title: p.id,
        reason: `Retake "${p.title}" to improve your ${p.bestScore}% score.`
      }));
      
      const fallbackNext = nextCandidates.slice(0, 3).map(p => ({
        title: p.id,
        reason: `Try "${p.title}" next. This ${p.difficulty} ${p.type === 'quiz' ? 'quiz' : 'problem'} will help you practice.`
      }));
      
        return {
          retake: fallbackRetake,
          next: fallbackNext
        };
    } catch (error) {
      console.error('Error getting recommendations:', error);
      
      // Fallback: Generate from data directly
      const fallbackRetake = retakeCandidates.slice(0, 3).map(p => ({
        title: p.id,
        reason: `Retake "${p.title}" to improve your ${p.bestScore}% score.`
      }));
      
      const fallbackNext = nextCandidates.slice(0, 3).map(p => ({
        title: p.id,
        reason: `Try "${p.title}" next. This ${p.difficulty} ${p.type === 'quiz' ? 'quiz' : 'problem'} will help you practice.`
      }));
      
      return {
        retake: fallbackRetake,
        next: fallbackNext
      };
    }
  }
  
  // Helper method to get initial recommendations for new users
  getInitialRecommendations() {
    // Get first 3 easy FA problems
    const easyFA = faProblems
      .filter(p => p.difficulty === 'Easy')
      .slice(0, 3)
      .map(p => ({
        title: p.id,
        reason: `Start with "${p.title}". This easy problem will help you build foundational understanding of ${p.type} concepts.`
      }));
    
    // Get first 2 easy quizzes
    const easyQuizzes = mcqQuizzes
      .filter(q => q.difficulty === 'Easy')
      .slice(0, 2)
      .map(q => ({
        title: q.id,
        reason: `Try "${q.title}" quiz. This will test your understanding of ${q.topic} concepts.`
      }));
    
    return {
      retake: [],
      next: [...easyFA, ...easyQuizzes].slice(0, 5)
    };
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
export default geminiService;


