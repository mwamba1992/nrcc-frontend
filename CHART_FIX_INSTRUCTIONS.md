# Chart Not Showing - Fix Instructions

## Issue
The "Applications Trend (Last 6 Months)" chart and other data visualizations show skeleton loaders but don't render the actual charts.

## Root Cause
The Chart.js component wasn't detecting when data changed after the initial view render. Fixed by adding `OnChanges` lifecycle hook.

## Fix Applied
✅ Added `OnChanges` hook to `LineChartComponent`
✅ Chart now recreates when data input changes
✅ Added data validation before rendering
✅ Added console logging for debugging

## How to See the Charts

### Step 1: Restart the Development Server
The Angular dev server needs to be restarted to pick up all the changes:

```bash
# Stop the current server (Ctrl+C in terminal, or)
pkill -f "ng serve"

# Start fresh
npm start
```

### Step 2: Hard Refresh Your Browser
After server restarts (wait for "Application bundle generation complete"):

**Windows/Linux:**
- Press `Ctrl + Shift + R` or `Ctrl + F5`

**Mac:**
- Press `Cmd + Shift + R`

### Step 3: Check Console for Logs
Open browser DevTools (F12) and look for these console messages:
```
Loading dashboard data...
Data loaded, setting stats...
Chart data: {labels: Array(6), datasets: Array(3)}
Setting isLoading to false
```

## What You Should See

### Reviewer Dashboard (http://localhost:4200/reviewer/dashboard)

**After 0.8 seconds of skeleton loaders, you should see:**

1. **Stats Cards** (top row):
   - Pending Review: **23** (+12% this month)
   - Approved This Month: **45** (+15% this month)
   - Reviewed This Month: **67** (+8% this month)
   - Total Applications: **135**

2. **Performance Metrics** (second row):
   - Avg Review Time: **2.3 days**
   - SLA Compliance: **94%** (with green progress bar)

3. **Applications Trend Chart** (bottom left):
   - Interactive line chart with 3 datasets
   - Labels: Jan, Feb, Mar, Apr, May, Jun
   - Lines: Approved (green), Reviewed (orange), Pending (blue)
   - Hover to see tooltips

4. **Recent Activity Timeline** (bottom right):
   - 5 recent activities with color-coded icons
   - Time stamps (e.g., "30 minutes ago")
   - User names and descriptions

5. **Notification Bell** (top right header):
   - Red badge showing **2** unread notifications
   - Click to see dropdown with notifications

### Applicant Dashboard (http://localhost:4200/applicant/dashboard)

**After 0.6 seconds, you should see:**

1. **Stats Cards**:
   - Total Applications: **8** (+20% from last month)
   - Amount Paid: **TZS 450,000**
   - Approved: **3** (+15% success rate)
   - In Review: **2**

2. **Application History Chart**:
   - Line chart comparing Submitted vs Approved
   - 6-month trend data

3. **Recent Activity Timeline**:
   - Your application submissions
   - Review updates
   - Document uploads

## Troubleshooting

### If Charts Still Don't Show:

1. **Check Console Errors:**
   ```javascript
   // Open browser console (F12)
   // Look for any red errors
   ```

2. **Verify Data is Loading:**
   ```javascript
   // You should see these console logs:
   "Loading dashboard data..."
   "Data loaded, setting stats..."
   "Chart data: ..." // Should have labels and datasets
   "Setting isLoading to false"
   ```

3. **Check Chart.js is Loaded:**
   ```javascript
   // In browser console, type:
   Chart
   // Should return Chart constructor, not undefined
   ```

4. **Verify Canvas Element Exists:**
   ```javascript
   // In browser console:
   document.querySelector('canvas')
   // Should return the canvas element
   ```

5. **Check Network Tab:**
   - Open DevTools → Network tab
   - Look for any failed requests (red items)
   - Check if chart.js is loaded successfully

### Common Issues:

**Issue**: Skeleton loaders stay forever
- **Cause**: `isLoading` not being set to `false`
- **Fix**: Check console for errors in setTimeout

**Issue**: Data shows but no chart
- **Cause**: Chart.js not registered or canvas not found
- **Fix**: Verify Chart.register(...registerables) in line-chart.ts:5

**Issue**: Chart appears then disappears
- **Cause**: Multiple chart instances or destroyed chart
- **Fix**: Check ngOnDestroy is properly cleaning up

**Issue**: Chart is tiny or stretched
- **Cause**: CSS height not applied or responsive issues
- **Fix**: Check chart-wrapper has proper height style

## Alternative: Use Build Instead of Serve

If development server has issues:

```bash
# Build the project
npm run build

# Serve the built files
npx http-server dist/nrcc-system/browser -p 4200
```

## Verification Checklist

After following steps above, verify:

- [ ] Stats cards show numbers (not 0)
- [ ] Trend indicators show percentages
- [ ] Charts render with colored lines
- [ ] Chart tooltips appear on hover
- [ ] Activity timeline shows events with icons
- [ ] Notification bell has badge with count
- [ ] No errors in browser console
- [ ] Page loads in < 1 second after initial load

## Files Changed in Fix

```
src/app/shared/components/line-chart/line-chart.ts
  - Added OnChanges, OnDestroy imports
  - Implemented ngOnChanges method
  - Added data validation in createChart
  - Added viewInitialized flag

src/app/features/reviewer/dashboard/reviewer-dashboard.ts
  - Added console.log for debugging
  - Reduced timeout from 1500ms to 800ms

src/app/features/applicant/dashboard/applicant-dashboard.ts
  - Reduced timeout from 1200ms to 600ms
```

## Next Steps

After verifying charts work:

1. **Remove Console Logs** (for production):
   - Comment out console.log statements
   - Or use environment-based logging

2. **Connect Real APIs**:
   - Replace setTimeout with actual HTTP calls
   - Update mock data with real endpoints

3. **Performance Testing**:
   - Test with large datasets
   - Verify chart responsiveness
   - Check memory leaks

## Support

If issues persist after following all steps:
1. Check `DASHBOARD_MODERNIZATION.md` for full documentation
2. Review commit: `f9496b4 - fix: Add OnChanges lifecycle hook`
3. Compare your code with the repository

---

**Last Updated**: 2026-01-06
**Fix Commit**: f9496b4
