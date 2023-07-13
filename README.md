# Webová vzdělávací real-time trivia game Egghead

## Bakalářská práce pro LS 2023 - Autor Marek Vaníček

Představuji vám EggHead Trivia hru, webovou aplikaci založenou na technologiích React, Node.js, Express a Socket.IO. Trivia Battle je real-time hra pro více hráčů, která slouží jako nástroj k motivaci studentů k získávání nových znalostí. Tato aplikace je vaším prvním projektem využívajícím těchto technologií, a tak si vyzkoušíte práci s různými nástroji a frameworky.

Trivia hra EggHead poskytuje uživatelům možnost zlepšit své znalosti prostřednictvím soutěže s ostatními hráči. Při vstupu do aplikace se hráči mohou přihlásit pomocí svých údajů nebo si vytvořit nový účet. Pro autentizaci je využívána technologie JWT (JSON Web Token), která zajišťuje bezpečnost a ochranu dat.

Po přihlášení hráči mohou vybrat z různých kategorií otázek, například věda, historie, sport atd. Aplikace obsahuje rozsáhlou knihovnu otázek, které jsou dynamicky načítány z databáze. Pro komunikaci se serverem je používáno REST API postavené na frameworku Express, které zajišťuje plynulý přenos dat mezi klientem a serverem.

Samotná hra probíhá v reálném čase díky použití Socket.IO, což umožňuje synchronizaci akcí mezi všemi hráči. Hráči jsou rozděleni do her s několika účastníky, kde se každý snaží odpovědět na otázky co nejrychleji a správně. Každý hráč vidí svůj aktuální skóre i skóre ostatních hráčů v dané hře. Vítěz je určen na základě nejvyššího skóre na konci hry.

Pro vytvoření uživatelského rozhraní je použit framework React, který zajišťuje efektivní a přehledný vývoj uživatelských komponent. Pro vzhled a responzivitu aplikace je použita knihovna React Bootstrap, která poskytuje sadu předdefinovaných komponent a stylů.

Komunikace se serverem a získávání dat z databáze je realizováno pomocí knihovny Axios, která zajišťuje jednoduché a efektivní asynchronní volání API. Pro validaci a ověření uživatelských vstupů je použita knihovna Yup.

Jako databáze je použit MySQL, který uchovává otázky a uživatelská data. Databáze je navržena tak, aby umožňovala snadnou správu otázek a rychlé vyhledávání.



Introducing EggHead Trivia, a web application built on React, Node.js, Express, and Socket.IO. Trivia Battle is a real-time multiplayer game designed to motivate students to acquire new knowledge. This application marks your first project utilizing these technologies, allowing you to explore various tools and frameworks.

Trivia hra EggHead offers users the opportunity to enhance their knowledge through competition with other players. Upon entering the application, players can either log in using their credentials or create a new account. JWT (JSON Web Token) technology is employed for authentication, ensuring data security and protection.

After logging in, players can choose from various question categories, such as science, history, sports, and more. The application incorporates an extensive question library, dynamically loaded from a database. REST API, built on Express, facilitates smooth data transmission between the client and server.

The actual gameplay takes place in real-time thanks to Socket.IO, enabling action synchronization among all players. Players are divided into games with multiple participants, each striving to answer questions as quickly and accurately as possible. Each player can view their current score as well as the scores of others in the game. The winner is determined based on the highest score at the end of the game.

The user interface is developed using the React framework, ensuring efficient and organized development of user components. React Bootstrap, a library providing a set of pre-defined components and styles, is utilized for the application's appearance and responsiveness.

Communication with the server and data retrieval from the database is implemented through the Axios library, offering simple and efficient asynchronous API calls. The Yup library is employed for validation and verification of user inputs.

MySQL serves as the database, storing questions and user data. The database is designed to facilitate easy question management and quick searches.




