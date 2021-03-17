<!DOCTYPE html>

<html>

<head>
	<?php 
		$root = $_SERVER["DOCUMENT_ROOT"];
		include($root . "/modules/head.php");
	?>
	<script data-main="init.js" src="require.js"></script>

</head>
<body>
	<?php 
		include($root . "/modules/topbar.php");
	?>
	<canvas id="gameCanvas" width="1200" height="750" style="margin-top: 25px; border: 1px solid #000; z-index: 2;">
	</canvas>
	<p class="genericContainer" style="width: max-content; margin: 5px auto; padding: 15px;">A,S = Rotate		Space = Motor On       LMB = Fire</p>

	

</body>
</html>