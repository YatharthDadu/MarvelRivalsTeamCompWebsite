# Marvel Rivals Team-Up Builder

## Description
The **Marvel Rivals Team-Up Builder** is the ultimate tool to discover the best team compositions for you and your friends. By taking into account your group's unique hero pools, role formations, and in-game synergies, this app calculates the most mathematically optimal squads to give you a competitive edge. Whether you are running a casual 6-stack or sweating in competitive matches, this builder ensures your team gets the maximum benefit from Marvel Rivals' team-up mechanics!

**🔗 [Play with the App Here!](https://yatharthdadu.github.io/MarvelRivalsTeamCompWebsite/)**

## Features
- **Hero Pool Optimization:** Assign specific hero pools for up to 6 different players so the generator only creates teams using heroes your squad actually plays.
- **Dynamic Synergies:** Automatically calculates and maximizes active team-ups, prioritizing enhanced buffs and highest overall synergy counts.
- **Custom Formations:** Adjust the Vanguard, Duelist, and Strategist role ratios to fit the exact playstyle your team wants (e.g., 2-2-2 or 1-3-2).
- **Save & Share Loadouts:** Bookmark your favorite team comps and save your squad's player pools for quick access later.
- **Import/Export:** Share your best team compositions and loadouts with friends using custom share codes.

## Usage
1. **Assemble Your Squad:** Use the "P1" through "P6" slots to select the heroes each of your friends is willing or able to play. Leave a pool empty if that player can flex to any character.
2. **Set Formation:** Use the Vanguard, Duelist, and Strategist toggles to choose the exact team role breakdown you want. The total must equal exactly 6 heroes.
3. **Generate Teams:** Click "Generate Teams" to run the algorithm. The builder will output the top-ranked teams with the highest synergy scores.
4. **Save & Share:** Found the perfect comp? Click the bookmark icon to save it, or click the share button to copy a team code to send to your friends.

## Technical Details & Local Development
While this app is built for normal users, it has some neat tech under the hood:
- Built with **React** and **Vite** for incredibly fast rendering and a smooth user experience.
- The team generation algorithm uses combinatorics to generate all possible role combinations, then applies a fast synergy lookup to score teams based on active team-ups and buff distribution.
- It efficiently prunes sub-optimal teams from the pool so the generator stays lightning-fast even with large hero pools.

### Running Locally
If you are a developer and want to run this locally:
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the local Vite development server.

## Credits
Created and maintained by:
- **TruishRocks**
- **Girf**
- **voidmonster3**
- **Earlyhydra**
