<?php

$data = [
    [1, 'One', 'First item'],
    [2, 'Two', 'Second item'],
    [3, 'Three', 'Third item'],
    [4, 'Four', 'Fourth item'],
    [5, 'Five', 'Fifth item'],
    [6, 'Six', 'Sixth item'],
    [7, 'Seven', 'Seventh item'],
    [8, 'Eight', 'Eight item'],
    [9, 'Nine', 'Ninth item'],
    [10, 'Ten', 'Tenth item'],
    [11, 'Eleven', 'Eleventh item'],
    [12, 'Twelve', 'Twelfth item'],
    [13, 'Thirteen', 'Thirteenth item'],
    [14, 'Fourteen', 'Fourteenth item'],
    [15, 'Fifteen', 'Fifteenth item'],
    [16, 'Sixteen', 'Sixteenth item'],
];

$dataFields = ['id', 'name', 'description'];

$totalCount = count($data);

$start = array_key_exists('start', $_GET) ? $_GET['start'] : 0;
$limit = array_key_exists('limit', $_GET) ? $_GET['limit'] : 5;
if (array_key_exists('filter', $_GET)) {
    $filters = json_decode($_GET['filter'], true);
    $data    = array_filter(
        $data,
        function ($dataItem) use ($filters, $dataFields) {
            $isMatch = true;

            foreach ($filters as $filter) {
                $fieldValue = $dataItem[array_flip($dataFields)[$filter['property']]];
                if ($filter['operator'] === 'like') {
                    $isMatch = $isMatch && (bool) strstr($fieldValue, $filter['value']);
                } else {
                    $isMatch = $isMatch && ($fieldValue === $filter['value']);
                }
            }

            return $isMatch;
        }
    );
}

$numbers = $data;

if (array_key_exists('sort', $_GET)) {
    $sorters = json_decode($_GET['sort'], true);

    $sort = $sorters[0];
    $dir  = ($sort['direction'] === 'DESC') ? SORT_DESC : SORT_ASC;

    $sortList = [];

    foreach ($numbers as $key => $row) {
        $sortList[$key] = $row[array_flip($dataFields)[$sort['property']]];
    }

    array_multisort($sortList, $dir, $numbers);
}

$numbers = array_splice($numbers, $start, $limit);

$response = [
    'numbers'    => $numbers,
    'totalCount' => count($data),
];

echo json_encode($response) . PHP_EOL;
