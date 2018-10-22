<?php

$starttime = microtime(true);

include_once dirname(__FILE__) . '/../common.php';
include_once dirname(__FILE__) . '/../classes/reports.php';

Log::append("Начато обновление списка раздач других хранителей...");

// получение настроек
if (!isset($cfg)) {
    $cfg = get_settings();
}

// проверка настроек
if (empty($cfg['tracker_login'])) {
    throw new Exception("Error: Не указано имя пользователя для доступа к форуму");
}

if (empty($cfg['tracker_paswd'])) {
    throw new Exception("Error: Не указан пароль пользователя для доступа к форуму");
}

// создаём временную таблицу
Db::query_database(
    "CREATE TEMP TABLE KeepersNew AS
    SELECT * FROM Keepers WHERE 0 = 1"
);

// подключаемся к форуму
if (!isset($reports)) {
    $reports = new Reports(
        $cfg['forum_url'],
        $cfg['tracker_login'],
        $cfg['tracker_paswd']
    );
}

// получаем данные
foreach ($cfg['subsections'] as $forum_id => $subsection) {

    $topic_id = $reports->search_topic_id($subsection['na']);

    if (empty($topic_id)) {
        Log::append("Error: Не удалось найти тему со списком для подраздела № $forum_id");
        continue;
    }

    Log::append("Сканирование подраздела № $forum_id...");

    $keepers = $reports->scanning_viewtopic($topic_id, true);

    if (!empty($keepers)) {
        $keepers = array_chunk($keepers, 500);
        foreach ($keepers as $keepers) {
            $select = Db::combine_set($keepers);
            Db::query_database("INSERT INTO temp.KeepersNew (id,nick) $select");
        }
    }
    unset($keepers);

}

// записываем изменения в локальную базу
$count_keepers = Db::query_database(
    "SELECT COUNT() FROM temp.KeepersNew",
    array(),
    true,
    PDO::FETCH_COLUMN
);

if ($count_keepers[0] > 0) {

    Log::append("Запись в базу данных списка раздач других хранителей...");

    Db::query_database("INSERT INTO Keepers SELECT * FROM temp.KeepersNew");

    Db::query_database(
        "DELETE FROM Keepers WHERE id NOT IN (
            SELECT Keepers.id FROM temp.KeepersNew LEFT JOIN Keepers
            ON temp.KeepersNew.id  = Keepers.id AND temp.KeepersNew.nick = Keepers.nick
            WHERE Keepers.id IS NOT NULL
        )"
    );

}

$endtime = microtime(true);

Log::append("Обновление списка раздач других хранителей завершено за " . convert_seconds($endtime - $starttime));
