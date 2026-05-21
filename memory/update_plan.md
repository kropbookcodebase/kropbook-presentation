# Kropbook Website Update Plan

## Overview
Update the Kropbook Agritech website based on the latest information in the Guidelines directory.

## Files to Review
- Guidelines/01_company_overview.md
- Guidelines/02_directors_shareholding.md  
- Guidelines/03_financials_FY2022-23.md
- Guidelines/04_financials_FY2023-24.md
- Guidelines/05_financials_FY2024-25.md

## Target HTML Files
All files in /html/ directory:
- business-operations.html
- clients.html
- corporate-profile.html
- finance.html
- financial-statements.html
- founder.html
- funding.html
- governance.html
- kropbook.html
- overview.html
- strategic-qa.html
- systems.html
- team.html
- troporganic.html

## Updates Needed

### 1. Corporate Information Updates
From 01_company_overview.md:
- Update company details (CIN, PAN, GSTIN, incorporation date)
- Update revenue streams description
- Update startup recognition certificate info
- Update Section 80-IAC certificate details
- Update auditor information

### 2. Director & Shareholding Updates
From 02_directors_shareholding.md:
- Update current board of directors (Kunal Pingle, Kiran Avhad)
- Update shareholding pattern (especially the 0.00% for Manoj Avhad, 91% for Kunal, 9% for Kiran as of March 2025)
- Update key managerial personnel
- Update related party transactions/director loans

### 3. Financial Updates
From financials guidelines:
- Update revenue figures across pages
- Update profit figures
- Update balance sheet items where displayed
- Update key financial ratios
- Update year-over-year growth percentages

### 4. Specific Page Updates

#### overview.html
- Already shows some FY 2024-25 financials (₹59.18 Cr revenue, ₹7.80 Cr profit)
- May need to update provisional FY 2025-26 figures if available
- Check if metrics need updating based on latest guidelines

#### corporate-profile.html
- Already shows CIN, incorporation date, recognition
- Should verify financial metrics match latest guidelines
- Director images and bios may need verification

#### finance.html / financial-statements.html
- Likely need most updates with detailed financial tables
- Should reflect latest audited figures from FY 2024-25

#### governance.html
- Should update with latest certificates, compliance info
- Director information from guidelines

#### kropbook.html
- Technology & data layer information
- May need updates based on revenue streams and operations

## Implementation Approach
1. Review each guideline file to extract key updated information
2. Compare with current HTML content
3. Update HTML files with new information while maintaining existing structure and styling
4. Ensure all financial figures are consistent across pages
5. Update director information consistently
6. Preserve existing animations, classes, and JS interactions

## Files to Create/Update in Memory
- update_plan.md (this file)
- Potentially extract specific data points to memory for easy reference

## Dependencies
- Must follow .ai-rules/PROJECT_RULES.md before making changes
- No frameworks, package workflows, external runtime services, or inline CSS/JS allowed
- Keep local-first static approach: active pages in html/, styles in css/, scripts in js/