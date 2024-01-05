# Instructions

- To get the solution for a specific date, for example "Sat, Jan 7", simply type "node requestDate.js sat jan 7" in the root directory of this repo
- To verify that all dates are possible, simply type "node calendarPuzzleSolver.js" in the root directory of this repo

## Requirements

Must have nodejs installed (recommended >= v18.14.0)

### Notes

Program is single-threaded, and verification program will take multiple hours to run, varying depending on CPU capability.
The single-date program will generally only take a few minutes. The worst case scenario would be an hour. Depends greatly on CPU capability.

### Expected output

Verification program should prove that every possible date (specifically, every combination of 1 Month, 1 Weekday, 1 Date) is possible to achieve.

The single date program should output the target date upon startup, and the progress (relative to the worst-case scenario) in realtime.
Once it finds the solution, it will output the runtime (in m:ss.mmm format), the date, and the solution. Example console output should look like this:

```
{ weekdayTarget: 'Fri', monthTarget: 'Jan', dateTarget: 6 }
Worst-case scenario progress: 0.02953%
Worst-case scenario progress: 0.05907%
...
...
...
Worst-case scenario progress: 3.66257%
Runtime: 3:17.988 (m:ss.mmm)
Got day: { weekday: 'Fri', month: 'Jan', day: 6 }
Solution:
[
'Jan, -8-, -5-, -5-, -5-, -5-, ___',
'-8-, -8-, -5-, -Y-, -Y-, -Y-, ___',
'-8-, -7-, -7-, -Y-, -Y-, 6 , -4-',
'-3-, -3-, -7-, -7-, -7-, -2-, -4-',
'-9-, -3-, -6-, -6-, -6-, -2-, -4-',
'-9-, -3-, -3-, -6-, -2-, -2-, -4-',
'-9-, -9-, -9-, -6-, -1-, -1-, -1-',
'___, ___, ___, ___, -1-, Fri, -1-'
]
```
