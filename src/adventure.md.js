export default `# Choose your story

This is a test adventure, welcome.

## The space ship

You are the brave pilot of this ship.
The trip is long and boring.

Are you going to [get food](/cantina) or to [get a rest](/bedroom)

## Cantina

{ show playedCount } time you come here

The cantina is full with your crew having a good time { test playedCount equals 1 } [trueCase||falseCase] 

They are singing 'oh my captain' for the { show playedCount } times

You pick up a sandwich an put it in your bag { set bag sandwich 1 }

You have { show bag sandwich } with you

{ test playedCount equals 1 } [ This is your first time here
    Will you come back ? || Should not you go somewhere else ?
or what ? ] 

## Bedroom

Crazy major doid jumps on you 

{ describe droid |CC  |CT  |F  |E  |
                 |----|----|---|---|
                 |33  |32  |24 |41 | }

`
