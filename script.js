var ticTacRef;
var IDs;
var mySymbol;
// $scope.xTurn= 'X';
angular.module("coolio", ["firebase"])
 .controller("gameBoardCtrl", function($scope, $firebase){
 	
 	ticTacRef = new Firebase("https://rshtictactoe.firebaseio.com/");
 	$scope.fbRoot = $firebase(ticTacRef);

 	// Wait until everything really is loaded
 	$scope.fbRoot.$on("loaded", function() 
 	{
		IDs = $scope.fbRoot.$getIndex();
		if(IDs.length == 0)
		{
			// What???  No Board????  Let's build one.
			$scope.fbRoot.$add( { gameBoard: [["","",""],["","",""],["","",""]], xTurn:true, row:0, gameOver:false, turnCounter: 0} );


			$scope.fbRoot.$on("change", function() {
				IDs = $scope.fbRoot.$getIndex();
				$scope.obj = $scope.fbRoot.$child(IDs[0]);
			});
		}
		else
		{
			$scope.obj = $scope.fbRoot.$child(IDs[0]);
		}
	});


	$scope.takeTurn = function (row, column)
	{
		if($scope.obj.gameBoard[row][column]=='' && $scope.obj.gameOver == false)
		{
			$scope.obj.xTurn=($scope.obj.xTurn=='X' ? 'O' : 'X');
			$scope.obj.gameBoard[row][column]=$scope.obj.xTurn;
			$scope.obj.turnCounter ++;
			$scope.obj.$save();
		}
		else if($scope.obj.gameOver == true)
			alert("No more move allowed");

		if ($scope.obj.turnCounter > 4)
		{
			$scope.checkWin();
		}

	};

		
	$scope.reset = function()
	 {
		$scope.obj.gameBoard = [['','',''],['','',''],['','','']];
		$scope.obj.xTurn = 'X'
	 };
	

	function checkRow(row) 
	{
		return $scope.obj.gameBoard[row][0] == $scope.obj.gameBoard[row][1] && $scope.obj.gameBoard[row][0] == $scope.obj.gameBoard[row][2] && $scope.obj.gameBoard[row][0] != '';
	}

	function checkColumn(cell)
	{
		return $scope.obj.gameBoard[0][cell] == $scope.obj.gameBoard[1][cell] && $scope.obj.gameBoard[0][cell] == $scope.obj.gameBoard[2][cell] && $scope.obj.gameBoard[0][cell] != '';
	}		

	function checkDiag1()
	{
		return $scope.obj.gameBoard[0][0] == $scope.obj.gameBoard[1][1] && $scope.obj.gameBoard[0][0] == $scope.obj.gameBoard[2][2] && $scope.obj.gameBoard[0][0] != '';
	}	

	function checkDiag2()
	{
		return $scope.obj.gameBoard[0][2] == $scope.obj.gameBoard[1][1] && $scope.obj.gameBoard[0][2] == $scope.obj.gameBoard[2][0] && $scope.obj.gameBoard[0][2] != '';
	}

	

	$scope.checkWin = function() 
	{
		$scope.obj.winAry = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
	
	 	for (var row = 0; row < $scope.obj.gameBoard.length; row++) 
	 	{ 
	 		for (var cell = 0; cell < $scope.obj.gameBoard[row].length;cell++) 

	 		{
	 	
	 			if (checkRow(row) || checkColumn(row) || checkDiag1() || checkDiag2()) 
	 			{
					if($scope.obj.gameOver == false)
						alert("Winner");
					// $scope.winner = "WINNER!";
					$scope.obj.gameOver = true;
					$scope.obj.$save();

					return true;
				}
			}
		}
		return false;

	};


});


