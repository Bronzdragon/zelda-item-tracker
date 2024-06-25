# Breath of the Wild/Tears of the Kingdom item upgrade tracker.
This application helps you keep track of outstanding items to collect for the armour upgrades in BotW/TotK. Simply enter the items you want to upgrade and the materials you have, and the application will tell you when you've met your collection goals. Either for individual pieces, or the totals for all items. The application helps you keep track in a way that is much smoother and easier than keeping track of these goals on paper.

The application also features several organizational features, like filtering tags, or sorting by amount of items you still need to collect.

The system is designed for BOTW/TOTK, but may work with either trivial modification or no modification for other games as well.

## How to run:
To run the application in development mode (good enough for most uses), you must first have [node.js and npm](https://nodejs.org) installed. Once you've done that, open a terminal pointed at the project's root folder, then:
1. Install dependencies. `npm install`.
2. Run the server. `npm start`.
3. Open the site on your preferred device. (Note, progress does not sync between devices).

## Building:
You can build this application into pure front-end files, which you can then use with any server. Simply run the build script (`npm run build`), and you'll find the files in a `build` folder. From there, host them however you'd like.

## Special Thanks
Thanks to Nintendo for releasing some really cool games, and thanks to [create-react-app](https://create-react-app.dev/), making it so easy to start a quick react application.