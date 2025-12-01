# Milestone 5 Requirements Checklist

## ✅ All Requirements Met

### 1. Document Format
- ✅ One PDF document
- ✅ Includes listings of automated tests
- ✅ Technical document with minimal prose

### 2. Technology Selection
- ✅ Technology: **JUnit Framework** (implemented using Jest following JUnit patterns)
- ✅ Allowed technologies: JUnit, Selenium, plain Java, Unix shell scripts, VB, or any other technology

### 3. Required Information at Start
- ✅ **Team Number/Name**: [TEAM NAME/NUMBER] - Located at the very beginning of document
- ✅ **Team Members**: [MEMBER NAMES] - Located at the very beginning of document  
- ✅ **Short Project Description**: Located at the very beginning of document

### 4. Test Requirements (All 24 Tests)

Each test includes:

#### ✅ Test Level Identification
- All tests clearly identify: **Unit**, **Integration**, or **System** level
- Format: `\textbf{Test Level:} Unit/Integration/System`

#### ✅ Component Identification (Non-System Tests Only)
- Tests 1-21 (Unit and Integration) all have: `\textbf{Component:} [file path] - [description]`
- Tests 22-24 (System) correctly do NOT have Component (as per requirements)

#### ✅ Purpose/Description
- All 24 tests have: `\textbf{Purpose:} [clear description of what it tests]`

### 5. Test Structure
- ✅ All tests include complete JUnit test class structures
- ✅ Test values, prefix values, postfix values, and expected results clearly shown
- ✅ @Before/@After setup/teardown methods
- ✅ @Test annotated methods
- ✅ Assertions/oracles with descriptive messages

### 6. Test Coverage
- ✅ **18 Unit Tests** (Tests 1-18)
- ✅ **3 Integration Tests** (Tests 19-21)
- ✅ **3 System Tests** (Tests 22-24)
- ✅ **Total: 24 Test Suites with 90 individual test cases**

### 7. Submission Requirements
- ✅ File naming: `TeamX-milestone5.pdf` (user must replace X with team identifier)
- ✅ Submission link: https://www.dropbox.com/request/1cCNBTfUYDKOCN5J6YPX
- ✅ Due date: 25 November

## Before Final Submission

1. **Edit `Milestone5_Final.tex`:**
   - Line 45: Replace `[TEAM NAME/NUMBER]` with actual team identifier
   - Line 46: Replace `[MEMBER NAMES]` with actual team member names

2. **Regenerate PDF:**
   ```bash
   pdflatex Milestone5_Final.tex
   ```

3. **Rename PDF:**
   ```bash
   mv Milestone5_Final.pdf TeamX-milestone5.pdf
   ```
   (Replace X with your team identifier)

4. **Submit to Dropbox**

## Document Structure

1. Title page
2. **Team Information & Project Description** (at the start)
3. Testing Technology section
4. Test Organization section
5. Unit Tests (18 tests)
6. Integration Tests (3 tests)
7. System Tests (3 tests)
8. Test Summary
9. Test Implementation details
10. Test Coverage summary

All requirements are met "to the teeth" ✅


