function sort(a, b){
	   	var colA = a.x;
	    var colB = b.x;
	   	var rowA = a.y;
	    var rowB = b.y;

	    // Sort by row
	    if (colA < colB) {
			return -1;
		}
	    if (colB < colA) {
			return 1;
		}
		
		if (rowA > rowB) return -1;
		if (rowB > rowA) return 1;


		return 0; //same exact point should actually be impossible

}

var array = [
	{x:1,y:2},
	{x:1,y:100},
	{x:1,y:1},
	{x:5,y:6},
	{x:3,y:4},
	{x:8,y:9},
	{x:12,y:11}
];

array = array.sort(sort);

console.log(array);