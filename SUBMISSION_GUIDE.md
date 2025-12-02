# Milestone 6 Submission Guide - Team B (SVSMC)

## Files Created

1. **TeamB-milestone6-combined.md** - Combined summary and access information (RECOMMENDED)
   - OR use separate files:
     - TeamB-milestone6-summary.md
     - TeamB-milestone6-access.md

2. **create-source-archive.sh** - Script to create source code zip file

3. **TeamB-milestone6-submission.txt** - Quick reference checklist

---

## Pre-Submission Checklist

### 1. Create Test Accounts
Before submission, create test accounts in your database:

```bash
# Option 1: Use the deployed application to create accounts
# Option 2: Use MongoDB Atlas to manually create test users
```

**Required test accounts:**
- Email: `instructor@acceptly.test`, Password: `Instructor123!`
- Email: `testuser@acceptly.test`, Password: `TestUser123!`

### 2. Verify Deployment
- [ ] Frontend is accessible at: https://csi-final-crz54vw9q-kadthalamanoj16-4032s-projects.vercel.app
- [ ] Backend is accessible at: https://acceptly-backend.onrender.com
- [ ] Test accounts can log in successfully
- [ ] All features are working (FA builder, AI hints, progress tracking)

### 3. Prepare Documents

**Option A: Combined Document (Recommended)**
- Convert `TeamB-milestone6-combined.md` to PDF
- Name it: `TeamB-milestone6.pdf`

**Option B: Separate Documents**
- Convert `TeamB-milestone6-summary.md` to PDF
- Convert `TeamB-milestone6-access.md` to PDF
- Name them: `TeamB-milestone6-summary.pdf` and `TeamB-milestone6-access.pdf`

**To convert Markdown to PDF:**
- Use online tools like: https://www.markdowntopdf.com/
- Or use Pandoc: `pandoc TeamB-milestone6-combined.md -o TeamB-milestone6.pdf`
- Or print to PDF from a markdown viewer

### 4. Create Source Code Archive

Run the archive script:

```bash
cd /Users/saimanojk/Desktop/CSI
./create-source-archive.sh
```

This will create `TeamB-milestone6-source.zip`

**Verify the archive:**
- Check that it contains: src/, server/, public/, package.json, etc.
- Verify it does NOT contain: node_modules/, .git/, build/, .env files
- File size should be reasonable (not too large)

### 5. Final File List

You should have:
- `TeamB-milestone6.pdf` (or separate summary/access PDFs)
- `TeamB-milestone6-source.zip`

---

## Submission Steps

1. **Go to Dropbox submission link:**
   https://www.dropbox.com/request/1cCNBTfUYDKOCN5J6YPX

2. **Upload files:**
   - Upload `TeamB-milestone6.pdf` (or separate PDFs)
   - Upload `TeamB-milestone6-source.zip`

3. **Verify submission:**
   - Dropbox will send a confirmation email
   - You can resubmit if needed (most recent version will be used)

4. **Prepare for Demo:**
   - Practice 5-10 minute demo (hard cutoff at 12 minutes)
   - Ensure all team members are present
   - Test on classroom computer if needed

---

## Demo Preparation

### Demo Outline (5-10 minutes)

1. **Introduction** (30 seconds)
   - Project name and purpose
   - Team members

2. **Live Demo** (6-8 minutes)
   - Show landing page and features
   - Demonstrate FA building
   - Show AI assistant in action
   - Display progress tracking
   - Show user authentication

3. **Technical Highlights** (1-2 minutes)
   - Tech stack overview
   - Deployment architecture
   - AI integration

4. **Q&A** (remaining time)

### Demo Tips
- Have the application open and ready
- Test all features before demo
- Have backup plan if internet is slow
- Practice transitions between features
- Be ready to explain technical decisions

---

## Important Notes

- **Deadline:** December 2, end of day
- **Naming Convention:** All files must start with "TeamB-milestone6"
- **File Format:** PDF for documents, ZIP for source code
- **Resubmission:** You can resubmit - most recent version will be used
- **Contact:** Be prepared to answer questions via email within 24 hours

---

## Troubleshooting

**If archive script fails:**
- Make sure you have zip installed: `which zip`
- Check file permissions: `chmod +x create-source-archive.sh`
- Manually create zip if needed

**If PDF conversion fails:**
- Submit markdown files directly (if allowed)
- Use online markdown to PDF converters
- Print markdown to PDF from browser

**If deployment is down:**
- Contact team immediately
- Have local setup instructions ready
- Provide alternative access method

---

## Good Luck! 🚀

