##[0.5.0]
- Damage/heal combatants by clicking their wounds or hitting the `d` key
- Vuex implementation fixes
- Increase/decrease combatant's advantage
- Automatically set advantage of character to 0 if it takes any damage
- Add filter for unique/non-unique NPCs in bestiary
- Add state versioning and backwards compatibility
- Set `updated_at` whenever it is saved
- Updating a unique combatant updates their data throughout the application
- Start/stop combat by clicking the initiative icon in the central table
- Next/previous combatant by buttons or N/AltN
- Combat round tracking
- Remove all NPCs from combat when hitting the `finish combat` button

##[0.4.0]
- Further implement Vuex, major refactor of use of variables and saving of state

##[0.3.0]
- Implement Vuex for global variables and functions

##[0.2.1]
- Fix: Check for data on load in center column

##[0.2.0]
- When editing an NPC, you can check whether it's a unique NPC or not
- Add combatants to running combat
- Remove combatants from running combat
- Select combatant that is in combat to view data on right column
- Fix: object clones replaced with object deep clones to prevent render loops

##[0.1.2]
- Reduced size of images for quicker loading

##[0.1.1]
- Fix: opening home page for the first time does not cause errors anymore

##[0.1.0]
- Added base homepage (non-responsive)
- Added ability to open library by clicking the MENU button
- Added ability to create, edit, and delete Combatants (NPC and Character)