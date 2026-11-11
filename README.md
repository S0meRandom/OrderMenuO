OrderMenuO to bezserwerowa aplikacja (Serverless) typu Single Page Application (SPA) służąca do zarządzania zamówieniami. System pozwala na kategoryzację zamówień (standardowe, na Cito, zakończone), 
dynamiczne sortowanie danych oraz łatwą edycję z poziomu przejrzystego interfejsu. Projekt został stworzony na potrzeby działalności mojej dziewczyny, która prowadzi sklep internetowy, sprzedający własnorecznie robione
pluszaki. 

🏗 Architektura

<img width="980" height="624" alt="image" src="https://github.com/user-attachments/assets/3366a9fc-a6dc-4e6b-859d-8e44ee0fcb3f" />


Projekt opiera się na chmurze AWS i wykorzystuje w pełni bezserwerowe podejście:

Frontend: Aplikacja napisana w Angularze , hostowana na Amazon S3 i serwowana przez sieć CDN Amazon CloudFront.

API: Połączenie frontendu z API Gateway, który przekierowuje ruch do  AWS Lambda, co pozwala lepiej kontrolować ruch.

Baza Danych i Powiadomienia: Zapis danych do nierelacyjnej bazy Amazon DynamoDB oraz wysyłka zdarzeń asynchronicznych przez Amazon SNS.

CI/CD: W pełni zautomatyzowane wdrożenia przy użyciu GitHub Actions.

🚀 Technologie

Frontend: Angular, TypeScript, HTML/CSS,

Lambda: Javascript

Chmura AWS: S3, CloudFront, Lambda, DynamoDB, SNS, API Gateway

Narzędzia: Node.js , GitHub Actions, AWS CLI

✨ Główne funkcjonalności

Trzy niezależne widoki zamówień: Zamówienia, Klienci na cito, Zakończone.

Inteligentne sortowanie tabeli

Interaktywne formularze (Modale) do dodawania, edycji i kończenia zamówień.

Powiadomienia na telefon w momencie dodania , usunięcia zamówień

Dodawanie zamówień do kolejki


