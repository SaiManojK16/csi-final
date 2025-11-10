import React, { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationInfo,
  usePagination
} from './Pagination';

/**
 * USAGE EXAMPLES FOR ACCEPTLY PROJECT
 * Copy these into your components where pagination is needed
 */

// ============================================
// 1. BASIC PAGINATION
// ============================================

export const BasicPaginationExample = () => {
  const [currentPage, setCurrentPage] = useState(2);
  const totalPages = 5;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          />
        </PaginationItem>

        {[...Array(totalPages)].map((_, i) => (
          <PaginationItem key={i + 1}>
            <PaginationLink
              isActive={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext 
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

// ============================================
// 2. PAGINATION WITH ELLIPSIS (Many Pages)
// ============================================

export const PaginationWithEllipsisExample = () => {
  const [currentPage, setCurrentPage] = useState(5);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink onClick={() => setCurrentPage(4)}>4</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink isActive onClick={() => setCurrentPage(5)}>5</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink onClick={() => setCurrentPage(6)}>6</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink onClick={() => setCurrentPage(20)}>20</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext 
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === 20}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

// ============================================
// 3. QUIZ QUESTION PAGINATION (SPECIAL)
// ============================================

export const QuizQuestionPagination = ({ 
  totalQuestions = 10,
  currentQuestion = 0,
  answeredQuestions = [],
  flaggedQuestions = [],
  onQuestionChange 
}) => {
  return (
    <Pagination variant="quiz">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => onQuestionChange(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          />
        </PaginationItem>

        {[...Array(totalQuestions)].map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentQuestion === i}
              answered={answeredQuestions.includes(i)}
              flagged={flaggedQuestions.includes(i)}
              onClick={() => onQuestionChange(i)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext 
            onClick={() => onQuestionChange(Math.min(totalQuestions - 1, currentQuestion + 1))}
            disabled={currentQuestion === totalQuestions - 1}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

// Usage in QuizPage.js:
/*
const [currentQuestion, setCurrentQuestion] = useState(0);
const [answeredQuestions, setAnsweredQuestions] = useState([0, 1, 3]);
const [flaggedQuestions, setFlaggedQuestions] = useState([2]);

<QuizQuestionPagination
  totalQuestions={quiz.questions.length}
  currentQuestion={currentQuestion}
  answeredQuestions={answeredQuestions}
  flaggedQuestions={flaggedQuestions}
  onQuestionChange={setCurrentQuestion}
/>
*/

// ============================================
// 4. PAGINATION WITH usePagination HOOK
// ============================================

export const SmartPaginationExample = () => {
  const problems = [...Array(100)]; // 100 problems

  const {
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    getPageNumbers,
    canGoNext,
    canGoPrev,
    startIndex,
    endIndex
  } = usePagination({
    totalItems: problems.length,
    itemsPerPage: 10,
    maxPageNumbers: 5
  });

  const pageNumbers = getPageNumbers();

  return (
    <div>
      {/* Display items */}
      <div className="problems-list">
        {problems.slice(startIndex, endIndex).map((_, i) => (
          <div key={startIndex + i}>
            Problem {startIndex + i + 1}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={prevPage} disabled={!canGoPrev} />
          </PaginationItem>

          {pageNumbers.map((pageNum, index) => (
            <PaginationItem key={`${pageNum}-${index}`}>
              {pageNum === 'ellipsis-start' || pageNum === 'ellipsis-end' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={pageNum === currentPage}
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext onClick={nextPage} disabled={!canGoNext} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Info */}
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <PaginationInfo currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

// ============================================
// 5. PROBLEM LIST PAGINATION
// ============================================

export const ProblemListPagination = ({ problems, itemsPerPage = 12 }) => {
  const {
    currentPage,
    goToPage,
    nextPage,
    prevPage,
    getPageNumbers,
    canGoNext,
    canGoPrev,
    startIndex,
    endIndex
  } = usePagination({
    totalItems: problems.length,
    itemsPerPage,
    maxPageNumbers: 7
  });

  const pageNumbers = getPageNumbers();
  const currentProblems = problems.slice(startIndex, endIndex);

  return (
    <div>
      {/* Problem Cards */}
      <div className="problems-grid">
        {currentProblems.map((problem, index) => (
          <div key={problem.id} className="problem-card">
            <h3>{problem.title}</h3>
            <p>{problem.description}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {problems.length > itemsPerPage && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={prevPage} disabled={!canGoPrev} />
            </PaginationItem>

            {pageNumbers.map((pageNum, index) => (
              <PaginationItem key={`${pageNum}-${index}`}>
                {typeof pageNum === 'string' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={pageNum === currentPage}
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext onClick={nextPage} disabled={!canGoNext} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

// ============================================
// 6. COMPACT PAGINATION (Mobile-friendly)
// ============================================

export const CompactPaginationExample = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <Pagination variant="compact">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationInfo currentPage={currentPage} totalPages={totalPages} />
        </PaginationItem>

        <PaginationItem>
          <PaginationNext 
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

// ============================================
// 7. ROUNDED PAGINATION
// ============================================

export const RoundedPaginationExample = () => {
  const [currentPage, setCurrentPage] = useState(3);

  return (
    <Pagination variant="rounded">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} />
        </PaginationItem>
        
        {[1, 2, 3, 4, 5].map(page => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={page === currentPage}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

// ============================================
// 8. PAGINATION WITH ROUTER (React Router)
// ============================================

export const RouterPaginationExample = ({ location }) => {
  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get('page') || '1');

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            to={`/problems?page=${currentPage - 1}`}
            disabled={currentPage === 1}
          />
        </PaginationItem>

        {[1, 2, 3, 4, 5].map(page => (
          <PaginationItem key={page}>
            <PaginationLink
              to={`/problems?page=${page}`}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext to={`/problems?page=${currentPage + 1}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

// Export all examples
export default {
  BasicPaginationExample,
  PaginationWithEllipsisExample,
  QuizQuestionPagination,
  SmartPaginationExample,
  ProblemListPagination,
  CompactPaginationExample,
  RoundedPaginationExample,
  RouterPaginationExample
};

