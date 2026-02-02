// Career-specific practice validation scenarios
// Organized by career_direction from O*NET database
// Now covers all 18 O*NET Career Directions

export const careerScenarios = {
    // 1. Wetenschap & Techniek (Science, Technology, Engineering & Mathematics)
    "Wetenschap & Techniek": [
        {
            id: 'wt_scenario_1',
            situation: 'Een cruciaal experiment of testresultaat wijkt af van de verwachting.',
            question: 'Hoe ga je hiermee om?',
            options: [
                { text: 'Ik analyseer systematisch alle variabelen om de oorzaak te vinden', riasec: 'I', value: 'achievement' },
                { text: 'Ik controleer de apparatuur en herhaal de test exact volgens protocol', riasec: 'R', value: 'security' },
                { text: 'Ik zie dit als een kans voor een nieuwe ontdekking', riasec: 'A', value: 'creativity' },
                { text: 'Ik overleg met collega\'s om hun inzichten te horen', riasec: 'S', value: 'team' }
            ]
        },
        {
            id: 'wt_scenario_2',
            situation: 'Je moet een complex technisch probleem uitleggen aan een niet-technische manager.',
            question: 'Wat is je aanpak?',
            options: [
                { text: 'Ik gebruik eenvoudige metaforen en visualisaties', riasec: 'A', value: 'creativity' },
                { text: 'Ik leg de feitelijke data en logica stap voor stap uit', riasec: 'I', value: 'achievement' },
                { text: 'Ik focus op de praktische impact en oplossingen', riasec: 'E', value: 'dynamic' },
                { text: 'Ik schrijf een gedetailleerd technisch rapport ter naslag', riasec: 'C', value: 'security' }
            ]
        },
        {
            id: 'wt_scenario_3',
            situation: 'Er is een nieuwe technologie beschikbaar die je werk kan verbeteren maar tijd kost om te leren.',
            question: 'Wat doe je?',
            options: [
                { text: 'Ik duik er direct in en leer al doende', riasec: 'I', value: 'autonomy' },
                { text: 'Ik wacht tot er een officiële training is', riasec: 'C', value: 'security' },
                { text: 'Ik vorm een werkgroep om het samen te leren', riasec: 'S', value: 'team' },
                { text: 'Ik evalueer eerst of de investering de moeite waard is', riasec: 'E', value: 'achievement' }
            ]
        }
    ],

    // 2. IT & Data (Information Technology)
    "IT & Data": [
        {
            id: 'it_scenario_1',
            situation: 'Een softwarebug veroorzaakt problemen voor gebruikers, maar de oorzaak is onduidelijk.',
            question: 'Hoe start je?',
            options: [
                { text: 'Ik spit logs door en debug de code regel voor regel', riasec: 'I', value: 'achievement' },
                { text: 'Ik probeer de bug te reproduceren door te testen', riasec: 'R', value: 'dynamic' },
                { text: 'Ik vraag gebruikers om meer details over wat ze deden', riasec: 'S', value: 'team' },
                { text: 'Ik rol de laatste update terug naar een veilige versie', riasec: 'C', value: 'security' }
            ]
        },
        {
            id: 'it_scenario_2',
            situation: 'Je team moet kiezen tussen een bewezen oude technologie of een veelbelovende nieuwe.',
            question: 'Wat adviseer je?',
            options: [
                { text: 'De nieuwe, innovatie is essentieel', riasec: 'A', value: 'creativity' },
                { text: 'De bewezen, stabiliteit en betrouwbaarheid gaan voor', riasec: 'C', value: 'security' },
                { text: 'We moeten een pilot draaien om te vergelijken', riasec: 'I', value: 'achievement' },
                { text: 'We kiezen wat de business doelen het beste dient', riasec: 'E', value: 'dynamic' }
            ]
        },
        {
            id: 'it_scenario_3',
            situation: 'Je hebt toegang tot gevoelige data en ziet een potentieel beveiligingslek.',
            question: 'Wat doe je?',
            options: [
                { text: 'Ik meld dit direct volgens het security protocol', riasec: 'C', value: 'security' },
                { text: 'Ik probeer het lek zelf te dichten om schade te voorkomen', riasec: 'R', value: 'autonomy' },
                { text: 'Ik onderzoek hoe diep het lek gaat', riasec: 'I', value: 'achievement' },
                { text: 'Ik waarschuw mijn teamleider', riasec: 'S', value: 'team' }
            ]
        }
    ],

    // 3. Kunst & Media (Arts, A/V Technology & Communications)
    "Kunst & Media": [
        {
            id: 'km_scenario_1',
            situation: 'Je hebt een deadline voor een creatief project maar nul inspiratie.',
            question: 'Hoe doorbreek je dit?',
            options: [
                { text: 'Ik ga iets heel anders doen om mijn hoofd leeg te maken', riasec: 'A', value: 'autonomy' },
                { text: 'Ik zoek inspiratie in het werk van anderen/trends', riasec: 'I', value: 'achievement' },
                { text: 'Ik begin gewoon te schetsen/schrijven en zie wel', riasec: 'R', value: 'dynamic' },
                { text: 'Ik brainstorm met collega\'s', riasec: 'S', value: 'team' }
            ]
        },
        {
            id: 'km_scenario_2',
            situation: 'Een klant wil een ontwerpwijziging die volgens jou het concept verpest.',
            question: 'Hoe reageer je?',
            options: [
                { text: 'Ik leg uit waarom mijn ontwerp beter werkt (visie)', riasec: 'A', value: 'creativity' },
                { text: 'Ik zoek een compromis dat werkt voor beiden', riasec: 'E', value: 'dynamic' },
                { text: 'Ik voer de wijziging uit, de klant is koning', riasec: 'C', value: 'security' },
                { text: 'Ik vraag waarom ze de wijziging willen (begrip)', riasec: 'S', value: 'team' }
            ]
        },
        {
            id: 'km_scenario_3',
            situation: 'Je moet feedback geven op het werk van een collega.',
            question: 'Hoe pak je dat aan?',
            options: [
                { text: 'Ik ben eerlijk en direct over wat beter kan', riasec: 'R', value: 'achievement' },
                { text: 'Ik begin met positieve punten en doe suggesties', riasec: 'S', value: 'team' },
                { text: 'Ik analyseer technisch wat er niet klopt', riasec: 'I', value: 'achievement' },
                { text: 'Ik vraag wat hun intentie was met het werk', riasec: 'A', value: 'creativity' }
            ]
        }
    ],

    // 4. Zorg & Welzijn (Health Science / Human Services)
    "Zorg & Welzijn": [
        {
            id: 'zw_scenario_1',
            situation: 'Een patiënt/cliënt weigert de noodzakelijke zorg.',
            question: 'Wat doe je?',
            options: [
                { text: 'Ik probeer te begrijpen waarom en toon empathie', riasec: 'S', value: 'altruism' },
                { text: 'Ik leg duidelijk de consequenties uit', riasec: 'I', value: 'achievement' },
                { text: 'Ik respecteer de keuze maar documenteer het goed', riasec: 'C', value: 'security' },
                { text: 'Ik probeer familie in te schakelen om te overtuigen', riasec: 'E', value: 'team' }
            ]
        },
        {
            id: 'zw_scenario_2',
            situation: 'Het is extreem druk en je komt tijd tekort voor persoonlijke aandacht.',
            question: 'Hoe prioriteer je?',
            options: [
                { text: 'Medische noodzaak gaat voor alles', riasec: 'R', value: 'security' },
                { text: 'Ik probeer toch iedereen even persoonlijk te spreken', riasec: 'S', value: 'altruism' },
                { text: 'Ik werk efficiënter en sneller door taken heen', riasec: 'C', value: 'achievement' },
                { text: 'Ik vraag collega\'s om taken over te nemen', riasec: 'E', value: 'team' }
            ]
        },
        {
            id: 'zw_scenario_3',
            situation: 'Je ziet dat een collega een fout maakt bij een behandeling.',
            question: 'Wat doe je?',
            options: [
                { text: 'Ik grijp direct in om de patiënt te beschermen', riasec: 'R', value: 'security' },
                { text: 'Ik bespreek het later rustig onder vier ogen', riasec: 'S', value: 'team' },
                { text: 'Ik meld het incident volgens protocol', riasec: 'C', value: 'security' },
                { text: 'Ik analyseer waarom de fout kon gebeuren', riasec: 'I', value: 'achievement' }
            ]
        }
    ],

    // 5. Business & Management (Business Management & Administration)
    "Business & Management": [
        {
            id: 'bm_scenario_1',
            situation: 'Twee teamleden hebben een conflict dat het werk beïnvloedt.',
            question: 'Wat is je rol?',
            options: [
                { text: 'Ik bemiddel om de relatie te herstellen', riasec: 'S', value: 'team' },
                { text: 'Ik maak duidelijke afspraken over professioneel gedrag', riasec: 'E', value: 'dynamic' },
                { text: 'Ik kijk naar de oorzaak in de werkprocessen', riasec: 'I', value: 'achievement' },
                { text: 'Ik verwijs naar de gedragscode van het bedrijf', riasec: 'C', value: 'security' }
            ]
        },
        {
            id: 'bm_scenario_2',
            situation: 'Je moet bezuinigen op je afdeling.',
            question: 'Waar snijd je in?',
            options: [
                { text: 'In processen en efficiëntie, niet in mensen', riasec: 'I', value: 'achievement' },
                { text: 'Ik vraag het team om samen oplossingen te bedenken', riasec: 'S', value: 'team' },
                { text: 'Ik schrap risicovolle nieuwe projecten', riasec: 'C', value: 'security' },
                { text: 'Ik kijk waar we strategisch kunnen focussen', riasec: 'E', value: 'dynamic' }
            ]
        },
        {
            id: 'bm_scenario_3',
            situation: 'Een project loopt uit de hand qua tijd en budget.',
            question: 'Hoe grijp je in?',
            options: [
                { text: 'Ik neem de leiding over en stuur strak aan', riasec: 'E', value: 'dynamic' },
                { text: 'Ik analyseer waar het misgaat en pas het plan aan', riasec: 'I', value: 'achievement' },
                { text: 'Ik onderhandel over meer budget of tijd', riasec: 'S', value: 'team' },
                { text: 'Ik rapporteer de status en vraag om directiebesluit', riasec: 'C', value: 'security' }
            ]
        }
    ],

    // 6. Financiën & Administratie (Finance)
    "Financiën & Administratie": [
        {
            id: 'fa_scenario_1',
            situation: 'Je ontdekt een kleine fout in een rapportage die al verstuurd is.',
            question: 'Wat doe je?',
            options: [
                { text: 'Ik stuur direct een correctie erachteraan', riasec: 'C', value: 'security' },
                { text: 'Ik bel de ontvanger om het uit te leggen', riasec: 'S', value: 'team' },
                { text: 'Ik kijk of het materieel impact heeft voor ik actie onderneem', riasec: 'I', value: 'achievement' },
                { text: 'Ik neem verantwoordelijkheid en zorg dat het niet weer gebeurt', riasec: 'E', value: 'achievement' }
            ]
        },
        {
            id: 'fa_scenario_2',
            situation: 'Een klant wil investeringsadvies dat veel risico met zich meebrengt.',
            question: 'Wat adviseer je?',
            options: [
                { text: 'Ik hamer op de risico\'s en adviseer voorzichtigheid', riasec: 'C', value: 'security' },
                { text: 'Ik analyseer of het potentiële rendement het risico waard is', riasec: 'I', value: 'achievement' },
                { text: 'Ik kijk naar wat de klant écht wil bereiken (doelen)', riasec: 'S', value: 'altruism' },
                { text: 'Ik presenteer ook spannende alternatieven', riasec: 'E', value: 'dynamic' }
            ]
        },
        {
            id: 'fa_scenario_3',
            situation: 'Het is einde boekjaar en de werkdruk is extreem hoog.',
            question: 'Hoe houd je het vol?',
            options: [
                { text: 'Ik maak een strakke planning en vink alles af', riasec: 'C', value: 'security' },
                { text: 'We slepen elkaar er als team doorheen', riasec: 'S', value: 'team' },
                { text: 'Ik focus op het resultaat: een perfecte jaarrekening', riasec: 'I', value: 'achievement' },
                { text: 'Ik werk hard door en vier het succes daarna', riasec: 'E', value: 'dynamic' }
            ]
        }
    ],

    // 7. Landbouw & Natuur (Agriculture, Food & Natural Resources)
    "Landbouw & Natuur": [
        {
            id: 'ln_scenario_1',
            situation: 'Een ziekte bedreigt de gewassen of dieren.',
            question: 'Wat is je eerste actie?',
            options: [
                { text: 'Isoleren en behandelen om verspreiding te stoppen', riasec: 'R', value: 'security' },
                { text: 'De oorzaak onderzoeken (biologisch/omgeving)', riasec: 'I', value: 'achievement' },
                { text: 'Expertise inroepen van specialisten', riasec: 'S', value: 'team' },
                { text: 'Preventieve maatregelen voor de toekomst opstellen', riasec: 'C', value: 'security' }
            ]
        },
        {
            id: 'ln_scenario_2',
            situation: 'Je werkt buiten en het weer is vreselijk.',
            question: 'Wat denk je?',
            options: [
                { text: 'Geen probleem, dat hoort bij het werk', riasec: 'R', value: 'dynamic' },
                { text: 'Ik pas mijn planning aan op de weersvoorspelling', riasec: 'C', value: 'security' },
                { text: 'Ik geniet van de kracht van de natuur', riasec: 'A', value: 'autonomy' },
                { text: 'Ik zorg dat mijn team en dieren veilig zijn', riasec: 'S', value: 'altruism' }
            ]
        },
        {
            id: 'ln_scenario_3',
            situation: 'Er is discussie over duurzaamheid versus winstgevendheid.',
            question: 'Waar sta jij?',
            options: [
                { text: 'Duurzaamheid, we moeten voor de natuur zorgen', riasec: 'S', value: 'altruism' },
                { text: 'Winstgevendheid, het is wel een bedrijf', riasec: 'E', value: 'achievement' },
                { text: 'Ik zoek naar innovatieve manieren om beide te bereiken', riasec: 'I', value: 'creativity' },
                { text: 'Ik houd me aan de wettelijke milieuregels', riasec: 'C', value: 'security' }
            ]
        }
    ],

    // 8. Bouw & Constructie (Architecture & Construction)
    "Bouw & Constructie": [
        {
            id: 'bc_scenario_1',
            situation: 'Op de bouwplaats zie je een onveilige situatie door tijdsdruk.',
            question: 'Wat doe je?',
            options: [
                { text: 'Ik leg het werk direct stil, veiligheid eerst', riasec: 'R', value: 'security' },
                { text: 'Ik bespreek het met de uitvoerder', riasec: 'S', value: 'team' },
                { text: 'Ik bedenk een manier om veilig én snel te werken', riasec: 'I', value: 'achievement' },
                { text: 'Ik spreek de collega\'s aan op de regels', riasec: 'E', value: 'dynamic' }
            ]
        },
        {
            id: 'bc_scenario_2',
            situation: 'De materialen zijn niet geleverd, het werk staat stil.',
            question: 'Hoe los je dit op?',
            options: [
                { text: 'Ik bel de leverancier en eis een oplossing', riasec: 'E', value: 'dynamic' },
                { text: 'Ik kijk wat we wél kunnen doen met aanwezige middelen', riasec: 'R', value: 'creativity' },
                { text: 'Ik pas de planning aan en informeer iedereen', riasec: 'C', value: 'security' },
                { text: 'Ik overleg met het team over alternatieven', riasec: 'S', value: 'team' }
            ]
        },
        {
            id: 'bc_scenario_3',
            situation: 'De tekening klopt niet met de werkelijkheid op de bouwplaats.',
            question: 'Wat is je aanpak?',
            options: [
                { text: 'Ik meet alles na en maak een nieuwe schets', riasec: 'R', value: 'accuracy' },
                { text: 'Ik raadpleeg de architect of ingenieur', riasec: 'I', value: 'team' },
                { text: 'Ik improviseer een praktische oplossing', riasec: 'A', value: 'creativity' },
                { text: 'Ik maak hiervan een melding volgens procedure', riasec: 'C', value: 'security' }
            ]
        }
    ],

    // 9. Onderwijs & Training (Education & Training)
    "Onderwijs & Training": [
        {
            id: 'ot_scenario_1',
            situation: 'Een leerling/student is erg gedemotiveerd en stoort de les.',
            question: 'Hoe reageer je?',
            options: [
                { text: 'Ik ga in gesprek om de oorzaak te achterhalen', riasec: 'S', value: 'altruism' },
                { text: 'Ik stel duidelijke grenzen en consequenties', riasec: 'E', value: 'security' },
                { text: 'Ik pas mijn lesmethode aan om boeiender te zijn', riasec: 'A', value: 'creativity' },
                { text: 'Ik analyseer of de stof te makkelijk/moeilijk is', riasec: 'I', value: 'achievement' }
            ]
        },
        {
            id: 'ot_scenario_2',
            situation: 'Je moet een nieuw curriculum/lesplan ontwikkelen.',
            question: 'Wat vind je belangrijk?',
            options: [
                { text: 'Dat het structureel klopt en aan eisen voldoet', riasec: 'C', value: 'security' },
                { text: 'Dat het vernieuwend en inspirerend is', riasec: 'A', value: 'creativity' },
                { text: 'Dat de leerlingen er praktisch iets aan hebben', riasec: 'R', value: 'achievement' },
                { text: 'Dat we het als docententeam samen dragen', riasec: 'S', value: 'team' }
            ]
        },
        {
            id: 'ot_scenario_3',
            situation: 'Ouders zijn het niet eens met jouw beoordeling.',
            question: 'Hoe sta je ze te woord?',
            options: [
                { text: 'Ik leg mijn beoordeling uit aan de hand van feiten/cijfers', riasec: 'I', value: 'achievement' },
                { text: 'Ik luister naar hun zorgen en toon begrip', riasec: 'S', value: 'altruism' },
                { text: 'Ik blijf bij mijn professionele oordeel', riasec: 'E', value: 'autonomy' },
                { text: 'Ik verwijs naar de officiële beoordelingscriteria', riasec: 'C', value: 'security' }
            ]
        }
    ],

    // 10. Overheid & Publieke Diensten (Government & Public Administration)
    "Overheid & Publieke Diensten": [
        {
            id: 'opd_scenario_1',
            situation: 'Een burger is boos over een beslissing van de gemeente.',
            question: 'Hoe ga je hiermee om?',
            options: [
                { text: 'Ik leg de regelgeving en procedure rustig uit', riasec: 'C', value: 'security' },
                { text: 'Ik luister en probeer de frustratie weg te nemen', riasec: 'S', value: 'altruism' },
                { text: 'Ik kijk of er binnen de regels toch iets mogelijk is', riasec: 'E', value: 'dynamic' },
                { text: 'Ik analyseer of de beslissing inderdaad correct was', riasec: 'I', value: 'achievement' }
            ]
        },
        {
            id: 'opd_scenario_2',
            situation: 'Er komt nieuwe wetgeving die veel werkprocessen verandert.',
            question: 'Hoe pak je dit op?',
            options: [
                { text: 'Ik zorg dat alles tot in detail correct wordt ingevoerd', riasec: 'C', value: 'security' },
                { text: 'Ik zie het als een kans om processen te verbeteren', riasec: 'I', value: 'achievement' },
                { text: 'Ik begeleid mijn collega\'s in de verandering', riasec: 'S', value: 'team' },
                { text: 'Ik neem de leiding in de implementatie', riasec: 'E', value: 'dynamic' }
            ]
        },
        {
            id: 'opd_scenario_3',
            situation: 'Er is een beperkt budget voor maatschappelijke doelen.',
            question: 'Hoe verdeel je dit?',
            options: [
                { text: 'Op basis van waar de nood het hoogst is (menselijk)', riasec: 'S', value: 'altruism' },
                { text: 'Op basis van meetbare effectiviteit (data)', riasec: 'I', value: 'achievement' },
                { text: 'Volgens de vastgestelde beleidskaders', riasec: 'C', value: 'security' },
                { text: 'Waar we politiek/bestuurlijk het meest mee scoren', riasec: 'E', value: 'dynamic' }
            ]
        }
    ],

    // 11. Horeca & Toerisme (Hospitality & Tourism)
    "Horeca & Toerisme": [
        {
            id: 'ht_scenario_1',
            situation: 'Het is topdrukte en er gaat iets mis in de keuken/bediening.',
            question: 'Wat doe je?',
            options: [
                { text: 'Ik blijf rustig en los het probleem snel praktisch op', riasec: 'R', value: 'dynamic' },
                { text: 'Ik bied de gasten direct mijn excuses en een compensatie aan', riasec: 'E', value: 'achievement' },
                { text: 'Ik help mijn collega\'s waar ik kan om de druk te verlagen', riasec: 'S', value: 'team' },
                { text: 'Ik zorg dat de standaardprocedures gevolgd blijven worden', riasec: 'C', value: 'security' }
            ]
        },
        {
            id: 'ht_scenario_2',
            situation: 'Je organiseert een evenement voor een veeleisende groep.',
            question: 'Waar focus je op?',
            options: [
                { text: 'Dat iedereen een fantastische tijd heeft (sfeer)', riasec: 'S', value: 'altruism' },
                { text: 'Dat alles tot in de puntjes geregeld is (organisatie)', riasec: 'C', value: 'accuracy' },
                { text: 'Dat we iets unieks en verrassends bieden (beleving)', riasec: 'A', value: 'creativity' },
                { text: 'Dat het financieel succesvol is voor het bedrijf', riasec: 'E', value: 'achievement' }
            ]
        },
        {
            id: 'ht_scenario_3',
            situation: 'Een gast heeft een specifieke wens die niet op de kaart staat.',
            question: 'Hoe reageer je?',
            options: [
                { text: 'Ik kijk wat de keuken kan improviseren', riasec: 'A', value: 'creativity' },
                { text: 'Ik doe er alles aan om het te regelen (service)', riasec: 'E', value: 'dynamic' },
                { text: 'Ik leg uit wat er wél mogelijk is volgens de kaart', riasec: 'C', value: 'security' },
                { text: 'Ik vraag de chef even mee te denken', riasec: 'S', value: 'team' }
            ]
        }
    ],

    // 12. Maatschappelijke Diensten (Human Services)
    "Maatschappelijke Diensten": [
        {
            id: 'md_scenario_1',
            situation: 'Je begeleidt een gezin dat in een crisissituatie zit.',
            question: 'Wat is je prioriteit?',
            options: [
                { text: 'Veiligheid en basisbehoeften garanderen', riasec: 'R', value: 'security' },
                { text: 'Emotionele steun bieden en luisteren', riasec: 'S', value: 'altruism' },
                { text: 'Een actieplan opstellen om eruit te komen', riasec: 'I', value: 'achievement' },
                { text: 'Coördineren met andere hulpinstanties', riasec: 'E', value: 'team' }
            ]
        },
        {
            id: 'md_scenario_2',
            situation: 'Je merkt dat je persoonlijk geraakt wordt door een casus.',
            question: 'Hoe ga je daarmee om?',
            options: [
                { text: 'Ik praat erover met collega\'s (intervisie)', riasec: 'S', value: 'team' },
                { text: 'Ik zoek afleiding in hobby\'s of sport', riasec: 'R', value: 'autonomy' },
                { text: 'Ik analyseer waarom het me raakt (zelfreflectie)', riasec: 'I', value: 'achievement' },
                { text: 'Ik houd strikt werk en privé gescheiden', riasec: 'C', value: 'security' }
            ]
        },
        {
            id: 'md_scenario_3',
            situation: 'Er is te veel administratie waardoor je minder tijd hebt voor cliënten.',
            question: 'Wat doe je?',
            options: [
                { text: 'Ik klaag, maar doe het wel want het moet', riasec: 'C', value: 'security' },
                { text: 'Ik probeer de administratie efficiënter in te richten', riasec: 'I', value: 'achievement' },
                { text: 'Ik prioriteer de cliënten, papierwerk komt later wel', riasec: 'S', value: 'altruism' },
                { text: 'Ik bespreek dit beleidsprobleem met het management', riasec: 'E', value: 'dynamic' }
            ]
        }
    ],

    // 13. Recht & Veiligheid (Law, Public Safety, Corrections & Security)
    "Recht & Veiligheid": [
        {
            id: 'rv_scenario_1',
            situation: 'Je ziet een situatie op straat escaleren.',
            question: 'Wat doe je?',
            options: [
                { text: 'Ik grijp in om de orde te handhaven', riasec: 'R', value: 'security' },
                { text: 'Ik probeer de partijen te kalmeren (de-escaleren)', riasec: 'S', value: 'altruism' },
                { text: 'Ik observeer en verzamel informatie/bewijs', riasec: 'I', value: 'achievement' },
                { text: 'Ik neem de leiding en stuur omstanders weg', riasec: 'E', value: 'dynamic' }
            ]
        },
        {
            id: 'rv_scenario_2',
            situation: 'Je moet een zaak onderzoeken waarbij de regels onduidelijk zijn.',
            question: 'Hoe interpreteer je dit?',
            options: [
                { text: 'Ik zoek naar precedenten en juridische kaders', riasec: 'I', value: 'achievement' },
                { text: 'Ik volg de letter van de wet zo strikt mogelijk', riasec: 'C', value: 'security' },
                { text: 'Ik kijk naar de geest van de wet en rechtvaardigheid', riasec: 'S', value: 'altruism' },
                { text: 'Ik hak een knoop door op basis van mijn ervaring', riasec: 'E', value: 'autonomy' }
            ]
        },
        {
            id: 'rv_scenario_3',
            situation: 'Je moet slecht nieuws brengen aan een slachtoffer of betrokkene.',
            question: 'Hoe doe je dat?',
            options: [
                { text: 'Duidelijk, feitelijk en direct', riasec: 'R', value: 'accuracy' },
                { text: 'Met veel medeleven en tijd voor emoties', riasec: 'S', value: 'altruism' },
                { text: 'Volgens het protocol voor slechtnieuwsgesprekken', riasec: 'C', value: 'security' },
                { text: 'Professioneel, met focus op de vervolgstappen', riasec: 'E', value: 'achievement' }
            ]
        }
    ],

    // 14. Productie & Fabricage (Manufacturing)
    "Productie & Fabricage": [
        {
            id: 'pf_scenario_1',
            situation: 'De productielijn valt stil door een storing.',
            question: 'Wat is je reactie?',
            options: [
                { text: 'Meteen gereedschap pakken en sleutelen', riasec: 'R', value: 'dynamic' },
                { text: 'Oorzaak analyseren om herhaling te voorkomen', riasec: 'I', value: 'achievement' },
                { text: 'Team aansturen om de achterstand in te halen', riasec: 'E', value: 'team' },
                { text: 'Veiligheidsprocedures controleren voor herstart', riasec: 'C', value: 'security' }
            ]
        },
        {
            id: 'pf_scenario_2',
            situation: 'Je ziet een manier om het productieproces sneller te maken.',
            question: 'Wat doe je?',
            options: [
                { text: 'Ik probeer het direct uit op mijn werkplek', riasec: 'R', value: 'autonomy' },
                { text: 'Ik reken uit hoeveel het oplevert en stel het voor', riasec: 'I', value: 'achievement' },
                { text: 'Ik bespreek het met de ploegleider', riasec: 'S', value: 'team' },
                { text: 'Ik dien een officieel verbetervoorstel in', riasec: 'C', value: 'security' }
            ]
        },
        {
            id: 'pf_scenario_3',
            situation: 'Er is een fout gemaakt in een batch producten.',
            question: 'Hoe los je dit op?',
            options: [
                { text: 'Snel sorteren: goed van fout scheiden', riasec: 'R', value: 'accuracy' },
                { text: 'Uitzoeken wie het gedaan heeft', riasec: 'E', value: 'dynamic' },
                { text: 'Kwaliteitscontrole aanscherpen', riasec: 'C', value: 'security' },
                { text: 'Samen kijken hoe we dit kunnen voorkomen', riasec: 'S', value: 'team' }
            ]
        }
    ],

    // 15. Marketing & Sales
    "Marketing & Sales": [
        {
            id: 'ms_scenario_1',
            situation: 'Je moet een product verkopen waar je zelf twijfels over hebt.',
            question: 'Hoe pak je dat aan?',
            options: [
                { text: 'Ik focus op de voordelen die wel kloppen', riasec: 'E', value: 'achievement' },
                { text: 'Ik zoek naar klanten voor wie het wél geschikt is', riasec: 'S', value: 'altruism' },
                { text: 'Ik bedenk een creatieve invalshoek', riasec: 'A', value: 'creativity' },
                { text: 'Ik verkoop het gewoon, dat is mijn werk', riasec: 'C', value: 'security' }
            ]
        },
        {
            id: 'ms_scenario_2',
            situation: 'Een campagne slaat niet aan zoals verwacht.',
            question: 'Wat is je analyse?',
            options: [
                { text: 'De data analyseren: waar haken mensen af?', riasec: 'I', value: 'achievement' },
                { text: 'Snel de boodschap aanpassen en testen', riasec: 'E', value: 'dynamic' },
                { text: 'Was het design wel aantrekkelijk genoeg?', riasec: 'A', value: 'creativity' },
                { text: 'Feedback vragen aan de doelgroep', riasec: 'S', value: 'team' }
            ]
        },
        {
            id: 'ms_scenario_3',
            situation: 'Je hebt een zeer ambitieuze target gekregen.',
            question: 'Hoe reageer je?',
            options: [
                { text: 'Game on! Ik ga ervoor', riasec: 'E', value: 'achievement' },
                { text: 'Ik maak een strategisch plan om het te halen', riasec: 'I', value: 'autonomy' },
                { text: 'Ik kijk wie mij kan helpen (netwerk)', riasec: 'S', value: 'team' },
                { text: 'Ik check of de target wel realistisch/haalbaar is', riasec: 'C', value: 'security' }
            ]
        }
    ],

    // 16. Transport & Logistiek (Transportation, Distribution & Logistics)
    "Transport & Logistiek": [
        {
            id: 'tl_scenario_1',
            situation: 'Er is een grote vertraging en de planning loopt in het honderd.',
            question: 'Wat doe je?',
            options: [
                { text: 'Ik puzzel net zo lang tot ik een nieuwe route heb', riasec: 'I', value: 'achievement' },
                { text: 'Ik bel de klanten om ze te informeren', riasec: 'S', value: 'altruism' },
                { text: 'Ik blijf rustig en werk stap voor stap de lijst af', riasec: 'C', value: 'security' },
                { text: 'Ik stuur chauffeurs direct bij en neem beslissingen', riasec: 'E', value: 'dynamic' }
            ]
        },
        {
            id: 'tl_scenario_2',
            situation: 'Een voertuig of machine heeft kuren.',
            question: 'Wat is je actie?',
            options: [
                { text: 'Ik kijk of ik het zelf kan fixen', riasec: 'R', value: 'autonomy' },
                { text: 'Ik meld het bij de onderhoudsdienst', riasec: 'C', value: 'security' },
                { text: 'Ik regel vervangend vervoer om door te kunnen', riasec: 'E', value: 'achievement' },
                { text: 'Ik overleg met planning over de impact', riasec: 'S', value: 'team' }
            ]
        },
        {
            id: 'tl_scenario_3',
            situation: 'Je ziet een manier om routes efficiënter te maken.',
            question: 'Hoe breng je dit?',
            options: [
                { text: 'Ik laat met cijfers zien hoeveel het bespaart', riasec: 'I', value: 'achievement' },
                { text: 'Ik probeer het uit in de praktijk', riasec: 'R', value: 'dynamic' },
                { text: 'Ik presenteer het als verbetering voor klanten', riasec: 'E', value: 'dynamic' },
                { text: 'Ik dien het in volgens de standaard procedure', riasec: 'C', value: 'security' }
            ]
        }
    ],

    // Aliases/Duplicates for fuzzy matching or specific mappings
    // (Note: The helper function below handles fuzzy matching, but direct keys are faster/safer)
    "Creatie & Design": null, // Will use Kunst & Media via lookup or I can duplicate content here if strictly needed, but let's assume we map in data
};

// Aliases mapping to main keys to ensure full coverage
const categoryAliases = {
    "Creatie & Design": "Kunst & Media",
    "Onderzoek & Data": "IT & Data",
    "Techniek & Praktijk": "Wetenschap & Techniek",
    "Verkoop & Administratie": "Business & Management",
    // Ensure direct mapping for new sectors if they have variations
    "Media & Communicatie": "Kunst & Media",
    "Administratie & Support": "Financiën & Administratie",
    "Management & Leiderschap": "Business & Management",
    "Zorg & Gezondheid": "Zorg & Welzijn",
    "IT & Technologie": "IT & Data",
    "Wetenschap & Lab": "Wetenschap & Techniek"
};

// Helper function to get scenarios for a career direction
export const getScenariosForCareerDirection = (careerDirection) => {
    if (!careerDirection) return [];

    let searchKey = careerDirection;

    // Check alias first
    if (categoryAliases[searchKey]) {
        searchKey = categoryAliases[searchKey];
    }

    // 1. Try direct match
    if (careerScenarios[searchKey]) {
        return careerScenarios[searchKey];
    }

    // 2. Try normalized match (ignore case, spaces, special chars)
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedInput = normalize(searchKey);

    const matchingKey = Object.keys(careerScenarios).find(key => {
        const normalizedKey = normalize(key);
        return normalizedKey === normalizedInput ||
            normalizedKey.includes(normalizedInput) ||
            normalizedInput.includes(normalizedKey);
    });

    if (matchingKey) {
        console.log(`Fuzzy match found: "${careerDirection}" -> "${matchingKey}"`);
        return careerScenarios[matchingKey];
    }

    // 3. Fallback: return Generic Business scenarios if nothing else matches (better than empty)
    console.warn(`No specific scenarios found for "${careerDirection}". Using generic fallback.`);
    return careerScenarios["Business & Management"]; // Safe default
};

// Get all available career directions
export const getAvailableCareerDirections = () => {
    return Object.keys(careerScenarios).filter(key => Array.isArray(careerScenarios[key]));
};
