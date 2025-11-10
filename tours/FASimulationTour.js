/**
 * FA Simulation Guided Tour
 * Interactive tutorial for Automata Builder
 */

export const FASimulationWelcome = {
  icon: '🎓',
  title: 'Welcome to the FA Builder!',
  subtitle: 'Learn how to build Finite Automata step by step',
  features: [
    {
      icon: '⭕',
      title: 'Add States',
      description: 'Click to add states to your automaton'
    },
    {
      icon: '➡️',
      title: 'Create Transitions',
      description: 'Connect states with labeled transitions'
    },
    {
      icon: '✓',
      title: 'Test Strings',
      description: 'Validate your automaton with test inputs'
    },
    {
      icon: '🤖',
      title: 'AI Assistant',
      description: 'Get help from our AI tutor anytime'
    }
  ]
};

export const FASimulationSteps = [
  // Step 1: Introduction - Canvas & Toolbar
  {
    selector: '.canvas-panel',
    title: '📐 Welcome to the FA Builder',
    description: 'This is your canvas where you\'ll build your Finite Automaton. The toolbar at the bottom has all the tools you need.',
    hint: 'You can move this tutorial box around by dragging the header!',
    position: 'top'
  },

  // Step 2: Add States - Task!
  {
    selector: '.toolbar-item-button:nth-child(2)',
    title: '⭕ Add States',
    description: 'Click "Add State" in the toolbar, then click on the canvas to create states. Add at least 2 states to build your automaton.',
    task: 'Add at least 2 states to the canvas',
    taskId: 'add-second-state',
    requireTask: true,
    hint: 'Click the "Add State" button, then click anywhere on the canvas. Add another state to continue.',
    position: 'bottom'
  },

  // Step 3: Set Start and Accept States - Task!
  {
    selector: '.canvas-panel',
    title: '✅ Mark Start & Accept States',
    description: 'Right-click a state to set it as the start state (initial state). Right-click another state to make it accepting (final state). The first state is already the start state.',
    task: 'Set a start state and mark at least one state as accepting',
    taskId: 'set-accept-state',
    requireTask: true,
    hint: 'Right-click a state → "Set as Start State" or "Make Accepting". You can also use the Properties panel on the right.',
    position: 'top'
  },

  // Step 4: Add Transitions - Task!
  {
    selector: '.toolbar-item-button:nth-child(3)',
    title: '➡️ Connect States with Transitions',
    description: 'Click "Add Transition", then click two states to connect them. Enter a symbol like "0" or "1" when prompted.',
    task: 'Create at least one transition between states',
    taskId: 'add-transition',
    requireTask: true,
    hint: '1. Click "Add Transition" button\n2. Click first state, then second state\n3. Type a symbol (like "0") and press Enter',
    position: 'bottom'
  },

  // Step 5: Test Your Automaton - Task!
  {
    selector: '.run-tests-btn',
    title: '▶️ Test Your FA',
    description: 'Click the "Run Test Cases" button (▶️) in the header next to Submit to validate your automaton. The system will test it against multiple cases and show results.',
    task: 'Run the test cases to validate your automaton',
    taskId: 'test-string',
    requireTask: true,
    hint: 'Make sure you have states, a start state, an accepting state, and at least one transition. Then click the "Run Test Cases" button (▶️) in the top header.',
    position: 'bottom'
  },

  // Step 6: Completion
  {
    selector: '.automata-builder-three-panel',
    title: '🎉 You\'re All Set!',
    description: 'Great job! You now know how to:\n✓ Add states\n✓ Set start and accepting states\n✓ Create transitions\n✓ Test your automaton\n\nUse the Properties panel (right) to edit details, and Undo/Redo buttons if you make mistakes. Good luck!',
    hint: 'Tip: You can right-click states for quick actions, and drag states to rearrange them.',
    position: 'bottom'
  }
];

// Task validation functions
export const FATaskValidators = {
  'add-second-state': (states) => {
    return states.size >= 2;
  },

  'set-accept-state': (states) => {
    // Check if any state is marked as accepting
    return Array.from(states.values()).some(state => state.isAccepting);
  },

  'add-transition': (transitions) => {
    return transitions.length >= 1;
  },

  'test-string': (testResults) => {
    return testResults.length > 0;
  }
};

export default {
  welcome: FASimulationWelcome,
  steps: FASimulationSteps,
  validators: FATaskValidators
};

