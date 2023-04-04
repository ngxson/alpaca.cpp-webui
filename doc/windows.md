# Guide for Windows

Install nodejs v18+:

![](./win_0.png)

Download the windows build for alpaca.cpp:

![](./win_1.png)

Go to `{PROJECT_DIR}/bin`

![](./win_2.png)

Extract the zip file

![](./win_3.png)

You should have these files in `bin` folder

![](./win_4.png)

Edit the `config.js`

![](./win_5.png)

Add `.exe` to the executable name:

![](./win_6.png)

Go back to `{PROJECT_DIR}`

Open a new terminal and run `npm i`

![](./win_7.png)

Run `npm start`

If you see error `child process exited with code ...`, make sure that you have enough available RAM to load the model. (For 7B, it's recommended to have at least 8GB of RAM)

![](./win_8.png)

Then, visit `http://localhost:13000`

