<?php 

$result = array(
	array(
		"checkin" => "2021-04-06",
		"checkout" => "2021-04-09",
		"title" => "Matteo Bleve"
	),
	array(
		"checkin" => "2021-04-23",
		"checkout" => "2021-04-25",
		"title" => "Luca Orlando"
	),
	array(
		"checkin" => "2021-04-05",
		"checkout" => "2021-04-06",
		"title" => "Giacomo Pinna"
	)
);

echo json_encode($result);
