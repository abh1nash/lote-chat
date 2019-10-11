## Lote Chat

A real-time chat application made with Vue.js and Firebase. Use your Google account to login, and begin conversing with other users!

[Demo](http://lotechat.abhinash.net/)

Features include single and group conversations, profile customization as well as group customization. A member of a chatroom can invite any other Lote Chat user to that room, who can then accept or decline the invite as per their desire.

Users can also see what other users in the chatroom are typing in real-time.

### Usage

Lote Chat operates utilizing the Realtime Database, Firestore and Storage provided by Google Firebase. As such, [setting up a Firebase project is necessary.](https://firebase.google.com/docs/web/setup)

Then, create a local clone for the project.

    git clone https://github.com/abh1nash/lote-chat.git

After setting up the project, Firebase's project configuration need to be placed in the `.env.local` file on the root directory of the project in the same format as presented in the `.env.local.sample` file.

It is also recommended to set up [Firebase Security Rules](https://firebase.google.com/docs/rules) to limit user access.

Then `npm` scripts can be run to test or build the app.

    npm run serve 	//to start the app in development
    npm run build 	//to build production version

### Future Plans

I might visit the project sometime in the future and add some of the following functionalities:

- Video and Audio Calls
- Custom Server
- Reactions to messages
- Better design for modals
- Other functionalities that I am not currently able to think of

If anyone wants to make contributions of any kind, you are always welcome!
