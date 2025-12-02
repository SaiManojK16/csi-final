# Finite Automata Builder with AI Assistant 🤖

An interactive web application for learning and building Finite Automata (FA) with integrated AI assistance powered by Google Gemini.

## Features

### 🎨 Visual FA Builder
- **Interactive Canvas**: Draw states and transitions with mouse clicks
- **State Management**: Add states, mark as accepting, set start state
- **Transition Creation**: Connect states with labeled transitions
- **Drag & Drop**: Move states around the canvas
- **Context Menu**: Right-click for quick state operations

### 🧪 Automated Testing
- **Test Suite**: Predefined test cases for validation
- **Path Visualization**: See the execution path for each test
- **Real-time Results**: Instant feedback on FA correctness
- **Detailed Analysis**: View why tests pass or fail

### 🤖 AI-Powered Learning Assistant
- **Intelligent Hints**: Get contextual hints based on your current FA structure
- **Error Analysis**: AI explains why your FA fails tests without giving the answer
- **Guided Learning**: Socratic method approach - helps you discover solutions
- **Concept Explanations**: Learn automata theory concepts on-demand
- **Inline Panel Mode**: AI Assistant available as a tab in the question panel
- **Chat Interface**: Interactive chat-based AI tutoring system

### 📚 Interactive Tutorial System
- **Step-by-Step Guidance**: Interactive tutorial with visual highlighting
- **Panel-Based Display**: Tutorial steps displayed inline in the question panel
- **Element Highlighting**: Spotlight system highlights relevant UI elements during tutorial
- **Task Tracking**: Tutorial tracks completion of interactive tasks
- **Non-Intrusive**: Tutorial runs without blocking popups, allowing full interaction

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   cd /path/to/CSI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Or copy the example file:
   ```bash
   cp .env.example .env
   # Then edit .env and add your API key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

### Getting Started with Tutorial

1. **Access Tutorial**
   - Navigate to any FA problem
   - Click the "Tutorial" tab in the left question panel
   - Click "Start Tutorial" button

2. **Follow Tutorial Steps**
   - Tutorial instructions appear in the left panel
   - Relevant UI elements are highlighted on the canvas
   - Complete tasks as instructed
   - Use Previous/Next buttons to navigate steps

3. **Panel Management**
   - Minimize the question panel using the minimize button (→) for more canvas space
   - Click any tab (Description, Tutorial, AI Assistant) to restore the panel
   - Tabs remain visible even when panel is minimized

### Building Your First FA

1. **Add States**
   - Click the "Add State" button in the toolbar
   - Click anywhere on the canvas to place a state
   - The first state is automatically set as the start state

2. **Configure States**
   - Right-click a state to open the context menu
   - Select "Make Accepting" to mark as an accepting state
   - Select "Set as Start State" to change the start state

3. **Add Transitions**
   - Click the "Add Transition" button
   - Click the source state
   - Click the destination state (can be the same for self-loops)
   - Enter the transition symbol (0 or 1)

4. **Test Your FA**
   - Click "Run All Tests" in the String Tester section
   - View results to see which tests pass or fail
   - Analyze the execution paths

### Using the AI Assistant 🤖

#### Accessing AI Assistant

1. **Via Tab**: Click the "AI Assistant" tab in the left question panel
2. **Via Header Button**: Click the AI icon (✨) in the header bar
3. **Inline Mode**: AI Assistant displays directly in the question panel when accessed via tab

#### Getting Hints

1. Open the AI Assistant (via tab or header button)
2. Type your question or request a hint
3. The AI will:
   - Ask guiding questions
   - Point out what to think about
   - Provide contextual hints based on your current FA
   - **NOT** give you the direct answer

#### Analyzing Errors

1. Run the test cases first
2. Open the AI Assistant
3. Ask "Why did my tests fail?" or "Analyze my errors"
4. The AI will:
   - Identify conceptual errors
   - Explain patterns in failed tests
   - Suggest what principles to apply
   - Help you understand your mistakes

## Current Problem

**Design a Finite Automaton that accepts strings over {0, 1} containing ONLY 0's (no 1's allowed)**

### Language Definition
- **L = {0}\*** 
- **Accepts**: ε (empty), 0, 00, 000, ...
- **Rejects**: Any string with at least one 1

### Solution Approach
Think about:
1. What should happen on input '0'?
2. What should happen on input '1'?
3. Should the empty string be accepted?
4. How many states do you need?

*Try building it yourself first, then use the AI hints if you get stuck!*

## Architecture

### Component Structure
```
src/
├── components/
│   ├── AutomataBuilder.js      # Main container component
│   ├── AutomataCanvas.js       # Canvas for drawing FA
│   ├── StringTester.js         # Test case runner
│   ├── Toolbar.js              # Tool selection
│   ├── AIHelper.js             # AI assistant UI (modal and inline modes)
│   └── GuidedTour.js           # Interactive tutorial system
├── pages/
│   ├── FASimulation.js         # Main FA simulation page with tutorial panel
│   └── LandingPage.js          # Landing page
├── services/
│   └── geminiService.js        # Gemini AI integration
└── App.js                      # Root component
```

### Key Technologies
- **React 18**: UI framework
- **Canvas API**: For drawing states and transitions
- **Google Gemini AI**: For intelligent tutoring
- **Context API**: State management

## AI Integration Details

### Gemini Service Features

The `geminiService` provides three main functions:

1. **`getHint(problemStatement, currentFA)`**
   - Analyzes current FA structure
   - Provides contextual hints
   - Maintains educational approach

2. **`analyzeErrors(problemStatement, currentFA, testResults)`**
   - Deep analysis of failed tests
   - Identifies conceptual misunderstandings
   - Guides without revealing solutions

3. **`explainConcept(concept)`**
   - Quick concept explanations
   - Student-friendly language
   - Automata theory fundamentals

### AI Behavior

The AI is designed to:
- ✅ Ask guiding questions
- ✅ Explain concepts
- ✅ Point out logical errors
- ✅ Encourage experimentation
- ❌ **NOT** give direct solutions
- ❌ **NOT** draw the FA for you
- ❌ **NOT** tell exact transitions

## Keyboard Shortcuts

- **Delete/Backspace**: Delete selected state (in select mode)
- **Right-click**: Open context menu for state
- **Drag**: Move states (in select mode)

## Troubleshooting

### AI Assistant Not Working

1. **Check API Key**: Ensure `.env` file has correct API key
2. **Restart Server**: After adding `.env`, restart with `npm start`
3. **Check Console**: Open browser console for error messages
4. **API Limits**: Verify your Gemini API quota hasn't been exceeded

### Canvas Issues

- **States not appearing**: Try clicking "Clear" and starting fresh
- **Can't drag states**: Make sure you're in "Select" mode
- **Transitions not showing**: Check if states exist before adding transitions

## Future Enhancements

- [ ] Save/Load automata designs
- [ ] Multiple problem types (NFA, DFA, Regular Expressions)
- [ ] Undo/Redo functionality
- [ ] Export FA as image or JSON
- [ ] Collaboration features
- [ ] NFA to DFA conversion
- [ ] Minimization algorithms
- [ ] Step-by-step execution mode

## Contributing

This is an educational project. Feel free to:
- Report bugs
- Suggest new features
- Improve AI prompts
- Add more test cases
- Enhance UI/UX

## License

MIT License - Educational purposes

## Acknowledgments

- **Google Gemini AI**: For powering the intelligent tutoring
- **React Team**: For the amazing framework
- **Automata Theory**: Classic computer science foundations

---

**Happy Learning! 🎓**

*Remember: The goal is to understand, not just to get the right answer. Use the AI as a guide, not a solution generator.*

