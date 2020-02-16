export default `# Choose your story

This is a test adventure, welcome.

## The space ship

You are the brave pilot of this ship.
The trip is long and boring.

Are you going to [get food](/cantina) or to [get a rest](/bedroom)

## Cantina

{ show playedCount } time you come here

The cantina is full with your crew having a good time { test playedCount equals val 1 } [trueCase||falseCase] 

They are singing 'oh my captain' for the { show playedCount } times

You pick up a sandwich an put it in your bag { set bag sandwich val 1 }

You find some pickles { set bag pickles val roll d10 }

You have { show bag sandwich } with you

You have { show bag pickles } with you

{ test playedCount equals val 1 } [ This is your first time here
    Will you come back ? || Should not you go somewhere else ?
or what ? ] 

## Bedroom

Crazy major droid jumps on you 

{ describe droid |CC       |CT  |F  |E  |
                 |---------|----|---|---|
                 |roll D6  |33  |24 |41 | }

You roll a dice it gives { show roll d10 }

The droid try to shoot you
{ test d100 lte val droid CT }[ you are shot || You luckyly escape ]
`
