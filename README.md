# Thing

Min Thing är en Larm simulator som triggas av rörelse. I min thing har jag kopplat in en Pir och en röd Led för att visa status. För att kunna larma av måste man vara en registrerad användare.

Applikationen fungerar på så sätt autentiserad användare har möjligheten att larma av och av. När detta sker registreras vem som har ändrat status för att kunna följa när och vem som lämnar eller kommer hem.

När Larmet är på tänds den röda leden för att visa att det är pålarmat. När Piren registrerar rörelse skickas ett event ut till de som lyssnar.

Då laddaren till min thing är lite iffy och inte känns så trygg vill jag inte lämna min thing igång samt det känns inte helt bekvämt att öppna upp den för omvärlden har jag valt att spela in en liten film som visar hur den fungerar.

Länk till den film är :

https://www.youtube.com/watch?v=CQUZfXFaHEo



# Motivering

Då min thing har alla sensorer inkopplade direkt till min Pi så har jag använt mig av integration pattern’et direkt integration. All kom som behövs för att köra Larmet ligger direkt på min pi och nås genom servern som körs på den lokalt. 

De olika lagerna är implementerad följande:

## Lager 1: Acces

Mitt larm ligger tillgängligt att nå via IP till min thing, den är oberoende på klient och kommunicerar enbart via Json. Både inkommande och utgående. 
För att det är löpande data som kommer in så stödjer den också websocket för att få real tids uppdateringar av larmet.

## Lager 2 Find

Hela designen kretsar runt min web thing modell.  När nya data registreras via mina sensorer eller att larmet startar registreras detta i min WOT modell. I sin tur lyssnar mitt larm på förändringar i modeller och skickar ett socket broadcast när nya data inkommer i modellen. Modellen är i centrum av designen och modellen kan nås via pi/Model

Min controllers uri är baserade på actions som finns i modellen för att klienterna lätt ska kunna hitta dem.

## Lager 3 Sharing

Då min thing enbart ska vara tillgänglig för en liten begränsad grupp, familjen. Men den måste vara säker då inte vem som helst ska kunna larma av. Kontona ska vara personliga för att kunna se vem som larmar av eller på. Därför använder jag mig av JWT som kändes som ett lämpligt alternativ

## Lager 4 Composition

Jag har gjort en typ av auto genererat Ui. Efter man har autentiserat sig hämtas min WOT modell och de actions renderar utifrån dessa. Skulle fler actions tillkomma skulle de automatiskt dyka upp på klienten.

