# Smart-Recipe-App-React-Native-Nodejs

-Backend
to run the backend 

1-> cd backend
2-> in the .env file replace the DATABASE_URL with your Postgres Database URL
3-> you may change the SPOONACULAR_API_KEY if recipes dont show up because its a free version and have limited calls. 
4-> open terminal and enter following commands:
  npm install
  npx prisma generate
  npm start
5-> your backend server will be up and running

-Frontend
to run the App 

1-> cd frontend
2-> in the frontend directorym, int the file named constants.js change the API_BASE_URL IP address according to yours which you can check in CMD with ipconfig
2-> open terminal and enter following commands:
  npm install
  npm start