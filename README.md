# Webová vzdělávací real-time trivia game Egghead

## Bakalářská práce pro LS 2023 - Autor Marek Vaníček

Představuji vám EggHead Trivia hru, webovou aplikaci založenou na technologiích React, Node.js, Express a Socket.IO. Trivia Battle je real-time hra pro více hráčů, která slouží jako nástroj k motivaci studentů k získávání nových znalostí. Tato aplikace je vaším prvním projektem využívajícím těchto technologií, a tak si vyzkoušíte práci s různými nástroji a frameworky.

Trivia Battle poskytuje uživatelům možnost zlepšit své znalosti prostřednictvím soutěže s ostatními hráči. Při vstupu do aplikace se hráči mohou přihlásit pomocí svých údajů nebo si vytvořit nový účet. Pro autentizaci je využívána technologie JWT (JSON Web Token), která zajišťuje bezpečnost a ochranu dat.

Po přihlášení hráči mohou vybrat z různých kategorií otázek, například věda, historie, sport atd. Aplikace obsahuje rozsáhlou knihovnu otázek, které jsou dynamicky načítány z databáze. Pro komunikaci se serverem je používáno REST API postavené na frameworku Express, které zajišťuje plynulý přenos dat mezi klientem a serverem.

Samotná hra probíhá v reálném čase díky použití Socket.IO, což umožňuje synchronizaci akcí mezi všemi hráči. Hráči jsou rozděleni do her s několika účastníky, kde se každý snaží odpovědět na otázky co nejrychleji a správně. Každý hráč vidí svůj aktuální skóre i skóre ostatních hráčů v dané hře. Vítěz je určen na základě nejvyššího skóre na konci hry.

Pro vytvoření uživatelského rozhraní je použit framework React, který zajišťuje efektivní a přehledný vývoj uživatelských komponent. Pro vzhled a responzivitu aplikace je použita knihovna React Bootstrap, která poskytuje sadu předdefinovaných komponent a stylů.

Komunikace se serverem a získávání dat z databáze je realizováno pomocí knihovny Axios, která zajišťuje jednoduché a efektivní asynchronní volání API. Pro validaci a ověření uživatelských vstupů je použita knihovna Yup.

Jako databáze je použit MySQL, který uchovává otázky, uživatelská data a statistiky her. Databáze je navržena tak, aby umožňovala snadnou správu otázek a rychlé vyhledávání.
