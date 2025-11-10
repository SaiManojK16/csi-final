import React from 'react';
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  ConfirmDialog,
  useAlertDialog
} from './AlertDialog';

/**
 * USAGE EXAMPLES FOR ACCEPTLY PROJECT
 * Copy these into your components where confirmation is needed
 */

// ============================================
// 1. QUIZ SUBMISSION CONFIRMATION
// ============================================

export const QuizSubmitDialog = ({ open, onOpenChange, onSubmit, answeredCount, totalCount }) => {
  const unansweredCount = totalCount - answeredCount;
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} variant="warning">
      <AlertDialogHeader>
        <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
        <AlertDialogDescription>
          {unansweredCount > 0 ? (
            <>
              You have <strong>{unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}</strong>.
              Are you sure you want to submit? You won't be able to change your answers after submission.
            </>
          ) : (
            <>
              You've answered all {totalCount} questions. Ready to submit your quiz?
              You won't be able to change your answers after submission.
            </>
          )}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => onOpenChange(false)}>
          Review Answers
        </AlertDialogCancel>
        <AlertDialogAction
          variant="primary"
          onClick={() => {
            onSubmit();
            onOpenChange(false);
          }}
        >
          Submit Quiz
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>
  );
};

// Usage in QuizPage.js:
/*
const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

<button onClick={() => setSubmitDialogOpen(true)}>
  Submit Quiz
</button>

<QuizSubmitDialog
  open={submitDialogOpen}
  onOpenChange={setSubmitDialogOpen}
  onSubmit={handleSubmitQuiz}
  answeredCount={answeredQuestions.length}
  totalCount={totalQuestions}
/>
*/

// ============================================
// 2. LOGOUT CONFIRMATION
// ============================================

export const LogoutConfirmDialog = ({ open, onOpenChange, onConfirm }) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} variant="warning">
      <AlertDialogHeader>
        <AlertDialogTitle>Logout?</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to logout? Any unsaved progress will be lost.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => onOpenChange(false)}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          variant="primary"
          onClick={() => {
            onConfirm();
            onOpenChange(false);
          }}
        >
          Logout
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>
  );
};

// Usage in Header.js:
/*
const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

<button onClick={() => setLogoutDialogOpen(true)}>
  Logout
</button>

<LogoutConfirmDialog
  open={logoutDialogOpen}
  onOpenChange={setLogoutDialogOpen}
  onConfirm={handleLogout}
/>
*/

// ============================================
// 3. DELETE/RESET AUTOMATON
// ============================================

export const ResetAutomatonDialog = ({ open, onOpenChange, onReset }) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} variant="error">
      <AlertDialogHeader>
        <AlertDialogTitle>Reset Automaton?</AlertDialogTitle>
        <AlertDialogDescription>
          This will delete all states, transitions, and your current work.
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => onOpenChange(false)}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          onClick={() => {
            onReset();
            onOpenChange(false);
          }}
        >
          Reset Automaton
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>
  );
};

// ============================================
// 4. LEAVE QUIZ IN PROGRESS
// ============================================

export const LeaveQuizDialog = ({ open, onOpenChange, onLeave }) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} variant="warning">
      <AlertDialogHeader>
        <AlertDialogTitle>Leave Quiz?</AlertDialogTitle>
        <AlertDialogDescription>
          You have a quiz in progress. If you leave now, your answers will not be saved
          and you'll need to start over.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => onOpenChange(false)}>
          Stay on Quiz
        </AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          onClick={() => {
            onLeave();
            onOpenChange(false);
          }}
        >
          Leave Quiz
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>
  );
};

// ============================================
// 5. DELETE PROGRESS DATA
// ============================================

export const DeleteProgressDialog = ({ open, onOpenChange, onDelete, loading }) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} variant="error">
      <AlertDialogHeader>
        <AlertDialogTitle>Delete All Progress?</AlertDialogTitle>
        <AlertDialogDescription>
          This will permanently delete all your progress, completed problems, quiz scores,
          and statistics. This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => onOpenChange(false)} disabled={loading}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          onClick={onDelete}
          loading={loading}
        >
          {loading ? 'Deleting...' : 'Delete Progress'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>
  );
};

// ============================================
// 6. SUBMIT PROBLEM SOLUTION
// ============================================

export const SubmitSolutionDialog = ({ open, onOpenChange, onSubmit, problemTitle }) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} variant="info">
      <AlertDialogHeader>
        <AlertDialogTitle>Submit Solution?</AlertDialogTitle>
        <AlertDialogDescription>
          Ready to submit your solution for "{problemTitle}"?
          Your automaton will be validated and you'll receive immediate feedback.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => onOpenChange(false)}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          variant="success"
          onClick={() => {
            onSubmit();
            onOpenChange(false);
          }}
        >
          Submit Solution
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>
  );
};

// ============================================
// 7. SUCCESS DIALOG (After Quiz/Problem)
// ============================================

export const SuccessDialog = ({ 
  open, 
  onOpenChange, 
  title = 'Success!',
  message,
  score,
  onContinue 
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} variant="success">
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>
          {message}
          {score !== undefined && (
            <div style={{ 
              marginTop: 'var(--spacing-md)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--success-600)'
            }}>
              Score: {score}%
            </div>
          )}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction
          variant="success"
          onClick={() => {
            onContinue?.();
            onOpenChange(false);
          }}
        >
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>
  );
};

// ============================================
// 8. USING THE SIMPLE ConfirmDialog
// ============================================

export const SimpleConfirmExample = () => {
  const dialog = useAlertDialog();

  const handleDelete = () => {
    console.log('Deleted!');
  };

  return (
    <>
      <button onClick={dialog.show}>Delete Item</button>

      <ConfirmDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title="Delete Item?"
        description="This action cannot be undone. Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        variant="error"
        destructive={true}
      />
    </>
  );
};

// ============================================
// 9. ACCOUNT DELETION
// ============================================

export const DeleteAccountDialog = ({ open, onOpenChange, onDelete, loading }) => {
  const [confirmText, setConfirmText] = React.useState('');
  const canDelete = confirmText === 'DELETE';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} variant="error">
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Account</AlertDialogTitle>
        <AlertDialogDescription>
          This will permanently delete your account and remove all your data from our servers.
          This action cannot be undone.
          <div style={{ marginTop: 'var(--spacing-md)' }}>
            <label style={{ 
              display: 'block',
              marginBottom: 'var(--spacing-sm)',
              fontWeight: 'var(--font-semibold)'
            }}>
              Type <strong>DELETE</strong> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid var(--gray-300)',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--text-base)'
              }}
            />
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => onOpenChange(false)} disabled={loading}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          onClick={onDelete}
          loading={loading}
          disabled={!canDelete || loading}
        >
          {loading ? 'Deleting Account...' : 'Delete Account'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>
  );
};

// ============================================
// 10. UNSAVED CHANGES WARNING
// ============================================

export const UnsavedChangesDialog = ({ open, onOpenChange, onDiscard, onSave }) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} variant="warning">
      <AlertDialogHeader>
        <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
        <AlertDialogDescription>
          You have unsaved changes. Do you want to save them before leaving?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => onOpenChange(false)}>
          Stay on Page
        </AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          onClick={() => {
            onDiscard();
            onOpenChange(false);
          }}
        >
          Discard Changes
        </AlertDialogAction>
        <AlertDialogAction
          variant="primary"
          onClick={() => {
            onSave();
            onOpenChange(false);
          }}
        >
          Save & Leave
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>
  );
};

// Export all dialog components
export default {
  QuizSubmitDialog,
  LogoutConfirmDialog,
  ResetAutomatonDialog,
  LeaveQuizDialog,
  DeleteProgressDialog,
  SubmitSolutionDialog,
  SuccessDialog,
  SimpleConfirmExample,
  DeleteAccountDialog,
  UnsavedChangesDialog
};

