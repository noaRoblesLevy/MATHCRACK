import json, os
out = r'C:\Users\noaro\MATHCRACK\src\content\reading'

chapters = [
# ── UNIT 6 ────────────────────────────────────────────────────────────
('ch-31-points_and_lines.json', {'id':'ch-31','chapterNumber':31,'unit':6,'unitTitle':'Graphing Linear Equations & Inequalities','title':'Points and Lines','pages':'248-254','blocks':[
  {'type':'definition','term':'Coordinate Plane','body':'A flat surface formed by two perpendicular number lines: the horizontal x-axis and vertical y-axis, intersecting at the origin (0, 0).'},
  {'type':'definition','term':'Ordered Pair','body':'A point written as (x, y) where x is the horizontal position and y is the vertical position. Example: (3, -2) means 3 right, 2 down from the origin.'},
  {'type':'rule','body':'The four quadrants: Quadrant I (+,+), Quadrant II (-,+), Quadrant III (-,-), Quadrant IV (+,-). Points on the axes are not in any quadrant.'},
  {'type':'rule','body':'To plot (x, y): start at the origin. Move right if x is positive (left if negative). Then move up if y is positive (down if negative). Mark the point.'},
  {'type':'example','label':'Examples','body':'Plot A(2,3): right 2, up 3. Plot B(-1,4): left 1, up 4. Plot C(0,-3): on y-axis, down 3.'},
  {'type':'note','body':'The x-coordinate is always listed first, the y-coordinate second. (3,5) and (5,3) are different points.'},
]}),
('ch-32-graphing_from_table.json', {'id':'ch-32','chapterNumber':32,'unit':6,'unitTitle':'Graphing Linear Equations & Inequalities','title':'Graphing a Line from a Table of Values','pages':'255-262','blocks':[
  {'type':'rule','body':'To graph a linear equation using a table: (1) Choose at least 3 x-values. (2) Substitute each into the equation to find y. (3) Plot the (x, y) pairs. (4) Draw a straight line through all points and extend with arrows.'},
  {'type':'example','label':'Example','body':'Graph y = 2x - 1. Table: x=-1 -> y=-3, x=0 -> y=-1, x=2 -> y=3. Plot (-1,-3), (0,-1), (2,3). Draw the line.'},
  {'type':'note','body':'Any two points determine a line, but plot a third to catch errors. If the three points are not collinear (on the same line), recheck your arithmetic.'},
  {'type':'definition','term':'x-intercept','body':'The point where the line crosses the x-axis (where y = 0). Set y = 0 and solve for x.'},
  {'type':'definition','term':'y-intercept','body':'The point where the line crosses the y-axis (where x = 0). Set x = 0 and solve for y. Easy to find — just substitute x = 0.'},
]}),
('ch-33-slope.json', {'id':'ch-33','chapterNumber':33,'unit':6,'unitTitle':'Graphing Linear Equations & Inequalities','title':'Slope of a Line','pages':'263-276','blocks':[
  {'type':'definition','term':'Slope','body':'The measure of steepness and direction of a line. Often called "rise over run." Formula: m = (y2 - y1) / (x2 - x1), where (x1,y1) and (x2,y2) are any two points on the line.'},
  {'type':'rule','body':'Positive slope: line rises from left to right. Negative slope: line falls from left to right. Zero slope: horizontal line. Undefined slope: vertical line (division by zero).'},
  {'type':'example','label':'Example 1','body':'Find slope of line through (2, 3) and (6, 11). m = (11-3)/(6-2) = 8/4 = 2.'},
  {'type':'example','label':'Example 2','body':'Find slope of line through (-1, 4) and (3, -2). m = (-2-4)/(3-(-1)) = -6/4 = -3/2.'},
  {'type':'rule','body':'Parallel lines have equal slopes. Perpendicular lines have slopes that are negative reciprocals of each other (m1 x m2 = -1). Example: slope 2/3 and slope -3/2 are perpendicular.'},
  {'type':'note','body':'Always subtract in the same order: (y2 - y1) and (x2 - x1). Do not mix up the order. Also, slope is the same no matter which two points you choose on the same line.'},
]}),
('ch-34-slope_intercept.json', {'id':'ch-34','chapterNumber':34,'unit':6,'unitTitle':'Graphing Linear Equations & Inequalities','title':'Slope-Intercept Form','pages':'277-288','blocks':[
  {'type':'definition','term':'Slope-Intercept Form','body':'y = mx + b, where m is the slope and b is the y-intercept (the y-value where the line crosses the y-axis).'},
  {'type':'rule','body':'To graph y = mx + b: (1) Plot the y-intercept (0, b). (2) Use the slope m = rise/run to find the next point. (3) Draw the line through both points.'},
  {'type':'example','label':'Example 1','body':'Graph y = (2/3)x - 4. y-intercept: (0, -4). Slope 2/3 means up 2, right 3: next point is (3, -2). Draw the line.'},
  {'type':'rule','body':'To write the equation from slope and y-intercept: substitute m and b directly into y = mx + b. Example: slope = -1/2, y-intercept = 3. Equation: y = -1/2 x + 3.'},
  {'type':'example','label':'Example 2','body':'Write equation of line with slope 4 passing through (0, -7). y = 4x - 7.'},
  {'type':'note','body':'Any linear equation can be rewritten in slope-intercept form by solving for y. Example: 3x + 2y = 8 -> 2y = -3x + 8 -> y = -3/2 x + 4. Now slope = -3/2, y-intercept = 4.'},
]}),
('ch-35-point_slope.json', {'id':'ch-35','chapterNumber':35,'unit':6,'unitTitle':'Graphing Linear Equations & Inequalities','title':'Point-Slope Form','pages':'289-298','blocks':[
  {'type':'definition','term':'Point-Slope Form','body':'y - y1 = m(x - x1), where m is the slope and (x1, y1) is a known point on the line. Useful when you know the slope and one point.'},
  {'type':'example','label':'Example 1','body':'Write the equation of a line with slope 3 passing through (2, 5). y - 5 = 3(x - 2). Can also write in slope-intercept: y = 3x - 1.'},
  {'type':'example','label':'Example 2','body':'Write the equation of the line through (-1, 4) and (3, -4). Slope = (-4-4)/(3-(-1)) = -8/4 = -2. y - 4 = -2(x - (-1)) -> y - 4 = -2(x + 1) -> y = -2x + 2.'},
  {'type':'rule','body':'To write the equation of a line through two points: (1) Find slope using m = (y2-y1)/(x2-x1). (2) Use point-slope form with either point. (3) Simplify to slope-intercept if needed.'},
  {'type':'note','body':'All three forms (standard, slope-intercept, point-slope) represent the same line. Choosing which form to use depends on what information is given.'},
]}),
('ch-36-systems_graphing.json', {'id':'ch-36','chapterNumber':36,'unit':6,'unitTitle':'Graphing Linear Equations & Inequalities','title':'Solving Systems by Graphing','pages':'299-306','blocks':[
  {'type':'rule','body':'To solve a system by graphing: (1) Graph both lines on the same coordinate plane. (2) Find the intersection point. (3) The coordinates of the intersection are the solution.'},
  {'type':'example','label':'Example','body':'Solve: y = x + 1 and y = -x + 5. Graph both. Line 1 has slope 1, y-int 1. Line 2 has slope -1, y-int 5. They intersect at (2, 3). Solution: (2, 3). Check: 3 = 2+1 ✓ and 3 = -2+5 ✓.'},
  {'type':'rule','body':'Parallel lines (same slope, different y-intercepts) never intersect — no solution. Same line (identical equations) — infinitely many solutions.'},
  {'type':'note','body':'Graphing gives approximate solutions and is useful for visualizing the system. For exact answers, use substitution or elimination. Graphing is most reliable when the intersection is at integer coordinates.'},
]}),
('ch-37-graphing_inequalities.json', {'id':'ch-37','chapterNumber':37,'unit':6,'unitTitle':'Graphing Linear Equations & Inequalities','title':'Graphing Linear Inequalities','pages':'307-314','blocks':[
  {'type':'rule','body':'To graph a linear inequality: (1) Replace the inequality with "=" and graph the boundary line. (2) Use a SOLID line for >= or <=. Use a DASHED line for > or <. (3) Test a point (usually the origin) — if it satisfies the inequality, shade that side. If not, shade the other side.'},
  {'type':'example','label':'Example 1','body':'Graph y > 2x - 3. Draw dashed line y = 2x - 3. Test (0,0): 0 > -3? Yes. Shade above the line.'},
  {'type':'example','label':'Example 2','body':'Graph y <= -x + 4. Draw solid line y = -x + 4. Test (0,0): 0 <= 4? Yes. Shade below the line (including the line itself).'},
  {'type':'note','body':'The shaded region is the solution set — every point in it satisfies the inequality. Points on a dashed boundary line are NOT solutions.'},
]}),
('ch-38-systems_inequalities.json', {'id':'ch-38','chapterNumber':38,'unit':6,'unitTitle':'Graphing Linear Equations & Inequalities','title':'Solving Systems of Inequalities by Graphing','pages':'315-324','blocks':[
  {'type':'text','body':'The solution to a system of linear inequalities is the region where the shading from all inequalities overlaps.'},
  {'type':'rule','body':'To solve a system of inequalities by graphing: (1) Graph each inequality on the same plane (with correct line type and shading). (2) Identify the overlapping shaded region. (3) This region is the solution set.'},
  {'type':'example','label':'Example','body':'Graph the system: y > x - 2 and y <= 3. Draw dashed line y = x - 2, shade above it. Draw solid line y = 3, shade below it. The solution is the overlap: above y = x - 2 AND below (or on) y = 3.'},
  {'type':'note','body':'If there is no overlapping region, the system has no solution. Check by picking a test point — it must satisfy ALL inequalities in the system simultaneously.'},
]}),
# ── UNIT 7 ────────────────────────────────────────────────────────────
('ch-39-intro_statistics.json', {'id':'ch-39','chapterNumber':39,'unit':7,'unitTitle':'Statistics & Probability','title':'Introduction to Statistics','pages':'326-334','blocks':[
  {'type':'definition','term':'Statistics','body':'The science of collecting, organizing, analyzing, and interpreting data.'},
  {'type':'definition','term':'Data','body':'Information, often numerical, collected through observation or measurement.'},
  {'type':'definition','term':'Population vs Sample','body':'A population is the entire group being studied. A sample is a subset of the population, used when studying the whole population is impractical. A random sample gives each member an equal chance of being chosen.'},
  {'type':'definition','term':'Categorical Data','body':'Data that falls into named groups or categories. Example: favorite color, type of pet.'},
  {'type':'definition','term':'Numerical Data','body':'Data that is measured or counted. Discrete: countable (number of siblings). Continuous: any value in a range (height, weight).'},
  {'type':'note','body':'A biased sample does not represent the population well. Example: surveying only students in the math club about math opinions would over-represent math enthusiasts.'},
]}),
('ch-40-central_tendency.json', {'id':'ch-40','chapterNumber':40,'unit':7,'unitTitle':'Statistics & Probability','title':'Measures of Central Tendency and Variation','pages':'335-342','blocks':[
  {'type':'definition','term':'Mean','body':'The average. Sum all values and divide by the count. Example: mean of 3, 7, 8, 2, 5 = (3+7+8+2+5)/5 = 25/5 = 5.'},
  {'type':'definition','term':'Median','body':'The middle value when data is ordered. If there is an even count, the median is the average of the two middle values. Example: median of 2, 3, 5, 7, 8 = 5. Median of 2, 3, 7, 8 = (3+7)/2 = 5.'},
  {'type':'definition','term':'Mode','body':'The value that appears most often. A data set can have one mode, multiple modes, or no mode. Example: in 1, 2, 2, 3, 4, 4, 4, the mode is 4.'},
  {'type':'definition','term':'Range','body':'The difference between the maximum and minimum values. Measures spread. Example: range of 2, 5, 9, 14 = 14 - 2 = 12.'},
  {'type':'note','body':'Use the mean when data has no extreme outliers. Use the median when there are outliers (very large or small values that skew the mean). Use the mode for categorical data or to find the most common item.'},
]}),
('ch-41-displaying_data.json', {'id':'ch-41','chapterNumber':41,'unit':7,'unitTitle':'Statistics & Probability','title':'Displaying Data','pages':'343-362','blocks':[
  {'type':'definition','term':'Dot Plot','body':'A number line with dots above values showing their frequency. Good for small data sets.'},
  {'type':'definition','term':'Histogram','body':'A bar graph where bars represent frequency of data in equal-width intervals (bins). Bars touch each other. Good for large data sets.'},
  {'type':'definition','term':'Box Plot (Box-and-Whisker)','body':'Shows five-number summary: minimum, Q1 (first quartile = 25th percentile), median, Q3 (third quartile = 75th percentile), and maximum. The box spans Q1 to Q3 (the Interquartile Range, IQR).'},
  {'type':'definition','term':'Stem-and-Leaf Plot','body':'Displays individual data values using stems (tens digit) and leaves (ones digit). Example: 34, 37, 42 -> stem 3 leaves 4,7 and stem 4 leaf 2.'},
  {'type':'rule','body':'IQR = Q3 - Q1. The IQR measures the middle 50% of data. An outlier is typically a value more than 1.5 x IQR below Q1 or above Q3.'},
  {'type':'note','body':'Choose the display that best suits your data and question. Histograms show distribution shape. Box plots compare groups. Scatter plots show relationships between two variables.'},
]}),
('ch-42-probability.json', {'id':'ch-42','chapterNumber':42,'unit':7,'unitTitle':'Statistics & Probability','title':'Probability','pages':'363-374','blocks':[
  {'type':'definition','term':'Probability','body':'A number between 0 and 1 (or 0% and 100%) that measures how likely an event is to occur. P = 0 means impossible, P = 1 means certain.'},
  {'type':'rule','body':'Theoretical Probability: P(event) = (number of favorable outcomes) / (total number of equally likely outcomes). Example: P(rolling a 3 on a die) = 1/6.'},
  {'type':'rule','body':'Experimental Probability: P(event) = (number of times event occurred) / (total number of trials). Based on actual results rather than theory.'},
  {'type':'definition','term':'Complement','body':'The complement of event A is "not A" — all outcomes that are not A. P(not A) = 1 - P(A). Example: P(not rolling a 3) = 1 - 1/6 = 5/6.'},
  {'type':'example','label':'Example','body':'A bag has 3 red, 5 blue, 2 green marbles. P(blue) = 5/10 = 1/2. P(not blue) = 1 - 1/2 = 1/2. P(red or green) = 5/10 = 1/2.'},
  {'type':'note','body':'All probabilities in a sample space sum to 1. The sample space is the set of all possible outcomes.'},
]}),
('ch-43-compound_events.json', {'id':'ch-43','chapterNumber':43,'unit':7,'unitTitle':'Statistics & Probability','title':'Compound Events','pages':'375-384','blocks':[
  {'type':'definition','term':'Independent Events','body':'Two events where the outcome of one does not affect the other. Example: flipping a coin and rolling a die.'},
  {'type':'rule','body':'Multiplication Rule for Independent Events: P(A and B) = P(A) x P(B). Example: P(heads and rolling a 6) = 1/2 x 1/6 = 1/12.'},
  {'type':'definition','term':'Dependent Events','body':'Two events where the outcome of the first affects the probability of the second. Example: drawing cards without replacement.'},
  {'type':'rule','body':'For dependent events: P(A and B) = P(A) x P(B given A has occurred). Example: P(drawing two aces from a deck without replacement) = 4/52 x 3/51 = 12/2652 = 1/221.'},
  {'type':'rule','body':'Addition Rule: P(A or B) = P(A) + P(B) - P(A and B). If A and B are mutually exclusive (cannot both occur), P(A or B) = P(A) + P(B).'},
  {'type':'note','body':'Mutually exclusive events cannot happen at the same time. Rolling a 3 and rolling a 5 are mutually exclusive. Drawing a heart and drawing a face card are NOT mutually exclusive (Jack of hearts).'},
]}),
('ch-44-permutations_combinations.json', {'id':'ch-44','chapterNumber':44,'unit':7,'unitTitle':'Statistics & Probability','title':'Permutations and Combinations','pages':'385-394','blocks':[
  {'type':'definition','term':'Fundamental Counting Principle','body':'If one event has m outcomes and a second has n outcomes, together they have m x n outcomes. Extend to any number of events. Example: 3 shirts and 4 pants = 12 outfits.'},
  {'type':'definition','term':'Permutation','body':'An arrangement of items where ORDER matters. Formula: nPr = n! / (n-r)!. Example: how many ways to arrange 3 of 5 books? 5P3 = 5!/2! = 60.'},
  {'type':'definition','term':'Combination','body':'A selection of items where ORDER does NOT matter. Formula: nCr = n! / (r!(n-r)!). Example: choosing 3 students from 5 for a committee: 5C3 = 10.'},
  {'type':'example','label':'Example 1','body':'How many 3-digit PINs using digits 1-9 without repetition? Order matters -> permutation. 9P3 = 9 x 8 x 7 = 504.'},
  {'type':'example','label':'Example 2','body':'How many ways to choose 2 toppings from 8? Order does not matter -> combination. 8C2 = (8 x 7)/(2 x 1) = 28.'},
  {'type':'note','body':'Key question: does order matter? If rearranging gives a different outcome (like different PINs), use permutations. If rearranging gives the same thing (like same pizza toppings), use combinations.'},
]}),
# ── UNIT 8 ────────────────────────────────────────────────────────────
('ch-45-relations_functions.json', {'id':'ch-45','chapterNumber':45,'unit':8,'unitTitle':'Functions','title':'Relations and Functions','pages':'396-406','blocks':[
  {'type':'definition','term':'Relation','body':'Any set of ordered pairs (x, y). The domain is the set of all x-values (inputs). The range is the set of all y-values (outputs).'},
  {'type':'definition','term':'Function','body':'A relation where each input (x-value) maps to exactly ONE output (y-value). Every x has one and only one y.'},
  {'type':'rule','body':'Vertical Line Test: A graph represents a function if and only if no vertical line passes through it more than once. A circle fails the test; a parabola opening up or down passes it.'},
  {'type':'example','label':'Example','body':'Is {(1,2),(3,4),(5,2)} a function? Yes — each x-value (1, 3, 5) appears only once. Is {(1,2),(1,3),(2,4)} a function? No — x=1 maps to both 2 and 3.'},
  {'type':'note','body':'The same y-value CAN appear more than once (multiple x-values can give the same output). Only x-values must be unique. Example: f(x) = x^2 gives f(2) = f(-2) = 4, which is fine.'},
]}),
('ch-46-function_notation.json', {'id':'ch-46','chapterNumber':46,'unit':8,'unitTitle':'Functions','title':'Function Notation','pages':'407-414','blocks':[
  {'type':'definition','term':'Function Notation','body':'f(x) (read "f of x") is a way of naming functions. It means the output of function f when the input is x. f(x) is the same as y.'},
  {'type':'rule','body':'To evaluate f(a): substitute a for every x in the function formula. Example: if f(x) = 3x - 2, then f(5) = 3(5) - 2 = 13. f(-1) = 3(-1) - 2 = -5.'},
  {'type':'example','label':'Example 1','body':'f(x) = x^2 + 2x. Find f(3): f(3) = 9 + 6 = 15. Find f(-2): f(-2) = 4 + (-4) = 0.'},
  {'type':'example','label':'Example 2','body':'g(x) = 2x + 1. Find g(a + 1): g(a+1) = 2(a+1) + 1 = 2a + 2 + 1 = 2a + 3.'},
  {'type':'note','body':'f(x), g(x), h(x) are all common names for functions, but you can use any letter. The letter in parentheses is always the input variable.'},
]}),
('ch-47-application_functions.json', {'id':'ch-47','chapterNumber':47,'unit':8,'unitTitle':'Functions','title':'Application of Functions','pages':'415-426','blocks':[
  {'type':'text','body':'Functions model real-world relationships where one quantity depends on another. The input is the independent variable; the output is the dependent variable.'},
  {'type':'example','label':'Example 1','body':'A car travels at 60 mph. Distance d as a function of time t: d(t) = 60t. Find distance after 2.5 hours: d(2.5) = 150 miles.'},
  {'type':'example','label':'Example 2','body':'A plumber charges $80 plus $50 per hour. Cost as a function of hours h: C(h) = 50h + 80. C(3) = 150 + 80 = $230.'},
  {'type':'rule','body':'Linear functions have the form f(x) = mx + b (constant rate of change). The graph is a straight line. Rate of change = slope = m.'},
  {'type':'note','body':'Always check the domain in context. For the plumber example, h >= 0 (negative hours make no sense). The domain is restricted by real-world constraints.'},
]}),
]

for fname, data in chapters:
    path = os.path.join(out, fname)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f'  {fname}: {len(data["blocks"])} blocks')
print('Done.')
